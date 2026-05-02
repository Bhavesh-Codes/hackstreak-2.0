from pydantic import BaseModel,EmailStr
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    name:str
    email:EmailStr
    department:str
    password:str

class User(BaseModel):
    name:str
    email:str
    password:str
    role:str
    department:str

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id:int
    name:str
    email:str
    role:str
    department:str

    class Config():
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    location: str
    height:float
    weight:float
    
class VisitCreate(BaseModel):
    doctor:str
    disease: str
    prescription: str | None = None
    bp: str | None = None
    temperature: float | None = None
    doctor_comment: str | None = None

class PatientResponse(BaseModel):
    id: UUID
    name: str
    age: int
    gender: str
    location: str
    disease: str | None = None
    prescription: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True