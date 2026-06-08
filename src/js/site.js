// site.js — Entry point v1.2.0
// Carga modulos solo si el elemento con data-module existe en la pagina.
// Webflow Footer: <script type="module" src="https://cdn.jsdelivr.net/gh/karenrebecag/AtomWebflow_2026Site@{VERSION}/src/js/site.js">

const modules = {
  'nav':               () => import('./modules/nav.js'),
  'animations':        () => import('./modules/animations.js'),
  'scroll-animations': () => import('./modules/scroll-animations.js'),
  'faq':               () => import('./modules/faq.js'),
  'button-041':        () => import('./modules/button-041.js'),
};

const pages = {
  'home': () => import('./pages/home.js'),
};

// Inicializa modulos por data-module en el elemento wrapper
document.querySelectorAll('[data-module]').forEach(el => {
  const name = el.dataset.module;
  if (modules[name]) {
    modules[name]()
      .then(m => m.init && m.init(el))
      .catch(err => console.error(`[atom] module "${name}" failed:`, err));
  }
});

// Auto-detect: componentes que se activan por su propio data attribute
// (Webflow no publica data-module en el root de componentes reutilizables)
const autoDetect = {
  '[data-button-041]':           () => import('./modules/button-041.js'),
  '[data-logo-wall-cycle-init]': () => import('./modules/logo-wall-cycle.js'),
  '[data-menu-wrap]':            () => import('./modules/mega-nav.js'),
  '.mega-nav':                   () => import('./modules/nav-scroll.js'),
  '[data-accordion-css-init]':   () => import('./modules/accordion.js'),
  '[data-tabs-init]':             () => import('./modules/tabs.js'),
  '[data-gsap-slider-init]':     () => import('./modules/gsap-slider.js'),
  '[data-css-marquee]':          () => import('./modules/marquee.js'),
  '[data-tabs="wrapper"]':       () => import('./modules/feature-tabs.js'),
  '[data-split="heading"]':      () => import('./modules/mask-text-reveal.js'),
  '[data-reveal-group]':         () => import('./modules/content-reveal.js'),
};

Object.entries(autoDetect).forEach(([selector, loader]) => {
  if (document.querySelector(selector)) {
    loader()
      .then(m => m.init && m.init(document))
      .catch(err => console.error(`[atom] auto "${selector}" failed:`, err));
  }
});

// Inicializa logica de pagina por data-page en el body
const pageKey = document.body.dataset.page;
if (pageKey && pages[pageKey]) {
  pages[pageKey]()
    .then(m => m.init && m.init(document))
    .catch(err => console.error(`[atom] page "${pageKey}" failed:`, err));
}
