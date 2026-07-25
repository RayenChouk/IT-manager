# models.py
# SQLAlchemy ORM models — each class maps to a database table.

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Date
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class Location(Base):
    """
    Represents a physical room or zone inside the building.
    x and y store the position on the floor plan SVG (as percentage 0–100).
    """
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    x = Column(Float, default=50.0)   # horizontal position on the map
    y = Column(Float, default=50.0)   # vertical position on the map

    # One location can have many pieces of equipment.
    equipment = relationship("Equipment", back_populates="location")


class Equipment(Base):
    """
    Represents a single piece of IT equipment (computer, printer, etc.).
    """
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    serial_number = Column(String(100), nullable=False, unique=True)

    # Type examples: "Computer", "Printer", "Monitor", "Switch", etc.
    type = Column(String(50), nullable=False)

    # Status values: "Active", "Inactive", "Broken", "Maintenance"
    status = Column(String(50), nullable=False, default="Active")
    warranty_end_date = Column(Date, nullable=True)

    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)

    location = relationship("Location", back_populates="equipment")
    maintenance_records = relationship(
        "MaintenanceRecord",
        back_populates="equipment",
        cascade="all, delete-orphan",
    )


class MaintenanceRecord(Base):
    """
    Logs a maintenance event for a specific piece of equipment.
    """
    __tablename__ = "maintenance_records"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    description = Column(Text, nullable=False)

    equipment = relationship("Equipment", back_populates="maintenance_records")


class User(Base):
    """
    Application user — only admin-level users are represented here.
    Passwords are stored as bcrypt hashes.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
