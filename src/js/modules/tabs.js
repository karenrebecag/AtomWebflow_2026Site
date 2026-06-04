// tabs.js — Tabbed content switcher
// Activates via [data-tabs-init]. Tabs: data-tab="name", panels: data-tab-panel="name".

export function init() {
  document.querySelectorAll('[data-tabs-init]').forEach((container) => {
    const tabs = container.querySelectorAll('[data-tab]');
    const panels = container.querySelectorAll('[data-tab-panel]');

    function activate(name) {
      tabs.forEach((tab) => {
        tab.setAttribute(
          'data-tab-status',
          tab.getAttribute('data-tab') === name ? 'active' : 'not-active'
        );
      });

      panels.forEach((panel) => {
        panel.style.display =
          panel.getAttribute('data-tab-panel') === name ? 'block' : 'none';
      });
    }

    container.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-tab]');
      if (!tab || !container.contains(tab)) return;
      activate(tab.getAttribute('data-tab'));
    });

    // First tab active by default
    if (tabs.length) activate(tabs[0].getAttribute('data-tab'));
  });
}
