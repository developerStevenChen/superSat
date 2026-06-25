import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { fetchMe, logout } from '../api';
import './Dashboard.css';

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMe()
      .then((data) => {
        if (data?.user && (data.user.is_superuser || data.user.is_staff)) {
          setUser(data.user);
        } else {
          navigate('/login', { state: { from: { pathname: '/dashboard' } } });
        }
      })
      .catch(() => navigate('/login', { state: { from: { pathname: '/dashboard' } } }))
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  if (loading) return <div className="dashboard-loading">Verifying…</div>;
  if (!user) return null;

  const navs = [
    { to: '/dashboard', end: true, label: 'Overview' },
    { to: '/dashboard/homepagepic', end: false, label: 'Home Carousel' },
    { to: '/dashboard/boards', end: false, label: 'Boards' },
    { to: '/dashboard/introductions', end: false, label: 'Introductions' },
    { to: '/dashboard/pathways', end: false, label: 'Pathway' },
    { to: '/dashboard/news', end: false, label: 'News' },
    { to: '/dashboard/events', end: false, label: 'Events' },
    { to: '/dashboard/awards', end: false, label: 'Awards' },
    { to: '/dashboard/navitems', end: false, label: 'Nav Items' },
    { to: '/dashboard/courses', end: false, label: 'Programs' },
    { to: '/dashboard/classes', end: false, label: 'Activity Schedule' },
    { to: '/dashboard/athletes', end: false, label: 'Shares' },
    { to: '/dashboard/coaches', end: false, label: 'Coaches' },
    { to: '/dashboard/intentclients', end: false, label: 'Intent Clients' },
    { to: '/dashboard/contactinfo', end: false, label: 'Contact Info' },
    // Only superuser sees Admins
    ...(user.is_superuser ? [{ to: '/dashboard/admins', end: false, label: 'Admins' }] : []),
  ];

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <span>BASSC Admin</span>
        </div>
        <nav className="dashboard-nav">
          {navs.map(({ to, end, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => 'dashboard-nav-link' + (isActive ? ' active' : '')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="dashboard-sidebar-footer">
          <span className="dashboard-user">{user.username}</span>
          <button type="button" className="dashboard-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
