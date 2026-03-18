import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import mlLogo from '../assets/ml-logo.svg';

export default function Header({ view, onNav }) {
  const { lang, setLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = [
    { id: 'gallery', label: t.nav.gallery },
    { id: 'month',   label: t.nav.month },
    { id: 'year',    label: t.nav.year },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d1a]/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={mlLogo} alt="Mercado Livre" className="w-8 h-8" />
          <span className="font-black text-xl tracking-tight">
            <span className="text-white">Momentos</span>
            <span className="text-[#FFE600] logo-glow"> Meli</span>
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
                className={`
                  px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${view === n.id
                    ? 'bg-[#FFE600] text-black shadow-lg shadow-yellow-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/10'}
                `}
              >
                {n.label}
              </button>
            ))}
          </nav>

          {/* Language toggle */}
          <div className="flex items-center gap-1 ml-3 bg-white/10 rounded-xl p-1" role="radiogroup" aria-label="Idioma">
            <button
              onClick={() => setLang('pt-BR')}
              title="Português (Brasil)"
              aria-pressed={lang === 'pt-BR'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${lang === 'pt-BR' ? 'bg-[#FFE600] text-black' : 'text-white/50 hover:text-white'}`}
            >
              🇧🇷 PT
            </button>
            <button
              onClick={() => setLang('es')}
              title="Español"
              aria-pressed={lang === 'es'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${lang === 'es' ? 'bg-[#FFE600] text-black' : 'text-white/50 hover:text-white'}`}
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
          className="md:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu - Lei de Fitts: alvos maiores para toque */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d0d1a]/95 backdrop-blur px-4 pb-4 pt-2 space-y-2">
          <nav className="flex flex-col gap-1" aria-label="Navegação principal">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => { onNav(n.id); setMenuOpen(false); }}
                aria-current={view === n.id ? 'page' : undefined}
                className={`
                  w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  ${view === n.id
                    ? 'bg-[#FFE600] text-black shadow-lg shadow-yellow-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/10'}
                `}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 w-fit" role="radiogroup" aria-label="Idioma">
            <button
              onClick={() => setLang('pt-BR')}
              aria-pressed={lang === 'pt-BR'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200
                ${lang === 'pt-BR' ? 'bg-[#FFE600] text-black' : 'text-white/50 hover:text-white'}`}
            >
              🇧🇷 PT
            </button>
            <button
              onClick={() => setLang('es')}
              aria-pressed={lang === 'es'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200
                ${lang === 'es' ? 'bg-[#FFE600] text-black' : 'text-white/50 hover:text-white'}`}
            >
              🇪🇸 ES
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
