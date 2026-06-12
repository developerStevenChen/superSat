import { useState, useEffect } from 'react';
import {
  dashboardList,
  dashboardCreate,
  dashboardUpdate,
  dashboardDelete,
  uploadImage,
} from '../../api';

const RESOURCE = 'news';

export default function NewsManage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', intro: '', content: '', prim_pic: '', sort_order: 0, is_active: true, images: [],
  });
  const [primPicFile, setPrimPicFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    dashboardList(RESOURCE).then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }
  useEffect(() => load(), []);

  function openAdd() {
    setEditing(null);
    setForm({ title: '', intro: '', content: '', prim_pic: '', sort_order: list.length, is_active: true, images: [] });
    setPrimPicFile(null);
    setExtraFiles([]);
    setSubmitError('');
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    const imgs = (row.images || []).map((i) => (typeof i === 'string' ? i : i.image_url));
    setForm({
      title: row.title || '', intro: row.intro || '', content: row.content || '',
      prim_pic: row.prim_pic || '', sort_order: row.sort_order ?? 0, is_active: row.is_active ?? true, images: imgs,
    });
    setPrimPicFile(null);
    setExtraFiles([]);
    setSubmitError('');
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    let primUrl = form.prim_pic;
    if (primPicFile) {
      setUploading(true);
      try {
        primUrl = await uploadImage(primPicFile);
      } catch (err) {
        setSubmitError(err.message || 'Primary image upload failed');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    const imageUrls = [...form.images];
    for (const f of extraFiles) {
      setUploading(true);
      try {
        imageUrls.push(await uploadImage(f));
      } catch (err) {
        setSubmitError(err.message || 'Extra image upload failed');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    const body = {
      title: form.title,
      intro: form.intro,
      content: form.content,
      prim_pic: primUrl,
      sort_order: Number(form.sort_order),
      is_active: !!form.is_active,
      images: imageUrls.map((url, i) => ({ image_url: url, sort_order: i, is_active: true })),
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
      <h2>News</h2>
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
                <th>Image</th>
                <th>Title</th>
                <th>Intro</th>
                <th>Order</th>
                <th>Active</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td className="img-cell">{row.prim_pic ? <img src={row.prim_pic} alt="" /> : '-'}</td>
                  <td>{row.title}</td>
                  <td>{row.intro?.slice(0, 50)}{row.intro?.length > 50 ? '…' : ''}</td>
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
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="dashboard-modal-header">{editing ? 'Edit News' : 'Add News'}</div>
            <form onSubmit={handleSubmit} className="dashboard-modal-body dashboard-form">
              {submitError && <div className="login-error">{submitError}</div>}
              <label>
                Primary image (upload to Railway)
                <div className={'upload-area' + (primPicFile || form.prim_pic ? ' has-file' : '')} onClick={() => document.getElementById('news-prim').click()}>
                  {primPicFile ? primPicFile.name : form.prim_pic ? 'Primary image selected' : 'Click to choose primary image'}
                </div>
                <input id="news-prim" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPrimPicFile(f); }} />
                {form.prim_pic && !primPicFile && <div className="upload-preview"><img src={form.prim_pic} alt="" /></div>}
              </label>
              <label>Title <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required /></label>
              <label>Intro <input type="text" value={form.intro} onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))} /></label>
              <label>Content <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={4} /></label>
              <label>Order <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))} title="Display order (smaller = first)" /></label>
              <label>
                More images (multiple)
                <input type="file" accept="image/*" multiple onChange={(e) => setExtraFiles(Array.from(e.target.files || []))} />
                {extraFiles.length > 0 && <span> {extraFiles.length} selected</span>}
              </label>
              <label>
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
                Active
              </label>
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
