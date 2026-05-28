// components/HealthCard.jsx
import { patientService } from '../services/api';
import { StatusBadge } from './StatusBadge';

export function HealthCard({ patient }) {
  const qrUrl = patientService.getQR(patient.id);

  return (
    <div style={{
      background: '#0f172a',
      color: '#fff',
      borderRadius: 12,
      padding: 24,
      maxWidth: 340,
      fontFamily: 'inherit',
    }}>
      {/* Brand header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <span style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#0d9488',
          letterSpacing: '0.05em',
        }}>
          Sukoon
        </span>
        <span style={{
          fontSize: '0.65rem',
          color: '#94a3b8',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Health Card
        </span>
      </div>

      <hr style={{ borderColor: '#1e293b', margin: '0 0 16px 0' }} />

      {/* Patient info + QR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 2px 0' }}>
            PATIENT NAME
          </p>
          <p style={{ fontWeight: 700, margin: '0 0 8px 0' }}>{patient.name}</p>

          <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 2px 0' }}>ID</p>
          <p style={{ margin: '0 0 8px 0' }}>{patient.id}</p>

          <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 2px 0' }}>
            AGE / GENDER
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            {patient.age} / {patient.gender}
          </p>

          {patient.location && (
            <>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 2px 0' }}>
                LOCATION
              </p>
              <p style={{ margin: '0 0 8px 0' }}>{patient.location}</p>
            </>
          )}

          {patient.blood_group && (
            <>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 2px 0' }}>
                BLOOD GROUP
              </p>
              <p style={{ margin: 0 }}>{patient.blood_group}</p>
            </>
          )}
        </div>

        <img
          src={qrUrl}
          alt="QR Code"
          width={80}
          height={80}
          style={{ borderRadius: 6, flexShrink: 0 }}
        />
      </div>

      <hr style={{ borderColor: '#1e293b', margin: '16px 0' }} />

      {/* Status badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <StatusBadge status="Active" />
      </div>

      {/* Footer */}
      <p style={{
        fontSize: '0.7rem',
        color: '#94a3b8',
        textAlign: 'center',
        margin: 0,
        letterSpacing: '0.05em',
      }}>
        NAVI MUMBAI HEALTH AUTHORITY
      </p>
    </div>
  );
}
