import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Per-month gradient blob palettes
const PALETTES = [
  ['#1e40af','#7c3aed','#c2410c'],  // Jan  – blue/purple/ember
  ['#9f1239','#be185d','#7c3aed'],  // Feb  – rose/pink/violet
  ['#065f46','#0f766e','#15803d'],  // Mar  – spring greens
  ['#92400e','#15803d','#b45309'],  // Apr  – orange/green bloom
  ['#6b21a8','#9d174d','#1e3a8a'],  // May  – violet/fuchsia/indigo
  ['#0e7490','#0369a1','#047857'],  // Jun  – cyan/sky/teal
  ['#991b1b','#c2410c','#78350f'],  // Jul  – fire reds
  ['#065f46','#0f766e','#0369a1'],  // Aug  – deep teal/ocean
  ['#1e1b4b','#4c1d95','#1e3a8a'],  // Sep  – indigo nights
  ['#4c1d95','#78350f','#1c1917'],  // Oct  – Halloween
  ['#78350f','#9a3412','#44403c'],  // Nov  – cosy autumn
  ['#1e3a8a','#6b21a8','#92400e'],  // Dec  – festive deep
];

const STICKERS = ['🎉','🎊','✨','🌟','💫','⭐','🎈','🎀','💥','🌈','🎵','🎶','🦄','🍭','💎','🔥','🎯','🏆','🎪','🪄','🎠','🌸','💝','🎁'];
const SPARKLE_COLORS = ['#FFE600','#FF6B9D','#00D4FF','#7C3AED','#10B981','#F97316','#EC4899','#8B5CF6'];

function seeded(seed) {
  let s = seed + 7;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ── Animated gradient blobs ───────────────────────────────────────────────────
function GradientBlob({ color, r, cx, cy, dur, delay }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: r, height: r,
        left: `${cx}%`, top: `${cy}%`,
        transform: 'translate(-50%,-50%)',
        background: `radial-gradient(circle, ${color}cc 0%, ${color}44 45%, transparent 75%)`,
        filter: 'blur(32px)',
        mixBlendMode: 'screen',
      }}
      animate={{
        scale:   [1, 1.45, 0.85, 1.3, 1],
        opacity: [0.55, 0.9, 0.4, 0.8, 0.55],
        x: [0, r * 0.12, -r * 0.08, r * 0.06, 0],
        y: [0, -r * 0.08, r * 0.12, -r * 0.05, 0],
      }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function CollageBackground({ active, month }) {
  const rand = useMemo(() => seeded((month || 1) * 137), [month]);
  const palette = PALETTES[(month - 1) % 12];

  const blobs = useMemo(() => [
    { color: palette[0], r: 320, cx: 15,  cy: 20,  dur: 9,   delay: 0   },
    { color: palette[1], r: 260, cx: 75,  cy: 30,  dur: 7.5, delay: 1.2 },
    { color: palette[2], r: 280, cx: 50,  cy: 75,  dur: 11,  delay: 0.5 },
    { color: palette[0], r: 200, cx: 85,  cy: 75,  dur: 8,   delay: 2   },
    { color: palette[1], r: 240, cx: 20,  cy: 70,  dur: 10,  delay: 1.8 },
    { color: palette[2], r: 180, cx: 55,  cy: 15,  dur: 6.5, delay: 0.8 },
  ], [month]);

  const stickers = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: STICKERS[i % STICKERS.length],
    left:     10 + rand() * 80,
    top:      25 + rand() * 60,
    size:     16 + rand() * 26,
    dur:      3.5 + rand() * 5,
    delay:    rand() * 3,
    driftX:   (rand() - 0.5) * 20,
    driftY:   -(8 + rand() * 18),
    rotate:   (rand() - 0.5) * 28,
  })), [month]);

  const sparkles = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    left: 2 + rand() * 96, top: 2 + rand() * 96,
    size: 3 + rand() * 5,
    dur: 1.2 + rand() * 2, delay: rand() * 2.5,
  })), [month]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, overflow: 'hidden' }}>

      {/* ── Animated gradient blobs ── */}
      {blobs.map((b, i) => <GradientBlob key={i} {...b} />)}

      {/* ── Dark base so photos stay readable ── */}
      <div className="absolute inset-0 bg-black/20" />

      {/* ── Moving shimmer lines ── */}
      <motion.div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white, white 1px, transparent 1px, transparent 60px)',
        }}
        animate={{ backgroundPosition: ['0px 0px', '120px 120px'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Twinkling sparkle dots ── */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          className="absolute rounded-full"
          style={{
            left: `${sp.left}%`, top: `${sp.top}%`,
            width: sp.size, height: sp.size,
            backgroundColor: sp.color,
            boxShadow: `0 0 ${sp.size * 3}px ${sp.color}`,
          }}
          animate={{ opacity: [0, 1, 0.2, 1, 0], scale: [0.4, 1.4, 0.7, 1.2, 0.4] }}
          transition={{ duration: sp.dur, delay: sp.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Floating emoji stickers ── */}
      {stickers.map((s) => (
        <motion.div
          key={s.id}
          className="absolute select-none"
          style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size, zIndex: 3 }}
          animate={{
            y: [0, s.driftY, s.driftY * 0.55, s.driftY * 1.1, 0],
            x: [0, s.driftX, s.driftX * 0.35, s.driftX * 0.75, 0],
            rotate: [0, s.rotate, -s.rotate * 0.5, s.rotate * 0.7, 0],
            scale: [1, 1.18, 0.92, 1.12, 1],
            opacity: [0.75, 1, 0.8, 1, 0.75],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {s.emoji}
        </motion.div>
      ))}

      {/* ── Corner bursts ── */}
      {[
        { top: '3%',  left:  '3%'  },
        { top: '3%',  right: '3%'  },
        { bottom: '3%', left: '3%' },
        { bottom: '3%', right: '3%'},
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl"
          style={pos}
          animate={{ rotate: [0, 22, -14, 10, 0], scale: [1, 1.35, 0.9, 1.2, 1] }}
          transition={{ duration: 3.5 + i * 0.6, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          🎆
        </motion.div>
      ))}
    </div>
  );
}
