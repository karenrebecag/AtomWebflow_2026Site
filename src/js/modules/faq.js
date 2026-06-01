// faq.js — Accordion FAQ accesible
// Webflow: agregar data-module="faq" al wrapper del bloque FAQ.
// Cada item necesita: data-faq-item, data-faq-trigger, data-faq-panel.

export function init(container) {
  const items = container.querySelectorAll('[data-faq-item]');

  items.forEach(item => {
    const trigger = item.querySelector('[data-faq-trigger]');
    const panel   = item.querySelector('[data-faq-panel]');

    if (!trigger || !panel) return;

    // Altura inicial para la transicion CSS
    panel.style.height = '0px';
    panel.style.overflow = 'hidden';
    panel.style.transition = 'height 240ms cubic-bezier(0.16, 1, 0.3, 1)';

    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panel.id || '');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Cerrar otros items abiertos (solo uno abierto a la vez)
      items.forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          closeItem(other);
        }
      });

      isOpen ? closeItem(item) : openItem(item);
    });
  });

  function openItem(item) {
    const trigger = item.querySelector('[data-faq-trigger]');
    const panel   = item.querySelector('[data-faq-panel]');
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.style.height = panel.scrollHeight + 'px';
  }

  function closeItem(item) {
    const trigger = item.querySelector('[data-faq-trigger]');
    const panel   = item.querySelector('[data-faq-panel]');
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.style.height = '0px';
  }
}
