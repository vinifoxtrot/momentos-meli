import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import { useLanguage } from '../context/LanguageContext';

export default function WelcomeMember({ photo, onDone }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState('intro'); // intro → spotlight → photo → text → done
  const [showConfetti, setShowConfetti] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const msg = useMemo(
    () => t.welcome.messages[Math.floor(Math.random() * t.welcome.messages.length)],
    [t]
  );

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('spotlight'), 400),
      setTimeout(() => setPhase('photo'),     1100),
      setTimeout(() => setPhase('text'),       2200),
      setTimeout(() => { setShowConfetti(true); setShowButton(true); }, 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // H3 - Controle do Usuário: permitir fechar com ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onDone();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden" role="dialog" aria-modal="true" aria-label={t.welcome.title}>
      <Confetti active={showConfetti} />

      {/* H3: Botão para pular/fechar a apresentação */}
      <button
        onClick={onDone}
        aria-label={t.welcome.close}
        className="absolute top-5 right-5 z-20 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
      >
        {t.welcome.close} ✕
      </button>

      {/* Dark backdrop */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.88 }}
        transition={{ duration: 0.5 }}
      />

      {/* Spotlight glow */}
      <AnimatePresence>
        {phase !== 'intro' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'radial-gradient(ellipse 55% 55% at 50% 48%, rgba(255,230,0,0.18) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Pulsing ring behind photo */}
      <AnimatePresence>
        {phase === 'photo' || phase === 'text' ? (
          <motion.div
            className="absolute rounded-full border-4 border-[#FFE600]/40"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 340, height: 340, opacity: [0, 0.6, 0.3, 0.5, 0.3] }}
            transition={{ duration: 0.8, opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
            style={{ left: '50%', top: '42%', transform: 'translate(-50%,-50%)' }}
          />
        ) : null}
      </AnimatePresence>

      {/* Floating emojis around the photo */}
      <AnimatePresence>
        {(phase === 'text') && ['🎉','⭐','✨','🎊','💫','🌟','🎈'].map((emoji, i) => {
          const angle = (i / 7) * Math.PI * 2;
          const r = 180;
          return (
            <motion.div
              key={i}
              className="absolute text-2xl pointer-events-none"
              aria-hidden="true"
              style={{ left: '50%', top: '42%' }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.7, 1, 0.8],
                x: Math.cos(angle) * r,
                y: Math.sin(angle) * r,
                scale: [0, 1.3, 0.9, 1.1, 1],
                rotate: [0, 20, -10, 15, 0],
              }}
              transition={{ duration: 0.7, delay: i * 0.08, repeat: Infinity, repeatDelay: 2, ease: 'backOut' }}
            >
              {emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center" style={{ marginTop: '-40px' }}>

        {/* Photo */}
        <AnimatePresence>
          {phase !== 'intro' && (
            <motion.div
              initial={{ y: 120, scale: 0.4, opacity: 0, rotate: -8 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
            >
              {/* Glow ring */}
              <div className="relative">
                <motion.div
                  className="absolute -inset-3 rounded-full"
                  animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background: 'conic-gradient(from 0deg, #FFE600, #FF6B9D, #00D4FF, #7C3AED, #FFE600)', filter: 'blur(8px)' }}
                />
                <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img src={photo.base64} alt={photo.memberName} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text */}
        <AnimatePresence>
          {phase === 'text' && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-[#FFE600] font-black text-4xl tracking-tight drop-shadow-[0_0_20px_rgba(255,230,0,0.6)]"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {t.welcome.hey} {photo.memberName || t.welcome.defaultName}!
              </motion.p>
              <p className="text-white font-bold text-xl">{t.welcome.title}</p>
              <p className="text-white/60 text-base">{msg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA button */}
        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={onDone}
              className="bg-[#FFE600] hover:bg-yellow-300 text-black font-black px-8 py-3 rounded-2xl text-lg shadow-lg shadow-yellow-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {t.welcome.button}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
