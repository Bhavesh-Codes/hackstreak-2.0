import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { PageTransition } from './PageTransition';

function MobileHeader({ onMenuClick }) {
  return (
    <div className="mobile-header">
      <button
        className="hamburger-btn"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>
      <span className="mobile-header__title">Sukoon</span>
    </div>
  );
}

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Dark backdrop overlay — closes sidebar when tapped on mobile */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <main className="shell-main">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}

export default AppShell;
