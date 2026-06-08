// feature-tabs.js — Tabbed content with GSAP animations + autoplay progress bar
// Activates via [data-tabs="wrapper"] on an inner element (not the component root).
// Requires window.gsap (Webflow 3.15.0). Uses waitForGSAP due to Cloudflare Rocket Loader.

function waitForGSAP(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window.gsap) return resolve(window.gsap);
    const start = Date.now();
    const check = setInterval(() => {
      if (window.gsap) { clearInterval(check); resolve(window.gsap); }
      else if (Date.now() - start > timeout) { clearInterval(check); reject(new Error('[atom] gsap not found')); }
    }, 50);
  });
}

export async function init() {
  const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');
  if (!wrappers.length) return;

  let gsap;
  try { gsap = await waitForGSAP(); }
  catch (e) { console.warn(e.message); return; }

  wrappers.forEach((wrapper) => {
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
    const visualItems  = wrapper.querySelectorAll('[data-tabs="visual-item"]');

    const autoplay         = wrapper.dataset.tabsAutoplay === 'true';
    const autoplayDuration = parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;

    let activeContent    = null;
    let activeVisual     = null;
    let isAnimating      = false;
    let progressBarTween = null;

    function startProgressBar(index) {
      if (progressBarTween) progressBarTween.kill();
      const bar = contentItems[index].querySelector('[data-tabs="item-progress"]');
      if (!bar) return;
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
      progressBarTween = gsap.to(bar, {
        scaleX: 1,
        duration: autoplayDuration / 1000,
        ease: 'power1.inOut',
        onComplete: () => {
          if (!isAnimating) switchTab((index + 1) % contentItems.length);
        },
      });
    }

    function switchTab(index) {
      if (isAnimating || contentItems[index] === activeContent) return;
      isAnimating = true;
      if (progressBarTween) progressBarTween.kill();

      const outgoingContent = activeContent;
      const outgoingVisual  = activeVisual;
      const outgoingBar     = outgoingContent?.querySelector('[data-tabs="item-progress"]');
      const incomingContent = contentItems[index];
      const incomingVisual  = visualItems[index];
      const incomingBar     = incomingContent.querySelector('[data-tabs="item-progress"]');

      const tl = gsap.timeline({
        defaults: { duration: 0.65, ease: 'power3' },
        onComplete: () => {
          activeContent = incomingContent;
          activeVisual  = incomingVisual;
          isAnimating   = false;
          if (autoplay) startProgressBar(index);
        },
      });

      if (outgoingContent) {
        outgoingContent.classList.remove('active');
        outgoingVisual?.classList.remove('active');
        tl.set(outgoingBar, { transformOrigin: 'right center' })
          .to(outgoingBar,  { scaleX: 0, duration: 0.3 }, 0)
          .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0)
          .to(outgoingContent.querySelector('[data-tabs="item-details"]'), { height: 0 }, 0);
      }

      incomingContent.classList.add('active');
      incomingVisual.classList.add('active');
      tl.fromTo(incomingVisual, { autoAlpha: 0, xPercent: 3 }, { autoAlpha: 1, xPercent: 0 }, 0.3)
        .fromTo(incomingContent.querySelector('[data-tabs="item-details"]'), { height: 0 }, { height: 'auto' }, 0)
        .set(incomingBar, { scaleX: 0, transformOrigin: 'left center' }, 0);
    }

    switchTab(0);

    contentItems.forEach((item, i) =>
      item.addEventListener('click', (e) => {
        e.preventDefault();
        if (item === activeContent) return;
        switchTab(i);
      })
    );
  });
}
