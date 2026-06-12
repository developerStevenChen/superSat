import { Link } from 'react-router-dom';
import { defaultHomepage } from '../data';

export default function NewsList({ newsList: propNewsList }) {
  const newsList = propNewsList?.length ? propNewsList : defaultHomepage.newsList;

  if (newsList.length === 0) return null;

  return (
    <section className="news-section">
      <div className="container">
        <div className="news-header">
          <h2 className="section-title">Latest News</h2>
          <Link to="/news" className="news-more">
            More News →
          </Link>
        </div>
        <div className="news-list">
          {newsList.map((news) => (
            <Link
              key={news.id}
              to={`/news/${news.id}`}
              className="news-card"
            >
              <div className="news-image-wrap">
                <img src={news.primPic} alt={news.title} className="news-image" />
              </div>
              <div className="news-body">
                <h3 className="news-title">{news.title}</h3>
                <p className="news-intro">{news.intro}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
