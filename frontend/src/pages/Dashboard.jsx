import { useState, useEffect } from 'react';
import { Users, Activity, AlertTriangle, TrendingUp, PieChart, MapPin } from 'lucide-react';
import { patientService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    patientService
      .getAll()
      .then((res) => {
        setPatients(res.data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load patient data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
          Navi Mumbai Health Surveillance Overview
        </p>
      </div>

      {/* Alert Banners */}
      <div className="alert alert-danger" style={{ marginBottom: 12 }}>
        <strong>Outbreak Alert — Dengue Fever, Zone 4 (Vashi)</strong>
        <p style={{ margin: '4px 0 0' }}>
          62 new cases in 48 hours — 340% above baseline. Vector control deployment recommended.
        </p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 24 }}>
        <strong>System Status — All Modules Operational</strong>
        <p style={{ margin: '4px 0 0' }}>
          Health card registry synced across 8 zones. Last backup: 2 hours ago.
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
          <LoadingSpinner size="lg" text="Loading statistics…" />
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ marginBottom: 24 }}>
          <strong>Error loading patient data:</strong> {error}
        </div>
      ) : (
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {/* Total Patients */}
          <div className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="stat-card__label">Total Patients</p>
                <p className="stat-card__value">{patients.length.toLocaleString()}</p>
              </div>
              <Users size={28} color="var(--accent)" aria-hidden="true" />
            </div>
          </div>

          {/* Active Cases */}
          <div className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="stat-card__label">Active Cases</p>
                <p className="stat-card__value">3,421</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: 4 }}>
                  +87 this week
                </p>
              </div>
              <Activity size={28} color="var(--accent)" aria-hidden="true" />
            </div>
          </div>

          {/* Open Alerts */}
          <div className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="stat-card__label">Open Alerts</p>
                <p className="stat-card__value">3</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: 4 }}>
                  Dengue spike — Zone 4
                </p>
              </div>
              <AlertTriangle size={28} color="var(--danger)" aria-hidden="true" />
            </div>
          </div>

          {/* Recovery Rate */}
          <div className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="stat-card__label">Recovery Rate</p>
                <p className="stat-card__value">72.4%</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  9,312 recovered
                </p>
              </div>
              <TrendingUp size={28} color="var(--accent)" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}

      {/* Chart Placeholder Cards */}
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <TrendingUp size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} aria-hidden="true" />
          <h3 style={{ margin: '0 0 8px', color: 'var(--text)' }}>Monthly Case Trend</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Chart coming soon</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <PieChart size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} aria-hidden="true" />
          <h3 style={{ margin: '0 0 8px', color: 'var(--text)' }}>Disease Distribution</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Chart coming soon</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <MapPin size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} aria-hidden="true" />
          <h3 style={{ margin: '0 0 8px', color: 'var(--text)' }}>Zone Case Burden</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Chart coming soon</p>
        </div>
      </div>
    </div>
  );
}
