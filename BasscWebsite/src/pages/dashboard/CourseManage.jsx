import { useState, useEffect } from 'react';
import {
  dashboardList,
  dashboardCreate,
  dashboardUpdate,
  dashboardDelete,
  uploadImage,
} from '../../api';

const RESOURCE = 'courses';
const IMAGE_KEYS = ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'image_6'];

const emptyForm = () => ({
  slug: '',
  title: '',
  hero_video_url: '',
  intro_text: '',
  image_1: '', image_2: '', image_3: '', image_4: '', image_5: '', image_6: '',
  sort_order: 0,
  is_active: true,
});

export default function CourseManage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [imageFiles, setImageFiles] = useState(Array(6).fill(null));
  const [heroVideoFile, setHeroVideoFile] = useState(null);
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
    setImageFiles(Array(6).fill(null));
    setHeroVideoFile(null);
    setSubmitError('');
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      slug: row.slug || '',
      title: row.title || '',
      hero_video_url: row.hero_video_url || '',
      intro_text: row.intro_text || '',
      image_1: row.image_1 || '',
      image_2: row.image_2 || '',
      image_3: row.image_3 || '',
      image_4: row.image_4 || '',
      image_5: row.image_5 || '',
      image_6: row.image_6 || '',
      sort_order: row.sort_order ?? 0,
      is_active: row.is_active ?? true,
    });
    setImageFiles(Array(6).fill(null));
    setHeroVideoFile(null);
    setSubmitError('');
    setModalOpen(true);
  }

  function setImageFile(index, file) {
    setImageFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    let heroVideoUrl = form.hero_video_url.trim() || '';
    if (heroVideoFile) {
      setUploading(true);
      try {
        heroVideoUrl = await uploadImage(heroVideoFile);
      } catch (err) {
        setSubmitError(err.message || 'Hero video upload failed');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    const body = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      hero_video_url: heroVideoUrl || undefined,
      intro_text: form.intro_text.trim() || '',
      sort_order: Number(form.sort_order),
      is_active: !!form.is_active,
    };
    const imageUrls = { ...form };
    for (let i = 0; i < 6; i++) {
      const key = IMAGE_KEYS[i];
      if (imageFiles[i]) {
        setUploading(true);
        try {
          imageUrls[key] = await uploadImage(imageFiles[i]);
        } catch (err) {
          setSubmitError(err.message || `Image ${i + 1} upload failed`);
          setUploading(false);
          return;
        }
        setUploading(false);
      }
      body[key] = imageUrls[key] || '';
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
      <h2>Courses</h2>
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
                <th>Slug</th>
                <th>Title</th>
                <th>Order</th>
                <th>Active</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td><code>{row.slug}</code></td>
                  <td>{row.title}</td>
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
            <div className="dashboard-modal-header">{editing ? 'Edit Course' : 'Add Course'}</div>
            <form onSubmit={handleSubmit} className="dashboard-modal-body dashboard-form">
              {submitError && <div className="login-error">{submitError}</div>}
              <label>
                Slug (URL: /class/<strong>slug</strong>)
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.replace(/\s+/g, '-').toLowerCase() }))}
                  placeholder="speedskating"
                  required
                />
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
                Hero video (upload to Railway, &lt;1 min)
                <div
                  className={'upload-area' + (heroVideoFile || form.hero_video_url ? ' has-file' : '')}
                  onClick={() => document.getElementById('course-hero-video').click()}
                >
                  {heroVideoFile ? heroVideoFile.name : form.hero_video_url ? 'Video selected' : 'Click to upload video'}
                </div>
                <input
                  id="course-hero-video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setHeroVideoFile(e.target.files?.[0] || null)}
                />
                <span className="form-hint">Or paste URL below to use an existing video</span>
                <input
                  type="url"
                  value={form.hero_video_url}
                  onChange={(e) => setForm((f) => ({ ...f, hero_video_url: e.target.value }))}
                  placeholder="https://... (optional if uploading)"
                  style={{ marginTop: 6 }}
                />
              </label>
              <label>
                Intro text (~300 words, 2–3 paragraphs)
                <textarea
                  value={form.intro_text}
                  onChange={(e) => setForm((f) => ({ ...f, intro_text: e.target.value }))}
                  rows={6}
                />
              </label>
              <fieldset className="course-form-images">
                <legend>Gallery images (6, optional)</legend>
                {IMAGE_KEYS.map((key, i) => (
                  <label key={key} className="course-form-image-label">
                    Image {i + 1}
                    <div
                      className={'upload-area small' + (imageFiles[i] || form[key] ? ' has-file' : '')}
                      onClick={() => document.getElementById(`course-img-${i}`).click()}
                    >
                      {imageFiles[i] ? imageFiles[i].name : form[key] ? 'Selected' : 'Choose'}
                    </div>
                    <input
                      id={`course-img-${i}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setImageFile(i, f || null);
                      }}
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
