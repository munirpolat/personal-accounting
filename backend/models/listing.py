from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import uuid

class Listing(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    price: float
    currency: str = "TL"
    category: str
    sub_category: str
    city: str
    location: str
    images: List[str] = []
    featured: bool = False
    views: int = 0
    details: Dict[str, str] = {}
    user_id: str
    status: str = "active"  # active, pending, sold
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ListingCreate(BaseModel):
    title: str
    description: str
    price: float
    currency: str = "TL"
    category: str
    sub_category: str
    city: str
    location: Optional[str] = None
    images: List[str] = []
    details: Dict[str, str] = {}
    duration_days: int = 30  # Listing duration in days

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    city: Optional[str] = None
    location: Optional[str] = None
    images: Optional[List[str]] = None
    details: Optional[Dict[str, str]] = None
    status: Optional[str] = None

class ListingResponse(BaseModel):
    id: str
    title: str
    description: str
    price: float
    currency: str
    category: str
    sub_category: str
    city: str
    location: str
    images: List[str]
    featured: bool
    views: int
    details: Dict[str, str]
    user_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    seller: Optional[Dict] = None
