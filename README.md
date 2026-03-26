# Task Manager — Backend Developer Intern Assignment

A secure, scalable REST API with JWT authentication and role-based access, paired with a minimal React frontend. Built as a complete submission for the Backend Developer Internship Assignment.

---

## ✅ Assignment Requirements Coverage

### Backend (Primary Focus)

| Requirement | Implementation |
|---|---|
| User registration & login with password hashing | `POST /v1/auth/register` and `POST /v1/auth/login` using `bcrypt` via `passlib` |
| JWT Authentication | `python-jose` issues signed JWTs; all task routes require `Authorization: Bearer <token>` |
| Role-based access (user vs admin) | `role` column on User model; `GET /v1/tasks/admin/all` restricted to admin users via 403 guard |
| CRUD APIs for a secondary entity (Tasks) | Full Create, Read, Update, Delete on `/v1/tasks/` |
| API Versioning | All routes prefixed with `/v1` |
| Error handling & validation | Pydantic schemas for request validation; HTTP exceptions with correct status codes (400, 401, 403, 404) |
| API Documentation (Swagger) | Auto-generated at `/docs` via FastAPI |
| Database schema (PostgreSQL) | Neon PostgreSQL via SQLAlchemy ORM; UUID primary keys on all models |

### Frontend (Supportive)

| Requirement | Implementation |
|---|---|
| React.js UI | Built with React + Vite + Tailwind CSS |
| Register & Log In users | Full auth flow with form validation and error messages |
| Protected dashboard (JWT required) | Dashboard only renders when a valid JWT is in `localStorage`; auto-logout on 401 |
| CRUD actions on tasks | Add task, toggle completion status, delete task |
| Error/success messages from API | Toast notifications shown for all API responses |

### Security & Scalability

| Requirement | Implementation |
|---|---|
| Secure JWT handling | UUID stored in `sub` claim (not email); token validated on every protected request |
| Input sanitization & validation | Pydantic's `EmailStr` and field validators on all schemas |
| UUID primary keys | Prevents enumeration attacks on user and task IDs |
| Scalable project structure | Routes, models, schemas, dependencies, and core utilities are fully separated |
| Docker deployment | `Dockerfile` provided; backend is containerized and deployed on Railway |
| Scalability note | See section below |

---

## 🚀 Tech Stack

- **Backend:** Python 3.11, FastAPI, SQLAlchemy ORM, PostgreSQL (Neon), Passlib (bcrypt), python-jose
- **Frontend:** React.js, Vite, Tailwind CSS
- **Database:** PostgreSQL with UUID primary keys
- **Deployment:** Railway (Docker), Vercel (Frontend)

---

## 🌐 Live Deployment

| Service | URL |
|---|---|
| Backend API | https://task-manager-production-e77e.up.railway.app |
| Swagger Docs | https://task-manager-production-e77e.up.railway.app/docs |
| Frontend UI | https://task-manager-phi-liart.vercel.app |

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@taskmanager.com` | `Admin@123` |
| User | `user@taskmanager.com` | `User@123` |

---

## 💻 Local Setup

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql://your_connection_string_here
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Start the server:
```bash
uvicorn main:app --reload
```

API available at `http://127.0.0.1:8000` | Swagger at `http://127.0.0.1:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at `http://localhost:5173`

---

## 📡 API Endpoints

### Auth (`/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/v1/auth/register` | Register a new user | No |
| `POST` | `/v1/auth/login` | Login and receive JWT | No |
| `GET` | `/v1/auth/me` | Get current user profile | Yes |

### Tasks (`/v1/tasks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/v1/tasks/` | Get all tasks for current user | Yes (user) |
| `POST` | `/v1/tasks/` | Create a new task | Yes (user) |
| `GET` | `/v1/tasks/{task_id}` | Get a specific task | Yes (user) |
| `PUT` | `/v1/tasks/{task_id}` | Update a task | Yes (user) |
| `DELETE` | `/v1/tasks/{task_id}` | Delete a task | Yes (user) |
| `GET` | `/v1/tasks/admin/all` | Get all tasks in database | Yes (admin only) |

---

## 🗄️ Database Schema

### User
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `email` | String | Unique, indexed |
| `hashed_password` | String | bcrypt hashed |
| `role` | String | `user` or `admin`, default: `user` |
| `created_at` | DateTime | Auto-set on creation |

### Task
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `title` | String | Required |
| `description` | String | Optional |
| `status` | String | `pending` or `completed`, default: `pending` |
| `owner_id` | UUID | Foreign key → User.id |
| `created_at` | DateTime | Auto-set on creation |

---

## 📈 Scalability & Architecture Note

1. **Stateless Auth:** JWT tokens eliminate server-side sessions. Multiple backend instances can run behind a load balancer with no session replication.
2. **Microservice-Ready:** Frontend and backend are fully decoupled via REST + CORS. The auth service and task service can be split into independent microservices without changing the frontend.
3. **Extensible Caching:** The dependency injection pattern (`Depends(get_db)`) makes it straightforward to introduce a Redis caching layer for read-heavy endpoints like `GET /v1/tasks/`.
4. **Docker:** The backend ships with a `Dockerfile` enabling consistent, portable deployments across any cloud provider.
