# Momentos Meli — Contexto do Projeto

## O que é
Webapp desktop para registrar fotos/prints do dia a dia do trabalho ao longo do mês,
com geração de colagens animadas para compartilhar com o time.

## Stack
- React + Vite
- Tailwind CSS v3
- Framer Motion (animações)
- html2canvas (exportar PNG)
- IndexedDB (armazenamento local das fotos, sem backend)

## Funcionalidades implementadas
- [x] Upload de fotos via drag-and-drop ou seleção de arquivos
- [x] Galeria organizada por mês com busca por legenda
- [x] Edição de legenda em cada foto (inline)
- [x] Exclusão de fotos com confirmação
- [x] Colagem do Mês: seletor de mês/ano → animação de fotos voando no lugar (estilo polaroid)
- [x] Retrospectiva do Ano: revela mês a mês com mini-colagem por mês + mensagem final
- [x] Confetti após cada colagem gerada
- [x] Download como PNG (html2canvas)
- [x] Fotos salvas localmente via IndexedDB (persistem entre sessões)

## Estrutura de arquivos
```
src/
  App.jsx                    → roteamento entre views (gallery/month/year)
  index.css                  → estilos globais + Tailwind
  main.jsx                   → entry point
  utils/
    db.js                    → wrapper IndexedDB (addPhoto, getAllPhotos, deletePhoto, updatePhoto)
    helpers.js               → utilitários (groupByMonth, groupByYear, layout, rotações)
  components/
    Header.jsx               → navegação sticky
    UploadZone.jsx           → drag-and-drop upload
    Gallery.jsx              → galeria com busca e grupos por mês
    PhotoCard.jsx            → card polaroid com edição de legenda e exclusão
    MonthCollage.jsx         → colagem animada do mês
    YearCollage.jsx          → retrospectiva animada do ano
    Confetti.jsx             → efeito de confete
```

## Rodar o projeto
```bash
cd "Desktop/Projetos Claude Code/02 - Momentos Meli"
npm run dev
```
Abre em: http://localhost:5173

## Próximas ideias / backlog
- [ ] Stickers/emojis sobrepostos nas fotos durante a colagem
- [ ] Exportar como GIF animado (gif.js já instalado)
- [ ] Exportar como vídeo MP4 (MediaRecorder API)
- [ ] Modo "surpresa" que revela uma foto por vez em tela cheia
- [ ] Filtros de cor nas fotos
- [ ] Temas/paletas personalizáveis para a colagem
- [ ] Compartilhamento por link (exigiria backend)
