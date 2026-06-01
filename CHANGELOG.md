# Changelog — ATOMwebflowSite

Formato: [Conventional Commits](https://www.conventionalcommits.org)
CDN: `https://cdn.jsdelivr.net/gh/karenrebecag/AtomWebflow_2026Site@{VERSION}/src/`

---

## [Unreleased]

---

## [v1.0.0] — 2026-06-01

### Added — Skills & Agente
- `ORCHESTRATOR.md` — decision tree como punto de entrada unico para el agente
- `atom-code-component-workflow/SKILL.md` — workflow end-to-end para Code Components React
- Skills registradas en `skills-lock.json` (34 total: 25 Webflow + 8 GSAP + 1 custom)

### Added — src/css/
- `base/tokens.css` — design tokens ATOM DS (#FF6600, #222020, Inter, espaciado, z-index)
- `base/reset.css` — reset minimo sin colisionar con Webflow
- `base/utilities.css` — helpers Client-First (u-container, u-truncate, u-brand)
- `sections/nav.css` — nav fijo con estado is-scrolled
- `sections/hero.css` — hero full-height dark
- `sections/cards.css` — card con hover, tag, media
- `sections/footer.css` — footer 2-columnas con nav grid
- `pages/home.css` — overrides especificos de home
- `site.css` — entry point con @import tree

### Added — src/js/
- `site.js` — loader condicional por data-module / data-page (zero JS si no hay data-module)
- `modules/nav.js` — scroll state + hamburguesa mobile accesible
- `modules/animations.js` — GSAP fade-up / fade-in on load
- `modules/scroll-animations.js` — GSAP ScrollTrigger: reveal, reveal-group, parallax
- `modules/faq.js` — accordion FAQ accesible (aria-expanded, una sola apertura)
- `pages/home.js` — counter animado con IntersectionObserver

### Fixed
- `skills-lock.json` — nombre de skill custom corregido de `atom:` a `atom-` (dash)
- `skills-lock.json` — hash recomputado por CLI tras `experimental_install`

---

## [0.0.1] — 2026-06-01

### Added
- Setup inicial del proyecto
- 33 skills instaladas (25 Webflow + 8 GSAP) via `npx skills add`
- Webflow MCP configurado via `.mcp.json` con token via env var
- Site ID confirmado: `6890d2a7153362eed21e1c49` (new.atomchat.io)
- Arquitectura definida: Webflow no-code + CSS/JS externo versionado via jsDelivr
