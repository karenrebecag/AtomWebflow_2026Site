// lenis.js — Smooth scroll (port del setup de Osmo).
// Lenis se integra al gsap.ticker y sincroniza ScrollTrigger. No existe en ESM
// util para Webflow → se carga por UMD dynamic import (global window.Lenis).
//
// Respeta prefers-reduced-motion (no inicia). Elementos con [data-lenis-prevent]
// (modales, dropdowns scrollables) son ignorados por Lenis nativamente.
//
// Activacion: site.js lo inicia en paginas .nw. Expone window.lenis.

import { getGsap } from './gsap-core.js';

const LENIS_URL = 'https://cdn.jsdelivr.net/npm/lenis@1.3/dist/lenis.min.js';

let _lenis = null;

export async function init() {
  if (_lenis) return _lenis;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const gsap = await getGsap();

  if (!window.Lenis) {
    await import(LENIS_URL);
  }
  if (!window.Lenis) {
    console.error('[atom] Lenis no se cargo');
    return null;
  }

  const lenis = new window.Lenis({
    lerp: 0.12,
    wheelMultiplier: 1.1,
    smoothWheel: true,
  });

  _lenis = lenis;
  window.lenis = lenis;

  // Sincroniza ScrollTrigger (lo provee Webflow globalmente)
  const ST = window.ScrollTrigger;
  if (ST) lenis.on('scroll', ST.update);

  // Conduce Lenis desde el ticker de GSAP (un solo RAF para todo)
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
