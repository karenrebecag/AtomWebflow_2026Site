# Changelog — ATOMwebflowSite

Formato: [Conventional Commits](https://www.conventionalcommits.org)
CDN: `https://cdn.jsdelivr.net/gh/karenrebecag/AtomWebflow_2026Site@{VERSION}/src/`

---

## [Unreleased]

---

## [v1.12.0] — 2026-06-05

### Changed — responsive <tablet / >tablet
- **mega-nav.css** — `<tablet` (≤991): nav casi sin padding vertical (`.mega-nav__container` 0.25em)
- **home.css** — `<tablet`: el hero (`section_banner`) gana `padding-top` para despejar el nav fixed
- **utilities.css** — `>tablet` (≥992): `u-section` con padding extra (clamp 6→8rem) para mas aire en desktop

### Added — src/css/base/utilities.css
- Utilities de justificacion/alineacion de elementos (para contenedores flex/grid):
  - `u-justify-start/center/end/between` (eje principal)
  - `u-items-start/center/end` (eje cruzado)
  - `u-mx-auto` / `u-ml-auto` / `u-mr-auto` (centrar o empujar un elemento)

---

## [v1.11.1] — 2026-06-05

### Fixed — src/css/components/logo-wall-cycle.css
- Celda vacia en tablet: la regla base `nth-child(n+6)` ocultaba el item 6 en todos los
  viewports y tablet nunca lo re-mostraba (quedaban 5 en grid de 3 → hueco). Tablet ahora
  re-muestra el item 6 explicitamente (6 = 3x2 lleno)
- Spacing reducido: gaps mas chicos (desktop 24px, tablet 16px, mobile 12px), menos padding
  de seccion y margen del header en mobile

---

## [v1.11.0] — 2026-06-05

### Fixed — src/css/components/logo-wall-cycle.css
- Logo wall reescrito: grid parejo (5/3/2 cols) en vez del flex-wrap que dejaba filas desparejas (5+3)
- Slot con altura fija + overflow hidden (clipea el slide del cycle); reemplaza el aspect-ratio 66%x40% que hacia logos diminutos
- Imagen con `object-fit: contain` + `grayscale` + altura uniforme; elimina el `width: 56px` fijo que rompia el scaling
- Cantidad visible alineada a filas completas por breakpoint

---

## [v1.10.0] — 2026-06-05

### Fixed — escala tipografica responsive (tablet/mobile)
- Multiplicadores de heading como variables `--scale-h1..h6`, reducidos por breakpoint
  (desktop ×3.815 → tablet ×2.6 → mobile ×2.0 en h1) para que no queden gigantes
- `--size-container-max` por breakpoint = su `ideal` (834/550/390): elimina la inflacion
  de la base dentro de cada band (antes mobile-landscape llegaba a ~22px base → h1 ~85px)
- Resultado: escala coherente y continua entre viewports (h1 ~51px desktop → ~32px mobile)

### Changed — navbar full-width
- **mega-nav.css** — `.mega-nav` a `top/left/right: 0` y `.mega-nav__bar` sin `border-radius`
  ni `max-width`: barra full-width pegada al top (quita el look "flotante" de pill centrado)
- Hide-on-scroll ajustado a `translateY(-100%)` (sin el offset -2em del pill)

### Added — sistema de espaciado y primitivas de layout
- **tokens.css** — tokens semanticos sobre la escala `--space-*` (acoplamiento parcial, no atado a `--size-font`):
  - `--section-space` (clamp 48→96px), `--stack-gap-tight/-/-loose`, `--measure` (60ch)
- **utilities.css** — primitivas de layout:
  - `u-section` (ritmo vertical de seccion)
  - `u-container-narrow` (~880px para bloques de texto)
  - `u-stack` / `u-stack-tight` / `u-stack-loose` (flujo vertical con gap consistente)
  - `u-measure` (ancho de lectura ~60ch)

---

## [v1.9.0] — 2026-06-05

### Added — src/css/base/utilities.css
- Utilities de alineacion: `u-text-left`, `u-text-center`, `u-text-right`
  - Aplicar como combo (ej: `nw-h3 u-text-left`); no tocan las clases base

---

## [v1.8.2] — 2026-06-05

### Changed — src/css/base/tokens.css
- `--size-container-max` 1440px → 1200px: la escala se congela mas pronto.
  Tope en monitores grandes: base ~13.3px, h1 ~51px, h2 ~41px

---

## [v1.8.1] — 2026-06-05

### Changed — src/css/base/tokens.css
- `--size-container-max` 1920px → 1440px: la escala tipografica se congela en el tamano
  del diseno (1440) y deja de crecer en monitores grandes. Antes el h1 llegaba a ~81px
  en pantallas anchas (se sentia excesivo); ahora tope ~61px

---

## [v1.8.0] — 2026-06-05

### Added — src/css/base/utilities.css
- Theming por seccion via atributo `data-theme="dark"` / `data-theme="light"`
  - Redefine los tokens `--color-text-heading/-body/-muted` en el subarbol
  - Toda la tipografia `.nw` se adapta automaticamente (usa los tokens via var())
  - Foregrounds claros en dark: heading #FFF, body rgba(255,255,255,.92), muted rgba(255,255,255,.65)
  - Acentos (naranja de marca, gradiente, verde WhatsApp) se conservan

---

## [v1.7.0] — 2026-06-05

### Changed — escala tipografica (jerarquia)
- Nueva escala major-third (ratio 1.25) — pasos claramente distintos (61/49/39/31/25/20px @1440)
  vs la escala anterior plana (h4-h6 casi iguales: 22/18/16)
- Scaling por viewport: `--size-font` derivado de `--size-container` (clamp por breakpoint),
  scoped a `.nw` (no toca el body ni paginas legacy)
- Tamanos via `calc(var(--size-font) * ratio)` (no em) para evitar compounding por anidacion

### tokens.css
- Removidos `--step-h1/h2/h3` (clamp). Agregados `--size-unit/-container-ideal/-container-min/-max/-container/-font`
- Overrides de `--size-container-*` por breakpoint (991/767/479)

### typography.css
- `.nw` ahora define `font-size: var(--size-font)` como base de la escala
- h1-h6, p1-p3, label, caption recalculados con multiplicadores major-third

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
