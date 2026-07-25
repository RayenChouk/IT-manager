# routes/locations.py
# Endpoints for managing building locations.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db
from routes.auth import get_current_user

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("/", response_model=list[schemas.LocationOut])
def list_locations(
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    return crud.get_all_locations(db)


@router.get("/{location_id}", response_model=schemas.LocationOut)
def get_location(
    location_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    location = crud.get_location(db, location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


@router.post("/", response_model=schemas.LocationOut, status_code=201)
def create_location(
    data: schemas.LocationCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    return crud.create_location(db, data)


@router.put("/{location_id}", response_model=schemas.LocationOut)
def update_location(
    location_id: int,
    data: schemas.LocationUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    location = crud.update_location(db, location_id, data)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


@router.delete("/{location_id}", status_code=204)
def delete_location(
    location_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    success = crud.delete_location(db, location_id)
    if not success:
        raise HTTPException(status_code=404, detail="Location not found")
