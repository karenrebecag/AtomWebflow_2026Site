// tabs.js — Tabbed content switcher
// Activates via [data-tabs-init]. Tabs: data-tab="name", panels: data-tab-panel="name".

export function init() {
  const containers = document.querySelectorAll('[data-tabs-init]');
  console.log('[atom:tabs] found', containers.length, 'tab container(s)');

  containers.forEach((container) => {
    const tabs = container.querySelectorAll('[data-tab]');
    const panels = container.querySelectorAll('[data-tab-panel]');
    console.log('[atom:tabs] tabs:', tabs.length, '| panels:', panels.length);
    console.log('[atom:tabs] tab names:', Array.from(tabs).map(t => t.getAttribute('data-tab')));
    console.log('[atom:tabs] panel names:', Array.from(panels).map(p => p.getAttribute('data-tab-panel')));

    function activate(name) {
      console.log('[atom:tabs] activating:', name);
      tabs.forEach((tab) => {
        const isMatch = tab.getAttribute('data-tab') === name;
        tab.setAttribute('data-tab-status', isMatch ? 'active' : 'not-active');
      });

      panels.forEach((panel) => {
        const isMatch = panel.getAttribute('data-tab-panel') === name;
        panel.style.display = isMatch ? 'grid' : 'none';
        console.log('[atom:tabs] panel', panel.getAttribute('data-tab-panel'), isMatch ? 'SHOW' : 'hide');
      });
    }

    container.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-tab]');
      if (!tab || !container.contains(tab)) {
        console.log('[atom:tabs] click ignored — not on a tab');
        return;
      }
      console.log('[atom:tabs] clicked:', tab.getAttribute('data-tab'));
      activate(tab.getAttribute('data-tab'));
    });

    // First tab active by default
    if (tabs.length) {
      console.log('[atom:tabs] init: activating first tab:', tabs[0].getAttribute('data-tab'));
      activate(tabs[0].getAttribute('data-tab'));
    }
  });
}
