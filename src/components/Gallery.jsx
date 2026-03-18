import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadZone from './UploadZone';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import { groupByMonth } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current) return;
    const start = prev.current;
    const diff = target - start;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = target;
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

const SECTION_COLORS = [
  '#3B82F6','#EC4899','#10B981','#F59E0B',
  '#8B5CF6','#06B6D4','#EF4444','#14B8A6',
  '#6366F1','#F97316','#64748B','#F43F5E',
];

export default function Gallery({ photos, onRefresh }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [lightboxGroup, setLightboxGroup] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const groups = groupByMonth(photos);
  const countMoments = useCountUp(photos.length);
  const countMonths  = useCountUp(groups.length);

  useEffect(() => {
    function onScroll() { setShowScrollTop(window.scrollY > 350); }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = search
    ? groups.map((g) => ({
        ...g,
        photos: g.photos.filter((p) =>
          (p.caption || '').toLowerCase().includes(search.toLowerCase()) ||
          (p.name || '').toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((g) => g.photos.length > 0)
    : groups;

  const totalFiltered = filtered.reduce((acc, g) => acc + g.photos.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {lightboxGroup && (
        <Lightbox
          photos={lightboxGroup.photos}
          index={lightboxGroup.index}
          onClose={() => setLightboxGroup(null)}
          onPrev={() => setLightboxGroup((l) => ({ ...l, index: Math.max(0, l.index - 1) }))}
          onNext={() => setLightboxGroup((l) => ({ ...l, index: Math.min(l.photos.length - 1, l.index + 1) }))}
        />
      )}

      <UploadZone onUploaded={onRefresh} />

      {photos.length > 0 && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-3">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <span className="text-xl">📷</span>
              <div>
                <p className="text-2xl font-black text-[#FFE600] leading-none">{countMoments}</p>
                <p className="text-white/40 text-xs uppercase tracking-wider mt-0.5">{t.gallery.momentsLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <span className="text-xl">📅</span>
              <div>
                <p className="text-2xl font-black text-[#FFE600] leading-none">{countMonths}</p>
                <p className="text-white/40 text-xs uppercase tracking-wider mt-0.5">{t.gallery.monthsLabel}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {search && (
              <p className="text-white/40 text-sm">
                {t.gallery.results(totalFiltered)}
              </p>
            )}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder={t.gallery.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#FFE600]/60 w-72"
              />
              {search && (
                <button onClick={() => setSearch('')} aria-label={t.gallery.scrollTop} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 text-xs">✕</button>
              )}
            </div>
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <p className="text-6xl">📷</p>
          <p className="text-white/50 text-lg">{t.gallery.empty}</p>
          <p className="text-white/30 text-sm">{t.gallery.emptyHint}</p>
        </div>
      )}

      {search && filtered.length === 0 && photos.length > 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="text-5xl">🔍</p>
          <p className="text-white/50">{t.gallery.noResults(search)}</p>
        </div>
      )}

      {filtered.map((group) => {
        const flatPhotos = filtered.flatMap((g) => g.photos);
        return (
        <motion.section
          key={`${group.year}-${group.month}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-1 h-7 rounded-full shrink-0"
              style={{ background: SECTION_COLORS[(group.month - 1) % 12] }}
            />
            <h2 className="text-xl font-black text-white">
              {t.months[group.month - 1]} {group.year}
            </h2>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{
                background: `${SECTION_COLORS[(group.month - 1) % 12]}18`,
                borderColor: `${SECTION_COLORS[(group.month - 1) % 12]}40`,
                color: SECTION_COLORS[(group.month - 1) % 12],
              }}
            >
              {t.gallery.photoCount(group.photos.length)}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {group.photos.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={i}
                onRefresh={onRefresh}
                onOpen={() => {
                  const flatPhotos = filtered.flatMap((g) => g.photos);
                  const globalIndex = flatPhotos.findIndex((p) => p.id === photo.id);
                  setLightboxGroup({ photos: flatPhotos, index: globalIndex });
                }}
              />
            ))}
          </div>
        </motion.section>
        );
      })}
      {/* Scroll to top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#FFE600] hover:bg-yellow-300 text-black font-black rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 transition-colors"
            aria-label={t.gallery.scrollTop}
            title={t.gallery.scrollTop}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
