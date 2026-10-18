// cuiqanalytics.com: copy buttons (theme toggle lives in brand/brand.js)
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); } catch { return; }
    btn.textContent = 'Copied'; btn.classList.add('done');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1600);
  });
});

// Hero loop: pause when off-screen, and never autoplay for people who asked for less motion.
const loop = document.querySelector('.hero-loop');
if (loop) {
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  if (still.matches) { loop.removeAttribute('autoplay'); loop.pause(); loop.controls = true; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      if (still.matches) return;
      if (e.isIntersecting) loop.play().catch(() => {}); else loop.pause();
    }).observe(loop);
  }
}

// Overview video in a dialog: play on open, stop on close.
document.querySelectorAll('[data-open]').forEach((btn) => {
  const dlg = document.getElementById(btn.dataset.open);
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const vid = dlg.querySelector('video');
  btn.addEventListener('click', () => { dlg.showModal(); loop && loop.pause(); vid.play().catch(() => {}); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { vid.pause(); if (loop && !matchMedia('(prefers-reduced-motion: reduce)').matches) loop.play().catch(() => {}); });
});
