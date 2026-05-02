from sqlalchemy.orm import Session
from app.models import Patient,PatientVisit
from app.schemas import PatientCreate
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy import func

def create_patients(request: PatientCreate, db: Session):

    new_patient = Patient(
        name=request.name,
        age=request.age,
        gender=request.gender,
        location=request.location,
        weight=request.weight,
        height=request.height
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


def get_patients(id: UUID, db: Session):

    patient = db.query(Patient).filter(Patient.id == id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient


def get_all_patient(db: Session):

    patients = db.query(Patient).order_by(Patient.created_at.desc()).limit(100).all()

    return patients 

def update_patients(id: UUID, request: PatientCreate, db: Session):

    patient = db.query(Patient).filter(Patient.id == id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient.name = request.name
    patient.age = request.age
    patient.gender = request.gender
    patient.location = request.location
    patient.weight = request.weight
    patient.height = request.height

    db.commit()
    db.refresh(patient)

    return patient


def delete_patients(id: UUID, db: Session):

    patient = db.query(Patient).filter(Patient.id == id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db.delete(patient)
    db.commit()

    return {"message": "Patient deleted"}

def disease_summary(db: Session):

    results = (
        db.query(
            Patient.location,
            PatientVisit.disease,
            func.count(PatientVisit.id)
        )
        .join(Patient, Patient.id == PatientVisit.patient_id)
        .group_by(Patient.location, PatientVisit.disease)
        .all()
    )

    return [
        {
            "location": location,
            "disease": disease,
            "count": count
        }
        for location, disease, count in results
    ]

def location_summary(db: Session):

    results = (
        db.query(Patient.location, func.count(Patient.id))
        .group_by(Patient.location)
        .all()
    )

    return [
        {"location": location, "count": count}
        for location, count in results
    ]


def create_visit(patient_id, request, db: Session):

    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    new_visit = PatientVisit(
        patient_id=patient_id,
        doctor=request.doctor,
        disease=request.disease,
        prescription=request.prescription,
        bp=request.bp,
        temperature=request.temperature,
        doctor_comment=request.doctor_comment
    )

    db.add(new_visit)
    db.commit()
    db.refresh(new_visit)

    return new_visit

def get_patient_visits(patient_id, db: Session):

    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    visits = (
        db.query(PatientVisit)
        .filter(PatientVisit.patient_id == patient_id)
        .order_by(PatientVisit.visit_time.desc())
        .all()
    )

    return visits