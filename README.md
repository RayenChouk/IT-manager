# 🖥️ IT Equipment Manager

A full-stack web application to manage and locate IT equipment inside a building.

Built with **FastAPI** + **PostgreSQL** (backend) and **React** + **Vite** (frontend).

---

## 🗂️ Project Structure

```
project 4/
├── backend/
│   ├── main.py          # FastAPI app entry point
│   ├── database.py      # DB engine & session
│   ├── models.py        # SQLAlchemy ORM models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── crud.py          # Database operations
│   ├── seed.py          # Sample data seeder
│   ├── requirements.txt
│   └── routes/
│       ├── auth.py
│       ├── equipment.py
│       ├── locations.py
│       └── maintenance.py
└── frontend/
    └── src/
        ├── api/         # Fetch wrappers (one per resource)
        ├── hooks/       # useAuth, useFetch
        ├── components/  # Sidebar, Modal, Toast, etc.
        ├── pages/       # One component per page
        └── styles/      # global.css, layout.css
```

---

## ⚙️ Setup

### 1. Database

Create a PostgreSQL database:
```sql
CREATE DATABASE it_equipment;
```

Update `DATABASE_URL` in `backend/database.py` if your credentials differ.

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
python seed.py          # populates with demo data
uvicorn main:app --reload
```

API runs at: **http://localhost:8000**  
Swagger docs: **http://localhost:8000/docs**

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

## 🔑 Default Login

| Username | Password |
|----------|----------|
| admin    | admin123 |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| Authentication | JWT login, 8-hour sessions |
| Equipment CRUD | Create, edit, delete, view with search & filter |
| Locations CRUD | Manage building rooms/zones |
| Maintenance Log | Record and view maintenance history |
| Dashboard | Stats: total, active, broken, maintenance count |
| Floor Map | Interactive SVG with draggable equipment markers |

---

## 🔌 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST   | /auth/login | Login & get JWT token |
| GET    | /equipment/ | List all (with search/filter) |
| POST   | /equipment/ | Create new equipment |
| PUT    | /equipment/{id} | Update equipment |
| DELETE | /equipment/{id} | Delete equipment |
| GET    | /equipment/stats | Dashboard statistics |
| GET    | /locations/ | List locations |
| POST/PUT/DELETE | /locations/{id} | CRUD locations |
| GET    | /maintenance/ | List maintenance records |
| POST   | /maintenance/ | Log new maintenance |

---

## 🎨 Tech Stack

- **Backend**: FastAPI, SQLAlchemy, Pydantic, python-jose, passlib, PostgreSQL
- **Frontend**: React 18, React Router v6, Vite, CSS Modules
