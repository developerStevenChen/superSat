import { useState, useEffect } from 'react';
import { dashboardList, dashboardCreate, dashboardUpdate } from '../../api';

const RESOURCE = 'contactinfo';

export default function ContactInfoManage() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function load() {
    setLoading(true);
    dashboardList(RESOURCE)
      .then((list) => {
        const first = list[0] || null;
        setContact(first);
        setForm({
          email: first?.email ?? '',
          phone: first?.phone ?? '',
        });
      })
      .catch(() => {
        setContact(null);
        setForm({ email: '', phone: '' });
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => load(), []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    const body = { email: form.email.trim(), phone: form.phone.trim() };
    try {
      if (contact) {
        await dashboardUpdate(RESOURCE, contact.id, body);
        setMessage('Updated.');
      } else {
        await dashboardCreate(RESOURCE, body);
        setMessage('Created.');
      }
      load();
    } catch (err) {
      setMessage(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-section">
      <h2>Contact Info</h2>
      <p className="dashboard-section-desc">Email and phone shown on the Contact page. One record only.</p>
      {loading ? (
        <div className="dashboard-empty">Loading…</div>
      ) : (
        <form onSubmit={handleSubmit} className="dashboard-form contact-info-form">
          {message && <div className={message === 'Updated.' || message === 'Created.' ? 'dashboard-success' : 'login-error'}>{message}</div>}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="contact@example.com"
            />
          </label>
          <label>
            Phone
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. 123-456-7890"
            />
          </label>
          <div className="dashboard-form-actions">
            <button type="submit" className="dashboard-btn" disabled={saving}>
              {saving ? 'Saving…' : contact ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
