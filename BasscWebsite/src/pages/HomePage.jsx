import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroCarousel from '../components/HeroCarousel';
import BoardSection from '../components/BoardSection';
import IntroductionCarousel from '../components/IntroductionCarousel';
import PathwayCard from '../components/PathwayCard';
import ClassSchedule from '../components/ClassSchedule';
import NewsList from '../components/NewsList';
import TryOutModal from '../components/TryOutModal';
import { fetchHomepage } from '../api';
import { defaultHomepage } from '../data';

function useHomepageData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchHomepage()
      .then((payload) => {
        if (cancelled) return;
        // Merge by field: use API when present, else default (avoid one empty section forcing full default)
        const merged = {
          homePagePic: (payload.homePagePic && payload.homePagePic.length > 0) ? payload.homePagePic : defaultHomepage.homePagePic,
          boards: (payload.boards && payload.boards.length > 0) ? payload.boards : defaultHomepage.boards,
          introductions: (payload.introductions && payload.introductions.length > 0) ? payload.introductions : defaultHomepage.introductions,
          pathway: payload.pathway ?? defaultHomepage.pathway,
          classes: Array.isArray(payload.classes) ? payload.classes : defaultHomepage.classes,
          newsList: (payload.newsList && payload.newsList.length > 0) ? payload.newsList : defaultHomepage.newsList,
          navItems: (payload.navItems && payload.navItems.length > 0) ? payload.navItems : defaultHomepage.navItems,
        };
        const usedDefault = merged.homePagePic === defaultHomepage.homePagePic || merged.boards === defaultHomepage.boards || merged.introductions === defaultHomepage.introductions || merged.newsList === defaultHomepage.newsList;
        if (usedDefault) alert('Some content uses default data (no backend data for that section).');
        setData(merged);
      })
      .catch(() => {
        if (cancelled) return;
        alert('Cannot reach backend, using default homepage data.');
        setData(defaultHomepage);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

export default function HomePage() {
  const { data, loading } = useHomepageData();
  const [tryOutOpen, setTryOutOpen] = useState(false);

  if (loading) {
    return (
      <>
        <Header navItems={defaultHomepage.navItems} onTryOutClick={() => setTryOutOpen(true)} />
        <main className="homepage-loading">
          <p>Loading...</p>
        </main>
        <Footer />
        <TryOutModal open={tryOutOpen} onClose={() => setTryOutOpen(false)} />
      </>
    );
  }

  if (!data) return null;

  return (
    <>
      <Header navItems={data.navItems} onTryOutClick={() => setTryOutOpen(true)} />
      <main>
        <HeroCarousel homePagePic={data.homePagePic} onTryOutClick={() => setTryOutOpen(true)} />
        <BoardSection boards={data.boards} />
        <IntroductionCarousel introductions={data.introductions} onTryOutClick={() => setTryOutOpen(true)} />
        {data.pathway && <PathwayCard pathway={data.pathway} />}
        <ClassSchedule classes={data.classes} />
        <NewsList newsList={data.newsList} />
      </main>
      <Footer />
      <TryOutModal open={tryOutOpen} onClose={() => setTryOutOpen(false)} />
    </>
  );
}
