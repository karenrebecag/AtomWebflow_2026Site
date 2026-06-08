// text-reveal.js — Bold scroll reveal for headings (GSAP + ScrollTrigger + SplitText)
// Activation: [data-split="heading"]. Optional [data-split-reveal="lines|words|chars"] (default "words").
//
// Inheritance note: the page also runs content-reveal.js ([data-reveal-group]) which
// fades+slides each section block on enter. Headings live inside those blocks, so a
// subtle text effect gets masked by the block fade. This effect is deliberately bold
// (blur + scale + travel) and fires slightly later (top 72%) than the block reveal
// (top 80%), so it reads on an already-visible block instead of competing with it.
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
  words: { stagger: 0.06, duration: 0.9 },
  lines: { stagger: 0.12, duration: 1.0 },
  chars: { stagger: 0.02, duration: 0.7 },
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

    const type = heading.dataset.splitReveal || 'words';

    const reveal = (targets, cfg) =>
      gsap.from(targets, {
        autoAlpha: 0,
        yPercent: 60,
        scale: 0.8,
        filter: 'blur(12px)',
        transformOrigin: '50% 100%',
        duration: cfg.duration,
        ease: 'power3.out',
        stagger: cfg.stagger,
        scrollTrigger: {
          trigger: heading,
          start: 'top 72%', // later than the block reveal (top 80%) so it reads distinctly
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
        autoSplit: true,
        linesClass: 'line',
        wordsClass: 'word',
        charsClass: 'letter',
        onSplit(instance) {
          const targets = instance[type] || instance.words || instance.lines;
          return reveal(targets, config[type] || config.words);
        },
      });
    } else {
      // Fallback when SplitText is unavailable — animate the whole heading (still bold)
      reveal(heading, config.lines);
    }
  });
}
