# seed.py
# Populates the database with realistic sample data for development and demo.
# Run once with: python seed.py

from database import SessionLocal, engine, Base
import models
from routes.auth import hash_password
from datetime import datetime, timedelta

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Skip seeding if data already exists
    if db.query(models.User).count() > 0:
        print("Database already seeded. Skipping.")
        db.close()
        return

    # ── Users ──────────────────────────────────────────────
    import os

    admin = models.User(
        username=os.getenv("ADMIN_USERNAME"),
        hashed_password=hash_password(
            os.getenv("ADMIN_PASSWORD")
        )
    )
    db.add(admin)

    # ── Locations ──────────────────────────────────────────
    locations = [
        models.Location(name="Server Room",     ),
        models.Location(name="IT Office",      ),
        models.Location(name="HR Department",  ),
        models.Location(name="Meeting Room A",  ),
        models.Location(name="Reception",      ),
        models.Location(name="Finance Dept",    ),
    ]
    db.add_all(locations)
    db.flush()  # Populate IDs before referencing them

    # ── Equipment ──────────────────────────────────────────
    equipment_list = [
        models.Equipment(name="Dell PowerEdge R740",    serial_number="SRV-001", type="Server",   status="Active",      location_id=locations[0].id),
        models.Equipment(name="HP ProLiant DL380",      serial_number="SRV-002", type="Server",   status="Maintenance", location_id=locations[0].id),
        models.Equipment(name="Cisco Catalyst 2960",    serial_number="SW-001",  type="Switch",   status="Active",      location_id=locations[0].id),
        models.Equipment(name="Dell Latitude 5520",     serial_number="PC-001",  type="Computer", status="Active",      location_id=locations[1].id),
        models.Equipment(name="Lenovo ThinkPad T14",    serial_number="PC-002",  type="Computer", status="Active",      location_id=locations[1].id),
        models.Equipment(name="HP LaserJet Pro M404",   serial_number="PRT-001", type="Printer",  status="Active",      location_id=locations[1].id),
        models.Equipment(name="LG 27-inch Monitor",     serial_number="MON-001", type="Monitor",  status="Active",      location_id=locations[1].id),
        models.Equipment(name="HP EliteBook 850",       serial_number="PC-003",  type="Computer", status="Broken",      location_id=locations[2].id),
        models.Equipment(name="Canon PIXMA G3010",      serial_number="PRT-002", type="Printer",  status="Inactive",    location_id=locations[2].id),
        models.Equipment(name="Dell OptiPlex 3080",     serial_number="PC-004",  type="Computer", status="Active",      location_id=locations[3].id),
        models.Equipment(name="Cisco RV340 Router",     serial_number="RT-001",  type="Router",   status="Active",      location_id=locations[0].id),
        models.Equipment(name="Samsung 24-inch Monitor",serial_number="MON-002", type="Monitor",  status="Active",      location_id=locations[5].id),
    ]
    db.add_all(equipment_list)
    db.flush()

    # ── Maintenance Records ────────────────────────────────
    records = [
        models.MaintenanceRecord(
            equipment_id=equipment_list[1].id,
            date=datetime.utcnow() - timedelta(days=3),
            description="Replaced failing RAM module. System running stable.",
        ),
        models.MaintenanceRecord(
            equipment_id=equipment_list[7].id,
            date=datetime.utcnow() - timedelta(days=10),
            description="Screen display failure. Awaiting replacement part.",
        ),
        models.MaintenanceRecord(
            equipment_id=equipment_list[0].id,
            date=datetime.utcnow() - timedelta(days=30),
            description="Routine quarterly checkup. All systems nominal.",
        ),
        models.MaintenanceRecord(
            equipment_id=equipment_list[5].id,
            date=datetime.utcnow() - timedelta(days=7),
            description="Paper jam cleared. Rollers cleaned.",
        ),
    ]
    db.add_all(records)

    db.commit()
    db.close()
    print("✅ Database seeded successfully!")
    


if __name__ == "__main__":
    seed()
