// gsap-slider.js — GSAP Draggable slider with snap and controls
// Activation: [data-gsap-slider-init]. Uses window.gsap + Draggable from Webflow.
// InertiaPlugin loaded via script tag (UMD fails with ES module import()).

function waitFor(name, timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window[name]) return resolve(window[name]);
    const start = Date.now();
    const check = setInterval(() => {
      if (window[name]) { clearInterval(check); resolve(window[name]); }
      else if (Date.now() - start > timeout) { clearInterval(check); reject(new Error(name + ' not found')); }
    }, 50);
  });
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = url;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function initBasicGSAPSlider() {
  document.querySelectorAll('[data-gsap-slider-init]').forEach(root => {
    if (root._sliderDraggable) root._sliderDraggable.kill();

    const collection = root.querySelector('[data-gsap-slider-collection]');
    const track      = root.querySelector('[data-gsap-slider-list]');
    const items      = Array.from(root.querySelectorAll('[data-gsap-slider-item]'));
    const controls   = Array.from(root.querySelectorAll('[data-gsap-slider-control]'));

    if (!collection || !track || !items.length) return;

    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', 'Slider');
    collection.setAttribute('role', 'group');
    collection.setAttribute('aria-roledescription', 'Slides List');
    items.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'Slide');
      slide.setAttribute('aria-label', `Slide ${i + 1} of ${items.length}`);
      slide.setAttribute('aria-hidden', 'true');
      slide.setAttribute('aria-selected', 'false');
      slide.setAttribute('tabindex', '-1');
    });
    controls.forEach(btn => {
      const dir = btn.getAttribute('data-gsap-slider-control');
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', dir === 'prev' ? 'Previous Slide' : 'Next Slide');
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
    });

    const styles    = getComputedStyle(root);
    const statusVar = styles.getPropertyValue('--slider-status').trim();
    let   spvVar    = parseFloat(styles.getPropertyValue('--slider-spv'));
    const rect      = items[0].getBoundingClientRect();
    const marginR   = parseFloat(getComputedStyle(items[0]).marginRight);
    const slideW    = rect.width + marginR;
    if (isNaN(spvVar)) spvVar = collection.clientWidth / slideW;

    const spv           = Math.max(1, Math.min(spvVar, items.length));
    const sliderEnabled = statusVar === 'on' && spv < items.length;
    root.setAttribute('data-gsap-slider-status', sliderEnabled ? 'active' : 'not-active');

    if (!sliderEnabled) {
      track.removeAttribute('style');
      items.forEach(s => {
        s.removeAttribute('data-gsap-slider-item-status');
        s.removeAttribute('aria-hidden');
        s.removeAttribute('aria-selected');
        s.removeAttribute('tabindex');
      });
      controls.forEach(btn => { btn.disabled = false; });
      return;
    }

    track.onmouseenter = () => track.setAttribute('data-gsap-slider-list-status', 'grab');
    track.onmouseleave = () => track.removeAttribute('data-gsap-slider-list-status');

    const vw        = collection.clientWidth;
    const tw        = track.scrollWidth;
    const maxScroll = Math.max(tw - vw, 0);
    const minX      = -maxScroll;
    const maxX      = 0;
    const maxIndex  = maxScroll / slideW;
    const full      = Math.floor(maxIndex);
    const snapPoints = [];
    for (let i = 0; i <= full; i++) snapPoints.push(-i * slideW);
    if (full < maxIndex) snapPoints.push(-maxIndex * slideW);

    let activeIndex    = 0;
    const setX         = gsap.quickSetter(track, 'x', 'px');
    let collectionRect = collection.getBoundingClientRect();

    function updateStatus(x) {
      if (x > maxX || x < minX) return;
      const calcX = Math.max(minX, Math.min(maxX, x));
      let closest = snapPoints[0];
      snapPoints.forEach(pt => {
        if (Math.abs(pt - calcX) < Math.abs(closest - calcX)) closest = pt;
      });
      activeIndex = snapPoints.indexOf(closest);

      items.forEach((slide, i) => {
        const r      = slide.getBoundingClientRect();
        const left   = r.left - collectionRect.left;
        const center = left + r.width / 2;
        const inView = center > 0 && center < collectionRect.width;
        const status = i === activeIndex ? 'active' : inView ? 'inview' : 'not-active';
        slide.setAttribute('data-gsap-slider-item-status', status);
        slide.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
        slide.setAttribute('aria-hidden', inView ? 'false' : 'true');
        slide.setAttribute('tabindex', i === activeIndex ? '0' : '-1');
      });

      controls.forEach(btn => {
        const dir = btn.getAttribute('data-gsap-slider-control');
        const can = dir === 'prev' ? activeIndex > 0 : activeIndex < snapPoints.length - 1;
        btn.disabled = !can;
        btn.setAttribute('aria-disabled', can ? 'false' : 'true');
        btn.setAttribute('data-gsap-slider-control-status', can ? 'active' : 'not-active');
      });
    }

    controls.forEach(btn => {
      const dir = btn.getAttribute('data-gsap-slider-control');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.disabled) return;
        const target = activeIndex + (dir === 'next' ? 1 : -1);
        gsap.to(track, {
          duration: 0.4,
          x: snapPoints[target],
          onUpdate: () => updateStatus(gsap.getProperty(track, 'x'))
        });
      });
    });

    const draggableConfig = {
      type: 'x',
      bounds: { minX, maxX },
      edgeResistance: 0.75,
      snap: { x: snapPoints, duration: 0.4 },
      onPress()         { track.setAttribute('data-gsap-slider-list-status', 'grabbing'); collectionRect = collection.getBoundingClientRect(); },
      onDrag()          { setX(this.x); updateStatus(this.x); },
      onRelease()       { setX(this.x); updateStatus(this.x); track.setAttribute('data-gsap-slider-list-status', 'grab'); }
    };

    if (window.InertiaPlugin) {
      draggableConfig.inertia = true;
      draggableConfig.throwResistance = 2000;
      draggableConfig.dragResistance = 0.05;
      draggableConfig.maxDuration = 0.6;
      draggableConfig.minDuration = 0.2;
      draggableConfig.onThrowUpdate = function () { setX(this.x); updateStatus(this.x); };
      draggableConfig.onThrowComplete = function () { setX(this.endX); updateStatus(this.endX); track.setAttribute('data-gsap-slider-list-status', 'grab'); };
    }

    root._sliderDraggable = Draggable.create(track, draggableConfig)[0];
    setX(0);
    updateStatus(0);
  });
}

function debounceOnWidthChange(fn, ms) {
  let last = innerWidth, timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => { if (innerWidth !== last) { last = innerWidth; fn.apply(this, args); } }, ms);
  };
}

export async function init() {
  const gsap = await waitFor('gsap');
  await waitFor('Draggable');

  // InertiaPlugin: try to load, non-blocking — slider works without it
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.15/dist/InertiaPlugin.min.js');
    await waitFor('InertiaPlugin', 2000);
    gsap.registerPlugin(InertiaPlugin);
  } catch (_) {
    console.warn('[atom:gsap-slider] InertiaPlugin not available, using snap without inertia');
  }

  gsap.registerPlugin(Draggable);
  initBasicGSAPSlider();
  window.addEventListener('resize', debounceOnWidthChange(initBasicGSAPSlider, 200));
}
