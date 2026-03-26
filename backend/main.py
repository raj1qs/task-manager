from fastapi import FastAPI
from routes import authentication,tasks
from models.user import User
from models import task
from db.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://task-manager-phi-liart.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(authentication.router)
app.include_router(tasks.router)
Base.metadata.create_all(bind=engine)

@app.get("/")
def health_check():
    return {"message": "Hello World"}