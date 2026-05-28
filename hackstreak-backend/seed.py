"""
Seed script — populates the Sukoon database with realistic sample data.
Run from the hackstreak-backend directory:
    python seed.py
"""

import requests

BASE = "http://127.0.0.1:8000"

# ── Patients ──────────────────────────────────────────────────────────────────
PATIENTS = [
    {"name": "Priya Nair",       "age": 28, "gender": "Female", "location": "Zone 2, Airoli",    "height": 162.0, "weight": 55.0},
    {"name": "Ravi Kumar",       "age": 45, "gender": "Male",   "location": "Zone 4, Vashi",     "height": 175.0, "weight": 82.0},
    {"name": "Sunita Desai",     "age": 34, "gender": "Female", "location": "Zone 1, Belapur",   "height": 158.0, "weight": 60.0},
    {"name": "Arjun Mehta",      "age": 52, "gender": "Male",   "location": "Zone 6, Kharghar",  "height": 170.0, "weight": 90.0},
    {"name": "Meena Pillai",     "age": 29, "gender": "Female", "location": "Zone 3, Nerul",     "height": 155.0, "weight": 50.0},
    {"name": "Vikram Singh",     "age": 38, "gender": "Male",   "location": "Zone 7, Panvel",    "height": 180.0, "weight": 78.0},
    {"name": "Anita Sharma",     "age": 61, "gender": "Female", "location": "Zone 5, Sanpada",   "height": 152.0, "weight": 65.0},
    {"name": "Deepak Joshi",     "age": 23, "gender": "Male",   "location": "Zone 4, Vashi",     "height": 168.0, "weight": 68.0},
    {"name": "Kavita Rao",       "age": 47, "gender": "Female", "location": "Zone 2, Airoli",    "height": 160.0, "weight": 72.0},
    {"name": "Suresh Patil",     "age": 55, "gender": "Male",   "location": "Zone 1, Belapur",   "height": 172.0, "weight": 85.0},
    {"name": "Pooja Iyer",       "age": 31, "gender": "Female", "location": "Zone 8, Ulwe",      "height": 163.0, "weight": 57.0},
    {"name": "Nikhil Verma",     "age": 19, "gender": "Male",   "location": "Zone 6, Kharghar",  "height": 174.0, "weight": 65.0},
]

# ── Visits per patient (index-matched) ───────────────────────────────────────
VISITS = [
    # Priya Nair — Dengue
    [
        {"doctor": "Dr. Ravi Kumar",  "disease": "Dengue Fever",        "prescription": "Paracetamol 500mg, ORS",          "bp": "110/70", "temperature": 102.4, "doctor_comment": "NS1 positive. Platelet count 98,000. Monitor every 12 hrs. No NSAIDs."},
        {"doctor": "Dr. Priya Shah",  "disease": "Fever — Preliminary", "prescription": "Hydration advised",               "bp": "112/72", "temperature": 101.0, "doctor_comment": "High grade fever, body aches, rash. NS1 test ordered."},
    ],
    # Ravi Kumar — Hypertension
    [
        {"doctor": "Dr. Meena Pillai","disease": "Hypertension",         "prescription": "Amlodipine 5mg once daily",       "bp": "158/96", "temperature": 98.6,  "doctor_comment": "BP elevated. Lifestyle changes advised. Follow-up in 4 weeks."},
        {"doctor": "Dr. Meena Pillai","disease": "Hypertension Follow-up","prescription": "Amlodipine 5mg, Losartan 50mg",  "bp": "142/88", "temperature": 98.4,  "doctor_comment": "Partial response. Added Losartan. Reduce salt intake."},
    ],
    # Sunita Desai — Typhoid
    [
        {"doctor": "Dr. Ravi Kumar",  "disease": "Typhoid Fever",        "prescription": "Azithromycin 500mg 7 days",       "bp": "100/65", "temperature": 103.2, "doctor_comment": "Widal test positive. Bed rest, soft diet."},
    ],
    # Arjun Mehta — Diabetes
    [
        {"doctor": "Dr. Priya Shah",  "disease": "Type 2 Diabetes",      "prescription": "Metformin 500mg twice daily",     "bp": "130/82", "temperature": 98.2,  "doctor_comment": "HbA1c 8.2%. Diet counselling given. Recheck in 3 months."},
        {"doctor": "Dr. Priya Shah",  "disease": "Diabetes Follow-up",   "prescription": "Metformin 1000mg twice daily",    "bp": "128/80", "temperature": 98.0,  "doctor_comment": "HbA1c improved to 7.4%. Continue medication."},
    ],
    # Meena Pillai — Malaria
    [
        {"doctor": "Dr. Ravi Kumar",  "disease": "Malaria (P. vivax)",   "prescription": "Chloroquine 600mg loading dose",  "bp": "105/68", "temperature": 104.0, "doctor_comment": "Peripheral smear positive. Chills and rigors. Admit for observation."},
    ],
    # Vikram Singh — Tuberculosis
    [
        {"doctor": "Dr. Meena Pillai","disease": "Pulmonary Tuberculosis","prescription": "HRZE regimen — 2 months intensive","bp": "118/76", "temperature": 99.8, "doctor_comment": "Sputum AFB positive. DOTS initiated. Notify health authority."},
        {"doctor": "Dr. Meena Pillai","disease": "TB Follow-up",          "prescription": "HR regimen — continuation phase", "bp": "120/78", "temperature": 98.6, "doctor_comment": "Sputum converted negative. Continue continuation phase 4 months."},
    ],
    # Anita Sharma — Routine checkup
    [
        {"doctor": "Dr. Priya Shah",  "disease": "Annual Health Checkup", "prescription": "Vitamin D3 60,000 IU weekly",    "bp": "118/76", "temperature": 98.4,  "doctor_comment": "All vitals normal. Vitamin D deficiency detected. Supplement advised."},
    ],
    # Deepak Joshi — Dengue
    [
        {"doctor": "Dr. Ravi Kumar",  "disease": "Dengue Fever",          "prescription": "Paracetamol, ORS, bed rest",     "bp": "108/68", "temperature": 101.8, "doctor_comment": "NS1 positive. Platelet 1,10,000. Outpatient management."},
    ],
    # Kavita Rao — Hypertension + Diabetes
    [
        {"doctor": "Dr. Priya Shah",  "disease": "Hypertension",          "prescription": "Telmisartan 40mg once daily",    "bp": "150/92", "temperature": 98.6,  "doctor_comment": "Stage 1 hypertension. Medication started."},
        {"doctor": "Dr. Priya Shah",  "disease": "Type 2 Diabetes",       "prescription": "Metformin 500mg twice daily",    "bp": "148/90", "temperature": 98.4,  "doctor_comment": "Incidental finding — FBS 148 mg/dL. Diabetes confirmed."},
    ],
    # Suresh Patil — COVID-19
    [
        {"doctor": "Dr. Ravi Kumar",  "disease": "COVID-19",              "prescription": "Paracetamol, Vitamin C, Zinc",   "bp": "122/80", "temperature": 100.4, "doctor_comment": "RT-PCR positive. Mild symptoms. Home isolation 10 days."},
    ],
    # Pooja Iyer — Flu
    [
        {"doctor": "Dr. Meena Pillai","disease": "Influenza (Flu/ILI)",   "prescription": "Oseltamivir 75mg twice daily",   "bp": "110/70", "temperature": 100.8, "doctor_comment": "Rapid flu test positive. Antiviral started within 48 hrs."},
    ],
    # Nikhil Verma — Routine
    [
        {"doctor": "Dr. Priya Shah",  "disease": "Routine Checkup",       "prescription": "Multivitamin supplement",        "bp": "116/74", "temperature": 98.2,  "doctor_comment": "Healthy young adult. BMI normal. No concerns."},
    ],
]


def seed():
    created = 0
    failed = 0

    # First fetch existing patients to avoid duplicates
    existing = requests.get(f"{BASE}/patients/").json()
    existing_names = {p["name"]: p["id"] for p in existing}

    for i, patient_data in enumerate(PATIENTS):
        # Reuse existing patient if already seeded
        if patient_data["name"] in existing_names:
            patient_id = existing_names[patient_data["name"]]
            print(f"  ~ Existing patient: {patient_data['name']} ({patient_id})")
        else:
            r = requests.post(f"{BASE}/patients/", json=patient_data)
            if r.status_code not in (200, 201):
                print(f"  ✗ Failed to create patient {patient_data['name']}: {r.status_code} {r.text}")
                failed += 1
                continue
            patient_id = r.json()["id"]
            print(f"  ✓ Created patient: {patient_data['name']} ({patient_id})")
            created += 1

        # Add visits
        for visit in VISITS[i]:
            vr = requests.post(f"{BASE}/patients/{patient_id}/visits", json=visit)
            if vr.status_code not in (200, 201):
                print(f"      ✗ Visit failed: {vr.status_code} {vr.text}")
            else:
                print(f"      + Visit: {visit['disease']}")

    print(f"\nDone — {created} patients created, {failed} failed.")


if __name__ == "__main__":
    seed()
