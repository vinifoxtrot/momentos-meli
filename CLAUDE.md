# 02 - Momentos Meli

## O que é
App React para o time do Mercado Libre criar colagens de fotos mensais e retrospectivas anuais. As fotos ficam salvas localmente no IndexedDB do browser.

## Tecnologias
- React 19 + Vite 8
- Tailwind CSS 3
- Framer Motion (animações)
- html2canvas (exportar PNG)
- Lucide React (ícones)
- IndexedDB (persistência local)

## Como rodar
```bash
npm run dev    # http://localhost:5173
npm run build  # gera /dist
```

## Estrutura principal
```
src/
  App.jsx                   → Roteador principal (gallery / month / year)
  components/
    Header.jsx              → Navegação sticky
    Gallery.jsx             → Grid de fotos com busca e agrupamento mensal
    UploadZone.jsx          → Upload drag-and-drop
    PhotoCard.jsx           → Card com editar/deletar
    MonthCollage.jsx        → Colagem estilo polaroid animada (por mês)
    YearCollage.jsx         → Retrospectiva anual com reveals mês a mês
    Confetti.jsx            → Efeito de celebração
    Lightbox.jsx            → Visualizador fullscreen
    WelcomeMember.jsx       → Tela de boas-vindas
    Toast.jsx               → Notificações
  utils/
    db.js                   → Wrapper do IndexedDB
    helpers.js              → Agrupamento, layout, rotações
    i18n.js                 → Internacionalização
  context/
    LanguageContext.jsx     → Provider de idioma
  hooks/
    useCollageSong.js       → Música na colagem
```

## Funcionalidades implementadas
- Upload drag-and-drop de fotos
- Galeria organizada por mês com busca/filtro
- Edição de legenda inline
- Deleção com confirmação
- Colagem mensal animada (polaroids com rotação)
- Retrospectiva anual mês a mês com confetti
- Exportar colagem como PNG
- Dados persistem no IndexedDB (sobrevive ao refresh)
- Suporte a internacionalização (i18n)

## Design
- Tema escuro: background `#0d0d1a`
- Componentes com Tailwind
- Animações via Framer Motion

## Status
Completo e funcional. Build disponível em `/dist`.

## Backlog (ideias futuras do contexto.md)
- Exportar como GIF
- Exportar como vídeo
- Filtros de cor nas fotos
- Temas customizados

## Progresso das sessões
<!-- Atualize aqui ao final de cada sessão -->
