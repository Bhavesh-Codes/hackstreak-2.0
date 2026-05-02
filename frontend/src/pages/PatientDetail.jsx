import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../services/api';
import { ArrowLeft, Clock, Thermometer, Droplets, FileText, Plus, QrCode, User } from 'lucide-react';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitData, setVisitData] = useState({
    doctor: '',
    disease: '',
    prescription: '',
    bp: '',
    temperature: '',
    doctor_comment: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [patientRes, visitsRes] = await Promise.all([
        patientService.getById(id),
        patientService.getVisits(id)
      ]);
      setPatient(patientRes.data);
      setVisits(visitsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientService.createVisit(id, {
        ...visitData,
        temperature: visitData.temperature ? parseFloat(visitData.temperature) : null
      });
      setShowVisitForm(false);
      setVisitData({ doctor: '', disease: '', prescription: '', bp: '', temperature: '', doctor_comment: '' });
      fetchData();
    } catch (err) {
      alert('Error saving visit');
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading profile...</div>;
  if (!patient) return <div style={{ padding: '100px', textAlign: 'center' }}>Patient not found</div>;

  return (
    <div>
      <header className="page-header">
        <div>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>{patient.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setShowVisitForm(true)} className="btn btn-primary">
            <Plus size={20} /> Log New Visit
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
              <User size={20} color="var(--primary)" style={{ marginBottom: '10px' }} />
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Gender</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{patient.gender}</div>
            </div>
            <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
              <Clock size={20} color="var(--primary)" style={{ marginBottom: '10px' }} />
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Age</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{patient.age}Y</div>
            </div>
            <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
              <Activity size={20} color="var(--primary)" style={{ marginBottom: '10px' }} />
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Height</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{patient.height || '--'} cm</div>
            </div>
            <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
              <Activity size={20} color="var(--primary)" style={{ marginBottom: '10px' }} />
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Weight</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>{patient.weight || '--'} kg</div>
            </div>
          </div>

          {/* Visit History */}
          <section>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Medical Visit History</h2>
            {visits.length === 0 ? (
              <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No visits logged yet. Click "Log New Visit" to start.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {visits.map((visit) => (
                  <div key={visit.id} className="glass" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <h4 style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{visit.disease}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(visit.visit_time).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ marginBottom: '15px', color: 'var(--text-main)', opacity: 0.9 }}>{visit.prescription}</p>
                    
                    <div style={{ display: 'flex', gap: '30px', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <Droplets size={16} /> BP: <span style={{ color: 'white' }}>{visit.bp || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <Thermometer size={16} /> Temp: <span style={{ color: 'white' }}>{visit.temperature ? `${visit.temperature}°C` : 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <User size={16} /> Doctor: <span style={{ color: 'white' }}>{visit.doctor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'sticky', top: '20px' }}>
          {/* QR Code */}
          <div className="glass" style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', color: 'var(--primary)' }}>
              <QrCode size={24} />
              <h3 style={{ margin: 0 }}>Patient Passport</h3>
            </div>
            <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'inline-block' }}>
              <img 
                src={patientService.getQR(id)} 
                alt="Patient QR Code" 
                style={{ width: '200px', height: '200px', display: 'block' }}
              />
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Scan to view patient profile on any mobile device.
            </p>
          </div>

          <div className="glass" style={{ padding: '30px' }}>
            <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} /> Location Note
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Patient resides in {patient.location}. Record created on {new Date(patient.created_at).toLocaleDateString()}.
            </p>
          </div>
        </div>
      </div>

      {/* Visit Form Modal Overlay */}
      {showVisitForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass animate-fade-in" style={{ maxWidth: '600px', width: '100%', padding: '40px', background: 'var(--bg-dark)' }}>
            <h2 className="gradient-text" style={{ marginBottom: '25px' }}>Log Medical Visit</h2>
            <form onSubmit={handleVisitSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label>Doctor Name</label>
                  <input required value={visitData.doctor} onChange={e => setVisitData({...visitData, doctor: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Diagnosis / Disease</label>
                  <input required value={visitData.disease} onChange={e => setVisitData({...visitData, disease: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>BP (e.g. 120/80)</label>
                  <input value={visitData.bp} onChange={e => setVisitData({...visitData, bp: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Temp (°C)</label>
                  <input type="number" step="0.1" value={visitData.temperature} onChange={e => setVisitData({...visitData, temperature: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Prescription</label>
                <textarea rows="3" required value={visitData.prescription} onChange={e => setVisitData({...visitData, prescription: e.target.value})} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowVisitForm(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Visit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
