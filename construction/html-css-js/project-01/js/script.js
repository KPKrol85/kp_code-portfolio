/* ======================================================================
  [00] Utils — header height source of truth
  [01] Navigation — mobile toggle + "Oferta" dropdown (a11y-first)
  [02] ScrollSpy — active links + prefer deepest subsection
  [03] Footer Year — auto-insert current year into <span id="year">
  [04] Smooth scroll to top
  [05] Skip-Next — 2 steps: Oferta → Kontakt (form)
  [06] Contact Form — honeypot, validation, a11y, phone mask, mock submit
  [07] Header — shrink state + precise --header-h (Fonts & ResizeObserver)
  [08] Theme Toggle — localStorage + system preference + a11y
  [09] Ripple — CTA "Wycena" (respects prefers-reduced-motion)
  [10] Hero — ultra-wide blur synced with <picture>
  [11] Lightbox — accessible preview for #oferta .card thumbnails
  [12] "Oferta" — horizontal scroller (snap + masks + arrows) 
  [13] Prefetch on hover/focus (offer subpages)
  [14] Home helpers — scroll-top URL cleanup + ?usluga prefill
====================================================================== */

/* ======================================================================
 * [00] Utils — header height source of truth
 * Responsibilities:
 *   - Provide the current header height in px for all features (scrollspy, smooth anchors, etc.)
 *   - Keep the CSS var --header-h in sync when requested
 * Caching:
 *   - Memoized per viewport width (RWD); cache is cleared on resize
 * Public API:
 *   - utils.getHeaderH()          -> number (px)
 *   - utils.refreshHeaderH()      -> number (px), forces recompute
 *   - utils.syncHeaderCssVar()    -> number (px), writes --header-h
 * DOM:
 *   - Reads: <header class="site-header"> (or header[role="banner"])
 * Perf:
 *   - Minimal layout reads; only measures when needed
 * ====================================================================== */
const utils = (() => {
  const docEl = document.documentElement;
  const headerSel = '.site-header, header[role="banner"]';

  /** Returns the header element or null */
  const qHeader = () => document.querySelector(headerSel);

  /** Reads a CSS custom property in px and returns its numeric value (0 if missing) */
  const readCssVarPx = (name) => {
    const raw = getComputedStyle(docEl).getPropertyValue(name);
    const v = parseFloat(raw); // works both for "74" and "74px"
    return Number.isFinite(v) ? v : 0;
  };

  /** Measures header height in px using geometry (sub-pixel safe) */
  const measureHeaderPx = () => {
    const el = qHeader();
    return el ? Math.round(el.getBoundingClientRect().height) : 0;
  };

  /** Computes header height:
   *  1) try CSS var --header-h; 2) fallback to live measure; 3) safe default
   */
  const computeHeaderH = () => {
    const fromVar = readCssVarPx('--header-h');
    const val = fromVar > 0 ? fromVar : measureHeaderPx();
    return val > 0 ? val : 74;
  };

  // Cache by viewport width (basic RWD memoization)
  let cached = null;
  let lastW = 0;

  /** Returns memoized header height (px). Recomputes on width change. */
  const getHeaderH = () => {
    const w = window.innerWidth || 0;
    if (cached != null && w === lastW) return cached;
    cached = computeHeaderH();
    lastW = w;
    return cached;
  };

  /** Clears cache and returns fresh value (px). */
  const refreshHeaderH = () => {
    cached = null;
    return getHeaderH();
  };

  /** Writes --header-h to :root and updates cache. Returns height (px). */
  const syncHeaderCssVar = () => {
    const h = computeHeaderH();
    docEl.style.setProperty('--header-h', `${h}px`);
    cached = h;
    return h;
  };

  // Invalidate cache on resize (throttled via rAF to avoid storms)
  let rAF = 0;
  window.addEventListener(
    'resize',
    () => {
      if (rAF) return;
      rAF = requestAnimationFrame(() => {
        rAF = 0;
        cached = null;
      });
    },
    { passive: true }
  );

  return Object.freeze({ getHeaderH, refreshHeaderH, syncHeaderCssVar });
})();

/* ======================================================================
 * [01] Navigation — mobile toggle + "Oferta" dropdown (a11y-first)
 * Responsibilities:
 *   - Toggle main nav on mobile (trap focus, Esc, outside click)
 *   - Dropdown "Oferta": desktop=hover, mobile=two-step (open then navigate)
 * A11Y:
 *   - Proper aria-expanded on controls, aria-label updates
 *   - Focus returns to toggle; focus trap within open menu
 * Events:
 *   - Uses AbortController so initNav() is idempotent (safe re-init)
 * Perf:
 *   - Minimal DOM reads; event delegation where reasonable
 * DOM contracts:
 *   - .nav-toggle (button), #navMenu (list), .dropdown-trigger[href="#oferta"], #dd-oferta
 * ====================================================================== */
function initNav() {
  // --- Idempotent setup (re-init safe) ---
  if (initNav._abort) initNav._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initNav._abort = ac;

  const html = document.documentElement;
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#navMenu');
  if (!toggle || !menu) return;

  // Ensure aria-controls on toggle for a11y
  if (!toggle.getAttribute('aria-controls')) toggle.setAttribute('aria-controls', 'navMenu');

  const OPEN_CLASS = 'is-nav-open';
  const OUTSIDE_EVT = 'pointerdown' in window ? 'pointerdown' : 'click';
  let lastFocus = null;

  /** Sets nav open/closed state and manages focus. */
  const setOpen = (open, { silentFocus = false } = {}) => {
    menu.classList.toggle('open', open);
    html.classList.toggle(OPEN_CLASS, open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');

    // Notify listeners (e.g., sections that adjust layout)
    window.dispatchEvent(new CustomEvent('nav:toggle', { detail: { open } }));

    if (silentFocus) return;

    if (open) {
      lastFocus = document.activeElement;
      menu.querySelector('a, button, [tabindex]:not([tabindex="-1"])')?.focus({ preventScroll: true });
    } else {
      (lastFocus || toggle).focus({ preventScroll: true });
      lastFocus = null;
    }
  };

  // Initial state (do not steal focus)
  setOpen(menu.classList.contains('open'), { silentFocus: true });

  // Toggle by button
  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')), { signal });

  // Close on in-menu anchor click (mobile only, hash links)
  menu.addEventListener(
    'click',
    (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const isMobile = window.matchMedia('(max-width: 991.98px)').matches;
      if (isMobile) setOpen(false);
    },
    { signal }
  );

  // Outside click (pointerdown to fire before focus shifts)
  document.addEventListener(
    OUTSIDE_EVT,
    (e) => {
      if (!menu.classList.contains('open')) return;
      if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    },
    { capture: true, passive: true, signal }
  );

  // Key handling: Esc (except when focus is inside the dropdown), Tab trap
  document.addEventListener(
    'keydown',
    (e) => {
      const isOpen = menu.classList.contains('open');
      if (!isOpen) return;

      // Escape closes menu unless inside the "Oferta" dropdown (handled below)
      if (e.key === 'Escape') {
        const ddMenuLive = document.querySelector('#dd-oferta');
        const ddTrigLive = document.querySelector('.dropdown-trigger[href="#oferta"]');
        const active = document.activeElement;
        const insideDd = ddMenuLive && ddTrigLive && (ddMenuLive.contains(active) || ddTrigLive.contains(active));
        if (!insideDd) {
          setOpen(false);
          return;
        }
      }

      // Focus trap inside #navMenu
      if (e.key === 'Tab') {
        const focusables = menu.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    { signal }
  );

  /* ===== Dropdown "Oferta" (desktop hover, mobile two-step) ===== */
  const ddTrigger = document.querySelector('.dropdown-trigger[href="#oferta"]');
  const ddMenu = document.querySelector('#dd-oferta');

  if (ddTrigger && ddMenu) {
    let ddOpen = ddMenu.classList.contains('open');
    const mqDesktop = window.matchMedia('(min-width: 992px)');
    const parentLi = ddTrigger.closest('.has-dropdown') || ddTrigger.parentElement;

    // ARIA init
    ddTrigger.setAttribute('aria-expanded', String(ddOpen));
    ddTrigger.setAttribute('aria-haspopup', 'true');
    if (!ddTrigger.getAttribute('aria-controls')) ddTrigger.setAttribute('aria-controls', 'dd-oferta');

    const focusFirstItem = () => {
      ddMenu.querySelector('a, button, [tabindex]:not([tabindex="-1"])')?.focus({ preventScroll: true });
    };

    const setDd = (open, { returnFocus = false, focusFirst = false } = {}) => {
      ddMenu.classList.toggle('open', open);
      ddTrigger.setAttribute('aria-expanded', String(open));
      ddOpen = open;
      if (open && focusFirst) focusFirstItem();
      else if (!open && returnFocus) ddTrigger.focus({ preventScroll: true });
    };

    // Desktop: open/close on hover
    if (parentLi) {
      parentLi.addEventListener(
        'mouseenter',
        () => {
          if (mqDesktop.matches) setDd(true);
        },
        { signal }
      );
      parentLi.addEventListener(
        'mouseleave',
        () => {
          if (mqDesktop.matches) setDd(false);
        },
        { signal }
      );
    }

    // Mobile: first activate opens submenu; second activates navigation
    const openMobileOnce = () => {
      const isMobile = window.matchMedia('(max-width: 991.98px)').matches;
      if (!isMobile) return false;
      if (!ddOpen) {
        setDd(true, { focusFirst: true });
        return true;
      }
      return false;
    };

    ddTrigger.addEventListener(
      'click',
      (e) => {
        if (openMobileOnce()) e.preventDefault();
      },
      { signal }
    );

    ddTrigger.addEventListener(
      'keydown',
      (e) => {
        const isEnter = e.key === 'Enter';
        const isSpace = e.key === ' ' || e.code === 'Space';
        if (!(isEnter || isSpace)) return;
        if (openMobileOnce()) e.preventDefault();
      },
      { signal }
    );

    // Close dropdown on outside interaction
    document.addEventListener(
      OUTSIDE_EVT,
      (e) => {
        if (ddOpen && !ddMenu.contains(e.target) && !ddTrigger.contains(e.target)) {
          setDd(false, { returnFocus: false });
        }
      },
      { capture: true, passive: true, signal }
    );

    // Esc closes dropdown (when focus is within trigger or menu)
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.key !== 'Escape' || !ddOpen) return;
        const active = document.activeElement;
        const inside = active && (ddMenu.contains(active) || ddTrigger.contains(active));
        if (inside) {
          e.preventDefault();
          setDd(false, { returnFocus: true });
        }
      },
      { signal }
    );

    // When closing the whole menu, also close dropdown
    toggle.addEventListener(
      'click',
      () => {
        // this runs before setOpen flips class; check desired end state
        const willClose = menu.classList.contains('open'); // currently open -> will close
        if (willClose) setDd(false);
      },
      { signal }
    );

    // If breakpoint changes while open, normalize state (close dropdown)
    const onMqChange = () => setDd(false);
    if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', onMqChange, { signal });
    else mqDesktop.addListener(onMqChange); // Safari legacy
  }
}

/* ======================================================================
 * [02] ScrollSpy — active links + prefer deepest subsection
 * Responsibilities:
 *   - Highlight current nav link while scrolling
 *   - Prefer subsections (e.g., #opinie inside #oferta)
 *   - Map #top -> #strona-glowna
 *   - Apply scroll-margin-top so anchors don't hide under header
 * Behavior:
 *   - Threshold line = live header height + PEEK (12px)
 *   - Picks the section intersecting the threshold line; if multiple -> last (deepest) in DOM
 *   - Skips recompute while hamburger menu is open
 *   - On click: close menu, scroll with offset, confirm after scroll end
 * Perf:
 *   - rAF-throttled scroll handler, cheap DOM reads
 * ====================================================================== */
function initScrollSpy() {
  // --- Idempotent setup ---
  if (initScrollSpy._abort) initScrollSpy._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initScrollSpy._abort = ac;

  const html = document.documentElement;
  const headerEl = document.querySelector('.site-header');
  const navMenu = document.getElementById('navMenu');
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  if (!navLinks.length) return;

  const PEEK = 12;
  const mapHref = (href) => (href === '#top' ? '#strona-glowna' : href);

  // Targets from the menu (unique, DOM order preserved)
  const targetsFromMenu = navLinks
    .map((a) => mapHref(a.getAttribute('href')))
    .filter((href) => href && href.startsWith('#') && href.length > 1);

  // Optional additional targets: keep #oferta to drive its trigger, but prefer its children later
  const extraTargets = [];
  if (document.querySelector('#oferta')) extraTargets.push('#oferta');

  const sections = [...new Set([...targetsFromMenu, ...extraTargets])]
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);
  if (!sections.length) return;

  // ----- Helpers -----
  const getHeaderLive = () => (headerEl ? Math.round(headerEl.getBoundingClientRect().height) : 0);
  const getOffset = () => (typeof utils?.getHeaderH === 'function' ? utils.getHeaderH() : getHeaderLive()) + PEEK;

  const isMenuOpen = () => {
    // keep in sync with [01] Navigation (uses html.is-nav-open + #navMenu.open)
    return (
      (navMenu && navMenu.classList.contains('open')) ||
      html.classList.contains('is-nav-open') ||
      document.body.classList.contains('nav-open') || // legacy guards
      document.documentElement.classList.contains('nav-open') ||
      (headerEl && headerEl.classList.contains('open'))
    );
  };

  // Apply scroll-margin-top to each target (once per value)
  const applyScrollMargin = () => {
    const OFFSET = getOffset();
    const token = String(OFFSET);
    sections.forEach((sec) => {
      if (sec.dataset.appliedScrollMargin !== token) {
        sec.style.scrollMarginTop = OFFSET + 'px';
        sec.dataset.appliedScrollMargin = token;
      }
    });
  };

  // Active state for links (incl. "Oferta" trigger)
  let lastId = sections[0].id;
  const setActive = (id) => {
    lastId = id;
    navLinks.forEach((a) => {
      const href = mapHref(a.getAttribute('href'));
      const match = href === '#' + id;
      a.classList.toggle('is-active', match);
      if (match) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    // mirror highlight on dropdown trigger
    const ofertaTrigger = document.querySelector('.dropdown-trigger[aria-controls="dd-oferta"]');
    if (ofertaTrigger) {
      const isOfertaCtx = id === 'oferta' || id.startsWith('oferta-');
      ofertaTrigger.classList.toggle('is-active', isOfertaCtx);
      if (isOfertaCtx) ofertaTrigger.setAttribute('aria-current', 'true');
      else ofertaTrigger.removeAttribute('aria-current');
    }
  };

  // Pick section by threshold line (prefer deepest)
  const pickCurrent = () => {
    const OFFSET = getOffset();
    const probeY = OFFSET + 1; // 1px below header

    // 1) sections intersecting the probe line (top <= probeY < bottom)
    const candidates = sections.filter((sec) => {
      const r = sec.getBoundingClientRect();
      return r.top <= probeY && r.bottom > probeY;
    });
    if (candidates.length) return candidates[candidates.length - 1].id;

    // 2) fallback: last whose top <= probe
    let currentId = sections[0].id;
    let bestTop = -Infinity;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top - OFFSET;
      if (top <= 0 && top > bestTop) {
        bestTop = top;
        currentId = sec.id;
      }
    }

    // 3) bottom of page -> last section
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      currentId = sections[sections.length - 1].id;
    }
    return currentId;
  };

  // Compute active section (skip when menu is open)
  const compute = () => {
    if (isMenuOpen()) return;
    const id = pickCurrent();
    if (id !== lastId) setActive(id);
  };

  // Confirm after scroll end (native 'scrollend' or timeout fallback)
  let scrollTimeout = 0;
  const scheduleComputeAfterScroll = () => {
    if ('onscrollend' in window) {
      const once = () => {
        compute();
        window.removeEventListener('scrollend', once);
      };
      window.addEventListener('scrollend', once, { signal });
    } else {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(compute, 120);
    }
  };

  // rAF-throttled scroll handler
  let ticking = false;
  const onScroll = () => {
    if (isMenuOpen()) return;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        compute(); // live update while scrolling
      });
    }
    scheduleComputeAfterScroll(); // confirm after scroll completes
  };
  window.addEventListener('scroll', onScroll, { passive: true, signal });

  // Re-apply margins and recompute on resize or nav state changes
  let raf = 0;
  const onResize = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      applyScrollMargin();
      compute();
    });
  };
  window.addEventListener('resize', onResize, { passive: true, signal });
  window.addEventListener('nav:toggle', onResize, { signal }); // fired by [01] Navigation

  // Link clicks: close menu, scroll with offset, confirm after end
  const prefersNoAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = prefersNoAnim ? 'auto' : 'smooth';

  navLinks.forEach((a) => {
    a.addEventListener(
      'click',
      (e) => {
        const raw = a.getAttribute('href') || '';
        const href = mapHref(raw);
        if (!href.startsWith('#')) return; // ignore external
        e.preventDefault();

        const target = document.querySelector(href);
        if (!target) return;

        // Close hamburger regardless of implementation
        navMenu?.classList.remove('open');
        headerEl?.classList.remove('open');
        html.classList.remove('is-nav-open');
        document.body.classList.remove('nav-open');
        document.documentElement.classList.remove('nav-open');
        window.dispatchEvent(new CustomEvent('nav:toggle', { detail: { open: false } }));

        // Mark target active immediately (perceived snappiness)
        setActive(target.id);

        // Scroll with header offset
        const OFFSET = getOffset();
        const targetY = Math.max(0, window.scrollY + target.getBoundingClientRect().top - OFFSET);
        window.scrollTo({ top: targetY, behavior });

        // Update hash for accessibility/history without jumping
        if (history.pushState) history.pushState(null, '', href);
        else location.hash = href;

        scheduleComputeAfterScroll();
      },
      { signal }
    );
  });

  // Observe closing of #navMenu (class changes) -> recompute
  if (navMenu) {
    const mo = new MutationObserver(() => {
      if (!isMenuOpen()) scheduleComputeAfterScroll();
    });
    mo.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('pagehide', () => mo.disconnect(), { once: true, signal });
  }

  // Init
  applyScrollMargin();
  compute();
}

/* ======================================================================
 * [03] Footer Year — auto-insert current year into <span id="year">
 * Responsibilities:
 *   - Write the current year into #year
 *   - If data-year-start="YYYY" is present and < current year, write "YYYY–CURRENT"
 * A11Y:
 *   - Purely visual, no live region changes
 * Perf:
 *   - O(1), idempotent (does not rewrite if already correct)
 * ====================================================================== */
function initFooterYear() {
  const el = document.getElementById('year');
  if (!el) return;

  const yearNow = String(new Date().getFullYear());
  const start = el.getAttribute('data-year-start');

  // Range, e.g., 2022–2025 (only if start < current and valid)
  if (start && /^\d{4}$/.test(start) && start < yearNow) {
    const desired = `${start}–${yearNow}`; // en dash
    if (el.textContent !== desired) el.textContent = desired;
    return;
  }

  // Single year fallback
  if (el.textContent !== yearNow) el.textContent = yearNow;
}

/* ======================================================================
 * [04] Smooth scroll to top
 * Responsibilities:
 *   - Scroll to the top when clicking <a href="#top"> or elements with .scroll-top / [data-scroll="top"]
 * A11Y:
 *   - Respects prefers-reduced-motion
 *   - If #top is present, briefly focuses it (without scrolling) to aid keyboard users
 * Events:
 *   - Event delegation on document; ignores modified/middle/right clicks & _blank/download
 * Idempotent:
 *   - Safe to call multiple times (AbortController cleans old listeners)
 * ====================================================================== */
function initSmoothTop() {
  if (initSmoothTop._abort) initSmoothTop._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initSmoothTop._abort = ac;

  const prefersNoAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = prefersNoAnim ? 'auto' : 'smooth';

  const isPrimaryClick = (e) =>
    e.button === 0 && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

  document.addEventListener(
    'click',
    (e) => {
      const el = e.target.closest('a[href="#top"], .scroll-top, [data-scroll="top"]');
      if (!el) return;

      // let the browser do its thing for new tab/download etc.
      if (!isPrimaryClick(e)) return;
      if (el.getAttribute && (el.getAttribute('target') === '_blank' || el.hasAttribute('download'))) return;

      e.preventDefault();
      window.scrollTo({ top: 0, behavior });

      // optional focus hint for screen readers (works if #top is focusable or temporarily made focusable)
      const topAnchor = document.getElementById('top');
      if (topAnchor && typeof topAnchor.focus === 'function') {
        const hadTabindex = topAnchor.hasAttribute('tabindex');
        if (!hadTabindex) topAnchor.setAttribute('tabindex', '-1');
        topAnchor.focus({ preventScroll: true });
        if (!hadTabindex) topAnchor.removeAttribute('tabindex');
      }

      // keep URL hash consistent without causing a jump
      if (history.pushState) history.pushState(null, '', '#top');
      else location.hash = '#top';
    },
    { signal }
  );
}

/* ======================================================================
 * [05] Skip-Next — 2 steps: Oferta → Kontakt (form)
 * Responsibilities:
 *   - Desktop-only helper button that jumps to the next key section
 * Behavior:
 *   - Determines current section using header offset + 12px peek
 *   - Updates label/live text; hides itself after the last step
 * A11Y:
 *   - Updates aria-label and optional live region (#skipNextLive)
 * Perf:
 *   - rAF-throttled scroll/resize handlers
 * Idempotent:
 *   - Safe to re-init (AbortController)
 * DOM contracts:
 *   - #skipNext (button), optional #skipNextLive (aria-live), sections #oferta, #kontakt
 * ====================================================================== */
function initSkipNext() {
  if (initSkipNext._abort) initSkipNext._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initSkipNext._abort = ac;

  // Mobile guard (do nothing on touch-first small screens)
  const isMobile = window.matchMedia('(hover:none) and (pointer:coarse)').matches || window.innerWidth <= 768;

  const btn = document.getElementById('skipNext');
  const live = document.getElementById('skipNextLive');
  if (!btn) return;

  if (isMobile) {
    btn.remove();
    live?.remove();
    return;
  }

  // Only these two in order
  const order = ['#oferta', '#kontakt'].map((sel) => document.querySelector(sel)).filter(Boolean);
  if (!order.length) {
    btn.remove();
    live?.remove();
    return;
  }

  const headerEl = document.querySelector('.site-header');
  const PEEK = 12;
  const getHeaderOffset = () =>
    (typeof window.utils?.getHeaderH === 'function'
      ? window.utils.getHeaderH()
      : Math.round(headerEl?.getBoundingClientRect().height || 0)) + PEEK;

  const labelFor = (el) => {
    const id = (el?.id || '').toLowerCase();
    if (id === 'oferta') return 'Oferta';
    if (id === 'kontakt') return 'Formularz';
    return 'kolejna sekcja';
  };

  const setLabel = (el) => {
    const name = labelFor(el);
    btn.setAttribute('aria-label', 'Przejdź do: ' + name);
    if (live) live.textContent = 'Następny: ' + name;
  };

  const getCurrentIdx = () => {
    const offset = getHeaderOffset();
    const probeY = offset + 1;
    let idx = -1;
    for (let i = 0; i < order.length; i++) {
      const r = order[i].getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) {
        idx = i;
        break;
      }
      if (r.top - offset <= 0) idx = i;
    }
    return idx;
  };

  const nextTarget = () => {
    const idx = getCurrentIdx();
    if (idx < 0) return order[0]; // start → Oferta
    if (idx === 0 && order[1]) return order[1]; // after Oferta → Kontakt
    return null; // after Kontakt → end
  };

  const updateVisibility = () => {
    const next = nextTarget();
    const done = !next;
    btn.classList.toggle('is-hidden', done);
    if (next) setLabel(next);
  };

  const prefersNoAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  btn.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      const target = nextTarget();
      if (!target) return;

      const y = Math.max(0, window.scrollY + target.getBoundingClientRect().top - getHeaderOffset());
      window.scrollTo({ top: y, behavior: prefersNoAnim ? 'auto' : 'smooth' });

      if ('onscrollend' in window) {
        const once = () => {
          updateVisibility();
          window.removeEventListener('scrollend', once);
        };
        window.addEventListener('scrollend', once, { signal });
      } else {
        setTimeout(updateVisibility, 120);
      }
    },
    { signal }
  );

  // rAF-throttled scroll handler
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateVisibility();
      });
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true, signal });

  // Resize → re-evaluate (throttled)
  let raf = 0;
  const onResize = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      updateVisibility();
    });
  };
  window.addEventListener('resize', onResize, { passive: true, signal });

  // Init
  updateVisibility();
}

/* ======================================================================
 * [06] Contact Form — honeypot, validation, a11y, phone mask, mock submit
 * Responsibilities:
 *   - Progressive enhancement for #kontakt .form
 *   - Spam protection: honeypot, min fill time, simple link heuristic
 *   - HTML5 validation + clear error messaging via aria-describedby="...-error"
 *   - PL phone masking & validation (+48 optional, groups of 3)
 *   - Mock submit with busy state and polite live region feedback
 * A11Y:
 *   - Live region .form-note (role="status", aria-live="polite", aria-atomic="true")
 *   - Sets aria-invalid on fields; focuses first invalid on error
 * Idempotent:
 *   - Safe to call multiple times; old listeners are removed (AbortController)
 * DOM contracts:
 *   - section#kontakt .form
 *   - #f-name, #f-phone, #f-msg, #f-consent, input[name="website"] (honeypot)
 *   - Error spans referenced by aria-describedby ending with "-error"
 * ====================================================================== */
function initContactForm() {
  // --- Idempotent setup ---
  if (initContactForm._abort) initContactForm._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initContactForm._abort = ac;

  const form = document.querySelector('section#kontakt .form');
  if (!form) return;

  const note = form.querySelector('.form-note');
  const btnSubmit = form.querySelector('button[type="submit"]');
  const hpInput = form.querySelector('input[name="website"]'); // honeypot
  const nameInput = form.querySelector('#f-name');
  const phoneInput = form.querySelector('#f-phone');
  const msgInput = form.querySelector('#f-msg');
  const consentInput = form.querySelector('#f-consent');

  // Live region for global messages
  if (note) {
    note.setAttribute('role', 'status');
    note.setAttribute('aria-atomic', 'true');
    note.setAttribute('aria-live', 'polite');
    if (!note.hasAttribute('tabindex')) note.setAttribute('tabindex', '-1'); // focusable for announcement
  }

  // Honeypot — safely hide even without CSS
  if (hpInput) {
    const wrap = hpInput.closest('label, div') || hpInput;
    Object.assign(wrap.style, {
      position: 'absolute',
      left: '-9999px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    });
    wrap.setAttribute('aria-hidden', 'true');
    hpInput.setAttribute('tabindex', '-1');
    hpInput.setAttribute('autocomplete', 'off');
  }

  // Anti-spam: min time to fill + simple link heuristics
  const startedAt = Date.now();
  const isTooFast = () => Date.now() - startedAt < 2000; // <2s looks like bot
  const looksSpammy = (text) => {
    const t = String(text || '').toLowerCase();
    const links = (t.match(/https?:\/\//g) || []).length;
    return links >= 2 || /viagra|bitcoin|casino/.test(t);
  };

  // Helpers ---------------------------------------------------------------
  const setBusy = (busy) => {
    form.setAttribute('aria-busy', busy ? 'true' : 'false');
    if (btnSubmit) btnSubmit.disabled = !!busy;
  };

  const showNote = (msg, ok = false) => {
    if (!note) return;
    note.textContent = msg || '';
    note.classList.toggle('is-ok', !!ok);
    note.classList.toggle('is-err', !ok && !!msg);
  };

  const errSpan = (el) => {
    const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/);
    const id = ids.find((x) => x.endsWith('-error'));
    return id ? document.getElementById(id) : null;
  };

  const setFieldError = (el, msg) => {
    if (!el) return;
    el.setAttribute('aria-invalid', 'true');
    el.setCustomValidity(msg || '');
    const span = errSpan(el);
    if (span) {
      span.textContent = msg || '';
      span.classList.toggle('visually-hidden', !msg);
    }
  };

  const clearFieldError = (el) => {
    if (!el) return;
    el.removeAttribute('aria-invalid');
    el.setCustomValidity('');
    const span = errSpan(el);
    if (span) {
      span.textContent = '';
      span.classList.add('visually-hidden');
    }
  };

  // Phone mask (PL) -------------------------------------------------------
  // Formats as "600 700 800" or "+48 600 700 800". Tolerates paste/backspace.
  const formatPLPhone = (raw) => {
    raw = String(raw || '');
    const hasPlus48 = raw.trim().startsWith('+48');
    let digits = raw.replace(/\D/g, '');
    let prefix = '';

    if (hasPlus48) {
      if (digits.startsWith('48')) digits = digits.slice(2);
      prefix = '+48 ';
    }
    digits = digits.slice(0, 9); // local 9 digits

    const g1 = digits.slice(0, 3);
    const g2 = digits.slice(3, 6);
    const g3 = digits.slice(6, 9);
    const grouped = [g1, g2, g3].filter(Boolean).join(' ');
    return (prefix + grouped).trim();
  };

  // Numeric validation for PL phone (robust to spaces/dashes)
  const isValidPLPhone = (val) => {
    const digits = String(val || '').replace(/\D/g, '');
    if (digits.length === 9) return true;
    if (digits.length === 11 && digits.startsWith('48')) return true; // 48 + 9 digits
    return false;
  };

  const applyPhoneMask = () => {
    if (!phoneInput) return;
    const active = document.activeElement === phoneInput;
    const before = phoneInput.value;
    const after = formatPLPhone(before);
    if (after !== before) {
      phoneInput.value = after;
      if (active && phoneInput.setSelectionRange) {
        phoneInput.setSelectionRange(after.length, after.length); // caret to end (simple but works well)
      }
    }
  };

  // Clear global note on any input; live phone validation + masking
  form.addEventListener(
    'input',
    (e) => {
      const t = e.target;
      if (note?.textContent) showNote('', true);
      if (t.matches('input, textarea')) clearFieldError(t);

      if (t === phoneInput) {
        applyPhoneMask();
        const raw = phoneInput.value.trim();
        if (raw === '' || isValidPLPhone(raw)) clearFieldError(phoneInput);
      }
    },
    { signal }
  );

  // Mask also on paste & blur
  phoneInput?.addEventListener('paste', () => requestAnimationFrame(applyPhoneMask), { signal });
  phoneInput?.addEventListener('blur', applyPhoneMask, { signal });

  // Trim text fields on blur
  form.addEventListener(
    'blur',
    (e) => {
      const t = e.target;
      if (t.matches('input[type="text"], textarea')) t.value = t.value.trim();
    },
    true,
    { signal }
  );

  // Reset clears notes/errors
  form.addEventListener(
    'reset',
    () => {
      showNote('', true);
      form.querySelectorAll('[aria-invalid="true"]').forEach((el) => clearFieldError(el));
    },
    { signal }
  );

  // Prevent double submit
  let submitting = false;

  form.addEventListener(
    'submit',
    (e) => {
      e.preventDefault();
      if (submitting) return;

      // 0) Anti-spam: honeypot / time / link heuristic
      if ((hpInput && hpInput.value.trim() !== '') || isTooFast() || looksSpammy(msgInput?.value)) {
        form.reset();
        return;
      }

      // 1) Native validation with readable messages
      if (!form.checkValidity()) {
        if (nameInput && nameInput.validity.valueMissing) {
          setFieldError(nameInput, 'Podaj imię i nazwisko (min. 2 znaki).');
        } else if (nameInput && nameInput.validity.tooShort) {
          setFieldError(nameInput, 'Imię i nazwisko powinno mieć co najmniej 2 znaki.');
        }

        if (phoneInput && phoneInput.validity.valueMissing) {
          setFieldError(phoneInput, 'Podaj numer telefonu.');
        }

        if (msgInput && msgInput.validity.valueMissing) {
          setFieldError(msgInput, 'Napisz krótki opis prac.');
        } else if (msgInput && msgInput.validity.tooLong) {
          setFieldError(msgInput, 'Opis może mieć maksymalnie 1000 znaków.');
        }

        if (consentInput && !consentInput.checked) {
          setFieldError(consentInput, 'Wymagana zgoda na kontakt w celu wyceny.');
        }

        form.reportValidity();
        form.querySelector(':invalid, [aria-invalid="true"]')?.focus({ preventScroll: true });
        showNote('Uzupełnij poprawnie wszystkie pola i zaznacz zgodę.', false);
        return;
      }

      // 2) Additional PL phone validation (post-mask)
      if (phoneInput) {
        applyPhoneMask();
        const raw = phoneInput.value.trim();
        if (!isValidPLPhone(raw)) {
          setFieldError(phoneInput, 'Podaj poprawny numer (np. 600 700 800 lub +48 600 700 800).');
          form.reportValidity();
          phoneInput.focus({ preventScroll: true });
          showNote('Sprawdź format numeru telefonu.', false);
          return;
        }
        clearFieldError(phoneInput);
      }

      // 3) Mock "send"
      submitting = true;
      setBusy(true);
      showNote('Wysyłanie…', true);

      setTimeout(() => {
        setBusy(false);
        submitting = false;
        form.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute('aria-invalid'));
        form.reset();
        showNote('Dziękujemy! Skontaktujemy się wkrótce.', true);
        note?.focus?.(); // announce success
      }, 900);
    },
    { signal }
  );
}

/* ======================================================================
 * [07] Header — shrink state + precise --header-h (Fonts & ResizeObserver)
 * Responsibilities:
 *   - Toggle .is-shrink after scrolling past ENTER; remove below EXIT (hysteresis)
 *   - Keep CSS var --header-h in sync on any header height change
 * Integration:
 *   - Other modules read header height via utils.getHeaderH()
 * A11Y:
 *   - Purely visual; no role/aria changes
 * Perf:
 *   - rAF-throttled scroll; ResizeObserver for structural changes; light DOM reads
 * Idempotent:
 *   - Safe to call multiple times (AbortController cleans listeners; RO disconnects on abort)
 * ====================================================================== */
function initHeaderShrink() {
  // --- Idempotent setup ---
  if (initHeaderShrink._abort) initHeaderShrink._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initHeaderShrink._abort = ac;

  const header = document.querySelector('.site-header, header[role="banner"]');
  if (!header) return;

  // Hysteresis thresholds (px)
  const ENTER = 16;
  const EXIT = 4;

  let isShrink = false;
  let rafScroll = 0;

  const measureHeader = () => Math.round(header.getBoundingClientRect().height);

  /** Syncs --header-h with current measured height and refreshes utils cache. */
  const syncVar = () => {
    const h = measureHeader();
    document.documentElement.style.setProperty('--header-h', `${h}px`);
    // let subsequent utils.getHeaderH() return fresh value
    if (window.utils?.refreshHeaderH) window.utils.refreshHeaderH();
    // optional: custom event for listeners that care
    window.dispatchEvent(new CustomEvent('header:sync', { detail: { height: h } }));
    return h;
  };

  /** Applies shrink class if needed and schedules a var sync. */
  const applyShrink = (want) => {
    if (want === isShrink) {
      // still ensure var is accurate (e.g., fonts/viewport changes)
      requestAnimationFrame(syncVar);
      return;
    }
    isShrink = want;
    header.classList.toggle('is-shrink', isShrink);
    // height likely changed; sync on next frame
    requestAnimationFrame(syncVar);
  };

  /** rAF-throttled scroll handler with hysteresis */
  const onScroll = () => {
    if (rafScroll) return;
    rafScroll = requestAnimationFrame(() => {
      rafScroll = 0;
      const y = window.scrollY || 0;
      if (!isShrink && y > ENTER) applyShrink(true);
      else if (isShrink && y < EXIT) applyShrink(false);
    });
  };

  // --- Observers & listeners ---

  // ResizeObserver: responds to layout changes affecting header height
  const ro = new ResizeObserver(() => {
    requestAnimationFrame(syncVar);
  });
  ro.observe(header);

  // Fonts may change metrics after load
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(syncVar)).catch(() => {});
  }

  // When mobile nav opens/closes, header height can change → re-sync
  window.addEventListener('nav:toggle', () => requestAnimationFrame(syncVar), { signal });

  // Visibility/page lifecycle: re-sync on return (bfcache/visibility)
  window.addEventListener('pageshow', () => requestAnimationFrame(syncVar), { signal });
  document.addEventListener(
    'visibilitychange',
    () => {
      if (!document.hidden) requestAnimationFrame(syncVar);
    },
    { signal }
  );

  window.addEventListener('scroll', onScroll, { passive: true, signal });
  window.addEventListener('resize', () => requestAnimationFrame(syncVar), { passive: true, signal });

  // Cleanup on abort (idempotent re-inits)
  signal.addEventListener('abort', () => {
    try {
      ro.disconnect();
    } catch {}
  });

  // --- Init ---
  syncVar();
  onScroll();
}

/* ======================================================================
 * [08] Theme Toggle — localStorage + system preference + a11y
 * Responsibilities:
 *   - Manage light/dark theme with persistence in localStorage ('theme')
 *   - If no saved value, follow system (prefers-color-scheme) and keep in sync
 *   - Update: <html data-theme>, button aria-pressed/label/title
 * A11Y:
 *   - Button reflects current state via aria-pressed and descriptive aria-label
 * Idempotent:
 *   - Safe to call multiple times (AbortController cleans listeners)
 * Integration:
 *   - Emits window event: 'theme:change' with detail { theme: 'light'|'dark' }
 * ====================================================================== */
function initThemeToggle() {
  // --- Idempotent setup ---
  if (initThemeToggle._abort) initThemeToggle._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initThemeToggle._abort = ac;

  const btn = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  if (!btn || !root) return;

  const KEY = 'theme';
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)');

  const safeGet = (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };
  const safeSet = (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  };
  const safeDel = (k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  };

  const labelFor = (mode) => (mode === 'dark' ? 'Przełącz na jasny tryb' : 'Przełącz na ciemny tryb');

  /** Apply theme to DOM (optionally persist) and notify listeners */
  const apply = (mode, { persist = false, silent = false } = {}) => {
    const theme = mode === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);

    // a11y + UX
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
    const nextLabel = labelFor(theme);
    btn.setAttribute('aria-label', nextLabel);
    btn.setAttribute('title', nextLabel);

    if (persist) safeSet(KEY, theme);

    if (!silent) {
      window.dispatchEvent(new CustomEvent('theme:change', { detail: { theme } }));
    }
  };

  // ---- Initialization logic ----
  const saved = safeGet(KEY); // 'dark' | 'light' | null
  const prefersDark = !!mq && mq.matches;
  const attrTheme = root.getAttribute('data-theme'); // set early in <head>
  const initial = saved || attrTheme || (prefersDark ? 'dark' : 'light');

  // If user has NOT saved a preference → follow system without persisting
  // (do NOT overwrite system setting on first run)
  apply(initial, { persist: !!saved, silent: true });

  // ---- Events ----

  // Click toggle: flip and PERSIST user choice
  btn.addEventListener(
    'click',
    () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      apply(next, { persist: true });
    },
    { signal }
  );

  // Follow system ONLY if there's no saved preference
  if (mq && !saved) {
    const onSystemChange = (e) => apply(e.matches ? 'dark' : 'light', { persist: false });
    mq.addEventListener?.('change', onSystemChange, { signal });
    // Safari legacy:
    if (mq.addListener && mq.removeListener && !mq.addEventListener) {
      mq.addListener(onSystemChange);
      signal.addEventListener('abort', () => mq.removeListener(onSystemChange));
    }
  }

  // Sync across tabs/windows if user changes theme elsewhere
  window.addEventListener(
    'storage',
    (e) => {
      if (e.key !== KEY) return;
      const v = e.newValue; // 'dark' | 'light' | null (null = remove)
      if (v === 'dark' || v === 'light') apply(v, { persist: false });
      else if (!v) {
        // user cleared preference in another tab -> revert to system
        if (mq) apply(mq.matches ? 'dark' : 'light', { persist: false });
        else apply('light', { persist: false });
      }
    },
    { signal }
  );

  // Optional: expose a small API for other modules (e.g., to reset to system)
  initThemeToggle.set = (modeOrNull) => {
    if (modeOrNull === 'dark' || modeOrNull === 'light') {
      apply(modeOrNull, { persist: true });
    } else {
      // null/undefined -> remove saved & follow system
      safeDel(KEY);
      if (mq) apply(mq.matches ? 'dark' : 'light', { persist: false });
    }
  };
}

/* ======================================================================
 * [09] Ripple — CTA "Wycena" (respects prefers-reduced-motion)
 * Responsibilities:
 *   - Add a material-like ripple on the header CTA button
 * A11Y:
 *   - No effect when prefers-reduced-motion: reduce
 * Idempotent:
 *   - Safe to call multiple times (AbortController cleans listeners)
 * DOM contracts:
 *   - Header CTA selector: .nav-menu li > a.btn.btn--sm
 * CSS expectations:
 *   - Button has position: relative; overflow: hidden;
 *   - .ripple has absolute positioning + animation (handled in CSS)
 * ====================================================================== */
function initRipple() {
  // --- Idempotent setup ---
  if (initRipple._abort) initRipple._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initRipple._abort = ac;

  const btn = document.querySelector('.nav-menu li > a.btn.btn--sm');
  if (!btn) return;

  // Respect user preferences
  const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const prefersReduced = !!mql && mql.matches;
  if (prefersReduced) return;

  // Ensure button can host the ripple
  const cs = getComputedStyle(btn);
  if (cs.position === 'static') btn.style.position = 'relative';
  if (cs.overflow !== 'hidden') btn.style.overflow = 'hidden';

  // Compute a size that fully covers the element from the interaction point
  const computeDiameter = (rect, x, y) => {
    const dx1 = x - rect.left;
    const dy1 = y - rect.top;
    const dx2 = rect.right - x;
    const dy2 = rect.bottom - y;
    const maxDist = Math.max(Math.hypot(dx1, dy1), Math.hypot(dx1, dy2), Math.hypot(dx2, dy1), Math.hypot(dx2, dy2));
    return Math.ceil(maxDist * 2); // diameter
  };

  const spawn = (x, y) => {
    const rect = btn.getBoundingClientRect();
    const d = computeDiameter(rect, x, y);

    // remove any existing ripple
    btn.querySelector('.ripple')?.remove();

    const ink = document.createElement('span');
    ink.className = 'ripple';
    ink.style.width = ink.style.height = `${d}px`;
    ink.style.left = `${x - rect.left - d / 2}px`;
    ink.style.top = `${y - rect.top - d / 2}px`;
    btn.appendChild(ink);

    // GC after animation or after a failsafe timeout
    const cleanup = () => ink.remove();
    ink.addEventListener('animationend', cleanup, { once: true, signal });
    setTimeout(() => ink.isConnected && cleanup(), 1200);
  };

  const isPrimary = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

  // Pointer (mouse/touch/pen)
  btn.addEventListener(
    'pointerdown',
    (e) => {
      if (!isPrimary(e)) return;
      spawn(e.clientX, e.clientY);
    },
    { signal }
  );

  // Keyboard (Enter / Space -> center ripple)
  btn.addEventListener(
    'keydown',
    (e) => {
      const isEnter = e.key === 'Enter';
      const isSpace = e.key === ' ' || e.code === 'Space';
      if (!isEnter && !isSpace) return;

      const rect = btn.getBoundingClientRect();
      spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);

      if (isSpace) {
        e.preventDefault(); // avoid page scroll
        btn.click();
      }
    },
    { signal }
  );

  // If user toggles reduced motion at runtime, disable ripple next init
  if (mql?.addEventListener) {
    mql.addEventListener(
      'change',
      (e) => {
        if (e.matches) initRipple._abort?.abort();
      },
      { signal }
    );
  }
}

/* ======================================================================
 * [10] Hero — ultra-wide blur synced with <picture>
 * Responsibilities:
 *   - Set .hero__bg-blur background-image to the currently used <img> variant (currentSrc)
 *   - React to: image load, resize/orientation, visibility changes, attribute mutations (src/srcset/sizes/media)
 * A11Y:
 *   - Purely visual enhancement
 * Idempotent:
 *   - Safe to call multiple times (AbortController cleans listeners/observers)
 * DOM contracts:
 *   - Foreground image:  .hero-bg img  (inside <picture>)
 *   - Blur overlay:      .hero__bg-blur (block with CSS blur)
 * ====================================================================== */
function initHeroBlurSync() {
  // --- Idempotent setup ---
  if (initHeroBlurSync._abort) initHeroBlurSync._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initHeroBlurSync._abort = ac;

  const img = document.querySelector('.hero-bg img');
  const blur = document.querySelector('.hero__bg-blur');
  if (!img || !blur) return;

  const pic = img.closest('picture') || null;

  let rafId = 0;
  let debTimer = 0;
  let lastBg = ''; // cache to avoid redundant writes

  const setBg = (url) => {
    const want = `url("${url}")`;
    if (want !== lastBg) {
      blur.style.backgroundImage = want;
      lastBg = want;
      window.dispatchEvent(new CustomEvent('hero:blurSync', { detail: { url } }));
    }
  };

  const pickCurrentUrl = () => img.currentSrc || img.src || '';

  const sync = () => {
    if (!img.isConnected || !blur.isConnected) return;
    const url = pickCurrentUrl();
    if (url) setBg(url);
  };

  // rAF throttle
  const syncNextFrame = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(sync);
  };

  // debounce helper
  const syncDebounced = (ms = 150) => {
    clearTimeout(debTimer);
    debTimer = setTimeout(sync, ms);
  };

  // Events ----------------------------------------------------------------

  // 1) image load (fires when a new candidate is fetched)
  img.addEventListener('load', syncNextFrame, { signal });

  // 2) window changes that can flip srcset candidate
  window.addEventListener('resize', () => syncDebounced(120), { passive: true, signal });
  window.addEventListener('orientationchange', syncNextFrame, { signal });
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.visibilityState === 'visible') syncNextFrame();
    },
    { signal }
  );

  // 3) prefers-color-scheme (if <source> uses it)
  const mqlColor = window.matchMedia?.('(prefers-color-scheme: dark)');
  if (mqlColor?.addEventListener) {
    mqlColor.addEventListener('change', syncNextFrame, { signal });
  } else if (mqlColor?.addListener && !mqlColor.addEventListener) {
    // Safari legacy
    mqlColor.addListener(syncNextFrame);
    signal.addEventListener('abort', () => mqlColor.removeListener(syncNextFrame));
  }

  // 4) Observe attribute mutations on <img> and <source> inside <picture>
  const moAttrs = ['src', 'srcset', 'sizes', 'media'];
  const mo = new MutationObserver(syncNextFrame);
  mo.observe(img, { attributes: true, attributeFilter: moAttrs });
  if (pic) {
    // watch all <source> under <picture> for changes
    pic.querySelectorAll('source').forEach((s) => {
      mo.observe(s, { attributes: true, attributeFilter: moAttrs });
    });
    // also watch for <source> list changes (rare dynamic cases)
    const moChild = new MutationObserver(syncNextFrame);
    moChild.observe(pic, { childList: true, subtree: true });
    signal.addEventListener('abort', () => moChild.disconnect());
  }

  // Cleanup on abort/pagehide
  window.addEventListener(
    'pagehide',
    () => {
      try {
        mo.disconnect();
      } catch {}
      cancelAnimationFrame(rafId);
      clearTimeout(debTimer);
    },
    { once: true, signal }
  );

  // Init
  if (document.readyState === 'complete') sync();
  else window.addEventListener('load', sync, { once: true, signal });
  // Also do an immediate pass for cases when the resource is cached and 'load' won't refire
  syncNextFrame();
}

/* ======================================================================
 * [11] Lightbox — accessible preview for #oferta .card thumbnails
 * Responsibilities:
 *   - Open image preview on thumbnail click/keyboard
 *   - Close on backdrop click or Esc; navigate with ← / →
 *   - Choose the largest candidate from <img srcset> / <picture><source>
 *   - Keep a single <img> in the viewport and reuse it between slides
 * A11Y:
 *   - role="dialog" + aria-modal on the overlay container
 *   - Focus trap between Close/Prev/Next; return focus to invoking thumbnail
 *   - Thumbnails get tabindex="0", role="button", descriptive aria-label
 *   - Keyboard support: Esc, ArrowLeft, ArrowRight, Enter/Space to open
 * Events:
 *   - Document-level keydown only when open; removed on close/pagehide
 *   - Swipe support on touch devices (horizontal gesture)
 * Perf:
 *   - DOM for the lightbox is created once and reused
 *   - Srcset parsing prefers highest-width candidate; fallback to currentSrc/src
 *   - Minimal layout work; listeners cleaned up on pagehide
 * DOM contracts:
 *   - Thumbnails: #oferta .card picture img
 *   - Lightbox markup (backdrop/wrap/buttons) is injected by the script
 * ====================================================================== */
function initOfertaLightbox() {
  // Idempotent: clean old listeners if re-inited
  if (initOfertaLightbox._abort) initOfertaLightbox._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initOfertaLightbox._abort = ac;

  const thumbs = Array.from(document.querySelectorAll('#oferta .card picture img'));
  if (!thumbs.length) return;

  const $ = (t) => document.createElement(t);
  const html = document.documentElement;
  const main = document.getElementById('main') || document.querySelector('main');
  const header = document.querySelector('.site-header');

  // Build lightbox DOM once (reuse if exists)
  let backdrop = document.querySelector('.lb-backdrop');
  let wrap = document.querySelector('.lb-wrap');
  let viewport, img, btnClose, btnPrev, btnNext;

  if (!backdrop || !wrap) {
    backdrop = $('div');
    backdrop.className = 'lb-backdrop';

    wrap = $('div');
    wrap.className = 'lb-wrap';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'Podgląd zdjęcia');
    wrap.tabIndex = -1;

    viewport = $('div');
    viewport.className = 'lb-viewport';

    img = new Image();
    img.alt = '';
    img.decoding = 'async';
    viewport.appendChild(img);
    wrap.appendChild(viewport);

    const mkBtn = (cls, label, svg) => {
      const b = $('button');
      b.type = 'button';
      b.className = `lb-btn ${cls}`;
      b.setAttribute('aria-label', label);
      b.innerHTML = svg;
      return b;
    };

    const svgX =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"/></svg>';
    const svgL =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.7 5.3a1 1 0 0 1 0 1.4L11.4 11l4.3 4.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0z"/></svg>';
    const svgR =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 5.3a1 1 0 0 0 0 1.4L12.6 11l-4.3 4.3a1 1 0 1 0 1.4 1.4l5-5a1 1 0 0 0 0-1.4l-5-5a1 1 0 0 0-1.4 0z"/></svg>';

    btnClose = mkBtn('lb-close', 'Zamknij podgląd', svgX);
    btnPrev = mkBtn('lb-prev', 'Poprzednie zdjęcie', svgL);
    btnNext = mkBtn('lb-next', 'Następne zdjęcie', svgR);

    document.body.append(backdrop, wrap, btnClose, btnPrev, btnNext);
  } else {
    viewport = wrap.querySelector('.lb-viewport') || $('div');
    img = wrap.querySelector('img') || new Image();
    btnClose = document.querySelector('.lb-btn.lb-close');
    btnPrev = document.querySelector('.lb-btn.lb-prev');
    btnNext = document.querySelector('.lb-btn.lb-next');
  }

  // Helpers ---------------------------------------------------------------
  const parseSrcset = (ss) => {
    if (!ss) return [];
    return ss
      .split(',')
      .map((s) => s.trim())
      .map((s) => {
        const m = s.match(/(.+)\s+(\d+)w$/);
        return m ? { url: m[1], w: parseInt(m[2], 10) } : { url: s.split(' ')[0], w: 0 };
      })
      .sort((a, b) => b.w - a.w);
  };

  const bestUrlFor = (el) => {
    // 1) <img srcset>
    let best = parseSrcset(el.getAttribute('srcset'))[0]?.url;
    // 2) <picture><source>
    if (!best) {
      const pic = el.closest('picture');
      if (pic) {
        const candidates = [];
        pic.querySelectorAll('source').forEach((s) => {
          candidates.push(...parseSrcset(s.getAttribute('srcset')));
        });
        candidates.sort((a, b) => b.w - a.w);
        best = candidates[0]?.url || null;
      }
    }
    // 3) fallbacks
    return best || el.currentSrc || el.src || '';
  };

  const preload = (i) => {
    if (i < 0 || i >= thumbs.length) return;
    const url = bestUrlFor(thumbs[i]);
    if (url) {
      const tmp = new Image();
      tmp.src = url;
    }
  };

  let index = 0;
  let isOpen = false;
  let lastFocus = null;

  const applyImage = () => {
    const el = thumbs[index];
    const url = bestUrlFor(el);
    if (!url) return;
    img.src = url;
    img.alt = el.getAttribute('alt') || '';
    // quick preload neighbors
    preload((index + 1) % thumbs.length);
    preload((index - 1 + thumbs.length) % thumbs.length);
  };

  const focusables = () => [btnClose, btnPrev, btnNext].filter(Boolean);

  // Toggle modal open/close with a11y bits
  const setOpen = (open) => {
    isOpen = open;
    backdrop.classList.toggle('is-open', open);
    wrap.classList.toggle('is-open', open);
    html.classList.toggle('lb-no-scroll', open);
    wrap.setAttribute('aria-hidden', open ? 'false' : 'true');

    // Inert background if supported
    try {
      if (main && 'inert' in main) main.inert = open;
      if (header && 'inert' in header) header.inert = open;
    } catch {}

    if (open) {
      lastFocus = document.activeElement;
      applyImage();
      // hide arrows if single image
      const multi = thumbs.length > 1;
      btnPrev.style.display = multi ? '' : 'none';
      btnNext.style.display = multi ? '' : 'none';
      // focus trap start
      (btnClose || wrap).focus({ preventScroll: true });
    } else {
      img.src = '';
      img.alt = '';
      lastFocus?.focus?.({ preventScroll: true });
      lastFocus = null;
    }
  };

  const prev = () => {
    if (thumbs.length < 2) return;
    index = (index - 1 + thumbs.length) % thumbs.length;
    applyImage();
  };
  const next = () => {
    if (thumbs.length < 2) return;
    index = (index + 1) % thumbs.length;
    applyImage();
  };

  // Thumb activation (mouse + keyboard)
  thumbs.forEach((el, i) => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Powiększ zdjęcie');

    el.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        index = i;
        setOpen(true);
      },
      { signal }
    );

    el.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          index = i;
          setOpen(true);
        }
      },
      { signal }
    );
  });

  // Controls
  btnClose?.addEventListener('click', () => setOpen(false), { signal });
  btnPrev?.addEventListener('click', prev, { signal });
  btnNext?.addEventListener('click', next, { signal });
  backdrop.addEventListener('click', () => setOpen(false), { signal });

  // Global key handling (only when open)
  document.addEventListener(
    'keydown',
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Tab') {
        const list = focusables();
        if (!list.length) return;
        const first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    { signal }
  );

  // Swipe (touch)
  let sx = 0,
    sy = 0,
    moved = false;
  const onStart = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    sx = t.clientX;
    sy = t.clientY;
    moved = false;
  };
  const onMove = () => {
    moved = true;
  };
  const onEnd = (e) => {
    if (!moved) return;
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev();
    }
  };
  (wrap.querySelector('.lb-viewport') || wrap).addEventListener('touchstart', onStart, { passive: true, signal });
  (wrap.querySelector('.lb-viewport') || wrap).addEventListener('touchmove', onMove, { passive: true, signal });
  (wrap.querySelector('.lb-viewport') || wrap).addEventListener('touchend', onEnd, { passive: true, signal });

  // Clean on pagehide and on abort
  window.addEventListener('pagehide', () => ac.abort(), { once: true, signal });
}

/* ======================================================================
 * [12] "Oferta" — horizontal scroller (snap + masks + arrows)
 * Responsibilities:
 *   - Horizontal scroll track with CSS scroll-snap and prev/next controls
 *   - Auto-detects "fits" state (no width guards) and toggles edge masks
 *   - Updates button states on scroll/resize and after images load
 * A11Y:
 *   - Buttons expose aria-controls; both disabled and aria-disabled set
 *   - Focusable track; keyboard support: ← → Home End
 * Events:
 *   - Idempotent via AbortController (safe re-init); cleans on pagehide
 *   - rAF-throttled scroll handler; uses scrollend with a timeout fallback
 * Perf:
 *   - Minimal layout reads; ResizeObserver for layout changes
 * DOM contracts:
 *   - #oferta-scroller (root), #oferta-track (scroll container)
 *   - .scroller-btn.prev / .scroller-btn.next (controls)
 *   - .card items inside the track; optional <img> whose load affects sizing
 * ====================================================================== */
function initOfertaScroller() {
  // Idempotent init
  if (initOfertaScroller._abort) initOfertaScroller._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initOfertaScroller._abort = ac;

  const scroller = document.getElementById('oferta-scroller');
  const track = document.getElementById('oferta-track');
  if (!scroller || !track) return;

  const prev = scroller.querySelector('.scroller-btn.prev');
  const next = scroller.querySelector('.scroller-btn.next');

  // A11Y wiring
  if (prev) prev.setAttribute('aria-controls', track.id);
  if (next) next.setAttribute('aria-controls', track.id);
  if (!track.hasAttribute('tabindex')) track.tabIndex = 0;

  const prefersNoAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = prefersNoAnim ? 'auto' : 'smooth';

  const getGap = () => parseFloat(getComputedStyle(track).gap) || 0;
  const cardW = () => track.querySelector('.card')?.getBoundingClientRect().width || 0;

  // step: card+gap OR 90% viewport — whichever is larger
  const step = () => Math.max(cardW() + getGap(), Math.round(track.clientWidth * 0.9));

  const setDisabled = (el, disabled) => {
    if (!el) return;
    el.setAttribute('aria-disabled', String(!!disabled));
    if ('disabled' in el) el.disabled = !!disabled;
  };

  const update = () => {
    const max = Math.max(0, track.scrollWidth - track.clientWidth - 1);
    const x = Math.round(track.scrollLeft);
    const atStart = x <= 1;
    const atEnd = x >= max;
    const fits = track.scrollWidth <= track.clientWidth + 1;

    scroller.classList.toggle('at-start', atStart);
    scroller.classList.toggle('at-end', atEnd);
    scroller.classList.toggle('fits', fits);

    setDisabled(prev, atStart || fits);
    setDisabled(next, atEnd || fits);
  };

  // rAF-throttled scroll
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  track.addEventListener('scroll', onScroll, { passive: true, signal });

  // Resize / layout changes
  const onResize = () => update();
  window.addEventListener('resize', onResize, { passive: true, signal });

  // scrollend confirmation (with fallback)
  if ('onscrollend' in window) {
    track.addEventListener('scrollend', update, { signal });
  } else {
    let to;
    track.addEventListener(
      'scroll',
      () => {
        clearTimeout(to);
        to = setTimeout(update, 120);
      },
      { passive: true, signal }
    );
  }

  // Watch size changes (fonts/RWD)
  const ro = new ResizeObserver(() => update());
  ro.observe(track);
  signal.addEventListener('abort', () => ro.disconnect());

  // Images load → recalc once ready
  track.querySelectorAll('img').forEach((im) => {
    if (!im.complete) {
      im.addEventListener('load', update, { once: true, signal });
      im.addEventListener('error', update, { once: true, signal });
    }
  });

  const move = (dir) => track.scrollBy({ left: dir * step(), behavior });

  // Clicks
  prev?.addEventListener('click', () => move(-1), { signal });
  next?.addEventListener('click', () => move(1), { signal });

  // Press & hold
  const addHold = (el, dir) => {
    if (!el) return;
    let hold;
    const start = (e) => {
      if (e.button !== 0) return;
      el.setPointerCapture?.(e.pointerId);
      hold = setInterval(() => {
        track.scrollBy({ left: dir * Math.max(40, step() / 6), behavior: 'auto' });
      }, 50);
    };
    const stop = () => {
      clearInterval(hold);
      hold = null;
    };

    el.addEventListener('pointerdown', start, { signal });
    el.addEventListener('pointerup', stop, { signal });
    el.addEventListener('pointercancel', stop, { signal });
    el.addEventListener('lostpointercapture', stop, { signal });

    // Keyboard activation
    el.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          move(dir);
        }
      },
      { signal }
    );
  };
  addHold(prev, -1);
  addHold(next, 1);

  // Keyboard on track
  track.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        move(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        move(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        track.scrollTo({ left: 0, behavior });
      } else if (e.key === 'End') {
        e.preventDefault();
        track.scrollTo({ left: track.scrollWidth, behavior });
      }
    },
    { signal }
  );

  // Wheel → horizontal (touchpad vertical gesture)
  track.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollBy({ left: e.deltaY, behavior: 'auto' });
      }
    },
    { passive: false, signal }
  );

  // Init
  update();

  // Cleanup on navigation
  window.addEventListener('pagehide', () => ac.abort(), { once: true, signal });
}

/* ======================================================================
 * [13] Prefetch on hover/focus (offer subpages)
 * Responsibilities:
 *   - Prefetch same-origin offer pages (oferta/*.html) on hover/focus/touch
 *   - Skip on Data Saver and very slow connections (2g/slow-2g)
 * Perf:
 *   - 120ms debounce to avoid accidental hovers
 *   - Caches already-prefetched URLs
 * Safety:
 *   - Same-origin guard; ignores non-http(s)
 * Idempotent:
 *   - Safe to call multiple times (AbortController cleans listeners)
 * DOM contracts:
 *   - Links inside cards, e.g. .services-track h3 a[href^="oferta/"]
 *   - Fallback selector also checks #oferta .card h3 a[…]
 * ====================================================================== */
function initOfferPrefetch() {
  // Idempotent init
  if (initOfferPrefetch._abort) initOfferPrefetch._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initOfferPrefetch._abort = ac;

  // Respect user's data saver / slow networks
  const canPrefetch = () => {
    const n = navigator;
    const c = n && 'connection' in n ? n.connection : null;
    if (c?.saveData) return false;
    const et = (c?.effectiveType || '').toLowerCase();
    if (et.includes('2g') || et === 'slow-2g') return false;
    return true;
  };
  if (!canPrefetch()) return;

  // Target only offer subpage links (same-origin HTML docs)
  const links = Array.from(
    document.querySelectorAll('.services-track h3 a[href^="oferta/"], #oferta .card h3 a[href^="oferta/"]')
  );
  if (!links.length) return;

  const prefetched = new Set();
  const timers = new WeakMap();

  const isSameOriginHttp = (href) => {
    try {
      const u = new URL(href, location.href);
      return (u.protocol === 'http:' || u.protocol === 'https:') && u.origin === location.origin;
    } catch {
      return false;
    }
  };

  const injectPrefetch = (href) => {
    if (!isSameOriginHttp(href)) return;
    if (prefetched.has(href)) return;
    if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
      prefetched.add(href);
      return;
    }
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    // Optional hint for HTML docs; not required, but fine if supported
    // l.as = 'document';
    document.head.appendChild(l);
    prefetched.add(href);
  };

  const schedule = (a) => {
    clear(a);
    const id = setTimeout(() => injectPrefetch(a.href), 120);
    timers.set(a, id);
  };
  const clear = (a) => {
    const id = timers.get(a);
    if (id) {
      clearTimeout(id);
      timers.delete(a);
    }
  };

  // Attach listeners
  links.forEach((a) => {
    // Pointer (desktop hover)
    a.addEventListener('mouseenter', () => schedule(a), { signal });
    a.addEventListener('mouseleave', () => clear(a), { signal });

    // Keyboard nav
    a.addEventListener('focus', () => schedule(a), { signal });
    a.addEventListener('blur', () => clear(a), { signal });

    // Touch: high intent → no delay
    a.addEventListener('touchstart', () => injectPrefetch(a.href), { passive: true, once: true, signal });
  });

  // Abort listeners on navigation
  window.addEventListener('pagehide', () => ac.abort(), { once: true, signal });
}

/* ======================================================================
 * [14] Home helpers — scroll-top URL cleanup + ?usluga prefill
 * What:
 *   (A) On homepage, after clicking .scroll-top, remove hash from the URL.
 *   (B) On homepage, prefill hidden input "usluga" from ?usluga=... and keep #kontakt.
 * Notes:
 *   - Plays nicely with [04] initSmoothTop: we *detect* if default was already prevented.
 *   - Idempotent: AbortController prevents double-binding.
 *   - "Homepage" detection is DOM-based (sections like #kontakt), so it works under subpaths.
 * ====================================================================== */
function initHomeHelpers() {
  // Idempotent setup
  if (initHomeHelpers._abort) initHomeHelpers._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initHomeHelpers._abort = ac;

  // Consider page "home-like" if it has main sections (works for subfolder deployments)
  const isHome =
    !!document.querySelector('#kontakt') ||
    !!document.querySelector('#oferta') ||
    !!document.querySelector('#strona-glowna');

  // (A) Scroll-top: clean hash on homepage
  if (isHome) {
    document.addEventListener(
      'click',
      (e) => {
        const link = e.target.closest('a.scroll-top, a[href="#top"]');
        if (!link) return;

        // If another handler (e.g., [04]) already ran, don't duplicate scrolling
        const alreadyHandled = e.defaultPrevented;

        // Respect prefers-reduced-motion
        const prefersNoAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior = prefersNoAnim ? 'auto' : 'smooth';

        // Try focusing #top anchor for a11y
        const topEl = document.getElementById('top');

        if (!alreadyHandled) {
          e.preventDefault();
          if (topEl?.scrollIntoView) {
            topEl.scrollIntoView({ behavior });
            // temporary focus for SR announcement
            if (typeof topEl.focus === 'function') {
              topEl.setAttribute('tabindex', '-1');
              topEl.focus({ preventScroll: true });
              setTimeout(() => topEl.removeAttribute('tabindex'), 800);
            }
          } else {
            window.scrollTo({ top: 0, behavior });
          }
        } else if (topEl && typeof topEl.focus === 'function') {
          // If another handler did the scroll, we can still improve a11y focus
          topEl.setAttribute('tabindex', '-1');
          topEl.focus({ preventScroll: true });
          setTimeout(() => topEl.removeAttribute('tabindex'), 800);
        }

        // Clean hash (keep query) — homepage only
        history.replaceState(null, '', location.pathname + location.search);
      },
      { signal }
    );
  }

  // (B) Prefill ?usluga=... → hidden input in #kontakt form; then clean query (keep hash)
  (function prefillService() {
    if (!isHome) return;
    const form = document.querySelector('#kontakt form');
    if (!form) return;

    const params = new URLSearchParams(location.search);
    const service = params.get('usluga');
    if (!service) return;

    let input = form.querySelector('[name="usluga"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'usluga';
      form.appendChild(input);
    }
    input.value = service;

    // Clean query string, keep hash (e.g., #kontakt)
    history.replaceState(null, '', location.pathname + location.hash);
  })();

  // Cleanup on navigation
  window.addEventListener('pagehide', () => ac.abort(), { once: true, signal });
}

/* ======================================================================
 * [99] Bootstrap — init all features in the right order
 * Notes:
 *  - File is loaded with `defer`, but we still wait for DOM if needed.
 *  - Each init…() is idempotent (internal AbortController cleans listeners).
 *  - Order: Nav → Header (sets --header-h) → ScrollSpy → helpers
 *           then Theme / Ripple / Hero / Lightbox / Scroller / Prefetch / Home
 *           and lastly Contact Form.
 * ====================================================================== */
(function boot() {
  const start = () => {
    // [00] Utils -> IIFE already executed (no call)

    // --- Core UI ---
    if (typeof initNav === 'function') initNav(); // [01] Navigation
    if (typeof initHeaderShrink === 'function') initHeaderShrink(); // [07] Header shrink + --header-h
    if (typeof initScrollSpy === 'function') initScrollSpy(); // [02] ScrollSpy (needs header offset)

    // --- Convenience / helpers ---
    if (typeof initFooterYear === 'function') initFooterYear(); // [03] Footer year
    if (typeof initSmoothTop === 'function') initSmoothTop(); // [04] Smooth scroll #top
    if (typeof initSkipNext === 'function') initSkipNext(); // [05] Skip-next (Oferta → Kontakt)

    // --- Visuals / enhancements ---
    if (typeof initThemeToggle === 'function') initThemeToggle(); // [08] Theme toggle (LS + a11y)
    if (typeof initRipple === 'function') initRipple(); // [09] Ripple on CTA
    if (typeof initHeroBlurSync === 'function') initHeroBlurSync(); // [10] Hero blur sync
    if (typeof initOfertaLightbox === 'function') initOfertaLightbox(); // [11] Lightbox
    if (typeof initOfertaScroller === 'function') initOfertaScroller(); // [12] Horizontal scroller
    if (typeof initOfferPrefetch === 'function') initOfferPrefetch(); // [13] Prefetch offer subpages
    if (typeof initHomeHelpers === 'function') initHomeHelpers(); // [14] Home helpers

    // --- Forms (last) ---
    if (typeof initContactForm === 'function') initContactForm(); // [06] Contact form
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
