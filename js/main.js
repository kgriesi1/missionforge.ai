/* ============================================================
   MISSION FORGE AI — Main JavaScript
   ============================================================ */

// --- Navigation scroll behavior ---
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// --- Mobile nav toggle ---
(function () {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  let open = false;

  toggle.addEventListener('click', () => {
    open = !open;
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';

    // Animate hamburger to X
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      const spans = toggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

// --- Scroll-triggered fade-up animations ---
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));
})();

// --- Contact form submission (Formspree-ready) ---
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form));

    // If using Formspree: replace action URL in the HTML
    // Otherwise this fires a mailto fallback
    try {
      const action = form.getAttribute('action');
      if (action && action.startsWith('https://formspree.io')) {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          showFormSuccess(form);
        } else {
          fallbackMailto(data);
        }
      } else {
        fallbackMailto(data);
      }
    } catch {
      fallbackMailto(data);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });

  function showFormSuccess(form) {
    const msg = document.createElement('div');
    msg.style.cssText = `
      padding: 24px 32px;
      background: rgba(196,154,60,0.1);
      border: 1px solid rgba(196,154,60,0.3);
      color: #09172E;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-top: 16px;
    `;
    msg.innerHTML = `<strong>Thank you for reaching out.</strong><br>We will be in touch with you shortly.`;
    form.after(msg);
    form.style.display = 'none';
  }

  function fallbackMailto(data) {
    const subject = encodeURIComponent('Inquiry from missionforge.ai');
    const body    = encodeURIComponent(
      `Name: ${data.name || ''}\nOrganization: ${data.organization || ''}\nEmail: ${data.email || ''}\nPhone: ${data.phone || ''}\n\nMessage:\n${data.message || ''}`
    );
    window.location.href = `mailto:ken@missionforge.ai?subject=${subject}&body=${body}`;
  }
})();

// --- Active nav link detection ---
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// --- Cookie Consent Banner ---
(function () {
  const STORAGE_KEY = 'mf_cookie_consent';

  // If the user has already made a choice, do nothing
  if (localStorage.getItem(STORAGE_KEY)) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.innerHTML = [
    '<div class="cookie-banner__inner">',
    '  <p class="cookie-banner__text">',
    '    We use essential cookies to keep this site running. With your permission, we may also use analytics cookies to understand how visitors engage with our content.',
    '    See our <a href="privacy.html">Privacy Policy</a> for full details.',
    '  </p>',
    '  <div class="cookie-banner__actions">',
    '    <button class="cookie-btn cookie-btn--essential" id="cookieBtnEssential">Essential Only</button>',
    '    <button class="cookie-btn cookie-btn--accept" id="cookieBtnAccept">Accept All</button>',
    '  </div>',
    '</div>'
  ].join('');

  document.body.appendChild(banner);

  // Slide in after paint
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      banner.classList.add('visible');
    });
  });

  function dismiss(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    banner.classList.remove('visible');
    setTimeout(function () { banner.remove(); }, 450);
  }

  document.getElementById('cookieBtnAccept').addEventListener('click', function () {
    dismiss('all');
  });

  document.getElementById('cookieBtnEssential').addEventListener('click', function () {
    dismiss('essential');
  });
})();
