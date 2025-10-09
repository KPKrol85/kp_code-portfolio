/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Animacje pojawiania sekcji przy scrollu (powtarzalne + initial) ============
   - Dodaje klasę .show, gdy element .hidden pojawi się w kadrze
   - Usuwa klasę .show, gdy element całkowicie znika z widoku
   - Obsługuje fallback dla starych przeglądarek (bez IntersectionObserver)
   - Initial reveal: pokazuje elementy widoczne od razu po wejściu na stronę
   ======================================================================================= */
(() => {
  const hiddenElements = document.querySelectorAll(".hidden");
  if (!hiddenElements.length) return; // brak ukrytych elementów — nic nie robimy

  /* --- Fallback dla bardzo starych przeglądarek (bez IntersectionObserver) --- */
  if (!("IntersectionObserver" in window)) {
    hiddenElements.forEach((el) => el.classList.add("show"));
    return;
  }

  /* --- Konfiguracja obserwatora --- */
  const ENTER_RATIO = 0.12; // próg wejścia: ≥12% elementu w kadrze
  const ROOT_MARGIN = "0px 0px -10% 0px"; // dolny margines — odpala nieco wcześniej

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > ENTER_RATIO) {
          // ZMIANA: odłóż dodanie .show do następnej klatki
          requestAnimationFrame(() => entry.target.classList.add("show"));
        } else if (entry.intersectionRatio === 0) {
          entry.target.classList.remove("show");
        }
      });
    },
    { root: null, rootMargin: ROOT_MARGIN, threshold: [0, ENTER_RATIO, 0.5, 1] }
  );

  hiddenElements.forEach((el) => observer.observe(el));

  // --- Initial reveal: sprawdź, co już jest widoczne przy starcie ---
  const isInViewport = (el, ratio = ENTER_RATIO) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    if (r.width === 0 || r.height === 0) return false;
    const visibleVert = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    const visibleHorz = Math.min(r.right, vw) - Math.max(r.left, 0);
    if (visibleVert <= 0 || visibleHorz <= 0) return false;
    const visibleArea = visibleVert * visibleHorz;
    const totalArea = r.width * r.height;
    return visibleArea / totalArea > ratio;
  };

  const initialReveal = () => {
    hiddenElements.forEach((el) => {
      if (isInViewport(el)) el.classList.add("show");
    });
  };

  // ZMIANA: odpal dopiero PO pierwszym paintcie (double rAF)
  requestAnimationFrame(() => {
    requestAnimationFrame(initialReveal);
  });

  // Zostaw też „bezpieczniki” na późniejsze wejścia
  window.addEventListener(
    "load",
    () => {
      setTimeout(initialReveal, 0);
    },
    { once: true }
  );
  window.addEventListener(
    "pageshow",
    () => {
      setTimeout(initialReveal, 0);
    },
    { once: true }
  );
})();

/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Motyw + przełączanie logo + ikonka hamburgera (desktop+mobile) =============
   - Umożliwia przełączanie motywu jasny/ciemny
   - Podmienia logotypy (.logo-img[data-light][data-dark]) i ikonę hamburgera
   - Zapamiętuje wybór w localStorage (zabezpieczenie na Safari Private Mode)
   - Obsługuje dwa przyciski: desktopowy i mobilny
   - Synchronizuje aria-label i aria-pressed (a11y)
   - Reaguje na systemowy prefers-color-scheme, jeśli brak zapisu w LS
   ======================================================================================= */
(() => {
  const btnDesktop = document.getElementById("themeToggleDesktop");
  const btnMobile = document.getElementById("themeToggleMobile");
  const logos = document.querySelectorAll(".logo-img[data-light][data-dark]");
  const hamburgerIcon = document.getElementById("hamburgerIcon");

  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  /* --- Podmiana logo w zależności od motywu --- */
  const setLogo = (isDark) => {
    logos.forEach((img) => {
      const next = isDark ? img.dataset.dark : img.dataset.light;
      if (!next) return;
      // unikamy zbędnych podmian
      const absNext = new URL(next, document.baseURI).href;
      if (img.src !== absNext) img.setAttribute("src", next);
    });
  };

  /* --- Podmiana ikonki hamburgera — korzystamy z data-light / data-dark z HTML --- */
  const setHamburgerIcon = (isDark) => {
    if (!hamburgerIcon) return;
    const next = isDark ? hamburgerIcon.dataset.dark : hamburgerIcon.dataset.light;
    if (!next) return;
    if (hamburgerIcon.getAttribute("src") !== next) {
      hamburgerIcon.setAttribute("src", next);
    }
  };

  /* --- Synchronizacja aria-* przycisków toggle (a11y) --- */
  const syncButtonsA11y = (isDark) => {
    const pressed = String(isDark);
    const label = isDark ? "Przełącz na jasny motyw" : "Przełącz na ciemny motyw";
    if (btnDesktop) {
      btnDesktop.setAttribute("aria-pressed", pressed);
      btnDesktop.setAttribute("aria-label", label);
    }
    if (btnMobile) {
      btnMobile.setAttribute("aria-pressed", pressed);
      btnMobile.setAttribute("aria-label", label);
    }
  };

  /* --- Safe localStorage (try/catch dla Safari Private) --- */
  const safeSetItem = (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  };
  const safeGetItem = (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };

  /* --- Główna funkcja zmiany motywu --- */
  const setTheme = (mode, persist = true) => {
    const isDark = mode === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    setLogo(isDark);
    setHamburgerIcon(isDark);
    syncButtonsA11y(isDark);
    if (persist) safeSetItem("theme", isDark ? "dark" : "light");
  };

  /* --- Inicjalizacja: localStorage > prefers-color-scheme --- */
  const saved = safeGetItem("theme"); // 'dark' | 'light' | null
  if (saved === "dark" || saved === "light") {
    setTheme(saved, false);
  } else {
    setTheme(mq && mq.matches ? "dark" : "light", false);
  }

  /* --- Obsługa kliknięć w przyciski --- */
  const onToggle = () => {
    const next = document.body.classList.contains("dark-mode") ? "light" : "dark";
    setTheme(next, true);
  };
  if (btnDesktop) btnDesktop.addEventListener("click", onToggle);
  if (btnMobile) btnMobile.addEventListener("click", onToggle);

  /* --- Reakcja na zmianę systemowego motywu (gdy brak zapisu w LS) --- */
  if (!saved && mq) {
    const onSystemChange = (e) => setTheme(e.matches ? "dark" : "light", false);
    if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange); // Safari <14
  }
})();

/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Hamburger (mobile nav) =====================================================
   - Steruje otwieraniem/zamykaniem menu mobilnego
   - A11y: aria-expanded + aria-label, blokada scrolla na <body> (nav-open)
   - Zamyka się na: Esc, klik linku w menu, wyjście z zakresu mobile (>768px)
   ======================================================================================= */
(() => {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("primaryNav");
  if (!btn || !nav) return; // brak elementów — kończymy

  // ensure default aria-expanded for a11y (defensywny)
  if (!btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");

  /* --- Zamknij menu i posprzątaj atrybuty/stany --- */
  const closeMenu = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    document.body.classList.remove("nav-open"); // odblokuj scroll (zgodnie z CSS)
  };

  /* --- Przełącz menu (open/close) + aktualizacja a11y --- */
  const toggleMenu = () => {
    const isOpen = !nav.classList.contains("mobile-open");
    nav.classList.toggle("mobile-open", isOpen);
    btn.classList.toggle("active", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
    document.body.classList.toggle("nav-open", isOpen); // zablokuj/odblokuj scroll (zgodnie z CSS)
  };

  /* --- Klik w przycisk hamburgera --- */
  btn.addEventListener("click", toggleMenu);

  /* --- Esc zamyka tylko, gdy naprawdę jest otwarte --- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("mobile-open")) {
      closeMenu();
    }
  });

  /* --- Klik w link w nawigacji = zamknij (UX mobilny) --- */
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a[href], area[href]");
    if (link) closeMenu();
  });

  /* --- Wyjście z mobile (np. rotacja/resize > 768px) — zamknij menu --- */
  const mql = window.matchMedia("(max-width: 768px)");
  const onChange = () => {
    if (!mql.matches) closeMenu();
  };
  if (mql.addEventListener) mql.addEventListener("change", onChange);
  else if (mql.addListener) mql.addListener(onChange); // Safari <14
})();

/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Przycisk „Powrót na górę” ==================================================
   - Pokazuje przycisk po przewinięciu > THRESHOLD
   - rAF odszumia nasłuch scrolla
   - Szanuje prefers-reduced-motion przy płynnym scrollu
   - Aktualizuje stan na: start, load, pageshow (bfcache), visibilitychange, resize
   ======================================================================================= */
(() => {
  const btn = document.getElementById("powrot-na-gore") || document.querySelector(".powrot-na-gore");
  if (!btn) return; // brak przycisku — nic nie robimy

  const THRESHOLD = 300; // px — po tylu pikselach pojawia się przycisk

  /* --- Bezpieczny odczyt pozycji scrolla (zgodność) --- */
  const getScrollTop = () => (typeof window.pageYOffset === "number" ? window.pageYOffset : (document.scrollingElement || document.documentElement).scrollTop);

  /* --- Uaktualnij widoczność przycisku --- */
  const update = () => {
    btn.classList.toggle("is-visible", getScrollTop() > THRESHOLD);
  };

  /* --- rAF: delikatne „odszumienie” eventów scroll --- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  /* --- Inicjalizacja i typowe powroty z bfcache --- */
  update();
  window.addEventListener("load", update, { once: true });
  window.addEventListener("pageshow", update, { once: true }); // Safari/FF bfcache
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") update();
  });
  window.addEventListener("resize", update); // zmiana wysokości viewportu

  /* --- Reakcja na scroll --- */
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Płynny powrót do góry (+ respect reduced motion) --- */
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    // Jeśli z jakiegoś powodu można kliknąć niewidoczny przycisk — ignorujemy
    if (!btn.classList.contains("is-visible")) return;

    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  });
})();

/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== FORMULARZ — submit + walidacja + licznik + success state + Netlify =========
   - Walidacja: required, email, phone (opcjonalny), RODO, reCAPTCHA (Netlify)
   - A11y: aria-invalid, skrót do pierwszego błędu, error summary + skip link
   - Licznik znaków wiadomości + auto-save szkicu w localStorage
   - Wysyłka: POST application/x-www-form-urlencoded (Netlify Forms)
   - Success state: dyskretny, bez przeładowania; GA4 + Meta po sukcesie (prod)
   =========================================================== */
(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  /* --- USTAWIENIA / REFERENCJE --- */
  const IS_LOCAL = /localhost|127\.0\.0\.1/.test(location.hostname); // wspólny przełącznik środowiska
  const statusBox = form.querySelector("#formStatus"); // rola: podgląd błędów/sukcesów
  const submitBtn = form.querySelector(".submit-btn");
  const originalBtnText = submitBtn ? submitBtn.textContent : "Wyślij wiadomość"; // (1) defensywnie
  const requiredFields = ["name", "email", "subject", "service", "message"]; // phone opcjonalny

  const msg = form.querySelector("#message");
  const counter = document.getElementById("messageCounter");
  const MAX = 500;

  // A11y elementy istnieją w HTML (summary + skrót)
  const a11ySummary = form.querySelector("#errorSummary");
  const skipLink = form.querySelector("#skipToError");

  /* --- Skrót „przejdź do pierwszego błędu” (link pod sumarycznym komunikatem) --- */
  if (skipLink) {
    skipLink.addEventListener("click", (ev) => {
      ev.preventDefault();
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
    });
  }

  /* --- Skrót klawiaturowy: Alt+Shift+E → fokus na 1. błędnym polu --- */
  form.addEventListener("keydown", (ev) => {
    const k = ev.key || ev.code;
    if (ev.altKey && ev.shiftKey && (k === "E" || k === "KeyE")) {
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        ev.preventDefault();
        firstInvalid.focus();
      }
    }
  });

  /* --- UTILS: oznaczanie/odznaczanie błędów + status box --- */
  const setInvalid = (el) => {
    if (!el) return;
    el.classList.add("is-invalid");
    el.setAttribute("aria-invalid", "true");
  };
  const clearInvalid = (el) => {
    if (!el) return;
    el.classList.remove("is-invalid");
    el.removeAttribute("aria-invalid");
  };
  const showStatus = (message, ok = false) => {
    if (!statusBox) return;
    statusBox.classList.toggle("ok", !!ok);
    statusBox.classList.toggle("err", !ok);
    statusBox.textContent = message;
  };

  /* --- Licznik znaków wiadomości + twardy limit --- */
  function updateCounter() {
    if (!msg || !counter) return;
    if (msg.value.length > MAX) msg.value = msg.value.slice(0, MAX);
    const len = msg.value.length;
    counter.textContent = `${len}/${MAX}`;
    counter.classList.toggle("warn", len >= MAX - 50 && len < MAX);
    counter.classList.toggle("limit", len >= MAX);
  }
  updateCounter();

  /* --- AUTO-SAVE szkicu wiadomości (localStorage) --- */
  const MSG_KEY = "contactFormMessage";
  if (msg) {
    // Przy starcie: odczyt i odświeżenie licznika
    const savedMsg = (() => {
      try {
        return localStorage.getItem(MSG_KEY);
      } catch {
        return null;
      }
    })();
    if (savedMsg) {
      msg.value = savedMsg;
      updateCounter();
    }

    // Zapis na input (try/catch pod Safari Private)
    msg.addEventListener("input", () => {
      try {
        localStorage.setItem(MSG_KEY, msg.value);
      } catch {
        /* silent */
      }
    });
  }

  /* --- Oczyszczanie błędów podczas wpisywania + ukrywanie summary/skip, gdy czysto --- */
  form.addEventListener("input", (e) => {
    const t = e.target;
    if (t.matches("#name, #email, #subject, #service, #message, #phone, #consent")) clearInvalid(t);
    if (t === msg) updateCounter();

    // Jeśli nie ma już błędów — schowaj summary/skip (a11y)
    if (![...form.querySelectorAll(".is-invalid")].length) {
      if (a11ySummary) a11ySummary.classList.add("visually-hidden");
      if (skipLink) skipLink.classList.add("visually-hidden");
    }
  });

  /* --- Główny handler submit --- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Hard guard: nie pozwól na wielokrotny submit
    if (form.getAttribute("aria-busy") === "true") return;
    showStatus("", false);

    let valid = true;

    /* 1) Required — puste pola */
    requiredFields.forEach((id) => {
      const el = form.querySelector("#" + id);
      if (!el || !el.value || !el.value.trim()) {
        setInvalid(el);
        valid = false;
      }
    });

    /* 2) Email — prosta walidacja struktury */
    const email = form.querySelector("#email");
    const emailVal = email ? email.value.trim() : "";
    if (email && emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setInvalid(email);
      valid = false;
      showStatus("Wpisz poprawny adres e-mail.", false);
    }

    /* 3) Telefon (opcjonalny) — akceptuje cyfry, spacje i standardowe separatory */
    const phone = form.querySelector("#phone");
    if (phone) {
      const phoneVal = phone.value.trim();
      if (phoneVal && !/^[0-9 +()-]{7,20}$/.test(phoneVal)) {
        setInvalid(phone);
        valid = false;
        showStatus("Wpisz poprawny numer telefonu (np. +48 600 000 000).", false);
      }
    }

    /* 4) RODO — checkbox wymagany */
    const consent = form.querySelector("#consent");
    if (consent && !consent.checked) {
      setInvalid(consent);
      valid = false;
      showStatus("Zaznacz zgodę na przetwarzanie danych.", false);
    }

    /* 4.5) reCAPTCHA (Netlify) — tylko gdy widget jest obecny i nie lokalnie */
    const recaptchaWrap = form.querySelector("[data-recaptcha]");
    if (recaptchaWrap && !IS_LOCAL) {
      const tokenField = form.querySelector('[name="g-recaptcha-response"]');
      if (!tokenField || !tokenField.value) {
        valid = false;
        showStatus("Potwierdź, że nie jesteś robotem (reCAPTCHA).", false);
      }
    }

    /* 5) Limit treści wiadomości */
    if (msg && msg.value.length > MAX) {
      setInvalid(msg);
      valid = false;
      showStatus(`Wiadomość może mieć maks. ${MAX} znaków.`, false);
    }

    /* --- Gdy są błędy: pokaż podsumowanie i przeskocz do pierwszego błędu --- */
    if (!valid) {
      const invalids = [...form.querySelectorAll(".is-invalid")];

      if (a11ySummary) {
        const labels = invalids.map((el) => {
          const lab = el.id ? form.querySelector(`label[for="${el.id}"]`) : null;
          return lab ? lab.textContent.trim() : el.name || el.id || "Pole";
        });
        const n = invalids.length;
        const suf = n === 1 ? "błąd" : n >= 2 && n <= 4 ? "błędy" : "błędów";
        a11ySummary.textContent = `Formularz zawiera ${n} ${suf}: ${labels.join(", ")}.`;
        a11ySummary.classList.remove("visually-hidden");
      }
      if (skipLink) skipLink.classList.remove("visually-hidden");

      const firstInvalid = invalids[0];
      if (firstInvalid) firstInvalid.focus();

      if (statusBox && !statusBox.textContent) showStatus("Uzupełnij wymagane pola.", false);
      return;
    }

    /* === SENDING UI === */
    form.setAttribute("aria-busy", "true");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("sending");
      submitBtn.textContent = "Wysyłanie…";
    }
    showStatus("Wysyłanie…", true);

    /* --- Przygotowanie danych do Netlify Forms --- */
    const formData = new FormData(form); // zawiera też hidden 'form-name'
    const body = new URLSearchParams(formData).toString(); // urlencoded do fetch

    try {
      /* --- Wysyłka: produkcja vs. lokalnie (symulacja) --- */
      if (!IS_LOCAL) {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          // keepalive: true, // (opcjonalnie) pozwala wysłać, gdy user szybko nawigował dalej
        });
        if (!res.ok) throw new Error("Netlify response not OK");
      } else {
        // Lokalnie: krótkie opóźnienie dla realizmu
        await new Promise((r) => setTimeout(r, 500));
      }

      /* === SUCCESS === */
      form.setAttribute("aria-busy", "false"); // (2) sprzątanie flagi
      form.reset();
      try {
        localStorage.removeItem(MSG_KEY);
      } catch {}

      updateCounter();
      showStatus("Dziękujemy! Wiadomość została wysłana.", true);

      if (submitBtn) {
        submitBtn.classList.remove("sending");
        submitBtn.classList.add("sent");
        submitBtn.textContent = "Wysłano ✓";
        setTimeout(() => {
          submitBtn.disabled = false;
        }, 1200);
        setTimeout(() => {
          showStatus("", true);
          submitBtn.classList.remove("sent");
          submitBtn.textContent = originalBtnText;
        }, 6000);
      }

      // Posprzątaj A11y (podsumowanie/skip niewidoczne przy czystym stanie)
      if (a11ySummary) a11ySummary.classList.add("visually-hidden");
      if (skipLink) skipLink.classList.add("visually-hidden");

      /* --- TRACKING (tylko produkcja): GA4 + Meta --- */
      if (!IS_LOCAL) {
        if (typeof gtag === "function") {
          gtag("event", "generate_lead", { event_category: "Formularz", event_label: "Kontakt — Budownictwo" });
        }
        if (typeof fbq === "function") {
          fbq("track", "Lead");
        }
      }
    } catch (err) {
      /* === ERROR PATH === */
      form.setAttribute("aria-busy", "false");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("sending");
        submitBtn.textContent = originalBtnText;
      }
      showStatus("Ups! Nie udało się wysłać. Spróbuj ponownie za chwilę.", false);
      console.error(err);
    }
  }); // ← koniec submit handlera
})(); // ← koniec IIFE

/* =======================================================================================
   LIGHTBOX — podgląd zdjęcia (bez overlay i bez „double-tap”)
   - HTML:
     <div id="lightbox" class="lb" role="dialog" aria-modal="true"
          aria-labelledby="lightbox-title" aria-describedby="lightbox-caption"
          hidden tabindex="-1"> … </div>
   - Otwieranie: 1 klik/tap w .gallery-link
   - Zamknięcie: Esc, klik w tło (data-lb-close) lub przycisk ×
   - A11y: focus-trap, aria-hidden, przywracanie fokusu, body lock (lb-open)
   ======================================================================================= */
(() => {
  const lb = document.getElementById("lightbox");
  if (!lb) return;

  const imgEl = lb.querySelector(".lb__img");
  const captionEl = lb.querySelector(".lb__caption");
  const closeBtn = lb.querySelector(".lb__close");
  const backdrop = lb.querySelector(".lb__backdrop");

  let lastActive = null;
  let focusables = [],
    firstF = null,
    lastF = null;

  // Wykrywanie desktopu do prefetchu (opcjonalne)
  const isTouchLike = window.matchMedia ? window.matchMedia("(hover: none) and (pointer: coarse)").matches : "ontouchstart" in window;

  // Focus trap
  const trapInit = () => {
    focusables = Array.from(lb.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
    firstF = focusables[0];
    lastF = focusables[focusables.length - 1];
  };
  const trapRelease = () => {
    focusables = [];
    firstF = lastF = null;
  };
  const handleTrap = (e) => {
    if (!focusables.length) return;
    if (e.shiftKey && document.activeElement === firstF) {
      e.preventDefault();
      lastF.focus();
    } else if (!e.shiftKey && document.activeElement === lastF) {
      e.preventDefault();
      firstF.focus();
    }
  };

  // OTWARCIE
  const open = (src, alt) => {
    lastActive = document.activeElement;

    imgEl.src = src;
    imgEl.alt = alt || "";

    if (alt && alt.trim()) {
      captionEl.textContent = alt;
      captionEl.hidden = false;
    } else {
      captionEl.textContent = "";
      captionEl.hidden = true;
    }

    // start z hidden w HTML
    lb.removeAttribute("hidden"); // zdejmij UA display:none
    lb.setAttribute("aria-hidden", "false"); // CSS pokazuje lightbox (np. display:flex)
    document.body.classList.add("lb-open"); // body lock (overflow:hidden)

    trapInit();
    if (closeBtn) closeBtn.focus();
  };

  // ZAMKNIĘCIE
  const close = () => {
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-open");

    imgEl.removeAttribute("src");
    captionEl.textContent = "";
    captionEl.hidden = true;

    trapRelease();

    // przywróć hidden dla pełnej zgodności
    lb.setAttribute("hidden", "");

    if (lastActive && typeof lastActive.focus === "function") {
      lastActive.focus();
    }
  };

  // Delegacja kliknięcia w miniaturę/link (jednolicie: desktop + mobile)
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".gallery-link");
    if (!link || !link.closest(".gallery-container")) return;

    e.preventDefault();
    const href = link.getAttribute("href");
    const thumbImg = link.querySelector("img");
    const alt = thumbImg ? thumbImg.alt : "";
    if (href) open(href, alt);
  });

  // Zamknięcie: klik w tło / przycisk ×
  if (backdrop) backdrop.addEventListener("click", close);
  if (closeBtn) closeBtn.addEventListener("click", close);

  // Klawiatura: Esc + Tab (focus-trap) — tylko gdy LB otwarty
  document.addEventListener("keydown", (e) => {
    if (lb.getAttribute("aria-hidden") !== "false") return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      handleTrap(e);
    }
  });

  // Prefetch dużego zdjęcia na hover (desktop only) — opcjonalnie pomaga wczytaniu
  if (!isTouchLike) {
    document.addEventListener(
      "mouseenter",
      (e) => {
        const link = e.target.closest(".gallery-link");
        if (!link || !link.closest(".gallery-container")) return;
        const href = link.getAttribute("href");
        if (!href) return;
        const pre = new Image();
        pre.decoding = "async";
        pre.src = href;
      },
      true
    );
  }
})();

/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Compact Header po scrollu ===================================================
   - Po przewinięciu > THRESHOLD px dodaje klasę .header-compact na <body>
   - Gdy otwarte mobile menu (body.nav-open) — kompakt wyłączony
   - rAF do odszumienia scrolla; init na starcie/po powrocie z bfcache
   ======================================================================================= */
(() => {
  const THRESHOLD = 20; // px przewinięcia, po którym header się „zbija”
  let compactOn = false;
  let ticking = false;

  const shouldCompact = () => (window.scrollY || window.pageYOffset || 0) > THRESHOLD;

  const apply = (on) => {
    if (on === compactOn) return;
    compactOn = on;
    document.body.classList.toggle("header-compact", compactOn);
  };

  const update = () => apply(shouldCompact());

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  // Inicjalizacja + typowe zdarzenia
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll); // obrót ekranu / zmiana vh
  window.addEventListener("pageshow", update, { once: true });

  // Synchronizacja z hamburgerem (po otwarciu/zamknięciu menu)
  const btn = document.getElementById("hamburger");
  if (btn) {
    btn.addEventListener("click", () => {
      setTimeout(update, 0); // po zmianie body.nav-open
    });
  }

  // Fallback: reaguj na każdą zmianę klas <body> (np. gdyby coś innego zmieniało nav-open)
  const mo = new MutationObserver(update);
  mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
})();
