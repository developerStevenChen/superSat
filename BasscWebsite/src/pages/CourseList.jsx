import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchCourses } from '../api';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCourses()
      .then((data) => {
        if (cancelled) return;
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (cancelled) return;
        setCourses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Header />
      <main className="course-list-page">
        <div className="container">
          <h1 className="course-list-title">Courses</h1>
          {loading ? (
            <p className="course-list-loading">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="course-list-empty">No courses yet.</p>
          ) : (
            <ul className="course-list">
              {courses.map((c) => (
                <li key={c.id}>
                  <Link to={`/class/${c.slug}`} className="course-list-link">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
