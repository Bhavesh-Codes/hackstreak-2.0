from fastapi import FastAPI
from app.database import engine
from app import models
from app.routers import auth,patients
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(engine)

app=FastAPI(title="Sukoon")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://smart-healthcare09.netlify.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)

@app.get("/")
def Sukoon():
    return {"message":"Welcome to Sukoon backend"}