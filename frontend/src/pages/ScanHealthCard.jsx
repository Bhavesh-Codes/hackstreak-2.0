import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Search, User } from 'lucide-react';
import { patientService } from '../services/api';
import { HealthCard } from '../components/HealthCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function ScanHealthCard() {
  const [query, setQuery] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setPatient(null);

    try {
      const res = await patientService.getById(query.trim());
      setPatient(res.data);
    } catch {
      setError('Patient not found');
    } finally {
      setLoading(false);
    }
  };

  // Derive latest condition from visits if available
  const latestCondition =
    patient?.visits?.length > 0
      ? patient.visits[patient.visits.length - 1].disease || '—'
      : '—';

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <QrCode size={28} color="var(--accent)" aria-hidden="true" />
          <h1 className="page-title">Scan or look up health card</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
          Enter a patient ID to retrieve their health card and summary.
        </p>
      </div>

      {/* Search Card */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 32 }}>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="patient-id-input"
            style={{
              display: 'block',
              fontWeight: 600,
              marginBottom: 8,
              color: 'var(--text)',
            }}
          >
            Patient ID
          </label>
          <div className="search-wrapper" style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              />
              <input
                id="patient-id-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 1042"
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !query.trim()}
            >
              {loading ? 'Looking up…' : 'Look up'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <LoadingSpinner size="lg" text="Fetching patient record…" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger" style={{ maxWidth: 560 }}>
          <strong>Patient not found</strong>
          <p style={{ margin: '4px 0 0' }}>
            No patient record matches ID "{query}". Please check the ID and try again.
          </p>
        </div>
      )}

      {/* Success State */}
      {patient && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Patient Summary Card */}
          <div className="card" style={{ maxWidth: 560 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={22} color="#fff" aria-hidden="true" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>
                  {patient.name}
                </h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Patient ID: {patient.id}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px 24px',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 2px',
                  }}
                >
                  Age
                </p>
                <p style={{ margin: 0, fontWeight: 600 }}>{patient.age}</p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 2px',
                  }}
                >
                  Gender
                </p>
                <p style={{ margin: 0, fontWeight: 600 }}>{patient.gender}</p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 2px',
                  }}
                >
                  Location
                </p>
                <p style={{ margin: 0, fontWeight: 600 }}>{patient.location || '—'}</p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 2px',
                  }}
                >
                  Latest Condition
                </p>
                <p style={{ margin: 0, fontWeight: 600 }}>{latestCondition}</p>
              </div>
            </div>
          </div>

          {/* Health Card */}
          <HealthCard patient={patient} />

          {/* Open Full Record Button */}
          <div>
            <Link
              to={`/patient/${patient.id}`}
              className="btn-primary"
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              Open full record
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
