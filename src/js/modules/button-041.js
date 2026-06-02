// button-041.js — Animated button con SplitText por caracter
// Canonical ref: https://ui.dev/buttons/button-041
// GSAP lo provee Webflow nativamente (3.15.0) — solo cargamos SplitText.
// Rocket Loader defiere GSAP, asi que esperamos a que exista en window.

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

async function loadSplitText(gsap) {
  if (window.SplitText) return window.SplitText;
  await import('https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js');
  gsap.registerPlugin(window.SplitText);
  return window.SplitText;
}

export async function init(container = document) {
  const buttons = container.querySelectorAll('[data-button-041]');
  if (!buttons.length) return;

  const gsap = await waitForGSAP();
  await loadSplitText(gsap);

  await document.fonts.ready;

  buttons.forEach(el => {
    const textEls = el.querySelectorAll('[data-button-041-text]');
    if (!textEls.length) return;

    textEls.forEach(textEl => {
      const isAriaHidden = textEl.getAttribute('aria-hidden') === 'true';
      const split = new SplitText(textEl, {
        type: 'chars',
        tag: 'span',
        charsClass: 'button-041__split-char',
        propIndex: true,
        aria: isAriaHidden ? 'none' : 'auto',
      });

      gsap.set(split.chars, { display: 'inline-block' });
    });
  });
}
