const THEME_KEY = "lume-skin-theme-v1";
const THEME_VERSION = 1;
const html = document.documentElement;

html.classList.add("js-enabled");

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");

const prefersDark = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

const getStoredTheme = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(THEME_KEY));
    if (stored?.version === THEME_VERSION) {
      return stored.theme;
    }
  } catch (error) {
    console.warn("Theme storage unavailable", error);
  }
  return null;
};

const applyTheme = (theme) => {
  if (theme) {
    html.setAttribute("data-theme", theme);
  } else {
    html.removeAttribute("data-theme");
  }
  if (themeLabel) {
    themeLabel.textContent = theme === "dark" ? "Tryb ciemny" : "Tryb jasny";
  }
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", theme === "dark");
  }
};

const initTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    applyTheme(storedTheme);
    return;
  }
  applyTheme(prefersDark() ? "dark" : "light");
};

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme") || (prefersDark() ? "dark" : "light");
    const nextTheme = current === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify({
        version: THEME_VERSION,
        theme: nextTheme
      }));
    } catch (error) {
      console.warn("Theme storage failed", error);
    }
  });
}

initTheme();

const header = document.querySelector(".header");
let lastKnownScroll = 0;
let ticking = false;

const onScroll = () => {
  lastKnownScroll = window.scrollY || window.pageYOffset;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (header) {
        header.classList.toggle("header--shrink", lastKnownScroll > 12);
      }
      ticking = false;
    });
    ticking = true;
  }
};

window.addEventListener("scroll", onScroll, { passive: true });

const overlay = document.querySelector(".header__overlay");
const mobileNav = document.querySelector(".header__nav--mobile");
const toggleButton = document.querySelector(".header__toggle");
let lastFocusedElement = null;

const focusableSelectors = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

const getFocusableElements = (container) =>
  Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (element) => !element.hasAttribute("disabled")
  );

const openMobileNav = () => {
  if (!mobileNav || !overlay || !toggleButton) return;
  lastFocusedElement = document.activeElement;
  mobileNav.classList.add("header__nav--open");
  overlay.classList.add("is-visible");
  toggleButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("no-scroll");
  const focusable = getFocusableElements(mobileNav);
  focusable[0]?.focus();
};

const closeMobileNav = () => {
  if (!mobileNav || !overlay || !toggleButton) return;
  mobileNav.classList.remove("header__nav--open");
  overlay.classList.remove("is-visible");
  toggleButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("no-scroll");
  lastFocusedElement?.focus();
};

const trapFocus = (event) => {
  if (!mobileNav || !mobileNav.classList.contains("header__nav--open")) return;
  if (event.key !== "Tab") return;
  const focusable = getFocusableElements(mobileNav);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

if (toggleButton && overlay && mobileNav) {
  toggleButton.addEventListener("click", () => {
    const isOpen = mobileNav.classList.contains("header__nav--open");
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  overlay.addEventListener("click", closeMobileNav);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav();
    }
    trapFocus(event);
  });
}

const revealElements = document.querySelectorAll("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

revealElements.forEach((element) => element.classList.add("reveal"));

if (reduceMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const tabGroups = document.querySelectorAll("[data-tabs]");

tabGroups.forEach((group) => {
  const tabs = group.querySelectorAll("[role='tab']");
  const panels = group.querySelectorAll("[role='tabpanel']");

  const activateTab = (tab) => {
    tabs.forEach((btn) => {
      const isActive = btn === tab;
      btn.setAttribute("aria-selected", isActive);
      btn.setAttribute("tabindex", isActive ? "0" : "-1");
    });
    panels.forEach((panel) => {
      const shouldShow = panel.id === tab.getAttribute("aria-controls");
      panel.hidden = !shouldShow;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      const index = Array.from(tabs).indexOf(tab);
      if (event.key === "ArrowRight") {
        event.preventDefault();
        activateTab(tabs[(index + 1) % tabs.length]);
        tabs[(index + 1) % tabs.length].focus();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        activateTab(tabs[(index - 1 + tabs.length) % tabs.length]);
        tabs[(index - 1 + tabs.length) % tabs.length].focus();
      }
    });
  });
});

const accordions = document.querySelectorAll("[data-accordion]");

accordions.forEach((accordion) => {
  const triggers = accordion.querySelectorAll(".accordion__trigger");
  triggers.forEach((trigger) => {
    const panel = trigger.parentElement.querySelector(".accordion__panel");
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.classList.toggle("is-open", !isOpen);
    });
  });
});

const bookingForm = document.querySelector("[data-booking-form]");

if (bookingForm) {
  const serviceSelect = bookingForm.querySelector("#service");
  const subServiceSelect = bookingForm.querySelector("#subservice");
  const successMessage = bookingForm.querySelector("[data-success]");
  const summary = bookingForm.querySelector("[data-error-summary]");

  const subServices = {
    "Skin Care": [
      "Oczyszczanie + peeling",
      "Nawilżenie i ukojenie",
      "Terapia anti-aging",
      "Program przeciwtrądzikowy",
      "Masaż liftingujący twarzy"
    ],
    Paznokcie: [
      "Manicure klasyczny",
      "Pedicure SPA",
      "Stylizacja żelowa",
      "Regeneracja płytki"
    ],
    Masaż: [
      "Relaksacyjny całego ciała",
      "Masaż pleców i karku",
      "Masaż twarzy i dekoltu"
    ]
  };

  const updateSubServices = () => {
    const selected = serviceSelect?.value;
    if (!subServiceSelect || !selected) return;
    subServiceSelect.innerHTML = "";
    const options = subServices[selected] || [];
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Wybierz pod-usługę";
    subServiceSelect.appendChild(placeholder);
    options.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      subServiceSelect.appendChild(option);
    });
  };

  const showError = (field, message) => {
    const targetId = field.dataset.errorTarget || field.id;
    const error = bookingForm.querySelector(`#${targetId}-error`);
    if (error) {
      error.textContent = message;
    }
    field.setAttribute("aria-invalid", "true");
  };

  const clearError = (field) => {
    const targetId = field.dataset.errorTarget || field.id;
    const error = bookingForm.querySelector(`#${targetId}-error`);
    if (error) {
      error.textContent = "";
    }
    field.removeAttribute("aria-invalid");
  };

  const validateField = (field) => {
    if (field.hasAttribute("required") && !field.value.trim()) {
      showError(field, "To pole jest wymagane.");
      return false;
    }
    clearError(field);
    return true;
  };

  const validateCheckbox = (field) => {
    if (field.hasAttribute("required") && !field.checked) {
      showError(field, "Wymagana zgoda na przetwarzanie danych.");
      return false;
    }
    clearError(field);
    return true;
  };

  if (serviceSelect) {
    serviceSelect.addEventListener("change", updateSubServices);
    updateSubServices();
  }

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (summary) {
      summary.innerHTML = "";
      summary.hidden = true;
    }
    const fields = bookingForm.querySelectorAll("input, select, textarea");
    const invalidFields = [];
    const checkedRadioGroups = new Set();

    fields.forEach((field) => {
      if (field.type === "radio") {
        if (checkedRadioGroups.has(field.name)) return;
        checkedRadioGroups.add(field.name);
        const group = bookingForm.querySelectorAll(`input[name='${field.name}']`);
        const hasSelection = Array.from(group).some((item) => item.checked);
        if (!hasSelection) {
          showError(field, "Wybierz preferowany kontakt.");
          invalidFields.push(field);
        } else {
          clearError(field);
        }
        return;
      }
      if (field.type === "checkbox") {
        if (!validateCheckbox(field)) {
          invalidFields.push(field);
        }
        return;
      }
      if (!validateField(field)) {
        invalidFields.push(field);
      }
    });

    if (invalidFields.length) {
      if (summary) {
        summary.hidden = false;
        summary.innerHTML = "<p>Sprawdź pola oznaczone błędem:</p>";
        const list = document.createElement("ul");
        invalidFields.forEach((field) => {
          const item = document.createElement("li");
          const link = document.createElement("a");
          link.href = `#${field.id}`;
          link.textContent = field.getAttribute("data-label") || field.name || field.id;
          item.appendChild(link);
          list.appendChild(item);
        });
        summary.appendChild(list);
      }
      invalidFields[0].focus();
      return;
    }

    if (successMessage) {
      successMessage.hidden = false;
      successMessage.textContent = "Dziękujemy! Rezerwacja została przyjęta. Skontaktujemy się, aby potwierdzić termin.";
    }
    bookingForm.reset();
    updateSubServices();
  });
}

const backToTop = document.querySelector("[data-back-to-top]");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  }, { passive: true });
}
