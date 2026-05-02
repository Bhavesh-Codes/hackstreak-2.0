import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { HeartPulse, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <HeartPulse size={48} color="#8b5cf6" style={{ marginBottom: '15px' }} />
          <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Login to Sukoon Dashboard</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="doctor@sukoon.com" 
                style={{ paddingLeft: '40px' }}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ paddingLeft: '40px' }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            {loading ? 'Authenticating...' : 'Login to System'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register-staff" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
