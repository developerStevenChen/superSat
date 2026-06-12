import { useState, useEffect } from 'react';
import { fetchContactInfo } from '../api';

export default function Footer() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchContactInfo()
      .then((data) => {
        if (!cancelled) setContact(data);
      })
      .catch(() => {
        if (!cancelled) setContact(null);
      });
    return () => { cancelled = true; };
  }, []);

  const email = contact?.email?.trim();
  const phone = contact?.phone?.trim();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <nav className="site-footer-nav" aria-label="Contact">
          {email && (
            <a href={`mailto:${email}`} className="site-footer-link">
              Email: {email}
            </a>
          )}
          {phone && (
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="site-footer-link">
              Phone: {phone}
            </a>
          )}
        </nav>
        <p className="site-footer-copy">
          © Bassc Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
