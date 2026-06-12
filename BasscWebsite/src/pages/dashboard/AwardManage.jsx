import { useState, useEffect } from 'react';
import {
  dashboardList,
  dashboardCreate,
  dashboardUpdate,
  dashboardDelete,
  uploadImage,
} from '../../api';

const RESOURCE = 'awards';
const IMAGE_KEYS = ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'image_6'];

const emptyForm = () => ({
  title: '',
  intro: '',
  event_time: '',
  content: '',
  image: '',
  image_1: '', image_2: '', image_3: '', image_4: '', image_5: '', image_6: '',
  sort_order: 0,
  is_active: true,
});

export default function AwardManage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState(Array(6).fill(null));
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
    setForm({ ...emptyForm(), sort_order: list.length });
    setImageFile(null);
    setImageFiles(Array(6).fill(null));
    setSubmitError('');
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      title: row.title || '',
      intro: row.intro || '',
      event_time: row.event_time || '',
      content: row.content || '',
      image: row.image || '',
      image_1: row.image_1 || '',
      image_2: row.image_2 || '',
      image_3: row.image_3 || '',
      image_4: row.image_4 || '',
      image_5: row.image_5 || '',
      image_6: row.image_6 || '',
      sort_order: row.sort_order ?? 0,
      is_active: row.is_active ?? true,
    });
    setImageFile(null);
    setImageFiles(Array(6).fill(null));
    setSubmitError('');
    setModalOpen(true);
  }

  function setExtraImageFile(index, file) {
    setImageFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    let mainImageUrl = form.image;
    if (imageFile) {
      setUploading(true);
      try {
        mainImageUrl = await uploadImage(imageFile);
      } catch (err) {
        setSubmitError(err.message || 'Main image upload failed');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    const body = {
      title: form.title.trim(),
      intro: form.intro.trim(),
      event_time: form.event_time.trim(),
      content: form.content.trim(),
      image: mainImageUrl,
      sort_order: Number(form.sort_order),
      is_active: !!form.is_active,
    };
    for (let i = 0; i < 6; i++) {
      const key = IMAGE_KEYS[i];
      if (imageFiles[i]) {
        setUploading(true);
        try {
          body[key] = await uploadImage(imageFiles[i]);
        } catch (err) {
          setSubmitError(err.message || `Image ${i + 1} upload failed`);
          setUploading(false);
          return;
        }
        setUploading(false);
      } else {
        body[key] = form[key] || '';
      }
    }
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
    if (!window.confirm(`Delete "${row.title}"?`)) return;
    try {
      await dashboardDelete(RESOURCE, row.id);
      load();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  }

  return (
    <div className="dashboard-section">
      <h2>Awards</h2>
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
          <div className="dashboard-empty">No data. Click "Add" to create.</div>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Intro</th>
                <th>Time</th>
                <th>Order</th>
                <th>Active</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td className="img-cell">
                    {row.image ? <img src={row.image} alt="" /> : '-'}
                  </td>
                  <td>{row.title}</td>
                  <td>{row.intro?.slice(0, 40)}{row.intro?.length > 40 ? '…' : ''}</td>
                  <td>{row.event_time || '—'}</td>
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
          <div className="dashboard-modal dashboard-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">{editing ? 'Edit Award' : 'Add Award'}</div>
            <form onSubmit={handleSubmit} className="dashboard-modal-body dashboard-form">
              {submitError && <div className="login-error">{submitError}</div>}
              <label>
                Main image
                <div
                  className={'upload-area' + (imageFile || form.image ? ' has-file' : '')}
                  onClick={() => document.getElementById('award-img').click()}
                >
                  {imageFile ? imageFile.name : form.image ? 'Image selected' : 'Click to choose image'}
                </div>
                <input
                  id="award-img"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setImageFile(f);
                  }}
                />
                {form.image && !imageFile && (
                  <div className="upload-preview">
                    <img src={form.image} alt="" />
                  </div>
                )}
              </label>
              <label>
                Title
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </label>
              <label>
                Intro (1 line, 30 words or less)
                <input
                  type="text"
                  value={form.intro}
                  onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
                  maxLength={200}
                  placeholder="Brief summary in one line"
                />
              </label>
              <label>
                Time (no location)
                <input
                  type="text"
                  value={form.event_time}
                  onChange={(e) => setForm((f) => ({ ...f, event_time: e.target.value }))}
                  maxLength={200}
                  placeholder="e.g. March 2025"
                />
              </label>
              <label>
                Content (details, multiple paragraphs)
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={6}
                  placeholder="Full description, paragraph breaks preserved"
                />
              </label>
              <fieldset className="course-form-images">
                <legend>Extra images (max 6)</legend>
                {IMAGE_KEYS.map((key, i) => (
                  <label key={key} className="course-form-image-label">
                    Image {i + 1}
                    <div
                      className={'upload-area small' + (imageFiles[i] || form[key] ? ' has-file' : '')}
                      onClick={() => document.getElementById(`award-extra-${i}`).click()}
                    >
                      {imageFiles[i] ? imageFiles[i].name : form[key] ? 'Selected' : 'Choose'}
                    </div>
                    <input
                      id={`award-extra-${i}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setExtraImageFile(i, e.target.files?.[0] || null)}
                    />
                    {form[key] && !imageFiles[i] && (
                      <div className="upload-preview small">
                        <img src={form[key]} alt="" />
                      </div>
                    )}
                  </label>
                ))}
              </fieldset>
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
                  {uploading ? 'Uploading…' : editing ? 'Save' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
