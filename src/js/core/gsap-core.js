// gsap-core.js — Fundamento GSAP compartido para modulos ATOM.
// Webflow provee window.gsap (3.15.0). Rocket Loader lo difiere, asi que
// esperamos por polling. Los plugins extra (CustomEase, Observer, SplitText)
// no existen en ESM, se cargan por UMD dynamic import.
//
// Registra las curvas "atom" / "atom-in-out" como CustomEase — espejo de los
// tokens CSS --ease-out / --ease-in-out (tokens.css) para coherencia CSS<->GSAP.
//
// NOTA: no tocamos gsap.defaults() global a proposito. Cambiar el ease/duration
// por defecto alteraria el easing de modulos existentes (animations, text-reveal,
// scroll-animations). Cada modulo nuevo opta por ease:"atom" explicitamente.

let _basePromise = null;

const PLUGIN_URLS = {
  SplitText:  'https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js',
  CustomEase: 'https://cdn.jsdelivr.net/npm/gsap@3.15/dist/CustomEase.min.js',
  Observer:   'https://cdn.jsdelivr.net/npm/gsap@3.15/dist/Observer.min.js',
};

// Curvas nombradas — los 4 puntos de control espejan los cubic-bezier de tokens.css
const EASES = {
  'atom':        '0.16, 1, 0.3, 1',   // = --ease-out
  'atom-in-out': '0.87, 0, 0.13, 1',  // = --ease-in-out
};

function waitForGSAP(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window.gsap) return resolve(window.gsap);
    const start = Date.now();
    const check = setInterval(() => {
      if (window.gsap) { clearInterval(check); resolve(window.gsap); }
      else if (Date.now() - start > timeout) {
        clearInterval(check);
        reject(new Error('[atom] gsap not found — Webflow GSAP may be disabled'));
      }
    }, 50);
  });
}

async function loadUMD(globalName, gsap) {
  if (window[globalName]) return window[globalName];
  const url = PLUGIN_URLS[globalName];
  if (!url) return null;
  await import(url);
  if (gsap && window[globalName]) gsap.registerPlugin(window[globalName]);
  return window[globalName];
}

// Resuelve gsap con CustomEase y las curvas "atom" registradas. Cachea el base.
// plugins: nombres extra a garantizar antes de devolver (ej: ['SplitText']).
export function getGsap({ plugins = [] } = {}) {
  if (!_basePromise) {
    _basePromise = (async () => {
      const gsap = await waitForGSAP();
      await loadUMD('CustomEase', gsap);
      if (window.CustomEase) {
        for (const [name, curve] of Object.entries(EASES)) {
          window.CustomEase.create(name, curve);
        }
      }
      return gsap;
    })();
  }

  return _basePromise.then(async (gsap) => {
    for (const name of plugins) await loadUMD(name, gsap);
    return gsap;
  });
}
