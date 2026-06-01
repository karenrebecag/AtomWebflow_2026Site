// nav.js — Comportamiento del nav
// Webflow: agregar data-module="nav" al elemento .nav_wrapper

export function init(container) {
  const nav = container;

  // Cambio de estado al hacer scroll (fondo mas opaco)
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  // Menu hamburguesa mobile
  const toggle = nav.querySelector('[data-nav-toggle]');
  const menu   = nav.querySelector('[data-nav-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar al hacer click en un link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
}
