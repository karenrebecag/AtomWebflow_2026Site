// tabs.js — Tabbed content switcher with sliding indicator
// Activates via [data-tabs-init]. Tabs: data-tab="name", panels: data-tab-panel="name".

export function init() {
  document.querySelectorAll('[data-tabs-init]').forEach((container) => {
    const selector = container.querySelector('.tabs_selector');
    const tabs = container.querySelectorAll('[data-tab]');
    const panels = container.querySelectorAll('[data-tab-panel]');

    console.log('[atom:tabs] selector:', !!selector, '| tabs:', tabs.length, '| panels:', panels.length);

    if (!selector || !tabs.length) return;

    // Create indicator element
    let indicator = selector.querySelector('.tabs_indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'tabs_indicator';
      selector.appendChild(indicator);
      console.log('[atom:tabs] indicator created');
    }

    console.log('[atom:tabs] selector position:', getComputedStyle(selector).position);

    function updateIndicator(activeTab) {
      const selectorRect = selector.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      const left = tabRect.left - selectorRect.left;
      const top = tabRect.top - selectorRect.top;
      const width = tabRect.width;
      const height = tabRect.height;

      console.log('[atom:tabs] indicator move → left:', left, 'top:', top, 'w:', width, 'h:', height);

      indicator.style.left = left + 'px';
      indicator.style.top = top + 'px';
      indicator.style.width = width + 'px';
      indicator.style.height = height + 'px';
    }

    function activate(name) {
      console.log('[atom:tabs] activate:', name);
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
