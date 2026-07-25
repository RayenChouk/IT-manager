# main.py
# Application entry point. Registers routers and configures CORS.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes import auth, equipment, locations, maintenance

# Create all database tables on startup if they don't exist yet.
# In production you would use Alembic migrations instead.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IT Equipment Manager",
    description="Manage and locate IT equipment across the building.",
    version="1.0.0",
)

# Allow the React dev server to communicate with the API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(equipment.router)
app.include_router(locations.router)
app.include_router(maintenance.router)


@app.get("/")
def root():
    return {"message": "IT Equipment Manager API is running."}
