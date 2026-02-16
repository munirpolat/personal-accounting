from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
import os

from models.admin import Admin, AdminCreate, AdminLogin, AdminResponse
from models.settings import SiteSettings, SiteSettingsUpdate, Category, CategoryCreate, CategoryUpdate
from models.listing import ListingResponse, ListingUpdate
from auth import hash_password, verify_password, create_access_token, get_current_user

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'sahibinden_clone')]

# Collections
admins_collection = db.admins
settings_collection = db.settings
categories_collection = db.categories
listings_collection = db.listings

admin_router = APIRouter(prefix="/admin", tags=["Admin"])


# ============ ADMIN AUTH ============

@admin_router.post("/register")
async def register_admin(admin_data: AdminCreate):
    """Register first admin - only if no admins exist"""
    admin_count = await admins_collection.count_documents({})
    if admin_count > 0:
        raise HTTPException(status_code=403, detail="Admin already exists. Registration closed.")
    
    # Check if username exists
    existing = await admins_collection.find_one({"username": admin_data.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create admin
    admin = Admin(
        username=admin_data.username,
        email=admin_data.email,
        full_name=admin_data.full_name,
        password=hash_password(admin_data.password),
        role="super_admin"
    )
    
    await admins_collection.insert_one(admin.dict())
    
    return {"message": "Admin created successfully"}


@admin_router.post("/login")
async def admin_login(credentials: AdminLogin):
    admin = await admins_collection.find_one({"username": credentials.username})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": admin["id"], "role": "admin"})
    
    return {"token": token, "admin": AdminResponse(**admin)}


async def get_current_admin(user_id: str = Depends(get_current_user)) -> str:
    """Verify user is admin"""
    admin = await admins_collection.find_one({"id": user_id})
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user_id


@admin_router.get("/me")
async def get_admin_profile(admin_id: str = Depends(get_current_admin)):
    admin = await admins_collection.find_one({"id": admin_id})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return AdminResponse(**admin)


# ============ LISTING MANAGEMENT ============

@admin_router.get("/listings")
async def get_all_listings(
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    admin_id: str = Depends(get_current_admin)
):
    """Get all listings with filtering"""
    query = {}
    if status:
        query["status"] = status
    
    skip = (page - 1) * limit
    listings = await listings_collection.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await listings_collection.count_documents(query)
    
    # Get user info for each listing
    for listing in listings:
        from models.user import UserResponse
        user = await db.users.find_one({"id": listing["user_id"]})
        if user:
            listing["seller"] = {
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
                "verified": user.get("verified", False)
            }
    
    return {
        "listings": [ListingResponse(**listing) for listing in listings],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }


@admin_router.put("/listings/{listing_id}/approve")
async def approve_listing(
    listing_id: str,
    admin_id: str = Depends(get_current_admin)
):
    """Approve a pending listing"""
    listing = await listings_collection.find_one({"id": listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    await listings_collection.update_one(
        {"id": listing_id},
        {"$set": {"status": "active", "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Listing approved"}


@admin_router.put("/listings/{listing_id}/reject")
async def reject_listing(
    listing_id: str,
    reason: Optional[str] = None,
    admin_id: str = Depends(get_current_admin)
):
    """Reject a pending listing"""
    listing = await listings_collection.find_one({"id": listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    await listings_collection.update_one(
        {"id": listing_id},
        {"$set": {"status": "rejected", "rejection_reason": reason, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Listing rejected"}


@admin_router.delete("/listings/{listing_id}")
async def delete_listing_admin(
    listing_id: str,
    admin_id: str = Depends(get_current_admin)
):
    """Admin delete any listing"""
    result = await listings_collection.delete_one({"id": listing_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Also delete from favorites
    await db.favorites.delete_many({"listing_id": listing_id})
    
    return {"message": "Listing deleted"}


# ============ CATEGORY MANAGEMENT ============

@admin_router.get("/categories")
async def get_categories_admin(admin_id: str = Depends(get_current_admin)):
    """Get all categories"""
    categories = await categories_collection.find().sort("order", 1).to_list(100)
    return categories


@admin_router.post("/categories")
async def create_category(
    category_data: CategoryCreate,
    admin_id: str = Depends(get_current_admin)
):
    """Create new category"""
    # Check if slug exists
    existing = await categories_collection.find_one({"slug": category_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")
    
    category = Category(**category_data.dict())
    await categories_collection.insert_one(category.dict())
    
    return {"message": "Category created", "category": category}


@admin_router.put("/categories/{category_id}")
async def update_category(
    category_id: str,
    category_data: CategoryUpdate,
    admin_id: str = Depends(get_current_admin)
):
    """Update category"""
    category = await categories_collection.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = {k: v for k, v in category_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await categories_collection.update_one(
        {"id": category_id},
        {"$set": update_data}
    )
    
    return {"message": "Category updated"}


@admin_router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str,
    admin_id: str = Depends(get_current_admin)
):
    """Delete category"""
    result = await categories_collection.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted"}


@admin_router.put("/categories/reorder")
async def reorder_categories(
    category_orders: List[dict],  # [{"id": "cat1", "order": 0}, ...]
    admin_id: str = Depends(get_current_admin)
):
    """Update category order"""
    for item in category_orders:
        await categories_collection.update_one(
            {"id": item["id"]},
            {"$set": {"order": item["order"]}}
        )
    
    return {"message": "Categories reordered"}


# ============ SITE SETTINGS ============

@admin_router.get("/settings")
async def get_settings(admin_id: str = Depends(get_current_admin)):
    """Get site settings"""
    settings = await settings_collection.find_one()
    if not settings:
        # Create default settings
        default_settings = SiteSettings()
        await settings_collection.insert_one(default_settings.dict())
        return default_settings
    return settings


@admin_router.put("/settings")
async def update_settings(
    settings_data: SiteSettingsUpdate,
    admin_id: str = Depends(get_current_admin)
):
    """Update site settings"""
    settings = await settings_collection.find_one()
    
    update_data = {k: v for k, v in settings_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    if settings:
        await settings_collection.update_one(
            {"id": settings["id"]},
            {"$set": update_data}
        )
    else:
        new_settings = SiteSettings(**update_data)
        await settings_collection.insert_one(new_settings.dict())
    
    return {"message": "Settings updated"}


# ============ DASHBOARD STATS ============

@admin_router.get("/stats")
async def get_dashboard_stats(admin_id: str = Depends(get_current_admin)):
    """Get dashboard statistics"""
    total_listings = await listings_collection.count_documents({})
    pending_listings = await listings_collection.count_documents({"status": "pending"})
    active_listings = await listings_collection.count_documents({"status": "active"})
    total_users = await db.users.count_documents({})
    
    return {
        "total_listings": total_listings,
        "pending_listings": pending_listings,
        "active_listings": active_listings,
        "total_users": total_users
    }


from datetime import datetime
