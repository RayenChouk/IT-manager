# crud.py
# All database read/write operations live here.
# Routes call these functions instead of writing SQL directly.

from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import date, timedelta

import models
import schemas


# ─── Equipment ────────────────────────────────────────────────────────────────

def get_equipment(db: Session, equipment_id: int) -> Optional[models.Equipment]:
    return db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()


def get_all_equipment(
    db: Session,
    search: Optional[str] = None,
    type_filter: Optional[str] = None,
    status_filter: Optional[str] = None,
    location_filter: Optional[int] = None,
) -> list[models.Equipment]:
    query = db.query(models.Equipment)

    if search:
        like = f"%{search}%"
        query = query.filter(
            models.Equipment.name.ilike(like)
            | models.Equipment.serial_number.ilike(like)
        )
    if type_filter:
        query = query.filter(models.Equipment.type == type_filter)
    if status_filter:
        query = query.filter(models.Equipment.status == status_filter)
    if location_filter:
        query = query.filter(models.Equipment.location_id == location_filter)

    return query.order_by(models.Equipment.name).all()


def create_equipment(db: Session, data: schemas.EquipmentCreate) -> models.Equipment:
    item = models.Equipment(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_equipment(
    db: Session, equipment_id: int, data: schemas.EquipmentUpdate
) -> Optional[models.Equipment]:
    item = get_equipment(db, equipment_id)
    if not item:
        return None
    # Only update fields that were explicitly provided.
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_equipment(db: Session, equipment_id: int) -> bool:
    item = get_equipment(db, equipment_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True


def get_dashboard_stats(db: Session) -> schemas.DashboardStats:
    total = db.query(func.count(models.Equipment.id)).scalar()
    active = db.query(func.count(models.Equipment.id)).filter(models.Equipment.status == "Active").scalar()
    broken = db.query(func.count(models.Equipment.id)).filter(models.Equipment.status == "Broken").scalar()
    maintenance = db.query(func.count(models.Equipment.id)).filter(models.Equipment.status == "Maintenance").scalar()
    inactive = db.query(func.count(models.Equipment.id)).filter(models.Equipment.status == "Inactive").scalar()
    
    today = date.today()
    in_30_days = today + timedelta(days=30)
    expiring_soon = db.query(func.count(models.Equipment.id)).filter(
        models.Equipment.warranty_end_date >= today,
        models.Equipment.warranty_end_date <= in_30_days
    ).scalar()

    return schemas.DashboardStats(
        total=total,
        active=active,
        broken=broken,
        maintenance=maintenance,
        inactive=inactive,
        expiring_soon=expiring_soon,
    )


# ─── Locations ────────────────────────────────────────────────────────────────

def get_location(db: Session, location_id: int) -> Optional[models.Location]:
    return db.query(models.Location).filter(models.Location.id == location_id).first()


def get_all_locations(db: Session) -> list[models.Location]:
    return db.query(models.Location).order_by(models.Location.name).all()


def create_location(db: Session, data: schemas.LocationCreate) -> models.Location:
    location = models.Location(**data.model_dump())
    db.add(location)
    db.commit()
    db.refresh(location)
    return location


def update_location(
    db: Session, location_id: int, data: schemas.LocationUpdate
) -> Optional[models.Location]:
    location = get_location(db, location_id)
    if not location:
        return None
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(location, field, value)
    db.commit()
    db.refresh(location)
    return location


def delete_location(db: Session, location_id: int) -> bool:
    location = get_location(db, location_id)
    if not location:
        return False
    db.delete(location)
    db.commit()
    return True


# ─── Maintenance ──────────────────────────────────────────────────────────────

def get_maintenance_records(
    db: Session, equipment_id: Optional[int] = None
) -> list[models.MaintenanceRecord]:
    query = db.query(models.MaintenanceRecord)
    if equipment_id:
        query = query.filter(models.MaintenanceRecord.equipment_id == equipment_id)
    return query.order_by(models.MaintenanceRecord.date.desc()).all()


def create_maintenance_record(
    db: Session, data: schemas.MaintenanceRecordCreate
) -> models.MaintenanceRecord:
    record = models.MaintenanceRecord(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ─── Auth ─────────────────────────────────────────────────────────────────────

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()
