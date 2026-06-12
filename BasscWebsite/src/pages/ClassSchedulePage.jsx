import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClassSchedule from '../components/ClassSchedule';
import { fetchClasses } from '../api';

export default function ClassSchedulePage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchClasses()
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
      <main>
        {loading ? (
          <section className="class-schedule-section">
            <div className="container">
              <h2 className="section-title">Class Schedule</h2>
              <p className="list-page-loading">Loading...</p>
            </div>
          </section>
        ) : list.length === 0 ? (
          <section className="class-schedule-section">
            <div className="container">
              <h2 className="section-title">Class Schedule</h2>
              <p className="list-page-empty">No open classes at the moment.</p>
            </div>
          </section>
        ) : (
          <ClassSchedule classes={list} />
        )}
      </main>
      <Footer />
    </>
  );
}

