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

Para cargar el MCP, abrir Claude Code desde este directorio:
```bash
cd ~/Desktop/SoftwareDevProjects/ATOMwebflowSite && claude
```

## Carga en Webflow

**Head (Site Settings > Custom Code > Head):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/karenrebecag/AtomWebflow_2026Site@{VERSION}/src/css/site.css">
```

**Footer (Site Settings > Custom Code > Footer):**
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/karenrebecag/AtomWebflow_2026Site@{VERSION}/src/js/site.js"></script>
```

Reemplazar `{VERSION}` por el tag del release (ej. `v1.0.0`). Nunca usar `@latest`.

## Convenciones de desarrollo

### CSS — naming Client-First
```
componente_elemento         .nav_wrapper, .hero_heading, .card_body
estado                      .is-open, .is-scrolled, .is-active
utilidad (global)           .u-container, .u-brand, .u-truncate
```

### JS — activacion por data attributes en Webflow Designer
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

### Estructura src/
```
src/
├── css/
│   ├── base/
│   │   ├── tokens.css       ← vars globales ATOM DS (colores, tipo, espaciado)
│   │   ├── reset.css        ← reset minimo, sin colisionar con Webflow
│   │   └── utilities.css    ← helpers Client-First (u-*)
│   ├── sections/
│   │   ├── nav.css
│   │   ├── hero.css
│   │   ├── cards.css
│   │   └── footer.css
│   ├── pages/
│   │   └── home.css
│   └── site.css             ← entry point: @import tree
└── js/
    ├── modules/
    │   ├── nav.js            ← scroll state + menu mobile
    │   ├── animations.js     ← GSAP on-load
    │   ├── scroll-animations.js ← GSAP ScrollTrigger
    │   └── faq.js            ← accordion accesible
    ├── pages/
    │   └── home.js           ← counter animado
    └── site.js               ← entry point: loader condicional
```

## Skills disponibles (33)

Instaladas en `.agents/skills/` — se activan automáticamente por contexto de tarea.

| Categoria | Skills |
|---|---|
| CMS | bulk-cms-update, cms-collection-setup, cms-best-practices |
| Salud del sitio | site-audit, asset-audit, link-checker, accessibility-audit, site-activity |
| Publicación y código | safe-publish, custom-code-management, flowkit-naming, review-comments, designer-tools |
| Code Components | code-component, component-audit, component-scaffold, convert-component, deploy-guide, local-dev-setup, pre-deploy-check, troubleshoot-deploy |
| CLI Webflow | devlink, designer-extension, troubleshooter, cloud |
| GSAP | gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-utils, gsap-react, gsap-performance, gsap-frameworks |

## Reglas de operación

- Nunca publicar sin usar el skill `safe-publish` — siempre muestra diff antes de confirmar
- Custom code (analytics, pixels, widgets) solo via skill `custom-code-management`
- CSS/JS global se versiona en este repo, no se edita inline en Webflow
- `.env` nunca se commitea — está en `.gitignore`
- Máximo 1 dominio custom modificado por sesion de trabajo

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
├── .env                     # credenciales locales (no commitear)
├── .gitignore
├── .mcp.json                # config Webflow MCP
├── .agents/skills/          # 33 skills (Webflow + GSAP)
├── CLAUDE.md                # este archivo
└── CHANGELOG.md
```

---

## Changelog

### 2026-06-01 — Scaffold src/ completo
- Creada estructura src/css/ y src/js/ con entry points
- tokens.css con valores reales ATOM DS (#FF6600, #222020, Inter)
- Modulos GSAP: animations.js, scroll-animations.js activados por data-module
- Loader condicional en site.js — zero JS cargado si no hay data-module en DOM
- CLAUDE.md actualizado con tabla de data-attributes y estructura src/

### 2026-06-01 — Setup inicial
- Creado directorio del proyecto en SoftwareDevProjects
- Instaladas 33 skills (25 Webflow + 8 GSAP)
- Configurado Webflow MCP en `.mcp.json` con token via env var
- Site ID confirmado: `6890d2a7153362eed21e1c49` (new.atomchat.io)
- Definida arquitectura: Webflow no-code + CSS/JS externo versionado via jsDelivr
