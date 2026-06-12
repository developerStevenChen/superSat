import { useState } from 'react';
import { submitIntentClient } from '../api';
import './TryOutModal.css';

const SKATING_GRADE_OPTIONS = [
  { value: '', label: '-- Select Skating grade --' },
  { value: 'beginner', label: 'Beginner (0-4 month)' },
  { value: 'intermediate', label: 'intermediate (4-12month)' },
  { value: 'advance', label: 'Advance (12 month+)' },
  { value: 'speed_skater', label: 'Speed Skater (Trained Speed skating 3 month and above)' },
  { value: 'advance_speed_skater', label: 'Advance Speed skater (Trained speed skating 12month+)' },
];

export default function TryOutModal({ open, onClose }) {
  const [form, setForm] = useState({
    grade: '',
    student_name: '',
    age: '',
    phone: '',
    email: '',
    zipcode: '',
  });
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
      setForm({ grade: '', student_name: '', age: '', phone: '', email: '', zipcode: '' });
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
              Student Name *
              <input
                type="text"
                value={form.student_name}
                onChange={(e) => handleChange('student_name', e.target.value)}
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
              Skating grade
              <select
                value={form.grade}
                onChange={(e) => handleChange('grade', e.target.value)}
                className="tryout-modal-select"
              >
                {SKATING_GRADE_OPTIONS.map((opt) => (
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
