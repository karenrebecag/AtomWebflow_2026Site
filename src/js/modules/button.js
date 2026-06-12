// button.js — Sistema de boton ATOM (port del rotate-button de Osmo).
// Dos labels apilados en un grid rotan en hover con un eje (--y) calculado por
// el largo del texto: texto mas largo necesita un eje mas lejano para que el
// giro no se corte. overflow:hidden en .button recorta el barrido.
//
// Activacion por auto-detect: [data-button-rotate] en el root del boton.
// El elemento que dispara el hover puede marcarse con [data-hover]; si no,
// se usa el root.

import { getGsap } from '../core/gsap-core.js';

const YK = 30; // factor de escala del eje por caracter (igual que Osmo)

function maxChars(btn) {
  const labels = btn.querySelectorAll('.button-label');
  return Math.max(0, ...[...labels].map(l => (l.textContent || '').trim().length));
}

// Botones full-width (o responsive-full en el breakpoint actual) necesitan un
// eje aun mas lejano porque el label puede ser muy ancho.
function isFullWidth(btn) {
  if (btn.dataset.size === 'full') return true;
  const resp = (btn.getAttribute('data-responsive') || '').toLowerCase();
  const w = window.innerWidth;
  return (resp.includes('mobile') && w <= 479)
      || (resp.includes('landscape') && w <= 767)
      || (resp.includes('tablet') && w <= 991);
}

function updateAxis(btn) {
  const c = maxChars(btn);
  let y = Math.round(100 + YK * (12 + 6 * c));
  if (isFullWidth(btn)) y *= 3;
  y = Math.max(100, Math.min(y, 10000));
  btn.style.setProperty('--y', y + '%');
}

function debounceWidth(fn, ms) {
  let last = window.innerWidth, t;
  return () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (window.innerWidth !== last) { last = window.innerWidth; fn(); }
    }, ms);
  };
}

export async function init(container = document) {
  const buttons = container.querySelectorAll('[data-button-rotate]');
  if (!buttons.length) return;

  const gsap = await getGsap();
  if (document.fonts && document.fonts.ready) await document.fonts.ready;

  buttons.forEach(updateAxis);

  // Recalculo del eje al cambiar el ancho — un solo listener global.
  if (!window.__atomButtonResize) {
    window.__atomButtonResize = debounceWidth(() => {
      document.querySelectorAll('[data-button-rotate]').forEach(updateAxis);
    }, 200);
    window.addEventListener('resize', window.__atomButtonResize);
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // sin rotacion en hover si el usuario lo pidio

  buttons.forEach(btn => {
    if (btn.__atomRotateBound) return;
    btn.__atomRotateBound = true;

    const trigger = btn.closest('[data-hover]') || btn;
    let lastTs = 0;
    const COOLDOWN = 100;

    const canTrigger = () => {
      const now = performance.now();
      if (now - lastTs < COOLDOWN) return false;
      lastTs = now;
      return true;
    };

    const run = () => {
      let items = btn.querySelectorAll('.button-label, .button-icon');
      if (!items.length) items = [btn];

      if (btn.__rotTl) {
        btn.__rotTl.kill();
        gsap.set(items, { clearProps: 'rotation' });
      }

      const r = parseFloat(getComputedStyle(btn).getPropertyValue('--r')) || 20;
      const full = btn.dataset.size === 'full';

      btn.__rotTl = gsap.to(items, {
        rotation: `+=${r}`,
        duration: full ? 0.75 : 0.5,
        ease: 'atom-in-out',
        stagger: 0.075,
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(items, { clearProps: 'rotation' });
          btn.__rotTl = null;
        }
      });
    };

    trigger.addEventListener('pointerenter', () => { if (canTrigger()) run(); });
    trigger.addEventListener('pointerleave', () => { canTrigger(); });
  });
}
