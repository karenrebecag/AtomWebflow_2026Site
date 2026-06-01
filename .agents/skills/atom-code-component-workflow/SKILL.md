---
name: atom-code-component-workflow
description: >
  Workflow completo para crear un Code Component reutilizable de ATOM DS:
  desde la idea hasta el componente draggable en Webflow Designer.
  Cubre arquitectura React, declareComponent, DevLink, tokens de Webflow
  Variables, integracion GSAP-React, pre-deploy check y deploy.
version: 1.0.0
refs:
  - https://developers.webflow.com/code-components/introduction
  - https://developers.webflow.com/code-components/define-code-component
  - https://developers.webflow.com/code-components/styling-components
  - https://developers.webflow.com/code-components/reference/prop-types
  - https://developers.webflow.com/devlink
  - https://gsap.com/docs/v3/Plugins/useGSAP/
---

# ATOM Code Component Workflow

Idea -> Scaffold -> declareComponent -> Props/Slots -> Tokens -> GSAP -> Bundle -> Deploy -> Designer

---

## Fase 0 — Clasificacion del componente

| Pregunta | Code Component | Webflow nativo |
|---|---|---|
| Necesita estado React / hooks? | Si | No |
| Tiene logica JS compleja? | Si | No |
| Se usa en multiples sitios del workspace? | Si | No |
| Lo editan devs fuera del Designer? | Si | No |
| Necesita GSAP avanzado? | Si | No |

2+ respuestas Si -> Code Component. Todas No -> componente nativo.

---

## Fase 1 — Scaffold

```
src/components/[nombre-componente]/
  NombreComponente.webflow.tsx   <- wrapper declareComponent
  NombreComponente.tsx           <- logica React pura
  NombreComponente.module.css    <- estilos con Webflow Variables
  index.ts                       <- export
```

---

## Fase 2 — Componente React puro

```tsx
// Accordion.tsx — logica React pura, sin Webflow
import { useState } from 'react';

export interface AccordionItem {
  title: string;
  content: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: number;
}

export function Accordion({ items, allowMultiple = false, defaultOpen }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    defaultOpen !== undefined ? [defaultOpen] : []
  );

  const toggle = (index: number) => {
    setOpenIndexes(prev =>
      allowMultiple
        ? prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        : prev.includes(index) ? [] : [index]
    );
  };

  return (
    <div className="accordion" aria-label="Accordion">
      {items.map((item, i) => (
        <div key={i} className="accordion__item">
          <button
            className="accordion__trigger"
            aria-expanded={openIndexes.includes(i)}
            onClick={() => toggle(i)}
          >
            {item.title}
          </button>
          {openIndexes.includes(i) && (
            <div className="accordion__panel" role="region">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## Fase 3 — declareComponent (Webflow wrapper)

```tsx
// Accordion.webflow.tsx
// declareComponent registra el componente en el Designer
// Props definidas aqui aparecen en el panel derecho de Webflow
import { declareComponent, PropTypes } from '@webflow/react';
import { Accordion } from './Accordion';

export default declareComponent(Accordion, {
  name: 'Accordion',
  props: {
    items: PropTypes.array({
      label: 'Items',
      itemType: PropTypes.object({
        title: PropTypes.string({ label: 'Titulo' }),
        content: PropTypes.string({ label: 'Contenido', multiline: true }),
      }),
    }),
    allowMultiple: PropTypes.boolean({
      label: 'Permitir multiples abiertos',
      defaultValue: false,
    }),
    defaultOpen: PropTypes.number({
      label: 'Item abierto por defecto (indice)',
    }),
  },
});
```

### PropTypes disponibles

| PropType | Uso |
|---|---|
| `PropTypes.string()` | Texto, URLs, clases CSS |
| `PropTypes.number()` | Numeros, indices, duraciones |
| `PropTypes.boolean()` | Toggles (show/hide, enabled) |
| `PropTypes.enum()` | Selects (`'sm' \| 'md' \| 'lg'`) |
| `PropTypes.array()` | Listas de items dinamicos |
| `PropTypes.object()` | Objetos compuestos |
| `PropTypes.color()` | Color picker en el Designer |
| `PropTypes.richText()` | Texto enriquecido |
| `PropTypes.slot()` | Slot para elementos de Webflow |

---

## Fase 4 — CSS con Webflow Variables

```css
/* Accordion.module.css */
/* Siempre usar var(--token, fallback) — el fallback es obligatorio */

.accordion {
  display: flex;
  flex-direction: column;
  gap: var(--space-2, 0.5rem);
  width: 100%;
}

.accordion__item {
  border: 1px solid var(--color-border, oklch(0 0 0 / 0.1));
  border-radius: var(--radius-md, 0.5rem);
  overflow: hidden;
  background: var(--color-surface, #f9f9f9);
}

.accordion__trigger {
  all: unset;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: var(--space-4, 1rem) var(--space-6, 1.5rem);
  font-size: var(--text-base, 1rem);
  font-family: var(--font-base, sans-serif);
  color: var(--color-text-heading, #222020);
  transition: background 180ms cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 44px; /* touch target WCAG */
}

.accordion__trigger:hover {
  background: var(--color-surface-dark, #27272a);
  color: var(--color-text-inverse, #ffffff);
}

.accordion__trigger:focus-visible {
  outline: 2px solid var(--color-brand, #FF6600);
  outline-offset: -2px;
}

.accordion__panel {
  padding: var(--space-4, 1rem) var(--space-6, 1.5rem);
  font-size: var(--text-base, 1rem);
  color: var(--color-text-muted, #71717a);
  line-height: 1.6;
  border-top: 1px solid var(--color-border, #e4e4e7);
}
```

---

## Fase 5 — GSAP (opcional)

```tsx
// Solo si CSS transitions no son suficientes.
// useGSAP hook oficial — limpia automaticamente al desmontar.
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP); // registrar al nivel de modulo

// Dentro del componente:
useGSAP(() => {
  // OBLIGATORIO: respetar prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.fromTo(panelRef.current,
    { height: 0, opacity: 0 },
    { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
  );
}, { dependencies: [isOpen] });
```

### Reglas GSAP en Code Components

- Siempre `useGSAP` — nunca `useEffect` para animaciones GSAP
- Siempre verificar `prefers-reduced-motion`
- Registrar plugins al nivel de modulo
- Nunca `gsap.globalTimeline.clear()` — afecta todo el site

---

## Fase 6 — webflow.json

```json
{
  "library": {
    "name": "ATOM Design System",
    "components": ["./src/**/*.webflow.@(js|jsx|ts|tsx)"]
  }
}
```

Un solo `webflow.json` en la raiz. El glob incluye todos los `.webflow.tsx` automaticamente.

---

## Fase 7 — Deploy checklist

- [ ] `declareComponent` con props tipadas
- [ ] Todos los `var(--token)` tienen fallback
- [ ] `prefers-reduced-motion` implementado (si hay GSAP)
- [ ] Touch targets >= 44px
- [ ] `aria-*` attributes correctos (expanded, role, label)
- [ ] TypeScript sin errores: `npx tsc --noEmit`
- [ ] Bundle < 2MB: `webflow library bundle --verbose`
- [ ] `.env` en `.gitignore`
- [ ] `webflow.json` en la raiz

Luego: skill `webflow-code-component-pre-deploy-check`
Luego: skill `webflow-cli-code-component` para el deploy

---

## Fase 8 — Como se ve en el Designer

1. Panel izquierdo -> Add Elements -> seccion "Libraries"
2. Se arrastra al canvas como cualquier elemento nativo
3. Panel derecho -> Properties muestra props configurables
4. Webflow Variables del site se aplican automaticamente
5. Marketing edita props sin tocar codigo

---

## Anti-patterns — NUNCA hacer esto

```tsx
// Estilos hardcodeados — rompen Webflow Variables
style={{ color: '#01696f', fontSize: '16px' }}

// useEffect para GSAP — causa memory leaks
useEffect(() => { gsap.to(el, { ... }) }, []);

// Props sin tipo — el Designer no puede renderizarlas
export default declareComponent(Component, { props: {} });

// Bundle > 2MB — el CLI rechaza el deploy
// Evitar: lodash completo, moment.js, charts pesados

// Estilos globales desde el componente
import './global-override.css';
```

---

## Quick Reference CLI

```bash
webflow --version                                    # verificar CLI
webflow library bundle --verbose                     # bundle local
webflow library share                                # deploy
webflow library log                                  # ver logs
webflow library share --api-token $TOKEN --no-input  # CI/CD
```
