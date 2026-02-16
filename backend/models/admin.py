from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password: str  # hashed
    full_name: str
    role: str = "admin"  # admin, super_admin
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: str
    created_at: datetime
