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

## Skills disponibles (25)

Instaladas en `.agents/skills/` — se activan automáticamente por contexto de tarea.

| Categoria | Skills |
|---|---|
| CMS | bulk-cms-update, cms-collection-setup, cms-best-practices |
| Salud del sitio | site-audit, asset-audit, link-checker, accessibility-audit, site-activity |
| Publicación y código | safe-publish, custom-code-management, flowkit-naming, review-comments, designer-tools |
| Code Components | code-component, component-audit, component-scaffold, convert-component, deploy-guide, local-dev-setup, pre-deploy-check, troubleshoot-deploy |
| CLI Webflow | devlink, designer-extension, troubleshooter, cloud |

## Reglas de operación

- Nunca publicar sin usar el skill `safe-publish` — siempre muestra diff antes de confirmar
- Custom code (analytics, pixels, widgets) solo via skill `custom-code-management`
- CSS/JS global se versiona en este repo, no se edita inline en Webflow
- `.env` nunca se commitea — está en `.gitignore`
- Máximo 1 dominio custom modificado por sesion de trabajo

## Estructura del repositorio

```
ATOMwebflowSite/
├── .env                     # credenciales locales (no commitear)
├── .gitignore
├── .mcp.json                # config Webflow MCP (lee de env)
├── .agents/skills/          # 25 Webflow skills (instaladas 2026-06-01)
├── CLAUDE.md                # este archivo
└── CHANGELOG.md
```

---

## Changelog

### 2026-06-01 — Setup inicial
- Creado directorio del proyecto en SoftwareDevProjects
- Instaladas 25 Webflow skills via `npx skills add webflow/webflow-skills`
- Configurado Webflow MCP en `.mcp.json` con token via env var
- Site ID confirmado: `6890d2a7153362eed21e1c49` (new.atomchat.io)
- Definida arquitectura: Webflow no-code + CSS/JS externo versionado via jsDelivr
- `.env` y `.gitignore` inicializados
