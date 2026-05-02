from sqlalchemy import Column, Integer, String,ForeignKey,Text,DateTime,Float,Boolean
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from sqlalchemy.dialects.postgresql import UUID
import uuid

class User(Base):
    __tablename__="users"
    id=Column(Integer,index=True,primary_key=True)
    name=Column(String,nullable=False)
    email=Column(String,nullable=False,unique=True)
    password=Column(String,nullable=False)
    role=Column(String, nullable=False,default="staff")
    department=Column(String,nullable=False)
    created_at=Column(DateTime,default=datetime.utcnow)

class PatientVisit(Base):
    __tablename__ = "patient_visits"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(String, ForeignKey("patients.id"))
    doctor = Column(String)
    disease = Column(String, nullable=False)
    prescription = Column(Text, nullable=True)
    bp = Column(String, nullable=True)
    temperature = Column(Float, nullable=True)
    doctor_comment = Column(Text, nullable=True)
    visit_time = Column(DateTime, default=datetime.utcnow)
    patient = relationship("Patient", back_populates="visits")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    location = Column(String, nullable=False)
    visits = relationship("PatientVisit", back_populates="patient", cascade="all, delete")
    height=Column(Float, nullable=True)
    weight=Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


