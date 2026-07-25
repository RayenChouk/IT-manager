# database.py
# Sets up the SQLAlchemy engine and session factory.
# All other modules import `SessionLocal` and `Base` from here.

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Read the connection string from environment or use a default for development.
# Format: postgresql://user:password@host:port/database
DATABASE_URL = "postgresql://postgres:rayen123@localhost:5432/it_equipment"

engine = create_engine(DATABASE_URL)

# Each request gets its own session via this factory.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class that all SQLAlchemy models inherit from."""
    pass


def get_db():
    """
    FastAPI dependency that yields a database session.
    Automatically closes the session when the request is done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
