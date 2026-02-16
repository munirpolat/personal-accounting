from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    site_title: str = "fromowner.ca"
    site_description: str = "Canada's Leading Classifieds Marketplace"
    primary_color: str = "#0066CC"
    secondary_color: str = "#0052A3"
    logo_url: Optional[str] = None
    featured_listings_count: int = 8
    max_photos_per_listing: int = 10
    default_listing_duration_days: int = 30
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SiteSettingsUpdate(BaseModel):
    site_title: Optional[str] = None
    site_description: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    logo_url: Optional[str] = None
    featured_listings_count: Optional[int] = None
    max_photos_per_listing: Optional[int] = None
    default_listing_duration_days: Optional[int] = None

class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    icon: str
    order: int = 0
    sub_categories: List[Dict[str, str]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CategoryCreate(BaseModel):
    name: str
    slug: str
    icon: str
    order: Optional[int] = 0
    sub_categories: Optional[List[Dict[str, str]]] = []

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    sub_categories: Optional[List[Dict[str, str]]] = None
