import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchEvents } from '../api';

export default function EventList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchEvents()
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
    if (!selectedEvent) return;
    const onEscape = (e) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [selectedEvent]);

  return (
    <>
      <Header />
      <main className="event-section">
        <div className="container">
          <h2 className="section-title">Events</h2>
          {loading ? (
            <p className="event-loading">Loading...</p>
          ) : list.length === 0 ? (
            <p className="event-empty">No events yet.</p>
          ) : (
            <div className="event-list">
              {list.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="event-card"
                  onClick={() => setSelectedEvent(item)}
                >
                  <div className="event-card-image-wrap">
                    <img src={item.image} alt={item.title} className="event-card-image" />
                  </div>
                  <div className="event-card-body">
                    <h3 className="event-card-title">{item.title}</h3>
                    {(item.location || item.event_time) && (
                      <p className="event-card-meta">
                        {item.event_time && <span>{item.event_time}</span>}
                        {item.event_time && item.location && ' · '}
                        {item.location && <span>{item.location}</span>}
                      </p>
                    )}
                    <p className="event-card-intro">{item.intro || '—'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {selectedEvent && (
        <div
          className="event-modal-overlay"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
        >
          <div
            className="event-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="event-modal-close"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="event-modal-content">
              {selectedEvent.image && (
                <div className="event-modal-image-wrap">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="event-modal-image"
                  />
                </div>
              )}
              <h1 id="event-modal-title" className="event-modal-title">
                {selectedEvent.title}
              </h1>
              <p className="event-modal-intro">{selectedEvent.intro || ''}</p>
              {(selectedEvent.location || selectedEvent.event_time) && (
                <div className="event-modal-meta">
                  {selectedEvent.event_time && (
                    <p><span className="event-modal-label">When</span> {selectedEvent.event_time}</p>
                  )}
                  {selectedEvent.location && (
                    <p><span className="event-modal-label">Location</span> {selectedEvent.location}</p>
                  )}
                </div>
              )}
              {selectedEvent.content && (
                <div className="event-modal-content-text">
                  {(selectedEvent.content || '')
                    .split(/\n\n+/)
                    .map((para) => para.trim())
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i} className="event-modal-p">{para}</p>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
