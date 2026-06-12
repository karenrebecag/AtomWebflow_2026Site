# ATOMwebflowSite

Proyecto Webflow para el sitio principal de ATOM: **new.atomchat.io**

## Identidad del proyecto

| Campo | Valor |
|---|---|
| Sitio | new.atomchat.io |
| Webflow Site ID | `6890d2a7153362eed21e1c49` |
| Workspace | atomchat-staging |
| Dominios adicionales | ai-agents.atomchat.io |

## Arquitectura

**Modelo hibrido: Webflow no-code + codigo externo versionado**

- Webflow controla: estructura de paginas, CMS, SEO, semántica HTML, clases, publicación
- Este repositorio controla: CSS global, JS por feature, versionado con release tags
- Producción sirve archivos desde jsDelivr con version fija (nunca `@latest`)

```html
<!-- Ejemplo de carga en Head de Webflow -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ORG/REPO@v1.0.0/site.css">
<script type="module" src="https://cdn.jsdelivr.net/gh/ORG/REPO@v1.0.0/site.js"></script>
```

**Contrato de trabajo:**
- Marketing/Content: edita texto, CMS, páginas y hace publish desde Webflow
- Dev: mantiene CSS/JS base y patrones reutilizables en este repo
- Cambios de comportamiento o styling requieren PR en este repo, no edición directa en Webflow

## Configuración MCP

Webflow MCP activo via `.mcp.json`. Lee credenciales del `.env`:

```
WEBFLOW_API_TOKEN=<ver .env>
WEBFLOW_SITE_ID=6890d2a7153362eed21e1c49
```

### Conexion al Webflow Designer (herramientas de Designer)

Las herramientas Data API (cms, pages, sites, scripts) funcionan sin el Designer abierto.
Las herramientas Designer (de_component_tool, element_tool, style_tool, whtml_builder, etc.) requieren que el Designer este activo en el navegador con la app MCP conectada.

**Proceso obligatorio al inicio de cada sesion que use herramientas Designer:**

1. Intentar cualquier llamada con una herramienta Designer (por ejemplo `get_all_components`).
2. Si el Designer no esta conectado, la respuesta de error incluye una URL con este formato:
   ```
   https://atomchat-staging.design.webflow.com?app=<token>
   ```
3. Compartir esa URL con el usuario como markdown link para que la abra en el navegador.
4. Una vez que el usuario abra el link y el Designer este en primer plano, reintentar la llamada.

No intentar generar ni adivinar la URL manualmente — siempre se obtiene del mensaje de error de la primera llamada fallida. La URL cambia por sesion.

Para cargar el MCP, abrir Claude Code desde este directorio:
```bash
cd ~/Desktop/SoftwareDevProjects/ATOMwebflowSite && claude
```

## Carga en Webflow

Un solo tag en **Site Settings > Custom Code > Head Code** (global, no por pagina).
URL fija — nunca cambia entre deploys.

**Head Code:**
```html
<script data-cfasync="false" src="https://cdn.jsdelivr.net/gh/karenrebecag/AtomWebflow_2026Site@latest/loader.js"></script>
```

**Footer Code:** vacio. `loader.js` inyecta tanto el CSS como el JS apuntando al tag versionado correcto.

> **Por que `@latest` y no `@main`:** jsDelivr cachea la resolucion de refs mutables.
> Para un branch (`@main`) cachea `main -> commit` hasta 12h (`s-maxage=43200`) y el
> purge del archivo NO re-resuelve el ref — `@main` quedaba sirviendo una version
> vieja durante horas. `@latest` resuelve al **tag** SemVer mas alto; como el CI crea
> un tag nuevo en cada deploy y los tags son una señal mas fuerte, jsDelivr lo
> refresca mucho mejor. El CI ademas purga `@latest` con verificacion + reintentos.

### Deploy workflow

Solo se necesita `git push origin main`. El CI hace el resto automaticamente:

1. Calcula el siguiente tag patch (`vX.Y.Z → vX.Y.(Z+1)`)
2. Regenera `loader.js` con la nueva version
3. Commit + push del loader y el tag
4. Purga `loader.js` en `@latest` (y `@main`) y **verifica con reintentos** que
   jsDelivr ya sirva la version nueva; si no, deja un warning (el tag inmutable
   `@vX.Y.Z` siempre esta fresco como fallback)

Los assets `site.css` y `site.js` quedan inmutables en el tag — no necesitan purge.

Para publicar en Webflow: manual via safe-publish skill o desde el Designer.

### Versionado en jsDelivr (referencia)

| Referencia | Cuando usar |
|---|---|
| `@latest` | **Solo `loader.js`** — URL fija en Webflow. Resuelve al tag mas alto; CI lo purga+verifica. El loader es diminuto y apunta a tags inmutables, asi que la agresividad de cache de `@latest` no afecta a los assets. |
| `@{commit-hash}` | Debug / rollback urgente — resuelve inmediato, sin cache |
| `@v1.2.0` (tag) | Assets versionados (`site.css`/`site.js`) — inmutables, siempre frescos |
| `@main` | **Evitar** — jsDelivr cachea la resolucion del branch hasta 12h y el purge no la refresca; el loader quedaba atascado en versiones viejas |
| `@latest` para ASSETS | **NUNCA** — cachea el contenido del asset agresivamente. Solo el loader puede usar `@latest`. |

### Atributos requeridos en los script tags

| Atributo | Motivo |
|---|---|
| `type="module"` | site.js usa `import()` dinamico para cargar modulos |
| `data-cfasync="false"` | Cloudflare Rocket Loader reescribe scripts; este atributo lo excluye |

### Scripts API vs Custom Code manual

La **Webflow Custom Code Scripts API** (`data_scripts_tool`) permite registrar y aplicar scripts programaticamente, pero los scripts registrados via API generan conflicto con el Custom Code manual (doble carga de CSS/JS con versiones distintas). **No usar Scripts API para CSS/JS del repo** — usar siempre Site Settings > Custom Code manual.

## Convenciones de desarrollo

### CSS — naming Client-First
```
componente_elemento         .nav_wrapper, .hero_heading, .card_body
estado                      .is-open, .is-scrolled, .is-active
utilidad (global)           .u-container, .u-brand, .u-truncate
```

### JS — dos patrones de activacion

**Patron 1: `data-module` en un wrapper** (modulos genericos)

site.js busca `[data-module="nombre"]` y carga el modulo correspondiente.
El atributo va en un wrapper que contenga los elementos a inicializar.

| Atributo | Donde agregarlo | Efecto |
|---|---|---|
| `data-module="nav"` | `.nav_wrapper` | Activa scroll state + hamburguesa |
| `data-module="animations"` | wrapper de pagina | GSAP fade-up/fade-in on load |
| `data-module="scroll-animations"` | wrapper de pagina | ScrollTrigger reveal/parallax |
| `data-module="faq"` | wrapper del bloque FAQ | Accordion accesible |
| `data-page="home"` | `<body>` | Logica especifica de home |
| `data-animate="fade-up"` | cualquier elemento | Anima en carga |
| `data-animate="reveal"` | cualquier elemento | Anima al entrar en viewport |
| `data-animate="reveal-group"` | wrapper de grid | Anima hijos con stagger |
| `data-animate="parallax"` | elemento decorativo | Parallax suave al scroll |
| `data-counter="1200"` | stat number | Counter animado |

**Patron 2: auto-detect por `data-*` propio** (componentes Webflow reutilizables)

Webflow NO publica `data-*` attributes en el root `<div>` de componentes reutilizables.
Por eso, los componentes que necesitan JS se activan por su propio data attribute, no por `data-module`.

site.js tiene un bloque `autoDetect` que busca selectores directamente en el DOM:

```js
const autoDetect = {
  '[data-button-041]': () => import('./modules/button-041.js'),
};
```

Cuando se crea un componente nuevo con JS, agregarlo a `autoDetect` en site.js.

## GSAP en Webflow — guia de integracion

### Webflow incluye GSAP 3.15.0 nativamente

Webflow carga automaticamente desde su propio CDN:
```html
<script src="https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js"></script>
<script src="https://cdn.prod.website-files.com/gsap/3.15.0/ScrollTrigger.min.js"></script>
```

`window.gsap` y `window.ScrollTrigger` estan disponibles globalmente.
Webflow puede agregar mas plugins segun la config del site.

### GSAP ESM no existe en npm

Los archivos `gsap.esm.min.js`, `ScrollTrigger.esm.min.js`, `SplitText.esm.min.js` **NO existen** en el paquete npm de GSAP en jsDelivr. Nunca importar con `import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.esm.min.js'` — da 404.

### Cloudflare Rocket Loader y timing

El site usa Cloudflare con Rocket Loader activo. Rocket Loader:
- Reescribe `type="text/javascript"` a un tipo custom para diferir ejecucion
- Esto incluye los scripts de GSAP de Webflow
- Nuestro `<script type="module" data-cfasync="false">` se ejecuta ANTES que GSAP exista en `window`

**Solucion:** cada modulo que necesite GSAP debe esperar con polling:
```js
function waitForGSAP(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window.gsap) return resolve(window.gsap);
    const start = Date.now();
    const check = setInterval(() => {
      if (window.gsap) { clearInterval(check); resolve(window.gsap); }
      else if (Date.now() - start > timeout) { clearInterval(check); reject(new Error('gsap not found')); }
    }, 50);
  });
}
```

### Plugins NO incluidos por Webflow

SplitText, Draggable, DrawSVG, etc. NO los carga Webflow. Se cargan via UMD dynamic import:
```js
async function loadSplitText(gsap) {
  if (window.SplitText) return window.SplitText;
  await import('https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/SplitText.min.js');
  gsap.registerPlugin(window.SplitText);
  return window.SplitText;
}
```

### Receta completa: componente Webflow con GSAP

1. **CSS** en `src/css/components/{nombre}.css` — variables locales + estados hover/focus via CSS
2. **JS** en `src/js/modules/{nombre}.js` — espera `window.gsap`, carga plugins extra via UMD
3. **site.css** — agregar `@import './components/{nombre}.css'`
4. **site.js** — agregar selector a `autoDetect`
5. **Webflow Designer** — crear componente via `whtml_builder`, los `data-*` van en elementos internos (no en el root)
6. **Publicar** — el root del componente es un `<div>` limpio, el auto-detect de site.js busca los data attributes internos

### Estructura src/
```
src/
├── css/
│   ├── base/
│   │   ├── tokens.css        ← vars globales ATOM DS
│   │   ├── reset.css         ← reset minimo
│   │   └── utilities.css     ← helpers Client-First (u-*)
│   ├── sections/
│   │   ├── nav.css
│   │   ├── hero.css
│   │   ├── cards.css
│   │   └── footer.css
│   ├── components/
│   │   └── button-041.css    ← GSAP SplitText button
│   ├── pages/
│   │   └── home.css
│   └── site.css              ← entry point: @import tree
└── js/
    ├── modules/
    │   ├── nav.js             ← scroll state + menu mobile
    │   ├── animations.js      ← GSAP on-load (usa window.gsap de Webflow)
    │   ├── scroll-animations.js ← GSAP ScrollTrigger
    │   ├── button-041.js      ← GSAP SplitText (auto-detect)
    │   └── faq.js             ← accordion accesible
    ├── pages/
    │   └── home.js            ← counter animado
    └── site.js                ← entry point: data-module + autoDetect
```

## Skills disponibles (34)

El agente lee `.agents/skills/ORCHESTRATOR.md` primero — decide que skills cargar segun el tipo de tarea.

| Categoria | Skills |
|---|---|
| Custom ATOM | **atom-code-component-workflow** |
| CMS | bulk-cms-update, cms-collection-setup, cms-best-practices |
| Salud del sitio | site-audit, asset-audit, link-checker, accessibility-audit, site-activity |
| Publicacion y codigo | safe-publish, custom-code-management, flowkit-naming, review-comments, designer-tools |
| Code Components | code-component, component-audit, component-scaffold, convert-component, deploy-guide, local-dev-setup, pre-deploy-check, troubleshoot-deploy |
| CLI Webflow | devlink, designer-extension, troubleshooter, cloud |
| GSAP | gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-utils, gsap-react, gsap-performance, gsap-frameworks |

### Agregar skills custom futuras

```bash
# 1. Crear el directorio y SKILL.md
mkdir .agents/skills/nombre-skill && touch .agents/skills/nombre-skill/SKILL.md

# 2. Agregar entrada en skills-lock.json con hash placeholder
# 3. Dejar que el CLI calcule el hash real
npx skills experimental_install

# 4. Commitear el lockfile actualizado
```

Regla: el key en `skills-lock.json` debe ser identico al nombre del directorio (dash, no colon).

## Reglas de operación

- Nunca publicar sin usar el skill `safe-publish` — siempre muestra diff antes de confirmar
- Custom code (analytics, pixels, widgets) solo via skill `custom-code-management`
- CSS/JS global se versiona en este repo, no se edita inline en Webflow
- `.env` nunca se commitea — está en `.gitignore`
- Máximo 1 dominio custom modificado por sesion de trabajo
- **Página scope:** nunca editar elementos en Webflow si la página no fue especificada explícitamente por el usuario. Siempre confirmar en qué página operar antes de cualquier acción con MCP Designer tools. Si el usuario dice "la página X", operar SOLO en esa página — nunca asumir Home u otra página por defecto.

## Estructura del repositorio

```
ATOMwebflowSite/
├── src/
│   ├── css/
│   │   ├── base/            tokens.css, reset.css, utilities.css
│   │   ├── sections/        nav.css, hero.css, cards.css, footer.css
│   │   ├── pages/           home.css
│   │   └── site.css         entry point
│   └── js/
│       ├── modules/         nav.js, animations.js, scroll-animations.js, faq.js
│       ├── pages/           home.js
│       └── site.js          entry point
├── loader.js                # entry point CDN — auto-generado por CI, no editar a mano
├── .env                     # credenciales locales (no commitear)
├── .gitignore
├── .github/workflows/       # CI: auto-tag + regenera loader.js en cada push a main
├── .mcp.json                # config Webflow MCP
├── .agents/skills/          # 34 skills (Webflow + GSAP + custom ATOM)
│   ├── ORCHESTRATOR.md      # punto de entrada del agente
├── CLAUDE.md                # este archivo
└── CHANGELOG.md
```

---

## Changelog

### v1.3.0 — 2026-06-12 (current)
- Loader pattern: `loader.js` en `@main` inyecta CSS/JS con tag versionado, cero desface de browser cache
- GitHub Actions auto-tag patch en cada push a main — `release.yml`
- Deploy = solo `git push origin main`, CI purga y tagea automaticamente

### v1.2.1 — 2026-06-01
- Auto-detect pattern para componentes Webflow con GSAP
- GSAP usa window.gsap nativo de Webflow (3.15.0) + polling para Rocket Loader
- SplitText carga via UMD dynamic import (no existe ESM en npm)
- Documentacion completa de GSAP + Webflow + Rocket Loader en CLAUDE.md
- Button 041 componente reutilizable en Webflow (grupo ATOM)

### v1.0.0 — 2026-06-01
- Scaffold inicial: tokens, reset, utilities, sections, pages
- Loader condicional site.js con data-module y autoDetect
- ORCHESTRATOR.md + atom-code-component-workflow skill
- 34 skills registradas y verificadas

### 0.0.1 — 2026-06-01
- Setup inicial, MCP, skills instaladas
