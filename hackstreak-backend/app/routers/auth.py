from fastapi import APIRouter,status,Depends
from sqlalchemy.orm import Session
from app.schemas import UserResponse,UserCreate,UserLogin
from app.database import get_db
from app.repository import auth
from app.models import User
from uuid import UUID
from app.oauth2 import get_current_user

router = APIRouter(
    prefix='/user',tags=['Users'])

@router.post("/register",status_code=status.HTTP_200_OK)
def register(user:UserCreate,db:Session=Depends(get_db)):
    return auth.register(user,db)

@router.post("/login",status_code=status.HTTP_200_OK)
def register(user:UserLogin,db:Session=Depends(get_db)):
    return auth.login(user,db)

@router.get("/")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/me")
def get_current_user_profile(db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)):
    user=db.query(User).filter(User.email==current_user).first()
    return user