import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { HeartPulse, User, Mail, Lock, Building2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', department: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <HeartPulse size={48} color="#8b5cf6" style={{ marginBottom: '15px' }} />
          <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Staff Registration</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create your Sukoon account</p>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Dr. John Doe" 
                style={{ paddingLeft: '40px' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="doctor@sukoon.com" 
                style={{ paddingLeft: '40px' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Department</label>
            <div style={{ position: 'relative' }}>
              <Building2 size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Cardiology" 
                style={{ paddingLeft: '40px' }}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
            {loading ? 'Creating Account...' : 'Register as Staff'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
