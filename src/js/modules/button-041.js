// button-041.js — Animated button con SplitText por caracter
// Fuente: https://ui.dev/buttons/button-041
// Webflow: agregar data-module="button-041" al wrapper de la seccion
// que contenga botones con [data-button-041].

import { gsap }      from 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.esm.min.js';
import { SplitText } from 'https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.esm.min.js';

gsap.registerPlugin(SplitText);

export function init(container = document) {
  const buttons = container.querySelectorAll('[data-button-041]');
  if (!buttons.length) return;

  // Esperar fuentes para split correcto
  document.fonts.ready.then(() => {
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
  });
}
