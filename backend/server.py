from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import shutil
import uuid

# Models
from models.user import User, UserCreate, UserLogin, SMSVerification, UserResponse
from models.listing import Listing, ListingCreate, ListingUpdate, ListingResponse
from models.favorite import Favorite, FavoriteCreate

# Auth
from auth import (
    hash_password, 
    verify_password, 
    create_access_token, 
    get_current_user,
    generate_verification_code
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'sahibinden_clone')]

# Collections
users_collection = db.users
listings_collection = db.listings
favorites_collection = db.favorites

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Import admin routes
from admin_routes import admin_router

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============ AUTH ENDPOINTS ============

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({
        "$or": [{"email": user_data.email}, {"phone": user_data.phone}]
    })
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or phone already registered")
    
    # Generate verification code
    verification_code = generate_verification_code()
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=hash_password(user_data.password),
        verification_code=verification_code
    )
    
    await users_collection.insert_one(user.dict())
    
    # In production, send SMS with verification code
    logger.info(f"SMS Verification Code for {user_data.phone}: {verification_code}")
    
    return {"message": "Registration successful. SMS code sent.", "phone": user_data.phone}


@api_router.post("/auth/verify-sms")
async def verify_sms(verification: SMSVerification):
    user = await users_collection.find_one({"phone": verification.phone})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("verification_code") != verification.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # Update user as verified
    await users_collection.update_one(
        {"phone": verification.phone},
        {"$set": {"verified": True, "verification_code": None}}
    )
    
    # Create token
    token = create_access_token({"sub": user["id"]})
    
    return {"message": "Phone verified", "token": token}


@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.get("verified", False):
        raise HTTPException(status_code=403, detail="Please verify your phone first")
    
    token = create_access_token({"sub": user["id"]})
    
    return {"token": token, "user": UserResponse(**user)}


@api_router.get("/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(**user)


# ============ LISTING ENDPOINTS ============

@api_router.get("/listings")
async def get_listings(
    category: Optional[str] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: str = "date",
    order: str = "desc",
    page: int = 1,
    limit: int = 20,
    featured: Optional[bool] = None,
    q: Optional[str] = None
):
    query = {"status": "active"}
    
    if category:
        query["category"] = category
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    if max_price is not None:
        query.setdefault("price", {})["$lte"] = max_price
    if featured is not None:
        query["featured"] = featured
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}}
        ]
    
    # Sorting
    sort_field = "created_at" if sort_by == "date" else sort_by
    sort_order = -1 if order == "desc" else 1
    
    # Pagination
    skip = (page - 1) * limit
    
    listings = await listings_collection.find(query).sort(sort_field, sort_order).skip(skip).limit(limit).to_list(limit)
    total = await listings_collection.count_documents(query)
    
    # Get seller info for each listing
    for listing in listings:
        user = await users_collection.find_one({"id": listing["user_id"]})
        if user:
            listing["seller"] = {
                "name": user["name"],
                "phone": user["phone"],
                "verified": user.get("verified", False)
            }
    
    return {
        "listings": [ListingResponse(**listing) for listing in listings],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }


@api_router.get("/listings/{listing_id}")
async def get_listing(listing_id: str):
    listing = await listings_collection.find_one({"id": listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Get seller info
    user = await users_collection.find_one({"id": listing["user_id"]})
    if user:
        listing["seller"] = {
            "name": user["name"],
            "phone": user["phone"],
            "verified": user.get("verified", False)
        }
    
    return ListingResponse(**listing)


@api_router.post("/listings")
async def create_listing(
    listing_data: ListingCreate,
    user_id: str = Depends(get_current_user)
):
    listing = Listing(
        **listing_data.dict(),
        user_id=user_id
    )
    
    await listings_collection.insert_one(listing.dict())
    
    return {"message": "Listing created", "listing": ListingResponse(**listing.dict())}


@api_router.put("/listings/{listing_id}")
async def update_listing(
    listing_id: str,
    listing_data: ListingUpdate,
    user_id: str = Depends(get_current_user)
):
    listing = await listings_collection.find_one({"id": listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to edit this listing")
    
    update_data = {k: v for k, v in listing_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await listings_collection.update_one(
        {"id": listing_id},
        {"$set": update_data}
    )
    
    updated_listing = await listings_collection.find_one({"id": listing_id})
    return {"message": "Listing updated", "listing": ListingResponse(**updated_listing)}


@api_router.delete("/listings/{listing_id}")
async def delete_listing(
    listing_id: str,
    user_id: str = Depends(get_current_user)
):
    listing = await listings_collection.find_one({"id": listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this listing")
    
    await listings_collection.delete_one({"id": listing_id})
    await favorites_collection.delete_many({"listing_id": listing_id})
    
    return {"message": "Listing deleted"}


@api_router.post("/listings/{listing_id}/view")
async def increment_view(listing_id: str):
    await listings_collection.update_one(
        {"id": listing_id},
        {"$inc": {"views": 1}}
    )
    return {"message": "View count updated"}


# ============ FAVORITES ENDPOINTS ============

@api_router.get("/favorites")
async def get_favorites(user_id: str = Depends(get_current_user)):
    favorites = await favorites_collection.find({"user_id": user_id}).to_list(100)
    
    listing_ids = [fav["listing_id"] for fav in favorites]
    listings = await listings_collection.find({"id": {"$in": listing_ids}}).to_list(100)
    
    # Get seller info
    for listing in listings:
        user = await users_collection.find_one({"id": listing["user_id"]})
        if user:
            listing["seller"] = {
                "name": user["name"],
                "phone": user["phone"],
                "verified": user.get("verified", False)
            }
    
    return [ListingResponse(**listing) for listing in listings]


@api_router.post("/favorites/{listing_id}")
async def add_favorite(
    listing_id: str,
    user_id: str = Depends(get_current_user)
):
    # Check if listing exists
    listing = await listings_collection.find_one({"id": listing_id})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if already favorited
    existing = await favorites_collection.find_one({
        "user_id": user_id,
        "listing_id": listing_id
    })
    if existing:
        return {"message": "Already in favorites"}
    
    favorite = Favorite(user_id=user_id, listing_id=listing_id)
    await favorites_collection.insert_one(favorite.dict())
    
    return {"message": "Added to favorites"}


@api_router.delete("/favorites/{listing_id}")
async def remove_favorite(
    listing_id: str,
    user_id: str = Depends(get_current_user)
):
    result = await favorites_collection.delete_one({
        "user_id": user_id,
        "listing_id": listing_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    return {"message": "Removed from favorites"}


# ============ USER ENDPOINTS ============

@api_router.get("/user/listings")
async def get_user_listings(user_id: str = Depends(get_current_user)):
    listings = await listings_collection.find({"user_id": user_id}).sort("created_at", -1).to_list(100)
    
    for listing in listings:
        user = await users_collection.find_one({"id": listing["user_id"]})
        if user:
            listing["seller"] = {
                "name": user["name"],
                "phone": user["phone"],
                "verified": user.get("verified", False)
            }
    
    return [ListingResponse(**listing) for listing in listings]


@api_router.put("/user/profile")
async def update_profile(
    name: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    update_data = {}
    if name:
        update_data["name"] = name
    if email:
        # Check if email already exists
        existing = await users_collection.find_one({"email": email, "id": {"$ne": user_id}})
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        update_data["email"] = email
    if phone:
        # Check if phone already exists
        existing = await users_collection.find_one({"phone": phone, "id": {"$ne": user_id}})
        if existing:
            raise HTTPException(status_code=400, detail="Phone already in use")
        update_data["phone"] = phone
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await users_collection.update_one({"id": user_id}, {"$set": update_data})
    
    user = await users_collection.find_one({"id": user_id})
    return UserResponse(**user)


# ============ IMAGE UPLOAD ENDPOINT ============

@api_router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files can be uploaded")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    file_url = f"/api/uploads/{unique_filename}"
    return {"url": file_url}


@api_router.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)


# ============ CATEGORIES ENDPOINT ============

@api_router.get("/categories")
async def get_categories():
    # Static categories - same as frontend mockData
    categories = [
        {"id": 1, "name": "Emlak", "slug": "emlak"},
        {"id": 2, "name": "Vasıta", "slug": "vasita"},
        {"id": 3, "name": "Yedek Parça, Aksesuar", "slug": "yedek-parca"},
        {"id": 4, "name": "İkinci El ve Sıfır Alışveriş", "slug": "ikinci-el"},
        {"id": 5, "name": "İş Makineleri & Sanayi", "slug": "is-makineleri"},
        {"id": 6, "name": "Ustalar ve Hizmetler", "slug": "ustalar"},
        {"id": 7, "name": "Özel Ders Verenler", "slug": "ozel-ders"},
        {"id": 8, "name": "Hayvanlar Alemi", "slug": "hayvanlar"},
        {"id": 9, "name": "İş İlanları", "slug": "is-ilanlari"}
    ]
    return categories


# Health check
@api_router.get("/")
async def root():
    return {"message": "fromowner.ca API"}


# Include the router in the main app
app.include_router(api_router)
app.include_router(admin_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
