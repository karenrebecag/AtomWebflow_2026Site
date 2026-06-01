// home.js — logica especifica de la pagina home
// Webflow: agregar data-page="home" al body o al wrapper principal.

export function init(container = document) {
  // Hero counter animado (si existe)
  const counters = container.querySelectorAll('[data-counter]');
  if (counters.length) {
    initCounters(counters);
  }
}

function initCounters(els) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseFloat(el.dataset.counter);
  const duration = 1500;
  const start    = performance.now();

  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
