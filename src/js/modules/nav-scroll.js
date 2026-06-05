// nav-scroll.js — Oculta el nav en scroll-down, lo muestra en scroll-up y en top
// Activacion: autoDetect via .mega-nav en site.js (no requiere atributo en Designer)
// Independiente de mega-nav.js: solo agrega/quita la clase is-nav-hidden y lee data-menu-open

const HIDDEN = 'is-nav-hidden';
const DELTA = 6;        // umbral minimo de scroll para reaccionar (evita jitter)
const TOP_OFFSET = 80;  // dentro de este margen desde el top, el nav siempre se muestra

export function init(container) {
  const nav = container.querySelector('.mega-nav');
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    // mega-nav.js marca data-menu-open al abrir panel/menu mobile — no ocultar en ese caso
    const menuOpen = nav.getAttribute('data-menu-open') === 'true';

    if (y <= TOP_OFFSET || menuOpen) {
      nav.classList.remove(HIDDEN);
    } else if (Math.abs(y - lastY) > DELTA) {
      nav.classList.toggle(HIDDEN, y > lastY);
    }

    lastY = y;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}
