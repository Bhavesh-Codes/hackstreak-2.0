import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { patientService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

/**
 * Pure filter function — exported for testability.
 * Returns the subset of patients whose name or id contains the search
 * string as a case-insensitive substring.
 */
export function filterPatients(patients, search) {
  const q = search.trim().toLowerCase();
  if (!q) return patients;
  return patients.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      String(p.id).toLowerCase().includes(q)
  );
}

/**
 * Derive a display status from a patient record.
 * If the patient has no condition (latest visit disease), they are "Active";
 * otherwise they are "Monitoring".
 */
function deriveStatus(condition) {
  return condition ? 'Monitoring' : 'Active';
}

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await patientService.getAll();
      setPatients(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to load patients.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = filterPatients(patients, search);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Patients</h1>
        <Link to="/register" className="btn-primary">
          Register Patient
        </Link>
      </div>

      {/* Search bar */}
      <div className="search-wrapper">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search by name or patient ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search patients"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ flex: 1 }}>{error}</span>
          <button
            className="btn-primary"
            onClick={fetchPatients}
            style={{ background: '#991b1b' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Table area */}
      <div className="table-wrapper">
        {loading ? (
          <LoadingSpinner text="Loading patients..." />
        ) : filtered.length === 0 && patients.length === 0 ? (
          /* Empty state — no patients registered at all */
          <div className="empty-state">
            <p>No patients registered yet.</p>
            <Link to="/register" className="btn-primary">
              Register your first patient
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty search results */
          <div className="empty-state">
            <p>No patients match your search.</p>
          </div>
        ) : (
          <table aria-label="Patients list">
            <thead>
              <tr>
                <th>Name</th>
                <th>Patient ID</th>
                <th>Age / Sex</th>
                <th>Location</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Health Card</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => {
                const condition = patient.latest_disease || '';
                const status = deriveStatus(condition);
                return (
                  <tr key={patient.id}>
                    <td>
                      <Link to={`/patient/${patient.id}`}>
                        {patient.name}
                      </Link>
                    </td>
                    <td>{patient.id}</td>
                    <td>
                      {patient.age} / {patient.gender}
                    </td>
                    <td>{patient.location || '—'}</td>
                    <td>{condition || '—'}</td>
                    <td>
                      <StatusBadge status={status} />
                    </td>
                    <td>
                      <Link to={`/patient/${patient.id}`}>View card</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
