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
      const newStatus = isActive ? 'not-active' : 'active';
      item.setAttribute('data-accordion-status', newStatus);

      // DEBUG: verify DOM change + CSS effect
      const bottom = item.querySelector('.accordion-css__item-bottom');
      if (bottom) {
        const rows = getComputedStyle(bottom).gridTemplateRows;
        console.log('[atom:accordion] status:', newStatus, '| grid-template-rows:', rows, '| bottom.offsetHeight:', bottom.offsetHeight);
      }

      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== item) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}
