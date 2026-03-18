import { useRef, useCallback } from 'react';

// semitones relative to C4 (261.63 Hz) → frequency
function hz(s) { return 261.63 * Math.pow(2, s / 12); }

// [semitone, duration_in_eighths]  |  semitone=null → rest
const SONGS = [
  // ── Jan: triumphant C major, BPM 135 ──────────────────────────────────────
  { bpm: 135,
    mel: [[12,1],[16,1],[19,2],[21,1],[19,1],[16,1],[12,1],[9,2],
          [7,1],[9,1],[12,1],[16,1],[19,2],[16,2],[12,4],
          [21,2],[19,1],[16,1],[12,1],[9,1],[7,2],[12,4]],
    bas: [[-12,4],[-5,4],[-3,4],[-5,4],[-12,4],[-8,4],[-5,4],[-12,4]] },

  // ── Feb: romantic A-minor, BPM 88 ─────────────────────────────────────────
  { bpm: 88,
    mel: [[9,3],[12,1],[9,2],[7,2],[5,2],[4,2],[5,4],
          [7,3],[9,1],[12,2],[11,2],[9,4],
          [7,2],[5,2],[4,2],[2,2],[0,8]],
    bas: [[-3,4],[-8,4],[-5,4],[-8,4],[-3,4],[-10,4],[-8,4],[-3,8]] },

  // ── Mar: springy G major, BPM 128 ─────────────────────────────────────────
  { bpm: 128,
    mel: [[7,1],[9,1],[11,1],[12,1],[14,1],[11,1],[9,1],[7,2],
          [12,1],[14,1],[16,1],[14,1],[12,1],[11,1],[9,2],
          [14,1],[16,1],[19,1],[16,1],[14,1],[12,1],[9,1],[7,4]],
    bas: [[-5,4],[-1,4],[2,4],[-1,4],[-5,4],[-8,4],[-1,4],[-5,4]] },

  // ── Apr: playful D major, BPM 122 ─────────────────────────────────────────
  { bpm: 122,
    mel: [[2,1],[4,1],[6,1],[9,1],[14,2],[11,1],[9,1],
          [11,1],[9,1],[6,1],[4,2],[2,2],
          [14,1],[16,1],[18,1],[16,1],[14,1],[11,1],[9,2],[6,4]],
    bas: [[-10,4],[-3,4],[2,4],[-3,4],[-10,4],[-7,4],[-3,4],[-10,4]] },

  // ── May: dancing E major, BPM 132 ─────────────────────────────────────────
  { bpm: 132,
    mel: [[4,1],[6,1],[8,1],[11,1],[16,2],[13,1],[11,1],
          [13,1],[11,1],[8,1],[6,1],[4,2],[null,2],
          [16,1],[18,1],[21,2],[18,1],[16,1],[13,1],[11,1],[8,4]],
    bas: [[-8,4],[-1,4],[4,4],[-1,4],[-8,4],[-4,4],[-1,4],[-8,4]] },

  // ── Jun: groovy F major, BPM 125 ──────────────────────────────────────────
  { bpm: 125,
    mel: [[5,2],[9,1],[12,1],[17,2],[16,1],[14,1],
          [12,1],[9,1],[5,1],[4,1],[5,2],[null,2],
          [17,1],[16,1],[14,1],[12,1],[9,2],[5,2],[12,4]],
    bas: [[-7,4],[-2,4],[5,4],[-2,4],[-7,4],[-5,4],[-2,4],[-7,4]] },

  // ── Jul: tropical Bb major, BPM 138 ───────────────────────────────────────
  { bpm: 138,
    mel: [[10,1],[13,1],[15,1],[17,1],[22,2],[20,1],[17,1],
          [15,1],[13,1],[10,1],[8,1],[10,2],[null,1],[10,1],
          [22,1],[20,1],[17,1],[15,1],[13,1],[10,1],[8,2],[10,4]],
    bas: [[-2,4],[3,4],[5,4],[3,4],[-2,4],[-5,4],[3,4],[-2,4]] },

  // ── Aug: warm A major, BPM 108 ────────────────────────────────────────────
  { bpm: 108,
    mel: [[9,2],[13,1],[16,1],[21,2],[18,1],[16,1],
          [13,2],[11,1],[9,1],[6,4],
          [16,2],[18,1],[21,1],[23,2],[21,1],[18,1],[16,4]],
    bas: [[-3,4],[2,4],[4,4],[2,4],[-3,4],[-6,4],[2,4],[-3,4]] },

  // ── Sep: transitional D-minor, BPM 118 ────────────────────────────────────
  { bpm: 118,
    mel: [[2,2],[5,1],[9,1],[14,2],[12,1],[9,1],
          [5,2],[4,2],[2,4],
          [9,1],[12,1],[14,1],[17,1],[14,2],[12,1],[9,1],[5,2],[2,4]],
    bas: [[-10,4],[-5,4],[-3,4],[-5,4],[-10,4],[-8,4],[-5,4],[-10,4]] },

  // ── Oct: spooky D-minor, BPM 112 ──────────────────────────────────────────
  { bpm: 112,
    mel: [[2,1],[null,1],[5,1],[null,1],[2,2],[9,2],
          [8,1],[null,1],[5,1],[null,1],[5,3],[null,1],
          [14,2],[12,1],[9,1],[8,1],[5,1],[2,2],[0,4],
          [null,2],[5,1],[8,1],[9,2],[5,2],[2,4]],
    bas: [[-10,4],[-5,4],[-3,4],[-5,4],[-10,4],[-12,4],[-8,4],[-10,4]] },

  // ── Nov: cozy F major, BPM 100 ────────────────────────────────────────────
  { bpm: 100,
    mel: [[5,3],[9,1],[12,2],[9,2],[5,4],
          [12,2],[14,1],[17,1],[14,2],[12,2],[9,4],
          [17,2],[16,1],[14,1],[12,2],[9,2],[5,8]],
    bas: [[-7,4],[-2,4],[5,4],[-2,4],[-7,4],[-5,4],[-2,4],[-7,4]] },

  // ── Dec: festive C major, BPM 140 ─────────────────────────────────────────
  { bpm: 140,
    mel: [[12,1],[12,1],[19,2],[19,1],[21,1],[19,2],
          [17,1],[16,1],[14,1],[12,2],[null,2],
          [14,1],[14,1],[12,1],[9,1],[12,2],[7,2],
          [19,1],[19,1],[16,1],[12,1],[14,2],[12,4]],
    bas: [[-12,4],[-5,4],[-3,4],[-5,4],[-12,4],[-8,4],[-5,4],[-12,4]] },
];

// ─── Audio helpers ────────────────────────────────────────────────────────────

function createReverb(ctx) {
  const c = ctx.createConvolver();
  const buf = ctx.createBuffer(2, ctx.sampleRate * 1.2, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
  }
  c.buffer = buf;
  return c;
}

function playNote(ctx, freq, t0, dur, dst, type = 'triangle') {
  if (!freq) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(1, t0 + 0.02);
  env.gain.setValueAtTime(1, t0 + dur - 0.06);
  env.gain.linearRampToValueAtTime(0, t0 + dur);
  osc.connect(env); env.connect(dst);
  osc.start(t0); osc.stop(t0 + dur + 0.05);
}

function playKick(ctx, t0, dst) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(160, t0);
  o.frequency.exponentialRampToValueAtTime(40, t0 + 0.15);
  g.gain.setValueAtTime(0.9, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);
  o.connect(g); g.connect(dst);
  o.start(t0); o.stop(t0 + 0.25);
}

function playHat(ctx, t0, dst, vol = 0.07) {
  const len = Math.floor(ctx.sampleRate * 0.04);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filt = ctx.createBiquadFilter();
  filt.type = 'highpass'; filt.frequency.value = 8000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.04);
  src.connect(filt); filt.connect(g); g.connect(dst);
  src.start(t0);
}

function schedule(ctx, song, masterGain, t0) {
  const eighth = (60 / song.bpm) / 2;

  const melGain = ctx.createGain(); melGain.gain.value = 0.32;
  const basGain = ctx.createGain(); basGain.gain.value = 0.22;
  const drGain  = ctx.createGain(); drGain.gain.value  = 0.55;

  const rev = createReverb(ctx);
  const revGain = ctx.createGain(); revGain.gain.value = 0.14;
  melGain.connect(rev); rev.connect(revGain);
  revGain.connect(masterGain);
  melGain.connect(masterGain);
  basGain.connect(masterGain);
  drGain.connect(masterGain);

  // melody
  let t = t0;
  for (const [s, d] of song.mel) {
    playNote(ctx, s !== null ? hz(s) : null, t, d * eighth - 0.02, melGain, 'triangle');
    t += d * eighth;
  }
  const len = t - t0;

  // bass
  t = t0;
  for (const [s, d] of song.bas) {
    playNote(ctx, hz(s), t, d * eighth - 0.04, basGain, 'sine');
    t += d * eighth;
  }

  // drums
  const beats = Math.ceil(len / (eighth * 2));
  for (let b = 0; b < beats; b++) {
    const bt = t0 + b * eighth * 2;
    if (b % 4 === 0 || b % 4 === 2) playKick(ctx, bt, drGain);
    playHat(ctx, bt, drGain);
    playHat(ctx, bt + eighth, drGain, 0.04);
  }

  return len;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCollageSong() {
  const ctxRef    = useRef(null);
  const masterRef = useRef(null);
  const loopTimer = useRef(null);
  const alive     = useRef(false);

  const play = useCallback((month = 1) => {
    if (alive.current) return;
    alive.current = true;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 4;
    comp.connect(ctx.destination);

    const master = ctx.createGain();
    master.gain.value = 0.72;
    master.connect(comp);
    masterRef.current = master;

    const song = SONGS[(month - 1) % 12];

    function loop(start) {
      if (!alive.current) return;
      const len = schedule(ctx, song, master, start);
      loopTimer.current = setTimeout(() => loop(start + len), (len - 0.4) * 1000);
    }
    loop(ctx.currentTime + 0.1);
  }, []);

  const stop = useCallback(() => {
    alive.current = false;
    clearTimeout(loopTimer.current);
    ctxRef.current?.close();
    ctxRef.current = null;
  }, []);

  const setVolume = useCallback((v) => {
    if (masterRef.current) masterRef.current.gain.value = v;
  }, []);

  return { play, stop, setVolume };
}
