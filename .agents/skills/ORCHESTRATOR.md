---
name: orchestrator
description: >
  Punto de entrada unico para el agente. Leer PRIMERO antes de cargar cualquier skill.
  Decide el camino correcto segun el tipo de tarea y orquesta las skills en orden.
---

# ATOM Webflow — Agent Orchestrator

> Regla #1: Leer este archivo antes de cualquier otra cosa. No cargar skills al azar.

---

## Decision Tree

### Tarea: Componente global reutilizable (drag & drop en Designer)

Senales: "crea un componente", "quiero arrastrarlo", "reutilizable", "props configurables", "React component"

Camino: ATOM CODE COMPONENT WORKFLOW

Orden de skills a cargar:
1. atom-code-component-workflow          <- ESTA skill (workflow completo)
2. webflow-code-component-component-scaffold
3. webflow-cli-devlink
4. webflow-cli-code-component
5. gsap-react                            <- solo si tiene animaciones
6. webflow-code-component-pre-deploy-check
7. webflow-code-component-deploy-guide

Rutas de escape:
- webflow-code-component-troubleshoot-deploy -> si falla el deploy
- webflow-code-component-component-audit     -> si se audita uno existente
- webflow-code-component-convert-component   -> si se convierte un nativo

---

### Tarea: Animacion / scroll animation en pagina

Senales: "animar", "scroll", "GSAP", "fade", "timeline", "trigger"

Camino: GSAP VANILLA (modulo externo via jsDelivr)

Orden:
1. gsap-core
2. gsap-scrolltrigger
3. gsap-timeline            <- solo si es secuencia
4. gsap-plugins             <- solo si usa SplitText / DrawSVG
5. gsap-performance
6. webflow-mcp-custom-code-management

---

### Tarea: Gestion de contenido / CMS / publicar / auditar

Camino: MCP + DATA API

Subtarea          -> Skills
-------------------------------------------------
CMS setup       -> webflow-mcp-cms-collection-setup
                -> webflow-mcp-cms-best-practices
Bulk edit       -> webflow-mcp-bulk-cms-update
Publicar        -> webflow-mcp-safe-publish
                -> webflow-mcp-site-activity
Auditar         -> webflow-mcp-site-audit
                -> webflow-mcp-accessibility-audit
Assets          -> webflow-mcp-asset-audit
                -> webflow-mcp-link-checker
Naming          -> webflow-mcp-flowkit-naming
Review PR       -> webflow-mcp-review-comments

---

### Tarea: Setup / CLI / troubleshoot

Camino: WEBFLOW CLI

1. webflow-cli-cloud
2. webflow-cli-designer-extension   <- solo si es extension del Designer
3. webflow-cli-troubleshooter       <- si hay error

---

## Reglas Globales

- NUNCA publicar sin pasar `webflow-mcp-safe-publish`
- NUNCA hacer deploy de Code Component sin `webflow-code-component-pre-deploy-check`
- Naming siempre sigue `webflow-mcp-flowkit-naming` (Client-First)
- GSAP siempre incluye `prefers-reduced-motion` check
- JS/CSS externo siempre via jsDelivr con version fija (nunca `@latest`)
- `.env` siempre en `.gitignore`, nunca commiteado
- Tokens de Webflow Variables antes que valores hardcodeados

---

## Inventario de Skills

CODE COMPONENTS + DEVLINK
  atom-code-component-workflow
  webflow-cli-code-component
  webflow-cli-devlink
  webflow-code-component-component-scaffold
  webflow-code-component-component-audit
  webflow-code-component-convert-component
  webflow-code-component-local-dev-setup
  webflow-code-component-deploy-guide
  webflow-code-component-pre-deploy-check
  webflow-code-component-troubleshoot-deploy

GSAP ANIMATIONS
  gsap-core / gsap-react / gsap-scrolltrigger
  gsap-timeline / gsap-plugins / gsap-performance
  gsap-utils / gsap-frameworks

WEBFLOW CLI
  webflow-cli-cloud
  webflow-cli-designer-extension
  webflow-cli-troubleshooter

MCP / DATA API
  webflow-mcp-designer-tools
  webflow-mcp-custom-code-management
  webflow-mcp-safe-publish
  webflow-mcp-site-audit / webflow-mcp-site-activity
  webflow-mcp-accessibility-audit / webflow-mcp-asset-audit
  webflow-mcp-link-checker / webflow-mcp-review-comments
  webflow-mcp-flowkit-naming
  webflow-mcp-cms-best-practices / webflow-mcp-cms-collection-setup
  webflow-mcp-bulk-cms-update
