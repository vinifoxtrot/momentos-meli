import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const { t } = useLanguage();
  const photo = photos[index];

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label={t.lightbox.counter(index + 1, photos.length)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'var(--overlay)' }} />

        {/* Counter */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-xs font-semibold px-3 py-1 rounded-full z-10 bg-white/10">
          {index + 1} / {photos.length}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label={t.lightbox.close}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          ✕
        </button>

        {/* Prev */}
        {index > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label={t.lightbox.prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-lg transition-colors"
          >
            ‹
          </button>
        )}

        {/* Next */}
        {index < photos.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label={t.lightbox.next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-lg transition-colors"
          >
            ›
          </button>
        )}

        {/* Image */}
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 flex flex-col items-center gap-4 max-w-[90vw] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={photo.base64}
            alt={photo.caption || photo.name}
            className="max-w-[85vw] max-h-[78vh] object-contain rounded-2xl shadow-2xl"
          />
          {photo.caption && (
            <p className="text-white/80 text-sm font-medium bg-white/10 px-4 py-2 rounded-xl">
              {photo.caption}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
