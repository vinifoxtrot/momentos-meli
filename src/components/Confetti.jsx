import { useEffect, useState } from 'react';

const COLORS = ['#FFE600', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98'];
const SHAPES = ['■', '●', '▲', '★', '♦'];

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) { setPieces([]); return; }

    const newPieces = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: 8 + Math.random() * 14,
      duration: 2.5 + Math.random() * 2.5,
      delay: Math.random() * 1.2,
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 6000);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            color: p.color,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.shape}
        </span>
      ))}
    </>
  );
}
