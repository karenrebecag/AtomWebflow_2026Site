// accordion.js — CSS Accordion toggle
// Activates via [data-accordion-css-init]. Sibling close via [data-accordion-close-siblings="true"].

export function init() {
  const accordions = document.querySelectorAll('[data-accordion-css-init]');
  console.log('[atom:accordion] found', accordions.length, 'accordion(s)');

  accordions.forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';
    const items = accordion.querySelectorAll('[data-accordion-status]');
    console.log('[atom:accordion] items:', items.length, '| closeSiblings:', closeSiblings);

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) {
        console.log('[atom:accordion] click ignored — not on toggle');
        return;
      }

      const item = toggle.closest('[data-accordion-status]');
      if (!item) {
        console.log('[atom:accordion] click ignored — no item with data-accordion-status');
        return;
      }

      const isActive = item.getAttribute('data-accordion-status') === 'active';
      const newStatus = isActive ? 'not-active' : 'active';
      console.log('[atom:accordion] toggle:', item.querySelector('h3')?.textContent?.slice(0, 30), '|', isActive, '->', newStatus);

      item.setAttribute('data-accordion-status', newStatus);

      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== item) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}
