import { useState } from 'react';
import { deletePhoto, updatePhoto } from '../utils/db';
import { getRotation } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

export default function PhotoCard({ photo, index, onRefresh, onOpen }) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(photo.caption || '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingMember, setEditingMember] = useState(false);
  const [memberName, setMemberName] = useState(photo.memberName || '');
  const rotation = getRotation(index);

  async function saveCaption() {
    await updatePhoto({ ...photo, caption });
    setEditing(false);
    onRefresh();
  }

  async function toggleNewMember() {
    if (photo.isNewMember) {
      await updatePhoto({ ...photo, isNewMember: false, memberName: '' });
      onRefresh();
    } else {
      setEditingMember(true);
    }
  }

  async function saveMember() {
    await updatePhoto({ ...photo, isNewMember: true, memberName });
    setEditingMember(false);
    onRefresh();
  }

  async function handleDelete() {
    await deletePhoto(photo.id);
    onRefresh();
  }

  return (
    <div
      onClick={() => { if (!editing && !editingMember && !confirmDelete && onOpen) onOpen(); }}
      className="photo-card group relative bg-white rounded-xl shadow-lg cursor-pointer"
      style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.04)'; e.currentTarget.style.boxShadow = '0 20px 40px var(--shadow)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${rotation}deg)`; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Tape strips */}
      <div className="absolute -top-2 left-2 w-7 h-3.5 bg-yellow-100/75 rounded-sm z-20 shadow-sm" style={{ transform: 'rotate(-6deg)', backdropFilter: 'blur(2px)' }} />
      <div className="absolute -top-2 right-2 w-7 h-3.5 bg-yellow-100/75 rounded-sm z-20 shadow-sm" style={{ transform: 'rotate(6deg)', backdropFilter: 'blur(2px)' }} />
      {/* New member badge */}
      {photo.isNewMember && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-[9px] font-black text-center py-0.5 rounded-t-xl tracking-wider">
          👋 {photo.memberName || t.welcome.badge}
        </div>
      )}

      {/* Photo */}
      <div className={`aspect-square overflow-hidden ${photo.isNewMember ? 'rounded-none' : 'rounded-t-xl'}`}>
        <img
          src={photo.base64}
          alt={photo.caption || t.photoCard.photoAlt(t.months[photo.month - 1], photo.year)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Polaroid bottom */}
      <div className="bg-white px-3 py-2 overflow-hidden rounded-b-xl">
        {editing ? (
          <div className="flex gap-1 w-full" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveCaption(); if (e.key === 'Escape') setEditing(false); }}
              className="min-w-0 flex-1 text-xs text-black border border-gray-300 rounded px-1 py-0.5 outline-none"
              placeholder={t.photoCard.captionPlaceholder}
            />
            <button onClick={saveCaption} className="shrink-0 text-green-600 text-xs font-bold w-5 text-center">✓</button>
            <button onClick={() => setEditing(false)} className="shrink-0 text-gray-400 text-xs font-bold w-5 text-center">✕</button>
          </div>
        ) : editingMember ? (
          <div className="flex gap-1 w-full" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveMember(); if (e.key === 'Escape') setEditingMember(false); }}
              className="min-w-0 flex-1 text-xs text-black border border-yellow-400 rounded px-1 py-0.5 outline-none"
              placeholder={t.welcome.namePlaceholder}
            />
            <button onClick={saveMember} className="shrink-0 text-green-600 text-xs font-bold w-5 text-center">✓</button>
            <button onClick={() => setEditingMember(false)} className="shrink-0 text-gray-400 text-xs font-bold w-5 text-center">✕</button>
          </div>
        ) : (
          <p
            onClick={() => setEditing(true)}
            className="text-xs text-gray-500 truncate min-h-[16px] cursor-text hover:text-gray-800 transition-colors"
          >
            {photo.caption || <span className="text-gray-300 italic">{t.photoCard.captionPlaceholder}</span>}
          </p>
        )}
      </div>

      {/* Hover overlay: delete + new member toggle */}
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 items-end">
        {/* Delete */}
        {confirmDelete ? (
          <div className="flex gap-1 bg-black/80 rounded-lg px-2 py-1">
            <button onClick={(e) => { e.stopPropagation(); handleDelete(); }} className="text-red-400 text-xs font-bold hover:text-red-300">{t.photoCard.delete}</button>
            <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }} className="text-white/50 text-xs hover:text-white/80">✕</button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
            aria-label={t.photoCard.delete}
            className="bg-black/70 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
          >✕</button>
        )}

        {/* New member toggle */}
        <div className="relative group/tip">
          <button
            onClick={(e) => { e.stopPropagation(); toggleNewMember(); }}
            className={`rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors
              ${photo.isNewMember
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
                : 'bg-black/70 hover:bg-yellow-500 text-white'}`}
          >
            👋
          </button>
          <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 whitespace-nowrap">
            <span className="bg-black/90 text-white text-[10px] font-semibold px-2 py-1 rounded-lg">
              {photo.isNewMember ? t.welcome.unmark : t.welcome.markAs}
            </span>
            <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/90" />
          </div>
        </div>
      </div>
    </div>
  );
}
