import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TryOutModal from '../components/TryOutModal';
import { fetchContactInfo } from '../api';
import './ContactPage.css';

export default function ContactPage() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tryOutOpen, setTryOutOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchContactInfo()
      .then((data) => {
        if (!cancelled) setContact(data);
      })
      .catch(() => {
        if (!cancelled) setContact(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const hasEmail = contact?.email?.trim();
  const hasPhone = contact?.phone?.trim();

  return (
    <>
      <Header />
      <main className="contact-page">
        <div className="container contact-page-inner">
          <h1 className="contact-page-title">Contact</h1>
          <p className="contact-page-lead">Get in touch by email, phone, or submit the inquiry form.</p>

          <div className="contact-cards">
            {hasEmail && (
              <a href={`mailto:${contact.email.trim()}`} className="contact-card contact-card-email">
                <span className="contact-card-label">Email</span>
                <span className="contact-card-value">{contact.email.trim()}</span>
              </a>
            )}
            {hasPhone && (
              <a href={`tel:${contact.phone.trim().replace(/\s/g, '')}`} className="contact-card contact-card-phone">
                <span className="contact-card-label">Phone</span>
                <span className="contact-card-value">{contact.phone.trim()}</span>
              </a>
            )}
            <div className="contact-card contact-card-form">
              <span className="contact-card-label">Inquiry form</span>
              <p className="contact-card-desc">Tell us about your interest — we’ll get back to you soon.</p>
              <button
                type="button"
                className="contact-card-btn"
                onClick={() => setTryOutOpen(true)}
              >
                Try out
              </button>
            </div>
          </div>

          {loading && !contact && (
            <p className="contact-page-loading">Loading contact info…</p>
          )}
          {!loading && !hasEmail && !hasPhone && (
            <p className="contact-page-muted">Contact details can be updated in the admin dashboard. Use the form below to reach out.</p>
          )}
        </div>
      </main>
      <Footer />
      <TryOutModal open={tryOutOpen} onClose={() => setTryOutOpen(false)} />
    </>
  );
}
