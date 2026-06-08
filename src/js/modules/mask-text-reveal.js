// mask-text-reveal.js — Scroll-triggered masked text reveal (GSAP SplitText + ScrollTrigger)
// Canonical ref: osmo.supply / GSAP SplitText masked reveal.
// Activation: [data-split="heading"]. Optional [data-split-reveal="lines|words|chars"] (default "lines").
// GSAP + ScrollTrigger come from Webflow (3.15.0); SplitText is loaded via UMD.
// Rocket Loader defers GSAP, so we poll for window.gsap.

function waitForGSAP(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window.gsap) return resolve(window.gsap);
    const start = Date.now();
    const check = setInterval(() => {
      if (window.gsap) { clearInterval(check); resolve(window.gsap); }
      else if (Date.now() - start > timeout) { clearInterval(check); reject(new Error('[atom] gsap not found — Webflow GSAP may be disabled')); }
    }, 50);
  });
}

async function loadPlugins(gsap) {
  if (!window.SplitText) {
    await import('https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js');
  }
  if (!window.ScrollTrigger) {
    await import('https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js');
  }
  gsap.registerPlugin(window.SplitText, window.ScrollTrigger);
}

// Per split-type defaults — tweak duration/stagger here.
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 },
};

export async function init(container = document) {
  const headings = container.querySelectorAll('[data-split="heading"]');
  if (!headings.length) return;

  let gsap;
  try {
    gsap = await waitForGSAP();
  } catch (e) {
    // Never leave the text hidden if GSAP is unavailable
    headings.forEach((h) => { h.style.visibility = 'visible'; });
    console.warn(e.message);
    return;
  }

  // Respect reduced-motion: reveal without animating
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(headings, { autoAlpha: 1 });
    return;
  }

  try {
    await loadPlugins(gsap);
  } catch (e) {
    gsap.set(headings, { autoAlpha: 1 });
    console.warn('[atom] SplitText/ScrollTrigger failed to load:', e);
    return;
  }

  // Split after fonts load so line breaks are measured correctly
  await document.fonts.ready;

  headings.forEach((heading) => {
    gsap.set(heading, { autoAlpha: 1 }); // clear the CSS FOUC hide right before splitting

    const type = heading.dataset.splitReveal || 'lines';
    const typesToSplit =
      type === 'lines' ? ['lines'] :
      type === 'words' ? ['lines', 'words'] :
      ['lines', 'words', 'chars'];

    window.SplitText.create(heading, {
      type: typesToSplit.join(', '),
      mask: 'lines',        // wrap each line in an overflow:hidden div for the mask effect
      autoSplit: true,      // re-split on resize/font change; reverts the previous tween
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit(instance) {
        const targets = instance[type];
        const config = splitConfig[type] || splitConfig.lines;
        return gsap.from(targets, {
          yPercent: 110,
          duration: config.duration,
          stagger: config.stagger,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: heading,
            start: 'clamp(top 80%)', // clamp keeps it starting from 0 even if already in view
            once: true,
          },
        });
      },
    });
  });
}
