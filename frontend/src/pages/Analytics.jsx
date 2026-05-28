import { useState, useEffect } from 'react';
import { BarChart2, MapPin, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { patientService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Static outbreak alert cards matching the HTML mockup
const OUTBREAK_ALERTS = [
  {
    id: 1,
    disease: 'Dengue',
    zone: 'Zone 4',
    change: '+340%',
    changeType: 'danger',
    detail: '62 new cases in 48 hrs',
  },
  {
    id: 2,
    disease: 'Malaria',
    zone: 'Zone 7',
    change: '+88%',
    changeType: 'warning',
    detail: '19 new cases in 72 hrs',
  },
  {
    id: 3,
    disease: 'Cholera',
    zone: 'Zone 1',
    change: '-12%',
    changeType: 'success',
    detail: 'Outbreak contained',
  },
];

const CHANGE_COLORS = {
  danger: 'var(--danger)',
  warning: 'var(--warning)',
  success: 'var(--success)',
};

export default function Analytics() {
  const [diseaseData, setDiseaseData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [diseaseLoading, setDiseaseLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [diseaseError, setDiseaseError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Fetch both in parallel; handle errors per-section so one failure
    // doesn't hide the other section.
    Promise.all([
      patientService
        .getAnalyticsDisease()
        .then((res) => setDiseaseData(res.data))
        .catch((err) =>
          setDiseaseError(err.message || 'Failed to load disease analytics.')
        )
        .finally(() => setDiseaseLoading(false)),

      patientService
        .getAnalyticsLocation()
        .then((res) => setLocationData(res.data))
        .catch((err) =>
          setLocationError(err.message || 'Failed to load location analytics.')
        )
        .finally(() => setLocationLoading(false)),
    ]);
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Surveillance &amp; Analytics</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
          Real-time disease outbreak monitoring across Navi Mumbai zones
        </p>
      </div>

      {/* Outbreak Alert Stat Cards */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {OUTBREAK_ALERTS.map((alert) => (
          <div key={alert.id} className="card stat-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <p className="stat-card__label">
                  {alert.disease} — {alert.zone}
                </p>
                <p
                  className="stat-card__value"
                  style={{ color: CHANGE_COLORS[alert.changeType] }}
                >
                  {alert.change}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: 4,
                  }}
                >
                  {alert.detail}
                </p>
              </div>
              <AlertTriangle
                size={28}
                color={CHANGE_COLORS[alert.changeType]}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Disease Analytics Section */}
      <section style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <BarChart2 size={20} color="var(--accent)" aria-hidden="true" />
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text)' }}>
            Disease Analytics
          </h2>
        </div>

        {diseaseLoading ? (
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}
          >
            <LoadingSpinner size="md" text="Loading disease data…" />
          </div>
        ) : diseaseError ? (
          <div className="alert alert-danger">
            <strong>Error:</strong> {diseaseError}
          </div>
        ) : diseaseData.length === 0 ? (
          <div className="card" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            No disease analytics data available.
          </div>
        ) : (
          <div className="grid-auto">
            {diseaseData.map((entry, idx) => (
              <div key={entry.disease ?? idx} className="card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        color: 'var(--text)',
                        fontSize: '1rem',
                      }}
                    >
                      {entry.disease}
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Reported cases
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                    }}
                  >
                    {entry.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Disease Heatmap by Zone Section */}
      <section style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <MapPin size={20} color="var(--accent)" aria-hidden="true" />
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text)' }}>
            Disease Heatmap by Zone
          </h2>
        </div>

        {locationLoading ? (
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}
          >
            <LoadingSpinner size="md" text="Loading location data…" />
          </div>
        ) : locationError ? (
          <div className="alert alert-danger">
            <strong>Error:</strong> {locationError}
          </div>
        ) : (
          <div className="card">
            {locationData.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                No location data available.
              </p>
            ) : (
              <div className="stack">
                {locationData.map((entry, idx) => (
                  <div
                    key={entry.location ?? idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom:
                        idx < locationData.length - 1
                          ? '1px solid #f1f5f9'
                          : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={14} color="var(--text-muted)" aria-hidden="true" />
                      <span style={{ fontWeight: 500, color: 'var(--text)' }}>
                        {entry.location}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        background: '#f1f5f9',
                        padding: '2px 10px',
                        borderRadius: '9999px',
                      }}
                    >
                      {entry.count} cases
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p
              style={{
                marginTop: 16,
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
              }}
            >
              Interactive heatmap coming soon
            </p>
          </div>
        )}
      </section>

      {/* Static Placeholder Cards */}
      <div className="grid-3">
        {/* 7-Day New Case Velocity */}
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <TrendingUp
            size={36}
            color="var(--text-muted)"
            style={{ marginBottom: 12 }}
            aria-hidden="true"
          />
          <h3 style={{ margin: '0 0 8px', color: 'var(--text)' }}>
            7-Day New Case Velocity
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Chart coming soon
          </p>
        </div>

        {/* AI Outbreak Risk Score */}
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <Activity
            size={36}
            color="var(--text-muted)"
            style={{ marginBottom: 12 }}
            aria-hidden="true"
          />
          <h3 style={{ margin: '0 0 8px', color: 'var(--text)' }}>
            AI Outbreak Risk Score
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Model inference coming soon
          </p>
        </div>

        {/* Zone Burden Overview */}
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <BarChart2
            size={36}
            color="var(--text-muted)"
            style={{ marginBottom: 12 }}
            aria-hidden="true"
          />
          <h3 style={{ margin: '0 0 8px', color: 'var(--text)' }}>
            Zone Burden Overview
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Chart coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
