import { useState, useEffect } from 'react';
import { patientService } from '../services/api';
import { PieChart, Map, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const [diseaseData, setDiseaseData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [diseaseRes, locationRes] = await Promise.all([
        patientService.getAnalyticsDisease(),
        patientService.getAnalyticsLocation()
      ]);
      setDiseaseData(diseaseRes.data);
      setLocationData(locationRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Crunching data...</div>;

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Health Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>Distribution across diseases and locations</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Disease Stats */}
        <div className="glass" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PieChart color="#8b5cf6" /> Disease Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.entries(diseaseData).length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No data available yet.</p>
            ) : (
              Object.entries(diseaseData).map(([name, count]) => (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span>{name}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{count} cases</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / 10) * 100}%`, background: 'var(--primary)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Location Stats */}
        <div className="glass" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Map color="#10b981" /> Hotspot Locations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {Object.entries(locationData).length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No data available yet.</p>
            ) : (
              Object.entries(locationData).map(([name, count]) => (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span>{name}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{count} patients</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / 10) * 100}%`, background: 'var(--accent)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="glass" style={{ marginTop: '30px', padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <AlertCircle size={32} color="var(--primary)" />
        <div>
          <h4 style={{ marginBottom: '5px' }}>AI-Ready Insights</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            This data is structured for predictive analytics. As you log more visits, Sukoon will automatically identify trend shifts in community health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
