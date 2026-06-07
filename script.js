document.addEventListener('DOMContentLoaded', () => {

  // ── 1. STICKY NAV ON SCROLL ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── 2. MOBILE MENU TOGGLE ──
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
      mobileBtn.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', false);
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!mobileBtn.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', false);
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }

  // ── 3. SCROLL REVEAL ──
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  // ── 4. SMOOTH SCROLL for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── 5. LIVE OPEN / CLOSED STATUS ──
  const openPill = document.getElementById('open-status');
  const openLabel = document.getElementById('open-label');
  const openDot = document.getElementById('open-dot');
  if (openPill && openLabel) {
    // hours: [openH, openM, closeH, closeM] | null = closed
    const hours = {
      0: [10, 0, 18, 0],   // Sun
      1: null,              // Mon — closed
      2: [9,  0, 19, 0],   // Tue
      3: [9,  0, 19, 0],   // Wed
      4: [9,  0, 19, 0],   // Thu
      5: [9,  0, 19, 0],   // Fri
      6: [9,  0, 18, 0],   // Sat
    };
    const fmt = (h, m) => {
      const suf = h < 12 ? 'AM' : 'PM';
      const hh = h % 12 || 12;
      return `${hh}${m ? ':' + String(m).padStart(2,'0') : ''} ${suf}`;
    };
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Kentucky/Louisville' }));
    const day = now.getDay();
    const cur = now.getHours() * 60 + now.getMinutes();
    const sch = hours[day];
    const isOpen = sch && cur >= sch[0]*60+sch[1] && cur < sch[2]*60+sch[3];

    if (isOpen) {
      openLabel.textContent = `Open now — closes ${fmt(sch[2], sch[3])}`;
      openPill.style.background = '#e8f8ee';
      openPill.style.color = '#1e6e35';
      if (openDot) openDot.style.background = '#2ecc71';
    } else {
      let nd = null, ns = null;
      for (let i = 1; i <= 7; i++) {
        const d = (day + i) % 7;
        if (hours[d]) { nd = d; ns = hours[d]; break; }
      }
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      openLabel.textContent = `Closed — opens ${days[nd]} at ${fmt(ns[0], ns[1])}`;
      openPill.style.background = '#fdecea';
      openPill.style.color = '#922b21';
      if (openDot) openDot.style.background = '#e74c3c';
    }
  }

  // ── 6. BEFORE / AFTER SLIDERS ──
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const handle  = slider.querySelector('.ba-handle');
    const resize  = slider.querySelector('.ba-resize');
    const resizeImg = resize ? resize.querySelector('img') : null;
    let dragging = false;

    const syncImgWidth = () => {
      if (resizeImg) resizeImg.style.width = slider.offsetWidth + 'px';
    };
    syncImgWidth();
    window.addEventListener('resize', syncImgWidth, { passive: true });

    const move = (clientX) => {
      if (!dragging) return;
      const rect = slider.getBoundingClientRect();
      let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const pct = (x / rect.width) * 100;
      if (handle) handle.style.left = pct + '%';
      if (resize) resize.style.width = pct + '%';
    };

    handle && handle.addEventListener('mousedown',  () => dragging = true);
    slider.addEventListener('mousedown',  () => dragging = true);
    window.addEventListener('mouseup',   () => dragging = false);
    window.addEventListener('mousemove', e => move(e.clientX));

    handle && handle.addEventListener('touchstart',  () => dragging = true, { passive: true });
    slider.addEventListener('touchstart',  () => dragging = true, { passive: true });
    window.addEventListener('touchend',   () => dragging = false);
    window.addEventListener('touchmove',  e => move(e.touches[0].clientX), { passive: true });
  });

  // ── 7. ACTIVE NAV LINK (highlight current page) ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

});
