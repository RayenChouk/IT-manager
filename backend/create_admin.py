from database import SessionLocal
import models
from routes.auth import hash_password

db = SessionLocal()

admin = models.User(
    username="abfinfo",
    hashed_password=hash_password("abf#info.401#")
)

db.add(admin)
db.commit()

db.close()

print("Admin created")