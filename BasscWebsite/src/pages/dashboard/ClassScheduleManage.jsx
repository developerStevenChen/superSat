import { useState, useEffect } from 'react';
import {
  dashboardList,
  dashboardCreate,
  dashboardUpdate,
  dashboardDelete,
} from '../../api';

const RESOURCE = 'classes';

export default function ClassScheduleManage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    time: '',
    location: '',
    category: '',
    intro: '',
    coach: '',
    is_open: true,
    sort_order: 0,
    is_active: true,
  });
  const [submitError, setSubmitError] = useState('');
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    dashboardList(RESOURCE)
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => load(), []);

  function openAdd() {
    setEditing(null);
    setForm({
      time: '',
      location: '',
      category: '',
      intro: '',
      coach: '',
      is_open: true,
      sort_order: list.length,
      is_active: true,
    });
    setSubmitError('');
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      time: row.time || '',
      location: row.location || '',
      category: row.category || '',
      intro: row.intro || '',
      coach: row.coach || '',
      is_open: row.is_open ?? true,
      sort_order: row.sort_order ?? 0,
      is_active: row.is_active ?? true,
    });
    setSubmitError('');
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    const body = {
      time: form.time.trim(),
      location: form.location.trim(),
      category: form.category.trim(),
      intro: form.intro.trim(),
      coach: form.coach.trim(),
      is_open: !!form.is_open,
      sort_order: Number(form.sort_order),
      is_active: !!form.is_active,
    };
    try {
      if (editing) {
        await dashboardUpdate(RESOURCE, editing.id, body);
      } else {
        await dashboardCreate(RESOURCE, body);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setSubmitError(err.message || 'Save failed');
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`Delete class "${row.time} - ${row.category}"?`)) return;
    try {
      await dashboardDelete(RESOURCE, row.id);
      load();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  }

  return (
    <div className="dashboard-section">
      <h2>Class Schedule (Sessions)</h2>
      <div className="dashboard-toolbar">
        <span />
        <button type="button" className="dashboard-btn" onClick={openAdd}>
          Add
        </button>
      </div>
      <div className="dashboard-table-wrap">
        {loading ? (
          <div className="dashboard-empty">Loading…</div>
        ) : list.length === 0 ? (
          <div className="dashboard-empty">No sessions. Click "Add" to create.</div>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Location</th>
                <th>Category</th>
                <th>Coach</th>
                <th>Open?</th>
                <th>Order</th>
                <th>Active</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td>{row.time}</td>
                  <td>{row.location}</td>
                  <td>{row.category}</td>
                  <td>{row.coach}</td>
                  <td>{row.is_open ? 'Yes' : 'No'}</td>
                  <td>{row.sort_order}</td>
                  <td>{row.is_active ? 'Yes' : 'No'}</td>
                  <td className="actions">
                    <button type="button" onClick={() => openEdit(row)} title="Edit">✎</button>
                    <button type="button" className="delete" onClick={() => handleDelete(row)} title="Delete">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="dashboard-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">{editing ? 'Edit Class Session' : 'Add Class Session'}</div>
            <form onSubmit={handleSubmit} className="dashboard-modal-body dashboard-form">
              {submitError && <div className="login-error">{submitError}</div>}
              <label>
                Time
                <input
                  type="text"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  placeholder="e.g. Sat 10:00–11:30"
                  required
                />
              </label>
              <label>
                Location
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Rink A / City"
                />
              </label>
              <label>
                Category
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Speedskating / PE / Camp..."
                />
              </label>
              <label>
                Coach
                <input
                  type="text"
                  value={form.coach}
                  onChange={(e) => setForm((f) => ({ ...f, coach: e.target.value }))}
                />
              </label>
              <label>
                Intro
                <textarea
                  value={form.intro}
                  onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
                  rows={4}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.is_open}
                  onChange={(e) => setForm((f) => ({ ...f, is_open: e.target.checked }))}
                />
                Open (only open sessions appear in homepage calendar)
              </label>
              <label>
                Order
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                />
                Active
              </label>
              <div className="dashboard-modal-footer">
                <button type="button" className="dashboard-btn secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dashboard-btn" disabled={uploading}>
                  {uploading ? 'Saving…' : editing ? 'Save' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

