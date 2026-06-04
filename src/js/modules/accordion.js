// accordion.js — CSS Accordion toggle
// Activates via [data-accordion-css-init]. Sibling close via [data-accordion-close-siblings="true"].

export function init() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return;

      const item = toggle.closest('[data-accordion-status]');
      if (!item) return;

      const isActive = item.getAttribute('data-accordion-status') === 'active';
      item.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');

      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== item) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}
