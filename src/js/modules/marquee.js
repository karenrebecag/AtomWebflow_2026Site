// marquee.js — CSS Marquee following osmo.supply spec exactly
// 1. Duplicates [data-css-marquee-list] for seamless loop
// 2. Calculates animation duration from track width
// 3. Pauses when out of viewport via IntersectionObserver

function waitForImages(scope) {
  const imgs = [...scope.querySelectorAll('img')];
  if (!imgs.length) return Promise.resolve();
  return Promise.all(imgs.map(img =>
    (img.complete && img.naturalWidth)
      ? Promise.resolve()
      : new Promise(res => {
          img.addEventListener('load', res, { once: true });
          img.addEventListener('error', res, { once: true });
        })
  ));
}

export function init() {
  const DEFAULT_PPS = 75;
  const marquees = document.querySelectorAll('[data-css-marquee]');

  // Duplicate each list inside its marquee container
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });
  });

  // IntersectionObserver: play when in view, pause when out
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.querySelectorAll('[data-css-marquee-list]').forEach(list => {
        list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    });
  }, { threshold: 0 });

  // Calculate duration from width and observe.
  // Velocidad por-marquee via data-css-marquee-speed (px/s); default 75.
  // Espera a que las imagenes carguen antes de medir el ancho (si no, offsetWidth
  // puede ser 0 → animation-duration: 0s → no se mueve).
  marquees.forEach(async marquee => {
    const pps = parseFloat(marquee.getAttribute('data-css-marquee-speed')) || DEFAULT_PPS;
    await waitForImages(marquee);
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const seconds = list.offsetWidth / pps;
      if (seconds > 0) list.style.animationDuration = seconds + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}
