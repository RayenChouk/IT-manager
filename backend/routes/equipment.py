# routes/equipment.py
# All endpoints related to equipment management.

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import Optional

import crud
import schemas
from database import get_db
from routes.auth import get_current_user

router = APIRouter(prefix="/equipment", tags=["Equipment"])


@router.get("/", response_model=list[schemas.EquipmentOut])
def list_equipment(
    search: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    location_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _: schemas.TokenResponse = Depends(get_current_user),
):
    return crud.get_all_equipment(db, search=search, type_filter=type, status_filter=status, location_filter=location_id)


@router.get("/stats", response_model=schemas.DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    _: schemas.TokenResponse = Depends(get_current_user),
):
    return crud.get_dashboard_stats(db)


@router.get("/{equipment_id}", response_model=schemas.EquipmentOut)
def get_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    item = crud.get_equipment(db, equipment_id)
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return item


@router.post("/", response_model=schemas.EquipmentOut, status_code=201)
def create_equipment(
    data: schemas.EquipmentCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    try:
        return crud.create_equipment(db, data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="This serial number is already in use")


@router.put("/{equipment_id}", response_model=schemas.EquipmentOut)
def update_equipment(
    equipment_id: int,
    data: schemas.EquipmentUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    try:
        item = crud.update_equipment(db, equipment_id, data)
        if not item:
            raise HTTPException(status_code=404, detail="Equipment not found")
        return item
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="This serial number is already in use")


@router.delete("/{equipment_id}", status_code=204)
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    success = crud.delete_equipment(db, equipment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Equipment not found")
