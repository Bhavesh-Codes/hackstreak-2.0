import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, PieChart, LogOut, HeartPulse } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="glass" style={{ margin: '20px 24px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.4rem' }}>
        <HeartPulse color="#8b5cf6" size={32} />
        <span className="gradient-text">Sukoon</span>
      </Link>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to="/" className="nav-link"><LayoutDashboard size={20} /> Dashboard</Link>
        <Link to="/register" className="nav-link"><PlusCircle size={20} /> New Patient</Link>
        <Link to="/analytics" className="nav-link"><PieChart size={20} /> Analytics</Link>
        
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--primary);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
