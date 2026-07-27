# tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool

from main import app
from database import Base, get_db
import models
from routes.auth import hash_password, create_access_token

# In-memory SQLite for tests — fast, isolated, wiped every run.
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def db_session():
    """Creates all tables before each test, drops them after — full isolation."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """A TestClient that talks to the app using the test database."""
    return TestClient(app)


@pytest.fixture
def test_user(db_session):
    """Creates a user directly in the test DB, returns the username/password used."""
    user = models.User(
        username="testadmin",
        hashed_password=hash_password("testpass123"),
    )
    db_session.add(user)
    db_session.commit()
    return {"username": "testadmin", "password": "testpass123"}


@pytest.fixture
def auth_headers(test_user):
    """A ready-to-use Authorization header with a valid token."""
    token = create_access_token(test_user["username"])
    return {"Authorization": f"Bearer {token}"}