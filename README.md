# Full-Stack Task Manager

A secure, scalable REST API and React frontend built as a complete Task Management solution. This project demonstrates backend engineering best practices including JWT authentication, solid database architecture, and security, paired with a snappy frontend UI.

## 🚀 Tech Stack
- **Backend:** Python, FastAPI, SQLAlchemy ORM, PostgreSQL (Neon), Passlib (bcrypt), python-jose (JWT)
- **Frontend:** React.js, Vite, Tailwind CSS
- **Database:** PostgreSQL

---

## 🌟 Core Features

### Backend (FastAPI)
- **Authentication & Security:** Secure JWT-based user authentication. Passwords hashed using `bcrypt` preventing plain-text vulnerabilities.
- **Relational Data & ORM:** PostgreSQL database integration using SQLAlchemy. UUIDs utilized for secure, non-iterable primary keys.
- **RESTful CRUD Operations:** Full task management (Create, Read, Update, Delete) restricted strictly to the authenticated task owner.
- **Interactive Documentation:** Auto-generated Swagger capabilities built directly into the framework.

### Frontend (React + Vite)
- **Auth Flow:** Fast and responsive Login and Registration flows.
- **Dashboard:** Protected workspace enforcing JWT token presence.
- **Interactive Task Management:** Clean UI to instantly add tasks, toggle completion status, and securely delete tasks using the backend API.
- **Dynamic Feedback:** Realtime error/success messages handled cleanly from the HTTP layer.

---

## 💻 Local Setup Instructions

### 1. Backend Setup
Navigate into the backend directory and set up your virtual environment:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory containing your variables:
```env
DATABASE_URL=postgresql://your_database_connection_url_here
SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
The backend will run at `http://127.0.0.1:8000`. You can access the **Swagger API Documentation** at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install the dependencies:

```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will run at `http://localhost:5173`. Make sure your backend is running so the frontend can fetch data!

---

## 📈 Scalability & Architecture Note
This monolithic application was structured specifically with scalability in mind:

1. **Stateless Authentication:** By leveraging JWT tokens rather than server-side session cookies, the backend remains entirely stateless. This effectively means we can deploy multiple, identical API instances behind a **Load Balancer** without worrying about session replication or sticky routing.
2. **Decoupling (Microservice Readiness):** The frontend and backend repo are completely decoupled. The frontend communicates strictly via REST APIs over CORS. If the backend scales into microservices later (e.g. separating the `Auth` service from the `Task` service), the frontend simply shifts its targeted API URLs.
3. **Extensible Caching (Future Scope):** Because the architecture uses standard dependency injection (`Depends(get_db)`), we can easily introduce a **Redis** caching layer dependency. For heavy read loads to the `/tasks/` endpoint, we could cache the JSON response using the user ID as a key.
