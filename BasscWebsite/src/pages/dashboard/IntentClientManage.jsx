import { useState, useEffect } from 'react';
import { dashboardList, dashboardUpdate, dashboardDelete } from '../../api';

const RESOURCE = 'intentclients';
const STATUS_OPTIONS = [
  { value: 'Asked', label: 'Asked' },
  { value: 'talked', label: 'talked' },
  { value: 'Tried', label: 'Tried' },
  { value: 'admit', label: 'admit' },
  { value: 'quited', label: 'quited' },
];

const SKATING_GRADE_LABELS = {
  beginner: 'Beginner (0-4 month)',
  intermediate: 'intermediate (4-12month)',
  advance: 'Advance (12 month+)',
  speed_skater: 'Speed Skater (Trained Speed skating 3 month and above)',
  advance_speed_skater: 'Advance Speed skater (Trained speed skating 12month+)',
};

function skatingGradeLabel(value) {
  if (!value) return '—';
  return SKATING_GRADE_LABELS[value] || value;
}

export default function IntentClientManage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    dashboardList(RESOURCE)
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => load(), []);

  async function handleStatusChange(row, newStatus) {
    try {
      await dashboardUpdate(RESOURCE, row.id, { status: newStatus });
      load();
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`Delete "${row.student_name}"?`)) return;
    try {
      await dashboardDelete(RESOURCE, row.id);
      load();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  }

  return (
    <div className="dashboard-section">
      <h2>Intent Clients (Try out)</h2>
      <p className="dashboard-section-desc">Leads from the public &quot;Try out&quot; form. Admin and Super can change status or delete.</p>
      <div className="dashboard-table-wrap">
        {loading ? (
          <div className="dashboard-empty">Loading…</div>
        ) : list.length === 0 ? (
          <div className="dashboard-empty">No intent clients yet.</div>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Skating grade</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Zipcode</th>
                <th>Status</th>
                <th>Submitted</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td>{row.student_name || '—'}</td>
                  <td>{skatingGradeLabel(row.grade)}</td>
                  <td>{row.age ?? '—'}</td>
                  <td>{row.phone || '—'}</td>
                  <td>{row.email || '—'}</td>
                  <td>{row.zipcode || '—'}</td>
                  <td>
                    <select
                      value={row.status || 'Asked'}
                      onChange={(e) => handleStatusChange(row, e.target.value)}
                      className="dashboard-status-select"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="delete"
                      onClick={() => handleDelete(row)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
