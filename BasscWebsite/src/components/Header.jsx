import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { navItems as defaultNavItems } from '../data';
import { SITE_TITLE } from '../config/site';

const HIDE_NAV_PATHS = ['/micro', '/peripheral', '/award'];

/** Nav labels from API may be outdated; enforce current display names by path. */
const NAV_LABEL_BY_PATH = {
  '/program': 'Program',
  '/class': 'Program',
  '/class-schedule': 'Activity Schedule',
  '/athlete': 'Shares',
};

function normalizeNavItems(items) {
  return items
    .filter((item) => !HIDE_NAV_PATHS.includes(item.path))
    .map((item) => {
      let path = item.path;
      if (path === '/class') path = '/program';
      else if (path?.startsWith('/class/')) path = path.replace(/^\/class\//, '/');
      const label = NAV_LABEL_BY_PATH[path] || NAV_LABEL_BY_PATH[item.path];
      return label ? { ...item, path, label } : { ...item, path };
    });
}

export default function Header({ navItems: propNavItems, onTryOutClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const raw = propNavItems?.length ? propNavItems : defaultNavItems;
  const navItems = normalizeNavItems(raw);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const overlayEl = menuOpen ? (
    <div
      className="nav-overlay nav-overlay-open"
      aria-hidden={false}
      onClick={closeMenu}
    >
      <div className="nav-overlay-panel" onClick={(e) => e.stopPropagation()}>
        <nav className="nav nav-mobile">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="nav-link nav-link-mobile"
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          {onTryOutClick && (
            <button
              type="button"
              className="nav-link nav-link-cta nav-link-mobile"
              onClick={() => { closeMenu(); onTryOutClick?.(); }}
            >
              Try out
            </button>
          )}
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <>
      <header className={`header ${menuOpen ? 'header-nav-open' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="logo" onClick={closeMenu}>
            {SITE_TITLE}
          </Link>
          <button
            type="button"
            className="header-hamburger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="header-hamburger-bar" />
            <span className="header-hamburger-bar" />
            <span className="header-hamburger-bar" />
          </button>
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="nav-link"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            {onTryOutClick && (
              <button
                type="button"
                className="nav-link nav-link-cta"
                onClick={() => { closeMenu(); onTryOutClick?.(); }}
              >
                Try out
              </button>
            )}
          </nav>
        </div>
      </header>
      {overlayEl && createPortal(overlayEl, document.body)}
    </>
  );
}
