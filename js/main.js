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
    window.location.href = 'contact.html';
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

// ============================================================
// AI READINESS ASSESSMENT
// ============================================================
(function () {
  var card = document.getElementById('assessmentCard');
  if (!card) return;

  var questions = [
    {
      q: "How would you describe your organization's current AI strategy?",
      opts: [
        "We don't have one yet",
        "We have ideas but nothing formal",
        "We have a clear, documented AI strategy"
      ]
    },
    {
      q: "How would you describe your data infrastructure?",
      opts: [
        "Fragmented: siloed systems, inconsistent quality",
        "Centralized but not well-organized or governed",
        "Well-structured, accessible, and documented"
      ]
    },
    {
      q: "How aligned is your leadership team on AI priorities?",
      opts: [
        "AI is on the radar but not yet a priority",
        "Leadership is interested but not fully committed",
        "Leadership is actively driving AI adoption"
      ]
    },
    {
      q: "Have you attempted AI initiatives before?",
      opts: [
        "Not yet, we're exploring for the first time",
        "Yes, with limited or mixed results",
        "Yes, with successes we're ready to scale"
      ]
    },
    {
      q: "What is your biggest barrier to AI adoption?",
      opts: [
        "Not knowing where to start",
        "Data quality, infrastructure, or skills gaps",
        "Scaling pilots and managing organizational change"
      ]
    }
  ];

  var tiers = [
    {
      name: "Emerging",
      min: 5, max: 8,
      msg: "Your organization is at the starting line, and that's exactly where the most important decisions get made. A focused first engagement can build the right foundation and prevent the most costly mistakes."
    },
    {
      name: "Building",
      min: 9, max: 12,
      msg: "You have momentum and a foundation to build on. With the right strategy and the right team, you can turn that foundation into measurable outcomes, faster than you might expect."
    },
    {
      name: "Leading",
      min: 13, max: 15,
      msg: "You are positioned to scale. The question is whether your current approach will take you there. Let's find the gaps and close them together."
    }
  ];

  var current = 0;
  var answers = [];
  var track = document.getElementById('assessTrack');
  var body = document.getElementById('assessBody');

  function setProgress(pct) {
    track.style.width = pct + '%';
  }

  function renderQ(index) {
    setProgress(Math.round((index / questions.length) * 100));
    var q = questions[index];
    var isLast = index === questions.length - 1;
    body.innerHTML =
      '<div class="assessment-counter">Question ' + (index + 1) + ' of ' + questions.length + '</div>' +
      '<div class="assessment-q">' + q.q + '</div>' +
      '<div class="assessment-opts">' +
        q.opts.map(function (opt, i) {
          return '<button class="assessment-opt" data-v="' + (i + 1) + '">' + opt + '</button>';
        }).join('') +
      '</div>' +
      '<div class="assessment-nav">' +
        '<button class="btn btn--gold assessment-next" id="assessNext" disabled>' +
          (isLast ? 'See My Results' : 'Next') +
        '</button>' +
      '</div>';

    var selected = null;
    body.querySelectorAll('.assessment-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        body.querySelectorAll('.assessment-opt').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        selected = parseInt(btn.getAttribute('data-v'));
        var next = document.getElementById('assessNext');
        next.disabled = false;
        next.classList.add('ready');
      });
    });

    document.getElementById('assessNext').addEventListener('click', function () {
      if (selected === null) return;
      answers[index] = selected;
      if (index + 1 < questions.length) {
        current++;
        renderQ(current);
      } else {
        showEmailCapture();
      }
    });
  }

  function showEmailCapture() {
    setProgress(100);
    body.innerHTML =
      '<div class="assessment-result-inner">' +
        '<div class="assessment-tier-label">Your Results Are Ready</div>' +
        '<p class="assessment-tier-msg" style="margin-bottom:24px;">Enter your email to see your personalized AI readiness score and recommended next steps.</p>' +
        '<div style="margin-bottom:12px;">' +
          '<input type="email" id="assessEmail" placeholder="your@email.com" style="width:100%;padding:13px 16px;border:1.5px solid #ddd;border-radius:3px;font-size:.95rem;font-family:inherit;outline:none;box-sizing:border-box;" />' +
        '</div>' +
        '<button class="btn btn--gold assessment-next ready" id="seeResultsBtn" style="width:100%;justify-content:center;pointer-events:auto;opacity:1;">See My Results</button>' +
        '<p style="font-size:.75rem;color:var(--text-secondary);margin-top:12px;">No spam. Just your score and a path forward.</p>' +
      '</div>';

    document.getElementById('seeResultsBtn').addEventListener('click', function () {
      var emailInput = document.getElementById('assessEmail');
      var email = emailInput.value.trim();
      if (!email || email.indexOf('@') === -1) {
        emailInput.style.borderColor = '#c0392b';
        emailInput.focus();
        return;
      }
      emailInput.style.borderColor = '#ddd';
      showResult(email);
    });
  }

  function showResult(email) {
    var total = answers.reduce(function (a, b) { return a + b; }, 0);
    var tier = tiers.find(function (t) { return total >= t.min && total <= t.max; }) || tiers[0];
    var contactHref = 'contact.html?score=' + encodeURIComponent(tier.name) + (email ? '&email=' + encodeURIComponent(email) : '');
    body.innerHTML =
      '<div class="assessment-result-inner">' +
        '<div class="assessment-tier-label">Your AI Readiness Level</div>' +
        '<div class="assessment-tier-name">' + tier.name + '</div>' +
        '<p class="assessment-tier-msg">' + tier.msg + '</p>' +
        '<div class="assessment-ctas">' +
          '<a href="' + contactHref + '" class="btn btn--gold btn--arrow">Start the Conversation</a>' +
          '<button class="assessment-retake" id="retakeBtn">Retake the Assessment</button>' +
        '</div>' +
      '</div>';

    document.getElementById('retakeBtn').addEventListener('click', function () {
      current = 0;
      answers = [];
      setProgress(0);
      renderQ(0);
    });
  }

  renderQ(0);
})();
