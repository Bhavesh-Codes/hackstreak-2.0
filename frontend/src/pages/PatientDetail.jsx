import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Stethoscope,
  QrCode,
  Plus,
  ArrowLeft,
  User,
  MapPin,
  Thermometer,
  Activity,
} from 'lucide-react';
import { patientService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// ─── Skeleton helpers ────────────────────────────────────────────────────────

function SkeletonHeader() {
  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="skeleton" style={{ height: 28, width: '60%', borderRadius: 6, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: '50%', borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: '35%', borderRadius: 4 }} />
        </div>
        <div className="skeleton" style={{ width: 100, height: 100, borderRadius: 8, flexShrink: 0 }} />
      </div>
    </div>
  );
}

function SkeletonTimeline() {
  return (
    <div className="timeline">
      {[1, 2, 3].map((i) => (
        <div key={i} className="timeline-item" style={{ marginBottom: 16 }}>
          <div className="skeleton" style={{ height: 14, width: '25%', borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 18, width: '45%', borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

// ─── Visit Card ───────────────────────────────────────────────────────────────

function VisitCard({ visit }) {
  const formattedDate = visit.visit_time
    ? new Date(visit.visit_time).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';

  return (
    <div className="timeline-item card" style={{ marginBottom: 16 }}>
      <div className="timeline-item__date" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Clock size={14} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
      </div>

      <div className="timeline-item__title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Stethoscope size={16} style={{ color: 'var(--accent)' }} />
        <span style={{ fontWeight: 600, fontSize: '1rem' }}>
          {visit.disease || 'General Visit'}
        </span>
        {visit.doctor && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: 4 }}>
            — Dr. {visit.doctor}
          </span>
        )}
      </div>

      <div className="timeline-item__meta" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '6px 16px' }}>
        {visit.prescription && (
          <MetaRow label="Prescription" value={visit.prescription} />
        )}
        {visit.bp && (
          <MetaRow label="Blood Pressure" value={visit.bp} icon={<Activity size={13} />} />
        )}
        {visit.temperature && (
          <MetaRow label="Temperature" value={visit.temperature} icon={<Thermometer size={13} />} />
        )}
        {visit.doctor_comment && (
          <div style={{ gridColumn: '1 / -1' }}>
            <MetaRow label="Doctor's Note" value={visit.doctor_comment} />
          </div>
        )}
      </div>
    </div>
  );
}

function MetaRow({ label, value, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon && <span style={{ color: 'var(--accent)' }}>{icon}</span>}
        {value}
      </span>
    </div>
  );
}

// ─── Add Visit Form ───────────────────────────────────────────────────────────

const EMPTY_FORM = {
  doctor: '',
  disease: '',
  prescription: '',
  bp: '',
  temperature: '',
  doctor_comment: '',
};

function AddVisitForm({ patientId, onVisitAdded }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await patientService.createVisit(patientId, form);
      onVisitAdded(res.data);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to add visit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: '1rem' }}>
        <Plus size={18} style={{ color: 'var(--accent)' }} />
        Add New Visit
      </h3>

      {error && (
        <div
          role="alert"
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '10px 14px',
            borderRadius: 'var(--radius)',
            marginBottom: 16,
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div className="input-group">
            <label htmlFor="visit-doctor">Doctor</label>
            <input
              id="visit-doctor"
              name="doctor"
              type="text"
              placeholder="Doctor name"
              value={form.doctor}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="visit-disease">Disease / Diagnosis</label>
            <input
              id="visit-disease"
              name="disease"
              type="text"
              placeholder="e.g. Hypertension"
              value={form.disease}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="visit-prescription">Prescription</label>
            <input
              id="visit-prescription"
              name="prescription"
              type="text"
              placeholder="Medications / dosage"
              value={form.prescription}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="visit-bp">Blood Pressure</label>
            <input
              id="visit-bp"
              name="bp"
              type="text"
              placeholder="e.g. 120/80"
              value={form.bp}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="visit-temperature">Temperature</label>
            <input
              id="visit-temperature"
              name="temperature"
              type="text"
              placeholder="e.g. 98.6°F"
              value={form.temperature}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: 20 }}>
          <label htmlFor="visit-comment">Doctor's Comment</label>
          <textarea
            id="visit-comment"
            name="doctor_comment"
            rows={3}
            placeholder="Additional notes or observations…"
            value={form.doctor_comment}
            onChange={handleChange}
            style={{ resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={submitting}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {submitting ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Plus size={16} />
          )}
          {submitting ? 'Saving…' : 'Add Visit'}
        </button>
      </form>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PatientDetail() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [patientError, setPatientError] = useState(null);
  const [visitsError, setVisitsError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoadingPatient(true);
    setLoadingVisits(true);
    setPatientError(null);
    setVisitsError(null);

    Promise.all([
      patientService.getById(id),
      patientService.getVisits(id),
    ])
      .then(([patientRes, visitsRes]) => {
        setPatient(patientRes.data);
        setVisits(
          Array.isArray(visitsRes.data)
            ? [...visitsRes.data].sort(
                (a, b) => new Date(a.visit_time) - new Date(b.visit_time)
              )
            : []
        );
      })
      .catch((err) => {
        // Try to distinguish which call failed by re-fetching individually
        patientService
          .getById(id)
          .then((res) => setPatient(res.data))
          .catch(() =>
            setPatientError('Could not load patient information.')
          )
          .finally(() => setLoadingPatient(false));

        patientService
          .getVisits(id)
          .then((res) =>
            setVisits(
              Array.isArray(res.data)
                ? [...res.data].sort(
                    (a, b) => new Date(a.visit_time) - new Date(b.visit_time)
                  )
                : []
            )
          )
          .catch(() => setVisitsError('Could not load visit history.'))
          .finally(() => setLoadingVisits(false));
      })
      .finally(() => {
        setLoadingPatient(false);
        setLoadingVisits(false);
      });
  }, [id]);

  const handleVisitAdded = (newVisit) => {
    setVisits((prev) =>
      [...prev, newVisit].sort(
        (a, b) => new Date(a.visit_time) - new Date(b.visit_time)
      )
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Back link */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <Link
          to="/patients"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={16} />
          Back to Patients
        </Link>
      </div>

      {/* ── Patient Header ── */}
      {loadingPatient ? (
        <SkeletonHeader />
      ) : patientError ? (
        <div
          role="alert"
          className="card"
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            marginBottom: 24,
          }}
        >
          {patientError}
        </div>
      ) : patient ? (
        <div className="card" style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              gap: 24,
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {/* Patient info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <User size={20} style={{ color: 'var(--accent)' }} />
                {patient.name}
              </h1>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '8px 20px',
                  marginTop: 14,
                }}
              >
                <InfoChip label="Age" value={patient.age ?? '—'} />
                <InfoChip label="Gender" value={patient.gender ?? '—'} />
                {patient.location && (
                  <InfoChip
                    label="Location"
                    value={patient.location}
                    icon={<MapPin size={13} />}
                  />
                )}
                {patient.height && (
                  <InfoChip label="Height" value={patient.height} />
                )}
                {patient.weight && (
                  <InfoChip label="Weight" value={patient.weight} />
                )}
                {patient.blood_group && (
                  <InfoChip label="Blood Group" value={patient.blood_group} />
                )}
              </div>
            </div>

            {/* QR Code */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
              }}
            >
              <QrCode size={16} style={{ color: 'var(--text-muted)' }} />
              <img
                src={patientService.getQR(id)}
                alt={`QR code for patient ${patient.name}`}
                width={100}
                height={100}
                style={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Health Card QR
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Visit Timeline ── */}
      <h2
        style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Stethoscope size={18} style={{ color: 'var(--accent)' }} />
        Visit History
      </h2>

      {loadingVisits ? (
        <SkeletonTimeline />
      ) : visitsError ? (
        <div
          role="alert"
          className="card"
          style={{ background: '#fee2e2', color: '#991b1b', marginBottom: 16 }}
        >
          {visitsError}
        </div>
      ) : (
        <div className="timeline">
          {visits.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
                padding: '32px 24px',
              }}
            >
              No visits recorded yet. Add the first visit below.
            </div>
          ) : (
            visits.map((visit, idx) => (
              <VisitCard key={visit.id ?? idx} visit={visit} />
            ))
          )}
        </div>
      )}

      {/* ── Add Visit Form ── */}
      <AddVisitForm patientId={id} onVisitAdded={handleVisitAdded} />
    </div>
  );
}

// ─── Small helper ─────────────────────────────────────────────────────────────

function InfoChip({ label, value, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span
        style={{
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '0.9rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {icon && <span style={{ color: 'var(--accent)' }}>{icon}</span>}
        {value}
      </span>
    </div>
  );
}
