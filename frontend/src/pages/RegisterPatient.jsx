import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../services/api';
import { UserPlus, ArrowLeft } from 'lucide-react';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    location: '',
    height: '',
    weight: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await patientService.create({
        ...formData,
        age: parseInt(formData.age),
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null
      });
      navigate(`/patient/${response.data.id}`);
    } catch (err) {
      console.error(err);
      alert('Error creating patient record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>New Patient Entry</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="glass" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              required
              type="text" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Location / City</label>
            <input 
              required
              type="text" 
              placeholder="Mumbai, India" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Age</label>
            <input 
              required
              type="number" 
              placeholder="30" 
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Gender</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="input-group">
            <label>Height (cm)</label>
            <input 
              type="number" 
              step="0.1"
              placeholder="175.5" 
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Weight (kg)</label>
            <input 
              type="number" 
              step="0.1"
              placeholder="70.2" 
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <UserPlus size={20} /> {loading ? 'Saving...' : 'Create Patient Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPatient;
