export default function PathwayCard({ pathway }) {
  if (!pathway || (!pathway.image && !pathway.text)) return null;
  const hasImage = !!pathway.image;
  const hasText = !!pathway.text;

  return (
    <section className="pathway-section">
      <div className="container">
        <h2 className="section-title">Pathway</h2>
        <div className={'pathway-card' + (!hasImage || !hasText ? ' pathway-card--single' : '')}>
          {pathway.image && (
            <div className="pathway-card-image-wrap">
              <img src={pathway.image} alt="" className="pathway-card-image" />
            </div>
          )}
          {pathway.text && (
            <div className="pathway-card-text-wrap">
              <div className="pathway-card-text">
                {(pathway.text || '')
                  .split(/\n\n+/)
                  .map((para) => para.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="pathway-card-p">{para}</p>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
