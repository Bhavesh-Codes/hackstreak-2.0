from sqlalchemy.orm import Session
from app.models import User
from fastapi import HTTPException
from app import hashing
from app import jwt_token


def register(user,db:Session):
    existing=db.query(User).filter(User.email==user.email).first()
    if existing:
        raise HTTPException(status_code=400,detail="email already exist")
    new_user=User(
        name=user.name,
        email=user.email,
        password=hashing.Hash.bcrypt(user.password),
        department=user.department
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message":"User registered succesfully"}

def login(user,db:Session):
    exist_user=db.query(User).filter(User.email==user.email).first()
    if not exist_user:
        raise HTTPException(status_code=404,detail="Incorrect credentials")
    if not hashing.Hash.verify(exist_user.password,user.password):
        raise HTTPException(status_code=403,detail="Incorrect Password")
    token=jwt_token.create_access_token(data={"sub":user.email})
    return {"access_token":"Bearer "+token}