# Changelog — ATOMwebflowSite

Formato: [Conventional Commits](https://www.conventionalcommits.org)
CDN: `https://cdn.jsdelivr.net/gh/karenrebecag/AtomWebflow_2026Site@{VERSION}/src/`

---

## [Unreleased]

### Added
- `src/css/base/tokens.css` — design tokens ATOM DS (colores, tipo, espaciado, z-index)
- `src/css/base/reset.css` — reset minimo sin colisionar con Webflow
- `src/css/base/utilities.css` — helpers Client-First (u-container, u-truncate, u-brand)
- `src/css/sections/nav.css` — estilos nav fijo con estado is-scrolled
- `src/css/sections/hero.css` — hero full-height dark
- `src/css/sections/cards.css` — card con hover, tag, media
- `src/css/sections/footer.css` — footer 2-columnas con nav grid
- `src/css/pages/home.css` — overrides especificos de home
- `src/css/site.css` — entry point con @import tree
- `src/js/site.js` — loader condicional por data-module / data-page
- `src/js/modules/nav.js` — scroll state + hamburguesa mobile accesible
- `src/js/modules/animations.js` — GSAP fade-up / fade-in on load
- `src/js/modules/scroll-animations.js` — GSAP ScrollTrigger: reveal, reveal-group, parallax
- `src/js/modules/faq.js` — accordion FAQ accesible (aria-expanded, una sola apertura)
- `src/js/pages/home.js` — counter animado con IntersectionObserver

---

## [0.0.1] — 2026-06-01

### Added
- Setup inicial del proyecto
- 25 Webflow skills + 8 GSAP skills instaladas
- Webflow MCP configurado via `.mcp.json`
- Site ID confirmado: `6890d2a7153362eed21e1c49` (new.atomchat.io)
