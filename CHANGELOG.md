# Changelog — ATOMwebflowSite

Formato: [Conventional Commits](https://www.conventionalcommits.org)
CDN: `https://cdn.jsdelivr.net/gh/karenrebecag/AtomWebflow_2026Site@{VERSION}/src/`

---

## [Unreleased]

---

## [v1.6.1] — 2026-06-05

### Note — max-width de secciones
- El max-width compartido de las secciones (`banner_container`) se rompio al editar la clase
  en el Designer. Solucion: usar la utility existente `.u-container` (`max-width: var(--container-xl)`
  + centrado + padding responsive) aplicada manualmente a cada inner content.
  No se overridea la clase nativa de Webflow desde el repo (control explicito en el Designer).

---

## [v1.6.0] — 2026-06-05

### Added — src/css/base/tokens.css
- Sistema de elevaciones con tinte calido de marca (`#201d1d` = `--elevation-tint: 32 29 29`)
- Tokens `--elevation-1..4` (sombras apiladas multi-capa, baja opacidad) + `--elevation-hover`

### Added — src/css/base/utilities.css
- `u-elev-1..4` / `[data-elev="1..4"]` — aplica profundidad por clase o atributo
- `u-elev-hover` — lift al hover (translateY -2px + sombra reforzada), respeta `prefers-reduced-motion`
- Sobrescribe la box-shadow plana nativa de Webflow

---

## [v1.5.0] — 2026-06-05

### Added — src/css/base/utilities.css
- `u-glass` / `[data-glass]` — superficie "liquid glass" en una sola clase o atributo
  - Colapsa el multi-capa de Webflow en un elemento: `backdrop-filter` + fill translucido + stack de box-shadow inset (highlights, edges, inner-glow)
  - Tunable via `--glass-blur` y `--glass-tint`
  - Variantes: `u-glass-dark` / `[data-glass="dark"]` (ahumado), `[data-glass="soft|strong"]` (blur)
  - Fallback `@supports` para navegadores sin backdrop-filter (fill mas opaco)

---

## [v1.4.1] — 2026-06-05

### Changed — src/css/components/mega-nav.css
- Easing del hide-on-scroll alineado al patron panel-reveal de transitions.dev:
  mismo `cubic-bezier(0.22, 1, 0.36, 1)` en ambas direcciones, open 0.4s / close 0.35s
  (antes: ease-in asimetrico, se sentia abrupto). Tunable via `--nav-show-dur`/`--nav-hide-dur`/`--nav-ease`

### Fixed — src/css/components/mega-nav.css
- Removido `will-change: transform` del `.mega-nav`: creaba un containing block permanente
  que rompia el `position: fixed` de `.mega-nav__dropdown-wrapper` (mega-menus colapsados).
  El `transform` ahora solo existe en `.is-nav-hidden` (transitorio, sin dropdown abierto)

---

## [v1.4.0] — 2026-06-05

### Added — src/js/
- `modules/nav-scroll.js` — hide-on-scroll del nav: oculta en scroll-down, muestra en scroll-up y en top
  - Umbral anti-jitter (6px), `TOP_OFFSET` 80px para mostrar siempre cerca del top
  - Respeta `data-menu-open` de mega-nav: no oculta con panel/menu mobile abierto
  - `requestAnimationFrame` para throttle del scroll
  - Activacion via `autoDetect` en `.mega-nav` — sin atributos extra en Designer

### Changed — src/css/components/mega-nav.css
- `.mega-nav`: `transition: transform` + `will-change` para el hide-on-scroll
- `.mega-nav.is-nav-hidden`: `translateY(calc(-100% - 2em))` (compensa `top: 1.25em` del pill flotante)
- `prefers-reduced-motion`: desactiva la transicion

---

## [v1.3.0] — 2026-06-05

### Added — src/js/
- `modules/content-reveal.js` — scroll reveal con GSAP + ScrollTrigger via `[data-reveal-group]`
  - Soporte para grupos anidados (`data-reveal-group-nested`), stagger, distancia y start configurables
  - `waitForGSAP` para compatibilidad con Cloudflare Rocket Loader
  - Activacion via `autoDetect` en `site.js` — carga solo si `[data-reveal-group]` existe en el DOM

### Changed — src/css/base/tokens.css
- Fluid type scale: `--step-h1/h2/h3` con `clamp()` calculado para 390px→1440px
- `--line-height-normal` 1.5 → 1.7
- `--line-height-display: 1` agregado

### Changed — src/css/base/typography.css
- `h1`: fluid size, `letter-spacing: -0.04em`, `line-height: 1`, `text-wrap: balance`
- `h2`: fluid size, `letter-spacing: -0.03em`, `line-height: 1.05`, `text-wrap: balance`
- `h3`: fluid size, `letter-spacing: -0.02em`, `text-wrap: balance`
- Body: `line-height: 1.7`
- Stats (`.stats-strip_number-violet/orange`): `clamp(2.25→4rem)`, `font-weight: 800`, tracking `-0.035em`
- Eliminados media queries de font-size en h1/h2/h3 (clamp los reemplaza)

### Added — src/css/base/utilities.css
- `u-bg-dim` — overlay blanco 25% sobre el fondo del elemento (fondos ligeramente tintados)
- `u-bg-dim-2` — overlay blanco 42% (fondos con color visible: rosa, salmon)
- `u-bg-dim-3` — overlay blanco 60% (fondos muy saturados)
- Tecnica: `::before` con `z-index: -1` dentro de `isolation: isolate` — no afecta contenido

### Changed — src/css/pages/home.css
- Agregados overrides de layout para grids y social proof

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
