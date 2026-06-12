import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PlaceholderPage({ title }) {
  return (
    <>
      <Header />
      <main className="placeholder-main">
        <h1>{title}</h1>
        <p>Coming soon.</p>
        <Link to="/" className="placeholder-link">Back to Home</Link>
      </main>
      <Footer />
    </>
  );
}
