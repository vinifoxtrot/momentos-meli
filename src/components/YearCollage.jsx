import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import Confetti from './Confetti';
import { groupByMonth, groupByYear, getRotation } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

const MONTH_COLORS = [
  '#3B82F6','#EC4899','#10B981','#F59E0B',
  '#8B5CF6','#06B6D4','#EF4444','#14B8A6',
  '#6366F1','#F97316','#64748B','#F43F5E',
];

const MONTH_EMOJIS = ['🥂','💖','🌸','🌷','🌟','☀️','🏖️','🌻','🍂','🎃','🍁','🎄'];

export default function YearCollage({ photos }) {
  const { t } = useLanguage();
  const yearGroups = groupByYear(photos);
  const [selectedYear, setSelectedYear] = useState('');
  const [playing, setPlaying] = useState(false);
  const [revealedMonths, setRevealedMonths] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef();

  const yearData = yearGroups.find((g) => g.year === Number(selectedYear));
  const monthsWithPhotos = yearData
    ? groupByMonth(yearData.photos).slice().reverse() // jan → dez order
    : [];

  function startRetro() {
    setRevealedMonths(0);
    setShowConfetti(false);
    setShowFinal(false);
    setPlaying(true);
  }

  useEffect(() => {
    if (!playing || !monthsWithPhotos.length) return;
    if (revealedMonths >= monthsWithPhotos.length) {
      setTimeout(() => { setShowFinal(true); setShowConfetti(true); }, 400);
      return;
    }
    const delay = revealedMonths === 0 ? 1200 : 500;
    const t = setTimeout(() => setRevealedMonths((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [playing, revealedMonths, monthsWithPhotos.length]);

  async function downloadPng() {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(canvasRef.current, { useCORS: true, scale: 2, backgroundColor: '#0d0d1a' });
      const link = document.createElement('a');
      link.download = `retrospectiva-${selectedYear}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Confetti active={showConfetti} />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">{t.yearCollage.title}</h1>
        <p className="text-white/40">{t.yearCollage.subtitle}</p>
      </div>

      {yearGroups.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-white/50">{t.yearCollage.empty}</p>
        </div>
      ) : (
        <>
          {/* Selector */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="yc-year" className="text-white/50 text-xs uppercase tracking-wider font-semibold">{t.yearCollage.yearLabel}</label>
              <div className="relative">
                <select
                  id="yc-year"
                  value={selectedYear}
                  onChange={(e) => { setSelectedYear(e.target.value); setPlaying(false); setRevealedMonths(0); }}
                  className="appearance-none bg-white/10 border border-white/20 rounded-xl pl-4 pr-10 py-2.5 text-white text-sm outline-none focus:border-[#FFE600]/60 min-w-[140px] w-full cursor-pointer"
                >
                  <option value="">{t.yearCollage.select}</option>
                  {yearGroups.map((g) => (
                    <option key={g.year} value={g.year}>
                      {g.year} ({t.yearCollage.photoCount(g.photos.length)})
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">▾</span>
              </div>
            </div>

            <button
              onClick={startRetro}
              disabled={!yearData}
              className="bg-[#FFE600] hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-sm px-6 py-[9px] rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {playing ? <><span>🔄</span><span>{t.yearCollage.repeat}</span></> : <><span>🚀</span><span>{t.yearCollage.generate}</span></>}
            </button>

            {playing && showFinal && (
              <button
                onClick={downloadPng}
                disabled={downloading}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-[9px] rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                {downloading ? '⏳' : '⬇️'} {t.yearCollage.download}
              </button>
            )}
          </div>

          {/* Retrospective canvas */}
          {playing && yearData && (
            <div ref={canvasRef} className="rounded-3xl overflow-hidden bg-[#08080f] border border-white/10">

              {/* Hero header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="text-center py-10 bg-gradient-to-b from-[#1a0a2e] to-transparent relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(ellipse at center, #FFE600 0%, transparent 70%)' }}
                />
                <p className="text-[#FFE600] font-black text-8xl tracking-tighter relative z-10 drop-shadow-[0_0_40px_rgba(255,230,0,0.5)]">
                  {selectedYear}
                </p>
                <p className="text-white/50 text-lg mt-2 relative z-10">
                  {t.yearCollage.heroSub(yearData.photos.length, monthsWithPhotos.length)}
                </p>
              </motion.div>

              {/* Months grid */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {monthsWithPhotos.map((group, mIdx) => {
                  const color = MONTH_COLORS[(group.month - 1) % MONTH_COLORS.length];
                  const emoji = MONTH_EMOJIS[(group.month - 1) % MONTH_EMOJIS.length];
                  const highlights = group.photos.slice(0, 4);
                  const isVisible = mIdx < revealedMonths;

                  return (
                    <AnimatePresence key={`${group.year}-${group.month}`}>
                      {isVisible && (
                        <motion.div
                          initial={{ opacity: 0, x: -60, scale: 0.85 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                          className="rounded-2xl overflow-hidden border border-white/10"
                          style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)` }}
                        >
                          {/* Month header */}
                          <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10"
                            style={{ borderLeftWidth: 3, borderLeftColor: color }}>
                            <span className="text-lg">{emoji}</span>
                            <div>
                              <p className="font-bold text-white text-sm leading-tight">
                                {t.months[group.month - 1]} {group.year}
                              </p>
                              <p className="text-white/40 text-xs">{t.yearCollage.photoCount(group.photos.length)}</p>
                            </div>
                          </div>

                          {/* Photo mini-grid */}
                          <div className="p-2 grid grid-cols-2 gap-1.5">
                            {highlights.map((photo, pIdx) => (
                              <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: pIdx * 0.1 + 0.2, type: 'spring' }}
                                className="rounded-lg overflow-hidden"
                                style={{ aspectRatio: '1', transform: `rotate(${getRotation(pIdx)}deg)` }}
                              >
                                <img
                                  src={photo.base64}
                                  alt={photo.name}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                            ))}
                            {highlights.length < 4 &&
                              Array.from({ length: 4 - highlights.length }).map((_, i) => (
                                <div key={i} className="rounded-lg bg-white/5" style={{ aspectRatio: '1' }} />
                              ))
                            }
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}
              </div>

              {/* Final message */}
              <AnimatePresence>
                {showFinal && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    className="text-center py-10 border-t border-white/10 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFE600]/5 to-transparent" />
                    <p className="text-4xl mb-3">🎊</p>
                    <p className="text-white font-black text-2xl mb-1">
                      {t.yearCollage.finalTitle}
                    </p>
                    <p className="text-white/40">
                      {t.yearCollage.finalSub}
                      {' '}<span className="text-[#FFE600] font-bold">{t.yearCollage.meliRocks}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Placeholder */}
          {!playing && yearData && (
            <div className="text-center py-16 border border-dashed border-white/20 rounded-3xl">
              <p className="text-5xl mb-3">🎬</p>
              <p className="text-white/50">
                {t.yearCollage.readyPhotos(yearData.photos.length, selectedYear)}
              </p>
              <p className="text-white/30 text-sm mt-1">{t.yearCollage.readyHint}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
