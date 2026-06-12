import { Link } from 'react-router-dom';
import { defaultHomepage } from '../data';

const boardLinks = {
  1: '/class',
  2: '/event',
  3: '/coach',
  4: '/award',
};

export default function BoardSection({ boards: propBoards }) {
  const boards = propBoards?.length ? propBoards : defaultHomepage.boards;

  if (boards.length === 0) return null;

  return (
    <section className="board-section">
      <div className="container">
        <div className="board-grid">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={board.link || boardLinks[board.id] || '#'}
              className="board-card"
            >
              <div className="board-image-wrap">
                <img src={board.image} alt={board.title} className="board-image" />
              </div>
              <h3 className="board-title">{board.title}</h3>
              <p className="board-desc">{board.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
