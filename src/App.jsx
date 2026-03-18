import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getAllPhotos } from './utils/db';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Gallery from './components/Gallery';
import MonthCollage from './components/MonthCollage';
import YearCollage from './components/YearCollage';

function AppInner() {
  const [view, setView] = useState('gallery');
  const [photos, setPhotos] = useState([]);

  async function loadPhotos() {
    const all = await getAllPhotos();
    setPhotos(all.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }

  useEffect(() => { loadPhotos(); }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-app)', transition: 'background 0.3s ease' }}>
      <Header view={view} onNav={setView} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {view === 'gallery' && <Gallery photos={photos} onRefresh={loadPhotos} />}
            {view === 'month'   && <MonthCollage photos={photos} />}
            {view === 'year'    && <YearCollage photos={photos} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </ThemeProvider>
  );
}
