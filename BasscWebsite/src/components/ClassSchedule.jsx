import { defaultHomepage } from '../data';

export default function ClassSchedule({ classes: propClasses }) {
  const classes = Array.isArray(propClasses) ? propClasses : [];
  // Backend homepage already filters is_open & is_active; fallback filter here
  const list = classes.filter((c) => c && c.time);

  if (list.length === 0) return null;

  return (
    <section className="class-schedule-section">
      <div className="container">
        <h2 className="section-title">Activity Schedule</h2>
        <div className="class-schedule-grid">
          {list.map((item) => (
            <article key={item.id} className="class-card">
              <div className="class-card-time">
                <span className="class-card-time-label">Class</span>
                <span className="class-card-time-value">{item.time}</span>
              </div>
              <div className="class-card-body">
                <div className="class-card-meta">
                  {item.location && (
                    <span className="class-card-chip">
                      Address: {item.location}
                    </span>
                  )}
                  {item.category && (
                    <span className="class-card-chip">
                      {item.category}
                    </span>
                  )}
                  {item.coach && (
                    <span className="class-card-chip">
                      Coach: {item.coach}
                    </span>
                  )}
                </div>
                {item.intro && (
                  <p className="class-card-intro">
                    {item.intro}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

