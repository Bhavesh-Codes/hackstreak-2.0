import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../services/api';
import { Search, UserPlus, ChevronRight, Activity, MapPin, User } from 'lucide-react';

const Home = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAll();
      setPatients(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Hospital Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>You have {patients.length} registered patients</p>
        </div>
        <Link to="/register" className="btn btn-primary">
          <UserPlus size={20} /> Register Patient
        </Link>
      </header>

      <div className="glass" style={{ marginBottom: '30px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search by name or location..." 
          style={{ border: 'none', background: 'transparent', padding: '10px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>Loading patients...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredPatients.map((patient) => (
            <Link key={patient.id} to={`/patient/${patient.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass glass-hover" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div className="glass" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)' }}>
                    <User color="#8b5cf6" />
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
                
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{patient.name}</h3>
                <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={14} /> {patient.age}Y, {patient.gender}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {patient.location}</span>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                    Record Active
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(patient.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredPatients.length === 0 && (
        <div className="glass" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          No patients found matching your search.
        </div>
      )}
    </div>
  );
};

export default Home;
