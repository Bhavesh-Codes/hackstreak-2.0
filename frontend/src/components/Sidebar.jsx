import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  QrCode,
  BarChart2,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'Core',
    links: [
      { to: '/',          label: 'Dashboard',       icon: LayoutDashboard, end: true },
      { to: '/patients',  label: 'Patients',         icon: Users },
      { to: '/register',  label: 'Register Patient', icon: UserPlus },
    ],
  },
  {
    label: 'Clinical',
    links: [
      { to: '/patients', label: 'Medical Records',  icon: FileText },
      { to: '/scan',     label: 'Scan Health Card', icon: QrCode },
    ],
  },
  {
    label: 'Admin',
    links: [
      { to: '/analytics', label: 'Surveillance', icon: BarChart2 },
    ],
  },
];

export function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <span className="sidebar-logo">
          Su<span>koon</span>
        </span>

        {/* Close button — visible only on mobile when sidebar is open */}
        {open && (
          <button
            className="hamburger-btn"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ marginLeft: 'auto', color: '#94a3b8' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="sidebar-group">
            <p className="sidebar-group-label">{group.label}</p>
            {group.links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={`${group.label}-${label}`}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? ' active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{ minWidth: 0 }}>
          <p className="sidebar-user-name">{user?.name ?? '—'}</p>
          <p className="sidebar-user-dept">{user?.department ?? '—'}</p>
        </div>
        <button
          className="hamburger-btn"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          style={{ color: '#94a3b8', flexShrink: 0 }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
