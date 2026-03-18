export const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function formatMonthYear(month, year) {
  return `${MONTHS_PT[month - 1]} ${year}`;
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function groupByMonth(photos) {
  const groups = {};
  for (const p of photos) {
    const key = `${p.year}-${String(p.month).padStart(2, '0')}`;
    if (!groups[key]) groups[key] = { year: p.year, month: p.month, photos: [] };
    groups[key].photos.push(p);
  }
  return Object.values(groups).sort((a, b) =>
    b.year !== a.year ? b.year - a.year : b.month - a.month
  );
}

export function groupByYear(photos) {
  const groups = {};
  for (const p of photos) {
    if (!groups[p.year]) groups[p.year] = [];
    groups[p.year].push(p);
  }
  return Object.entries(groups)
    .map(([year, photos]) => ({ year: Number(year), photos }))
    .sort((a, b) => b.year - a.year);
}

// Returns a deterministic "fun" rotation for a photo slot
export function getRotation(index) {
  const rotations = [-6, 4, -3, 7, -5, 3, -8, 5, -2, 6, -4, 3];
  return rotations[index % rotations.length];
}

// Returns layout positions (percent) for N photos on the collage canvas
export function getCollageLayout(n) {
  const layouts = {
    1:  [{ x: 50, y: 50, w: 55, h: 55 }],
    2:  [{ x: 28, y: 50, w: 44, h: 50 }, { x: 72, y: 50, w: 44, h: 50 }],
    3:  [
          { x: 20, y: 50, w: 32, h: 44 },
          { x: 50, y: 50, w: 32, h: 44 },
          { x: 80, y: 50, w: 32, h: 44 },
        ],
    4:  [
          { x: 27, y: 30, w: 40, h: 44 }, { x: 73, y: 30, w: 40, h: 44 },
          { x: 27, y: 72, w: 40, h: 44 }, { x: 73, y: 72, w: 40, h: 44 },
        ],
    5:  [
          { x: 20, y: 28, w: 32, h: 40 }, { x: 52, y: 28, w: 32, h: 40 }, { x: 84, y: 28, w: 32, h: 40 },
          { x: 33, y: 72, w: 36, h: 42 }, { x: 70, y: 72, w: 36, h: 42 },
        ],
    6:  [
          { x: 20, y: 28, w: 30, h: 38 }, { x: 50, y: 28, w: 30, h: 38 }, { x: 80, y: 28, w: 30, h: 38 },
          { x: 20, y: 72, w: 30, h: 38 }, { x: 50, y: 72, w: 30, h: 38 }, { x: 80, y: 72, w: 30, h: 38 },
        ],
  };

  if (n <= 6) return layouts[n];

  // Generic grid for 7-12
  const cols = n <= 8 ? 4 : 4;
  const rows = Math.ceil(n / cols);
  const cellW = 80 / cols;
  const cellH = 70 / rows;
  return Array.from({ length: n }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: 10 + cellW * col + cellW / 2,
      y: 15 + cellH * row + cellH / 2,
      w: cellW * 0.85,
      h: cellH * 0.85,
    };
  });
}
