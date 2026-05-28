import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { authService } from '../services/api';

export default function RegisterStaff() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        department: form.department,
        password: form.password,
      });
      navigate('/login');
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please try again.';
      setError(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--accent)',
              marginBottom: 12,
            }}
          >
            <UserPlus size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Register Staff
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: '0.875rem' }}>
            Create a new staff account
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
              marginBottom: 16,
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="name"
              style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: '0.875rem', color: 'var(--text)' }}
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Dr. Jane Smith"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                color: 'var(--text)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: '0.875rem', color: 'var(--text)' }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="jane@hospital.org"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                color: 'var(--text)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="department"
              style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: '0.875rem', color: 'var(--text)' }}
            >
              Department
            </label>
            <input
              id="department"
              name="department"
              type="text"
              autoComplete="organization"
              required
              value={form.department}
              onChange={handleChange}
              placeholder="Cardiology"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                color: 'var(--text)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: '0.875rem', color: 'var(--text)' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                color: 'var(--text)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Registering…' : 'Register'}
          </button>
        </form>

        {/* Back to login */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
