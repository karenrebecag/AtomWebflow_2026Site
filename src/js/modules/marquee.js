// marquee.js — CSS Marquee following osmo.supply spec exactly
// 1. Duplicates [data-css-marquee-list] for seamless loop
// 2. Calculates animation duration from track width
// 3. Pauses when out of viewport via IntersectionObserver

export function init() {
  const pixelsPerSecond = 75;
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

  // Calculate duration from width and observe
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      list.style.animationDuration = (list.offsetWidth / pixelsPerSecond) + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}
