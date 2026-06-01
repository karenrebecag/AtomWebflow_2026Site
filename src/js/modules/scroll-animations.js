// scroll-animations.js — GSAP ScrollTrigger
// Fuente: GSAP ScrollTrigger docs (gsap.com/docs/v3/Plugins/ScrollTrigger)
// Webflow: agregar data-module="scroll-animations" al wrapper de la pagina.

import { gsap }          from 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.esm.min.js';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.esm.min.js';

gsap.registerPlugin(ScrollTrigger);

export function init(container = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Reveal generico: data-animate="reveal"
  container.querySelectorAll('[data-animate="reveal"]').forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: 'power2.out',
    });
  });

  // Reveal con stagger para grids: data-animate="reveal-group" en el wrapper
  container.querySelectorAll('[data-animate="reveal-group"]').forEach(group => {
    const children = group.children;
    if (!children.length) return;

    gsap.from(children, {
      scrollTrigger: {
        trigger: group,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 32,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    });
  });

  // Parallax suave: data-animate="parallax" — desplazamiento vertical al scrollear
  container.querySelectorAll('[data-animate="parallax"]').forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: -40,
      ease: 'none',
    });
  });
}
