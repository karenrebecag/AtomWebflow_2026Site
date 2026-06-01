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

// Inicializa logica de pagina por data-page en el body
const pageKey = document.body.dataset.page;
if (pageKey && pages[pageKey]) {
  pages[pageKey]()
    .then(m => m.init && m.init(document))
    .catch(err => console.error(`[atom] page "${pageKey}" failed:`, err));
}
