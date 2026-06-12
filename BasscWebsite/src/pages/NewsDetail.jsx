import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { newsList as defaultNewsList } from '../data';
import { API_BASE } from '../api';

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}/news/${id}/`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        setNews({
          id: data.id,
          title: data.title,
          intro: data.intro,
          content: data.content,
          primPic: data.prim_pic,
          images: (data.images || []).map((img) => img.image_url || img).filter(Boolean),
        });
      })
      .catch(() => {
        if (cancelled) return;
        const found = defaultNewsList.find((n) => n.id === Number(id));
        setNews(found || null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="news-detail-empty"><p>Loading...</p></main>
        <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Header />
        <div className="news-detail-empty">
          <p>News not found.</p>
          <Link to="/">Back to Home</Link>
        </div>
        <Footer />
      </>
    );
  }

  const images = Array.isArray(news.images) ? news.images : [];

  return (
    <>
      <Header />
      <article className="news-detail">
        <div className="news-detail-header">
          <Link to="/" className="news-back">← Back to Home</Link>
          <h1 className="news-detail-title">{news.title}</h1>
          <p className="news-detail-intro">{news.intro}</p>
        </div>
        <div className="news-detail-content">
          <p className="news-detail-text">{news.content}</p>
          {images.length > 0 && (
            <div className="news-detail-gallery">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={typeof img === 'string' ? img : img.image_url}
                  alt={`${news.title} - Image ${index + 1}`}
                  className="news-detail-img"
                />
              ))}
            </div>
          )}
        </div>
      </article>
      <Footer />
    </>
  );
}
