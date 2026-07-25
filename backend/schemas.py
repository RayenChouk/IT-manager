# schemas.py
# Pydantic models used for request validation and response serialization.
# Kept separate from SQLAlchemy models to avoid coupling.

from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime, date


# ─── Location ────────────────────────────────────────────────────────────────

class LocationBase(BaseModel):
    name: str
   


class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    name: Optional[str] = None
    


class LocationOut(LocationBase):
    id: int

    model_config = {"from_attributes": True}


# ─── Equipment ────────────────────────────────────────────────────────────────

VALID_STATUSES = {"Active", "Inactive", "Broken", "Maintenance"}
VALID_TYPES = {"Computer", "Printer", "Monitor", "Switch", "Router", "Server", "Other"}


class EquipmentBase(BaseModel):
    name: str
    serial_number: str
    type: str
    status: str = "Active"
    location_id: Optional[int] = None
    warranty_end_date: Optional[date] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        if value not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return value

    @field_validator("type")
    @classmethod
    def validate_type(cls, value: str) -> str:
        if value not in VALID_TYPES:
            raise ValueError(f"Type must be one of: {', '.join(VALID_TYPES)}")
        return value


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    serial_number: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    location_id: Optional[int] = None
    warranty_end_date: Optional[date] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and value not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return value


class EquipmentOut(EquipmentBase):
    id: int
    location: Optional[LocationOut] = None

    model_config = {"from_attributes": True}


# ─── Maintenance ──────────────────────────────────────────────────────────────

class MaintenanceRecordCreate(BaseModel):
    equipment_id: int
    description: str
    date: Optional[datetime] = None


class MaintenanceRecordOut(BaseModel):
    id: int
    equipment_id: int
    date: datetime
    description: str
    equipment: Optional[EquipmentOut] = None

    model_config = {"from_attributes": True}


# ─── Auth ─────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── Dashboard ────────────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total: int
    active: int
    broken: int
    maintenance: int
    inactive: int
    expiring_soon: int
