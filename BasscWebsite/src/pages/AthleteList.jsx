import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchAthletes } from '../api';

export default function AthleteList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAthletes()
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

  return (
    <>
      <Header />
      <main className="list-page athlete-list-page">
        <div className="container">
          <h1 className="list-page-title">Athletes</h1>
          {loading ? (
            <p className="list-page-loading">Loading...</p>
          ) : list.length === 0 ? (
            <p className="list-page-empty">No athletes yet.</p>
          ) : (
            <div className="list-page-grid">
              {list.map((item) => (
                <article key={item.id} className="list-card">
                  <div className="list-card-image-wrap">
                    <img src={item.image} alt={item.name} className="list-card-image" />
                  </div>
                  <div className="list-card-body">
                    <div className="list-card-name-row">
                      <h2 className="list-card-name">{item.name}</h2>
                      <span className="list-card-level">Level {item.team_level}</span>
                    </div>
                    {item.source && <span className="list-card-source">{item.source}</span>}
                    <p className="list-card-intro">{item.intro || '—'}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
