// observer-hub.js — IntersectionObserver centralizado (port del hub de Osmo).
// Un solo observer por configuracion (threshold + rootMargin) en vez de uno por
// elemento. Cada elemento acumula sus callbacks; el observer las despacha.
//
// Uso:
//   import { observeWith } from '../core/observer-hub.js';
//   const off = observeWith(el, { threshold: 0.15 }, (entry) => { ... });
//   // off() para dejar de observar y limpiar.

const _hub = new Map();

function keyOf(opts = {}) {
  const t = Array.isArray(opts.threshold) ? opts.threshold.join(',') : (opts.threshold ?? 0);
  const r = opts.rootMargin ?? '0px';
  return t + '|' + r;
}

export function getObserver(opts = {}) {
  const key = keyOf(opts);
  if (_hub.has(key)) return _hub.get(key);

  const ob = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const list = e.target.__atomIO;
      if (!list) continue;
      for (const cb of list) cb(e);
    }
  }, opts);

  _hub.set(key, ob);
  return ob;
}

export function observeWith(el, opts, cb) {
  if (!el || typeof cb !== 'function') return () => {};
  const ob = getObserver(opts);
  (el.__atomIO ||= []).push(cb);
  ob.observe(el);

  return () => {
    if (el.__atomIO) el.__atomIO = el.__atomIO.filter(fn => fn !== cb);
    try { ob.unobserve(el); } catch (_) {}
  };
}
