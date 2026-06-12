import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchAwards } from '../api';

const EXTRA_IMAGE_KEYS = ['image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'image_6'];

export default function AwardList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAward, setSelectedAward] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAwards()
      .then((data) => {
        if (cancelled) return;
        setList(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (cancelled) return;
        setList([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedAward) return;
    const onEscape = (e) => {
      if (e.key === 'Escape') setSelectedAward(null);
    };
    window.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [selectedAward]);

  return (
    <>
      <Header />
      <main className="award-section">
        <div className="container">
          <h2 className="section-title">Awards</h2>
          {loading ? (
            <p className="award-loading">Loading...</p>
          ) : list.length === 0 ? (
            <p className="award-empty">No awards yet.</p>
          ) : (
            <div className="award-list">
              {list.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="award-card"
                  onClick={() => setSelectedAward(item)}
                >
                  <div className="award-card-image-wrap">
                    <img src={item.image} alt={item.title} className="award-card-image" />
                  </div>
                  <div className="award-card-body">
                    <h3 className="award-card-title">{item.title}</h3>
                    {item.event_time && (
                      <p className="award-card-meta">{item.event_time}</p>
                    )}
                    <p className="award-card-intro">{item.intro || '—'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {selectedAward && (
        <div
          className="award-modal-overlay"
          onClick={() => setSelectedAward(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="award-modal-title"
        >
          <div
            className="award-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="award-modal-close"
              onClick={() => setSelectedAward(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="award-modal-content">
              {selectedAward.image && (
                <div className="award-modal-image-wrap">
                  <img
                    src={selectedAward.image}
                    alt={selectedAward.title}
                    className="award-modal-image"
                  />
                </div>
              )}
              <h1 id="award-modal-title" className="award-modal-title">
                {selectedAward.title}
              </h1>
              <p className="award-modal-intro">{selectedAward.intro || ''}</p>
              {selectedAward.event_time && (
                <div className="award-modal-meta">
                  <p><span className="award-modal-label">When</span> {selectedAward.event_time}</p>
                </div>
              )}
              {selectedAward.content && (
                <div className="award-modal-content-text">
                  {(selectedAward.content || '')
                    .split(/\n\n+/)
                    .map((para) => para.trim())
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i} className="award-modal-p">{para}</p>
                    ))}
                </div>
              )}
              {(() => {
                const extraImages = EXTRA_IMAGE_KEYS
                  .map((key) => selectedAward[key])
                  .filter(Boolean);
                if (extraImages.length === 0) return null;
                return (
                  <div className="award-modal-gallery">
                    {extraImages.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${selectedAward.title} - ${i + 1}`}
                        className="award-modal-gallery-img"
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
