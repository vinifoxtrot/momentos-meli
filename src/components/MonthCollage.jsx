import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import Confetti from './Confetti';
import CollageBackground from './CollageBackground';
import WelcomeMember from './WelcomeMember';
import { groupByMonth, getCollageLayout, getRotation } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';
import { useCollageSong } from '../hooks/useCollageSong';

// Per-month dark base color (blends with animated blobs)
const MONTH_BASES = [
  '#0a0e2a','#1a0814','#051a10','#1a0e05',
  '#100520','#021a1a','#1a0505','#021a12',
  '#08061e','#0e0514','#120a04','#06081e',
];

export default function MonthCollage({ photos }) {
  const { t } = useLanguage();
  const { play: playSong, stop: stopSong } = useCollageSong();
  const groups = groupByMonth(photos);

  const [selectedYear,  setSelectedYear]  = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [stage, setStage] = useState('idle'); // idle | welcoming | collage
  const [welcomeIdx, setWelcomeIdx]   = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [downloading,  setDownloading]  = useState(false);
  const [muted, setMuted] = useState(false);
  const collageRef = useRef();

  useEffect(() => () => stopSong(), []);

  const years  = [...new Set(groups.map((g) => g.year))].sort((a, b) => b - a);
  const months = groups.filter((g) => !selectedYear || g.year === Number(selectedYear));
  const selected = groups.find(
    (g) => g.year === Number(selectedYear) && g.month === Number(selectedMonth)
  );
  const collagePhotos = selected ? selected.photos.slice(0, 12) : [];
  const newMembers    = selected ? selected.photos.filter((p) => p.isNewMember) : [];
  const layout = getCollageLayout(collagePhotos.length);
  const monthIdx = (Number(selectedMonth) - 1) || 0;
  const baseColor = MONTH_BASES[monthIdx];

  // ── Start flow ───────────────────────────────────────────────────────────────
  function startFlow() {
    stopSong();
    setShowConfetti(false);
    setVisibleCount(0);
    if (newMembers.length > 0) {
      setWelcomeIdx(0);
      setStage('welcoming');
    } else {
      beginCollage();
    }
  }

  function beginCollage() {
    setStage('collage');
    if (!muted) playSong(Number(selectedMonth));
  }

  function onWelcomeDone() {
    if (welcomeIdx < newMembers.length - 1) {
      setWelcomeIdx((i) => i + 1);
    } else {
      beginCollage();
    }
  }

  // ── Reveal photos one by one ─────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'collage' || !collagePhotos.length) return;
    if (visibleCount >= collagePhotos.length) {
      setTimeout(() => setShowConfetti(true), 300);
      return;
    }
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 350);
    return () => clearTimeout(timer);
  }, [stage, visibleCount, collagePhotos.length]);

  async function downloadPng() {
    if (!collageRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(collageRef.current, { useCORS: true, scale: 2 });
      const link = document.createElement('a');
      link.download = `momentos-${t.months[selected.month - 1]}-${selected.year}.png`.toLowerCase();
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  const playing = stage === 'collage';

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Confetti active={showConfetti} />

      {/* Welcome overlay */}
      {stage === 'welcoming' && newMembers[welcomeIdx] && (
        <WelcomeMember photo={newMembers[welcomeIdx]} onDone={onWelcomeDone} />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>{t.monthCollage.title}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t.monthCollage.subtitle}</p>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <p style={{ color: 'var(--text-secondary)' }}>{t.monthCollage.empty}</p>
        </div>
      ) : (
        <>
          {/* ── Selector ── */}
          <div className="rounded-2xl p-6 mb-8 flex flex-wrap gap-4 items-end" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="mc-year" className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>{t.monthCollage.yearLabel}</label>
              <div className="relative">
                <select
                  id="mc-year"
                  value={selectedYear}
                  onChange={(e) => { setSelectedYear(e.target.value); setSelectedMonth(''); setStage('idle'); }}
                  className="appearance-none rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none min-w-[120px] w-full cursor-pointer"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}
                >
                  <option value="">{t.monthCollage.select}</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--text-muted)' }}>▾</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="mc-month" className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>{t.monthCollage.monthLabel}</label>
              <div className="relative">
                <select
                  id="mc-month"
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setStage('idle'); setVisibleCount(0); }}
                  disabled={!selectedYear}
                  className="appearance-none rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none min-w-[160px] w-full disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}
                >
                  <option value="">{t.monthCollage.select}</option>
                  {months.map((g) => (
                    <option key={g.month} value={g.month}>
                      {t.months[g.month - 1]} {g.year} ({g.photos.length})
                      {g.photos.some((p) => p.isNewMember) ? ' 👋' : ''}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--text-muted)' }}>▾</span>
              </div>
            </div>

            <button
              onClick={startFlow}
              disabled={!selected}
              className="bg-[#FFE600] hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-sm px-6 py-[9px] rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {playing
                ? <><span>🔄</span><span>{t.monthCollage.repeat}</span></>
                : newMembers.length > 0
                  ? <><span>👋</span><span>{t.monthCollage.generate}</span></>
                  : <><span>🎬</span><span>{t.monthCollage.generate}</span></>
              }
            </button>

            {playing && (
              <>
                <button
                  onClick={downloadPng}
                  disabled={downloading}
                  className="font-semibold text-sm px-5 py-[9px] rounded-xl transition-all duration-200 flex items-center gap-2"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
                >
                  {downloading ? '⏳' : '⬇️'} {t.monthCollage.download}
                </button>
                <button
                  onClick={() => { const n = !muted; setMuted(n); if (n) stopSong(); else playSong(Number(selectedMonth)); }}
                  className="font-semibold text-sm px-4 py-[9px] rounded-xl transition-all duration-200"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
                >
                  {muted ? '🔇' : '🔊'}
                </button>
              </>
            )}

            {/* New members hint */}
            {selected && newMembers.length > 0 && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-3 py-2">
                <span>👋</span>
                <span>{t.monthCollage.newMembersHint(newMembers.length)}</span>
              </div>
            )}
          </div>

          {/* ── Collage canvas ── */}
          {playing && selected && (
            <div
              ref={collageRef}
              className="relative w-full rounded-3xl"
              style={{ aspectRatio: '16/9', minHeight: 'min(480px, 60vw)', backgroundColor: baseColor, overflow: 'hidden' }}
            >
              {/* Animated gradient background */}
              <CollageBackground active={playing} month={Number(selectedMonth)} />

              {/* Title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute top-5 left-0 right-0 flex flex-col items-center z-20 px-4"
              >
                <div className="bg-black/50 rounded-2xl px-5 flex items-center gap-3 max-w-[90%]" style={{ height: 44 }}>
                  <span className="text-2xl leading-none" style={{ lineHeight: 1 }}>{['🥂','💖','🌸','🌷','🌟','☀️','🏖️','🌻','🍂','🎃','🍁','🎄'][monthIdx]}</span>
                  <span className="text-white font-black text-xl tracking-tight drop-shadow leading-none">
                    {t.monthCollage.collageTitle} {t.months[selected.month - 1]} {selected.year}
                  </span>
                  <span className="text-2xl leading-none" style={{ lineHeight: 1 }}>{['🥂','💖','🌸','🌷','🌟','☀️','🏖️','🌻','🍂','🎃','🍁','🎄'][monthIdx]}</span>
                </div>
              </motion.div>

              {/* Photos */}
              {collagePhotos.slice(0, visibleCount).map((photo, i) => {
                const slot = layout[i];
                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 600, scale: 0.3, rotate: getRotation(i) * 3 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: getRotation(i) }}
                    transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                    className="absolute z-10"
                    style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, transform: `translate(-50%, -50%) rotate(${getRotation(i)}deg)` }}
                  >
                    <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                      <div style={{ paddingTop: '85%', position: 'relative' }}>
                        <img src={photo.base64} alt={photo.name} className="absolute inset-0 w-full h-full object-cover" />
                        {photo.isNewMember && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-400/90 to-transparent px-2 py-1">
                            <p className="text-black text-[9px] font-black text-center">👋 {photo.memberName}</p>
                          </div>
                        )}
                      </div>
                      <div className="h-4">
                        {photo.caption && <p className="text-black text-[10px] font-medium text-center px-2 truncate leading-4">{photo.caption}</p>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Counter */}
              <motion.div
                className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {t.monthCollage.counter(visibleCount, collagePhotos.length)}
              </motion.div>
            </div>
          )}

          {/* Placeholder */}
          {stage === 'idle' && selected && (
            <div className="text-center py-16 border border-dashed rounded-3xl" style={{ borderColor: 'var(--border-strong)' }}>
              <p className="text-5xl mb-3">🎬</p>
              <p style={{ color: 'var(--text-secondary)' }}>
                {t.monthCollage.photoCount(collagePhotos.length, `${t.months[selected.month - 1]} ${selected.year}`)}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t.monthCollage.readyHint}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
