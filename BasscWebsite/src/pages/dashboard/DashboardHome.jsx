import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const tiles = [
    { to: '/dashboard/homepagepic', label: 'Home Carousel', desc: 'Hero images on homepage' },
    { to: '/dashboard/boards', label: 'Boards', desc: 'Homepage boards / sections' },
    { to: '/dashboard/introductions', label: 'About the Club', desc: 'Intro carousel content' },
    { to: '/dashboard/pathways', label: 'Pathway', desc: 'Pathway card below About the Club' },
    { to: '/dashboard/classes', label: 'Class Schedule', desc: 'Open class sessions (calendar)' },
    { to: '/dashboard/events', label: 'Events', desc: 'Event list & details' },
    { to: '/dashboard/awards', label: 'Awards', desc: 'Awards & extra photos' },
    { to: '/dashboard/news', label: 'News', desc: 'News list and detail' },
  ];

  return (
    <div className="dashboard-section">
      <h2>Overview</h2>
      <p className="dashboard-subtitle">
        Quick access to the most frequently edited sections. The full navigation is still available in the left sidebar.
      </p>
      <div className="dashboard-tiles">
        {tiles.map((tile) => (
          <Link key={tile.to} to={tile.to} className="dashboard-tile">
            <div className="dashboard-tile-title">{tile.label}</div>
            <div className="dashboard-tile-desc">{tile.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
