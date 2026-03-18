import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import mlLogo from '../assets/ml-logo.svg';

export default function Header({ view, onNav }) {
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = [
    { id: 'gallery', label: t.nav.gallery },
    { id: 'month',   label: t.nav.month },
    { id: 'year',    label: t.nav.year },
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur"
      style={{ background: 'var(--bg-header)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={mlLogo} alt="Mercado Livre" className="w-8 h-8" />
          <span className="font-black text-xl tracking-tight">
            <span style={{ color: 'var(--text-primary)' }}>Momentos</span>
            <span className="logo-glow" style={{ color: isDark ? '#FFE600' : '#c7a600' }}> Meli</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex gap-1" aria-label="Navegação principal">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => onNav(n.id)}
                aria-current={view === n.id ? 'page' : undefined}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  view === n.id
                    ? 'bg-[#FFE600] text-black shadow-lg'
                    : ''
                }`}
                style={view === n.id
                  ? { boxShadow: '0 4px 14px var(--accent-shadow)' }
                  : { color: 'var(--text-secondary)' }
                }
                onMouseEnter={(e) => { if (view !== n.id) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}}
                onMouseLeave={(e) => { if (view !== n.id) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}}
              >
                {n.label}
              </button>
            ))}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Modo claro' : 'Modo escuro'}
            className="ml-2 w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-200"
            style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Language toggle */}
          <div className="flex items-center gap-1 ml-1 rounded-xl p-1" style={{ background: 'var(--bg-hover)' }} role="radiogroup" aria-label="Idioma">
            <button
              onClick={() => setLang('pt-BR')}
              title="Português (Brasil)"
              aria-pressed={lang === 'pt-BR'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${lang === 'pt-BR' ? 'bg-[#FFE600] text-black' : ''}`}
              style={lang !== 'pt-BR' ? { color: 'var(--text-muted)' } : {}}
            >
              🇧🇷 PT
            </button>
            <button
              onClick={() => setLang('es')}
              title="Español"
              aria-pressed={lang === 'es'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${lang === 'es' ? 'bg-[#FFE600] text-black' : ''}`}
              style={lang !== 'es' ? { color: 'var(--text-muted)' } : {}}
            >
              🇪🇸 ES
            </button>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden backdrop-blur px-4 pb-4 pt-2 space-y-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-header)' }}>
          <nav className="flex flex-col gap-1" aria-label="Navegação principal">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => { onNav(n.id); setMenuOpen(false); }}
                aria-current={view === n.id ? 'page' : undefined}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  view === n.id ? 'bg-[#FFE600] text-black shadow-lg' : ''
                }`}
                style={view !== n.id ? { color: 'var(--text-secondary)' } : { boxShadow: '0 4px 14px var(--accent-shadow)' }}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Modo claro' : 'Modo escuro'}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-200"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: 'var(--bg-hover)' }} role="radiogroup" aria-label="Idioma">
              <button
                onClick={() => setLang('pt-BR')}
                aria-pressed={lang === 'pt-BR'}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200
                  ${lang === 'pt-BR' ? 'bg-[#FFE600] text-black' : ''}`}
                style={lang !== 'pt-BR' ? { color: 'var(--text-muted)' } : {}}
              >
                🇧🇷 PT
              </button>
              <button
                onClick={() => setLang('es')}
                aria-pressed={lang === 'es'}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200
                  ${lang === 'es' ? 'bg-[#FFE600] text-black' : ''}`}
                style={lang !== 'es' ? { color: 'var(--text-muted)' } : {}}
              >
                🇪🇸 ES
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
