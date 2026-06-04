// tabs.js — Tabbed content switcher with sliding indicator
// Activates via [data-tabs-init]. Tabs: data-tab="name", panels: data-tab-panel="name".

export function init() {
  document.querySelectorAll('[data-tabs-init]').forEach((container) => {
    const selector = container.querySelector('.tabs_selector');
    const tabs = container.querySelectorAll('[data-tab]');
    const panels = container.querySelectorAll('[data-tab-panel]');

    if (!selector || !tabs.length) return;

    // Create indicator element
    let indicator = selector.querySelector('.tabs_indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'tabs_indicator';
      selector.appendChild(indicator);
    }

    function updateIndicator(activeTab) {
      const selectorRect = selector.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      const left = tabRect.left - selectorRect.left;
      const top = tabRect.top - selectorRect.top;

      indicator.style.left = left + 'px';
      indicator.style.top = top + 'px';
      indicator.style.width = tabRect.width + 'px';
      indicator.style.height = tabRect.height + 'px';
    }

    function activate(name) {
      tabs.forEach((tab) => {
        const isActive = tab.getAttribute('data-tab') === name;
        tab.setAttribute('data-tab-status', isActive ? 'active' : 'not-active');
        if (isActive) updateIndicator(tab);
      });

      panels.forEach((panel) => {
        panel.style.display =
          panel.getAttribute('data-tab-panel') === name ? 'grid' : 'none';
      });
    }

    container.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-tab]');
      if (!tab || !container.contains(tab)) return;
      activate(tab.getAttribute('data-tab'));
    });

    if (tabs.length) activate(tabs[0].getAttribute('data-tab'));

    // Recalc on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const active = selector.querySelector('[data-tab-status="active"]');
        if (active) updateIndicator(active);
      }, 200);
    });
  });
}
