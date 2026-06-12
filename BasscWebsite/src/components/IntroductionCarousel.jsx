import { useState } from 'react';
import { defaultHomepage } from '../data';

export default function IntroductionCarousel({ introductions: propIntros, onTryOutClick }) {
  const introductions = propIntros?.length ? propIntros : defaultHomepage.introductions;
  const [current, setCurrent] = useState(0);

  if (introductions.length === 0) return null;

  const item = introductions[current];

  return (
    <section className="intro-section">
      <div className="container">
        <h2 className="section-title">About the Club</h2>
        <div className="intro-carousel">
          <button
            className="intro-arrow intro-prev"
            onClick={() =>
              setCurrent((prev) => (prev - 1 + introductions.length) % introductions.length)
            }
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="intro-content">
            <div className="intro-image-wrap">
              <img src={item.image} alt={item.title} className="intro-image" />
            </div>
            <div className="intro-text-wrap">
              <h3 className="intro-title">{item.title}</h3>
              <div className="intro-text">
                {(item.text || '')
                  .split(/\n\n+/)
                  .map((para) => para.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="intro-text-p">
                      {para}
                    </p>
                  ))}
              </div>
              {onTryOutClick && (
                <button
                  type="button"
                  className="intro-tryout-btn"
                  onClick={onTryOutClick}
                >
                  Try out
                </button>
              )}
            </div>
          </div>
          <button
            className="intro-arrow intro-next"
            onClick={() => setCurrent((prev) => (prev + 1) % introductions.length)}
            aria-label="Next"
          >
            ›
          </button>
        </div>
        <div className="intro-indicators">
          {introductions.map((_, index) => (
            <button
              key={index}
              className={`intro-dot ${index === current ? 'active' : ''}`}
              onClick={() => setCurrent(index)}
              aria-label={`Section ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
