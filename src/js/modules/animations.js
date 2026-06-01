// animations.js — GSAP base animations
// GSAP no publica ESM en npm — carga UMD via dynamic import.
// Webflow: agregar data-module="animations" al wrapper de la pagina.

const GSAP_CDN = 'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist';

async function loadGSAP() {
  if (window.gsap) return window.gsap;
  await import(`${GSAP_CDN}/gsap.min.js`);
  return window.gsap;
}

export async function init(container = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gsap = await loadGSAP();

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
