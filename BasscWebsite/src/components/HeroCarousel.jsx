import { useState, useEffect } from 'react';
import { defaultHomepage } from '../data';

export default function HeroCarousel({ homePagePic: propPics, onTryOutClick }) {
  const homePagePic = propPics?.length ? propPics : defaultHomepage.homePagePic;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (homePagePic.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % homePagePic.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [homePagePic.length]);

  if (homePagePic.length === 0) return null;

  const item = homePagePic[current];

  const getImageUrl = (pic) => pic?.image ?? pic?.image_url ?? '';

  return (
    <section className="hero-carousel">
      <div className="hero-slides">
        {homePagePic.map((pic, index) => {
          const src = getImageUrl(pic);
          return (
            <div
              key={pic.id}
              className={`hero-slide ${index === current ? 'active' : ''}`}
              style={{ backgroundImage: src ? `url(${src})` : undefined }}
              title={pic.title || `Slide ${index + 1}`}
            />
          );
        })}
      </div>
      <div className="hero-content">
        <h1 className="hero-title">{item.title}</h1>
        <p className="hero-description">{item.description}</p>
      </div>
      {onTryOutClick && (
        <button
          type="button"
          className="hero-tryout-btn"
          onClick={onTryOutClick}
        >
          Try out
        </button>
      )}
      <div className="hero-indicators">
        {homePagePic.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
      <button
        className="hero-arrow hero-prev"
        onClick={() => setCurrent((prev) => (prev - 1 + homePagePic.length) % homePagePic.length)}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className="hero-arrow hero-next"
        onClick={() => setCurrent((prev) => (prev + 1) % homePagePic.length)}
        aria-label="Next slide"
      >
        ›
      </button>
    </section>
  );
}
