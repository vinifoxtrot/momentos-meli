import { useState, useRef } from 'react';
import Toast from './Toast';
import { addPhoto } from '../utils/db';
import { fileToBase64, generateId } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

export default function UploadZone({ onUploaded }) {
  const { t } = useLanguage();
  const now = new Date();
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [uploading, setUploading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const inputRef = useRef();

  const currentYear = now.getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  async function processFiles(files) {
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!images.length) return;

    setUploading(true);
    for (const file of images) {
      const base64 = await fileToBase64(file);
      await addPhoto({
        id: generateId(),
        base64,
        name: file.name,
        caption: '',
        date: new Date(selectedYear, selectedMonth - 1, 1).toISOString(),
        month: selectedMonth,
        year: selectedYear,
      });
    }
    setUploading(false);
    setToast({ visible: true, message: t.upload.toast(images.length) });
    onUploaded();
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      {/* Month/year selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <label htmlFor="upload-month" className="text-white/40 text-xs uppercase tracking-wider font-semibold">
            {t.upload.monthLabel}
          </label>
          <div className="relative">
            <select
              id="upload-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="appearance-none bg-white/10 border border-white/20 rounded-xl pl-4 pr-9 py-2 text-white text-sm outline-none focus:border-[#FFE600]/60 cursor-pointer"
            >
              {t.months.map((name, i) => (
                <option key={i + 1} value={i + 1}>{name}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">▾</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="upload-year" className="text-white/40 text-xs uppercase tracking-wider font-semibold">
            {t.upload.yearLabel}
          </label>
          <div className="relative">
            <select
              id="upload-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none bg-white/10 border border-white/20 rounded-xl pl-4 pr-9 py-2 text-white text-sm outline-none focus:border-[#FFE600]/60 cursor-pointer"
            >
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">▾</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-white/30 text-sm">
          <span>→</span>
          <span>
            {t.months[selectedMonth - 1]} {selectedYear}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-10
          flex flex-col items-center justify-center gap-3 transition-all duration-200
          ${dragging
            ? 'border-[#FFE600] bg-[#FFE600]/10 scale-[1.01]'
            : 'border-white/20 hover:border-white/40 hover:bg-white/5'}
        `}
        style={dragging ? {} : {
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,230,0,0.04) 0%, transparent 70%)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        {uploading ? (
          <>
            <div className="w-12 h-12 border-4 border-[#FFE600] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60 font-medium">{t.upload.uploading}</p>
          </>
        ) : (
          <>
            <div className={`transition-transform duration-200 ${dragging ? 'scale-125' : ''}`}>
              {dragging ? (
                <svg className="w-14 h-14 text-[#FFE600]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              ) : (
                <svg className="w-14 h-14 text-white/30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.043 11.095H6.75z" />
                </svg>
              )}
            </div>
            <div className="text-center">
              <p className={`font-bold text-lg ${dragging ? 'text-[#FFE600]' : 'text-white'}`}>{t.upload.title}</p>
              <p className="text-white/40 text-sm mt-1">{t.upload.subtitle}</p>
            </div>
          </>
        )}
      </div>
      <Toast message={toast.message} visible={toast.visible} onHide={() => setToast((t) => ({ ...t, visible: false }))} />
    </div>
  );
}
