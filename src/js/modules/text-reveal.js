// text-reveal.js — Bold scroll reveal for headings (GSAP + ScrollTrigger + SplitText)
// Activation: [data-split="heading"]. Optional [data-split-reveal="lines|words|chars"] (default "words").
//
// Effect: masked slide-up — each line/word sits below an overflow-clip edge and
// rises into place (expo.out). No blur, no scale.
//
// Inheritance note: the page also runs content-reveal.js ([data-reveal-group]) which
// fades+slides each section block on enter. Headings live inside those blocks, so the
// reveal fires slightly later (top 75%) than the block reveal (top 80%), so it reads on
// an already-visible block instead of competing with it.
//
// Webflow ships gsap/ScrollTrigger/SplitText (3.15.0) but Cloudflare Rocket Loader
// defers them, so we poll for the globals before using them.

function waitFor(check, timeout = 6000) {
  return new Promise((resolve, reject) => {
    if (check()) return resolve();
    const start = Date.now();
    const t = setInterval(() => {
      if (check()) { clearInterval(t); resolve(); }
      else if (Date.now() - start > timeout) { clearInterval(t); reject(new Error('[atom] gsap/ScrollTrigger not ready')); }
    }, 50);
  });
}

// Prefer Webflow's deferred SplitText; fall back to the public UMD build.
async function ensureSplitText(gsap) {
  try { await waitFor(() => window.SplitText, 2500); } catch (_) { /* fall through to import */ }
  if (!window.SplitText) {
    try { await import('https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js'); } catch (_) { /* no-op */ }
  }
  if (window.SplitText) { gsap.registerPlugin(window.SplitText); return window.SplitText; }
  return null;
}

// Per split-type timing
const config = {
  lines: { stagger: 0.12, duration: 0.9 },
  words: { stagger: 0.05, duration: 0.7 },
  chars: { stagger: 0.015, duration: 0.5 },
};

export async function init(container = document) {
  const headings = container.querySelectorAll('[data-split="heading"]');
  if (!headings.length) return;

  try {
    await waitFor(() => window.gsap && window.ScrollTrigger);
  } catch (e) {
    headings.forEach((h) => { h.style.visibility = 'visible'; }); // never leave text hidden
    console.warn(e.message);
    return;
  }

  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  // Reduced motion: reveal without animating
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(headings, { autoAlpha: 1 });
    return;
  }

  const SplitText = await ensureSplitText(gsap);
  await document.fonts.ready;

  headings.forEach((heading) => {
    gsap.set(heading, { autoAlpha: 1 }); // clear the CSS FOUC hide

    // Skip gradient text: SplitText wraps words in their own boxes, which
    // breaks the parent's background-clip:text gradient. Just reveal it.
    if (heading.matches('[class*="gradient"]') || heading.querySelector('[class*="gradient"]')) {
      return;
    }

    const type = heading.dataset.splitReveal || 'lines';

    // Masked slide-up: each piece sits below an overflow-clip edge and rises into place
    const reveal = (targets, cfg) =>
      gsap.from(targets, {
        yPercent: 100,
        duration: cfg.duration,
        ease: 'expo.out',
        stagger: cfg.stagger,
        scrollTrigger: {
          trigger: heading,
          start: 'top 75%', // after the block reveal (top 80%) so it reads distinctly
          once: true,
        },
      });

    if (SplitText) {
      const typesToSplit =
        type === 'lines' ? ['lines'] :
        type === 'chars' ? ['lines', 'words', 'chars'] :
        ['lines', 'words'];

      SplitText.create(heading, {
        type: typesToSplit.join(', '),
        mask: type, // wrap each piece in an overflow-clip mask for the slide-up
        autoSplit: true,
        linesClass: 'line',
        wordsClass: 'word',
        charsClass: 'letter',
        onSplit(instance) {
          const targets = instance[type] || instance.lines || instance.words;
          return reveal(targets, config[type] || config.lines);
        },
      });
    } else {
      // Fallback when SplitText is unavailable — slide the whole heading up
      reveal(heading, config.lines);
    }
  });
}
