/* ===========================
   BISNISNET — Global JavaScript
   =========================== */

/* ── Navbar scroll state ── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile nav burger ── */
(function () {
  const burger = document.querySelector('.nav-burger');
  const links  = document.querySelector('.nav-links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('mobile-open');
    burger.setAttribute('aria-expanded', open);
    burger.querySelectorAll('span')[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
    burger.querySelectorAll('span')[1].style.opacity   = open ? '0' : '';
    burger.querySelectorAll('span')[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  });

  /* Close on link click */
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('mobile-open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    })
  );
})();

/* ── Mark active nav link ── */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Intersection Observer reveal ── */
(function () {
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── Chip filter ── */
function initChips(barSelector, itemSelector, key) {
  const bar = document.querySelector(barSelector);
  if (!bar) return;
  bar.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      bar.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.dataset.filter;
      document.querySelectorAll(itemSelector).forEach(item => {
        const match = val === 'all' || (item.dataset[key] || '').toLowerCase().includes(val.toLowerCase());
        item.style.display = match ? '' : 'none';
      });
    });
  });
}

/* ── Toast notification ── */
function showToast(msg, icon = '✓') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-icon"><svg width="12" height="12" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div><span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── Smooth counter animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const dur = 1400;
  const start = performance.now();
  const step = ts => {
    const prog = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.round(target * ease) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}
initCounters();
