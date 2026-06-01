// animations.js — GSAP base animations
// Fuente: GSAP Installation docs (gsap.com/docs/v3/Installation)
// GSAP es framework-agnostic; se carga como ES module desde CDN oficial.
// Webflow: agregar data-module="animations" al wrapper de la pagina.

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.esm.min.js';

export function init(container = document) {
  // Respetar prefers-reduced-motion — GSAP best practice oficial
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Fade-up: data-animate="fade-up" en Custom Attributes del elemento en Webflow
  const fadeUpEls = container.querySelectorAll('[data-animate="fade-up"]');
  if (fadeUpEls.length) {
    gsap.from(fadeUpEls, {
      y: 32,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }

  // Fade-in: data-animate="fade-in"
  const fadeInEls = container.querySelectorAll('[data-animate="fade-in"]');
  if (fadeInEls.length) {
    gsap.from(fadeInEls, {
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power1.out',
    });
  }
}
