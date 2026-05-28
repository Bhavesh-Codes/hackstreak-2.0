import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, CheckCircle } from 'lucide-react';
import { patientService } from '../services/api';
import { HealthCard } from '../components/HealthCard';

const INITIAL_PERSONAL = {
  name: '',
  age: '',
  gender: '',
  location: '',
  height: '',
  weight: '',
};

const INITIAL_MEDICAL = {
  doctor: '',
  disease: '',
  prescription: '',
  notes: '',
};

function hasMedicalData(medical) {
  return Object.values(medical).some((v) => v.trim() !== '');
}

export default function RegisterPatient() {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState(INITIAL_PERSONAL);
  const [medical, setMedical] = useState(INITIAL_MEDICAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdPatient, setCreatedPatient] = useState(null);

  const handlePersonalChange = (e) => {
    setPersonal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMedicalChange = (e) => {
    setMedical((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Step 1: Create patient with personal data
      const patientPayload = {
        name: personal.name,
        age: personal.age ? Number(personal.age) : undefined,
        gender: personal.gender,
        location: personal.location,
        height: personal.height ? Number(personal.height) : undefined,
        weight: personal.weight ? Number(personal.weight) : undefined,
      };

      const patientRes = await patientService.create(patientPayload);
      const newPatient = patientRes.data;

      // Step 2: Conditionally create visit if any medical field is non-empty
      if (hasMedicalData(medical)) {
        await patientService.createVisit(newPatient.id, {
          doctor: medical.doctor,
          disease: medical.disease,
          prescription: medical.prescription,
          doctor_comment: medical.notes,
        });
      }

      // Step 3: Show success state
      setCreatedPatient(newPatient);
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please try again.';
      setError(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success view ──────────────────────────────────────────────────────────
  if (createdPatient) {
    return (
      <div>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={24} color="var(--success)" />
            <h1 className="page-title" style={{ margin: 0 }}>Patient Registered</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: '0.875rem' }}>
            The patient record has been created successfully.
          </p>
        </div>

        <div className="card" style={{ maxWidth: 480, marginBottom: 24 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
            Health Card Preview
          </h2>
          <HealthCard patient={createdPatient} />
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => navigate(`/patient/${createdPatient.id}`)}
          >
            View Full Record
          </button>
          <button
            className="btn-primary"
            style={{ background: 'var(--text-muted)' }}
            onClick={() => {
              setCreatedPatient(null);
              setPersonal(INITIAL_PERSONAL);
              setMedical(INITIAL_MEDICAL);
            }}
          >
            Register Another Patient
          </button>
        </div>
      </div>
    );
  }

  // ── Form view ─────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserPlus size={22} color="var(--accent)" />
          <h1 className="page-title" style={{ margin: 0 }}>Register Patient</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: '0.875rem' }}>
          Fill in the patient's personal and medical details below.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fca5a5',
            borderRadius: 'var(--radius)',
            padding: '10px 14px',
            marginBottom: 20,
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid-2">
          {/* ── LEFT: Personal Details ─────────────────────────────────── */}
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: 'var(--text)' }}>
              Personal Details
            </h2>

            <div className="input-group">
              <label htmlFor="name">Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={personal.name}
                onChange={handlePersonalChange}
                placeholder="e.g. Ravi Kumar"
              />
            </div>

            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                max="150"
                value={personal.age}
                onChange={handlePersonalChange}
                placeholder="e.g. 35"
              />
            </div>

            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={personal.gender}
                onChange={handlePersonalChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={personal.location}
                onChange={handlePersonalChange}
                placeholder="e.g. Navi Mumbai"
              />
            </div>

            <div className="input-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                id="height"
                name="height"
                type="number"
                min="0"
                value={personal.height}
                onChange={handlePersonalChange}
                placeholder="e.g. 170"
              />
            </div>

            <div className="input-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                min="0"
                value={personal.weight}
                onChange={handlePersonalChange}
                placeholder="e.g. 65"
              />
            </div>
          </div>

          {/* ── RIGHT: Medical Details ─────────────────────────────────── */}
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, color: 'var(--text)' }}>
              Medical Details
              <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
                (optional — creates initial visit record)
              </span>
            </h2>

            <div className="input-group">
              <label htmlFor="doctor">Attending Doctor</label>
              <input
                id="doctor"
                name="doctor"
                type="text"
                value={medical.doctor}
                onChange={handleMedicalChange}
                placeholder="e.g. Dr. Priya Sharma"
              />
            </div>

            <div className="input-group">
              <label htmlFor="disease">Diagnosis / Disease</label>
              <input
                id="disease"
                name="disease"
                type="text"
                value={medical.disease}
                onChange={handleMedicalChange}
                placeholder="e.g. Hypertension"
              />
            </div>

            <div className="input-group">
              <label htmlFor="prescription">Prescription</label>
              <input
                id="prescription"
                name="prescription"
                type="text"
                value={medical.prescription}
                onChange={handleMedicalChange}
                placeholder="e.g. Amlodipine 5mg once daily"
              />
            </div>

            <div className="input-group">
              <label htmlFor="notes">Doctor's Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={medical.notes}
                onChange={handleMedicalChange}
                placeholder="Additional observations or instructions…"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* Submit row */}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              padding: '10px 28px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Registering…' : 'Register Patient'}
          </button>
          <Link
            to="/patients"
            style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
