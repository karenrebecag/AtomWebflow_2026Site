// logo-wall-cycle.js — Logo wall como marquee continuo (estilo Osmo trusted-by).
// Reemplaza el cycle GSAP por scroll horizontal infinito:
//  1. clona la lista una vez → loop sin costura
//  2. duracion = ancho / PPS → velocidad constante sin importar cuantos logos
//  3. pausa fuera de viewport (observer-hub) → no gasta frames oculto
// Activado por [data-logo-wall-cycle-init]. Markup intacto.

import { observeWith } from '../core/observer-hub.js';

const PPS = 50; // pixeles por segundo (igual que Osmo)

function waitForImages(scope) {
  const imgs = [...scope.querySelectorAll('img')];
  if (!imgs.length) return Promise.resolve();
  return Promise.all(imgs.map(img => {
    if (img.complete && img.naturalWidth) return Promise.resolve();
    return new Promise(res => {
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    });
  }));
}

export async function init(container = document) {
  const roots = container.querySelectorAll('[data-logo-wall-cycle-init]');
  if (!roots.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  for (const root of roots) {
    if (root.__marqueeInit) continue;
    root.__marqueeInit = true;

    const viewport = root.querySelector('.logo-wall__collection') || root;
    const original = viewport.querySelector('[data-logo-wall-list]');
    if (!original) continue;

    // Clona la lista para el loop sin costura
    const clone = original.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    viewport.appendChild(clone);

    const lists = [...viewport.querySelectorAll('[data-logo-wall-list]')];

    await waitForImages(viewport);

    const setDurations = () => {
      lists.forEach(l => {
        const d = l.offsetWidth / PPS;
        if (d > 0) l.style.animationDuration = d + 's';
      });
    };
    setDurations();

    if (reduce) continue; // sin movimiento: la lista queda estatica (CSS animation:none)

    // Pausa/reanuda segun viewport
    observeWith(root, { threshold: 0 }, (entry) => {
      lists.forEach(l => {
        l.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    });
  }

  // Recalcula la duracion al cambiar el ancho (un solo listener global)
  if (!window.__logoWallResize) {
    window.__logoWallResize = true;
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        document.querySelectorAll('[data-logo-wall-cycle-init] [data-logo-wall-list]')
          .forEach(l => {
            const d = l.offsetWidth / PPS;
            if (d > 0) l.style.animationDuration = d + 's';
          });
      }, 200);
    });
  }
}
