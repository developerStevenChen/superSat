import { useState, useEffect } from 'react';
import {
  dashboardList,
  dashboardCreate,
  dashboardUpdate,
  dashboardDelete,
  uploadImage,
} from '../../api';

const RESOURCE = 'athletes';

export default function AthleteManage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', intro: '', image: '', activity_name: '', sort_order: 0, is_active: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    dashboardList(RESOURCE).then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }
  useEffect(() => load(), []);

  function openAdd() {
    setEditing(null);
    setForm({ name: '', intro: '', image: '', activity_name: '', sort_order: list.length, is_active: true });
    setImageFile(null);
    setSubmitError('');
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      name: row.name || '',
      intro: row.intro || '',
      image: row.image || '',
      activity_name: row.activity_name || '',
      sort_order: row.sort_order ?? 0,
      is_active: row.is_active ?? true,
    });
    setImageFile(null);
    setSubmitError('');
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    let imageUrl = form.image;
    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (err) {
        setSubmitError(err.message || 'Image upload failed');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    const body = {
      name: form.name.trim(),
      intro: form.intro.trim(),
      image: imageUrl,
      activity_name: form.activity_name.trim(),
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
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    try {
      await dashboardDelete(RESOURCE, row.id);
      load();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  }

  return (
    <div className="dashboard-section">
      <h2>Shares</h2>
      <div className="dashboard-toolbar">
        <span />
        <button type="button" className="dashboard-btn" onClick={openAdd}>Add</button>
      </div>
      <div className="dashboard-table-wrap">
        {loading && <div className="dashboard-empty">Loading…</div>}
        {!loading && list.length === 0 && <div className="dashboard-empty">No data. Click "Add" to create.</div>}
        {!loading && list.length > 0 && (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Activity</th>
                <th>Intro</th>
                <th>Order</th>
                <th>Active</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td className="img-cell">{row.image ? <img src={row.image} alt="" /> : '-'}</td>
                  <td>{row.name}</td>
                  <td>{row.activity_name || '-'}</td>
                  <td>{row.intro?.slice(0, 40)}{row.intro?.length > 40 ? '…' : ''}</td>
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
            <div className="dashboard-modal-header">{editing ? 'Edit Share' : 'Add Share'}</div>
            <form onSubmit={handleSubmit} className="dashboard-modal-body dashboard-form">
              {submitError && <div className="login-error">{submitError}</div>}
              <label>
                Photo (upload to Railway)
                <div className={'upload-area' + (imageFile || form.image ? ' has-file' : '')} onClick={() => document.getElementById('athlete-img').click()}>
                  {imageFile ? imageFile.name : form.image ? 'Image selected' : 'Click to choose image'}
                </div>
                <input id="athlete-img" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImageFile(f); }} />
                {form.image && !imageFile && <div className="upload-preview"><img src={form.image} alt="" /></div>}
              </label>
              <label>Name <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required /></label>
              <label>
                Activity name
                <input
                  type="text"
                  value={form.activity_name}
                  onChange={(e) => setForm((f) => ({ ...f, activity_name: e.target.value }))}
                  placeholder="e.g. Summer Retreat 2026"
                />
              </label>
              <label>Intro <textarea value={form.intro} onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))} rows={3} /></label>
              <label>Order <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))} /></label>
              <label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} /> Active</label>
              <div className="dashboard-modal-footer">
                <button type="button" className="dashboard-btn secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="dashboard-btn" disabled={uploading}>{uploading ? 'Uploading…' : editing ? 'Save' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
