from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import visitors, auth

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(visitors.router, prefix="/api")
# app.include_router(auth.router, prefix="/api/auth")

@app.get("/")
def read_root():
    return {"message": "Visitor Management System API"}