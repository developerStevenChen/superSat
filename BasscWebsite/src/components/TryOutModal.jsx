import { useState } from 'react';
import { submitIntentClient } from '../api';
import './TryOutModal.css';

const GENDER_OPTIONS = [
  { value: '', label: '-- Select gender --' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const EMPTY_FORM = {
  name: '',
  age: '',
  gender: '',
  phone: '',
  email: '',
  zipcode: '',
};

export default function TryOutModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await submitIntentClient(form);
      setSuccess(true);
      setForm(EMPTY_FORM);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  function handleOverlayClick() {
    if (!submitting) onClose();
  }

  return (
    <div className="tryout-modal-overlay" onClick={handleOverlayClick}>
      <div className="tryout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tryout-modal-header">
          <h3>Try out</h3>
          <button type="button" className="tryout-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        {success ? (
          <div className="tryout-modal-success">Thank you! We will contact you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="tryout-modal-form">
            {error && <div className="tryout-modal-error">{error}</div>}
            <label>
              Name *
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="Full name"
              />
            </label>
            <label>
              Age
              <input
                type="number"
                min="1"
                max="120"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="e.g. 10"
              />
            </label>
            <label>
              Gender
              <select
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="tryout-modal-select"
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value || 'empty'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Phone
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. 123-456-7890"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your@email.com"
              />
            </label>
            <label>
              Zipcode
              <input
                type="text"
                value={form.zipcode}
                onChange={(e) => handleChange('zipcode', e.target.value)}
                placeholder="e.g. 94000"
              />
            </label>
            <div className="tryout-modal-footer">
              <button type="button" className="tryout-btn secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="tryout-btn primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
