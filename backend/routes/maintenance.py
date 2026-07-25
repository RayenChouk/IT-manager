# routes/maintenance.py
# Endpoints for creating and viewing maintenance records.

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

import crud
import schemas
from database import get_db
from routes.auth import get_current_user

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


@router.get("/", response_model=list[schemas.MaintenanceRecordOut])
def list_maintenance_records(
    equipment_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    """Return all maintenance records, optionally filtered by equipment."""
    return crud.get_maintenance_records(db, equipment_id=equipment_id)


@router.post("/", response_model=schemas.MaintenanceRecordOut, status_code=201)
def create_maintenance_record(
    data: schemas.MaintenanceRecordCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    # Make sure the referenced equipment exists.
    equipment = crud.get_equipment(db, data.equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return crud.create_maintenance_record(db, data)
