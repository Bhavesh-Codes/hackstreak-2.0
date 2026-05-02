from fastapi import APIRouter,status,Depends,HTTPException
from sqlalchemy.orm import Session
from io import BytesIO
import qrcode
from uuid import UUID
from fastapi.responses import StreamingResponse
from app.models import Patient
from app.database import get_db
from app.schemas import User,PatientCreate,VisitCreate
from app.oauth2 import get_current_user
from app.routers import patients
from app.repository import patient
from typing import List

router = APIRouter(
    prefix='/patients',tags=['Patients'])

@router.get("/{patient_id}/qr")
def get_patient_qr(patient_id: UUID, db: Session = Depends(get_db)):
    
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient_url = f"https://smart-healthcare09.netlify.app/patient/{patient_id}"
    qr = qrcode.make(patient_url)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png")


@router.post("/")
def create_patient(
    request: PatientCreate,
    db: Session = Depends(get_db)
):
    return patient.create_patients(request, db)

@router.get("/")
def get_all_patients(db: Session = Depends(get_db)):
    return patient.get_all_patient(db)

@router.get("/analytics/disease")
def disease_summaries(db: Session = Depends(get_db)):
    return patient.disease_summary(db)

@router.get("/analytics/location")
def location_summaries(db: Session = Depends(get_db)):
    return patient.location_summary(db)

@router.get("/{id}")
def get_patient(id: UUID, db: Session = Depends(get_db)):
    return patient.get_patients(id, db)


@router.put("/{id}",)
def update_patient(
    id: UUID,
    request: PatientCreate,
    db: Session = Depends(get_db)
):
    return patient.update_patients(id, request, db)

@router.post("/{patient_id}/visits")
def create_visit(
    patient_id: UUID,
    request: VisitCreate,
    db: Session = Depends(get_db)
):
    return patient.create_visit(patient_id, request,  db)

@router.get("/{patient_id}/visits")
def get_patient_visits(
    patient_id: UUID,
    db: Session = Depends(get_db)
):
    return patient.get_patient_visits(patient_id, db)

@router.delete("/{id}")
def delete_patient(id: UUID, db: Session = Depends(get_db)):
    return patient.delete_patients(id, db)


