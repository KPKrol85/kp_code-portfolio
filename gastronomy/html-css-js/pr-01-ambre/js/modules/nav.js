import { $, $$, byTestId, log } from "./utils.js";

export function initMobileNav() {
  const toggle = byTestId("nav-toggle") || $(".nav-toggle");
  const nav = byTestId("site-nav") || $("#site-nav");
  if (!toggle || !nav) return;

  const overlay = $(".nav-overlay");
  const drawer = $(".nav-drawer");
  const drawerInner = $(".nav-drawer-inner", drawer || document);
  const navList = nav.querySelector("ul");
  if (drawerInner && navList && !drawerInner.children.length) {
    drawerInner.appendChild(navList.cloneNode(true));
  }
  if (drawerInner) {
    drawerInner.querySelectorAll(".has-submenu").forEach((item) => {
      if (item.querySelector(".drawer-accordion-trigger")) return;
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "drawer-accordion-trigger";
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-label", "Pokaż podmenu");
      const submenu = item.querySelector(".nav-submenu");
      if (submenu) {
        item.insertBefore(trigger, submenu);
      }
    });
  }
  if (overlay) overlay.hidden = false;
  if (drawer) drawer.hidden = false;

  const mq = window.matchMedia("(min-width: 939px)");
  const getFocusable = () =>
    drawer
      ? Array.from(
          drawer.querySelectorAll(
            "a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])"
          )
        ).filter((el) => !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true")
      : [];
  let previouslyFocused = null;
  const trapFocus = (event) => {
    if (event.key !== "Tab" || !document.body.classList.contains("nav-open")) return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (drawer && !drawer.contains(active)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const setOpen = (open) => {
    const wasOpen = document.body.classList.contains("nav-open");
    if (open && !wasOpen) previouslyFocused = document.activeElement;
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (drawer) drawer.setAttribute("aria-hidden", String(!open));
    if (open) {
      const focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
      document.addEventListener("keydown", trapFocus);
    } else {
      document.removeEventListener("keydown", trapFocus);
      if (wasOpen) {
        const target = previouslyFocused && typeof previouslyFocused.focus === "function" ? previouslyFocused : toggle;
        if (target && typeof target.focus === "function") target.focus();
      }
      previouslyFocused = null;
    }
  };

  if (!toggle.hasAttribute("aria-controls")) {
    toggle.setAttribute("aria-controls", nav.id || "site-nav");
  }

  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")), { passive: true });

  nav.addEventListener(
    "click",
    (event) => {
      if (event.target.closest("a")) setOpen(false);
    },
    { passive: true }
  );

  drawer?.addEventListener(
    "click",
    (event) => {
      const trigger = event.target.closest(".drawer-accordion-trigger");
      if (trigger) {
        const item = trigger.closest(".has-submenu");
        if (!item) return;
        const isOpen = !item.classList.contains("is-accordion-open");
        item.classList.toggle("is-accordion-open", isOpen);
        trigger.setAttribute("aria-expanded", String(isOpen));
        return;
      }
      if (event.target.closest("a")) setOpen(false);
    },
    { passive: true }
  );

  overlay?.addEventListener("click", () => setOpen(false), { passive: true });

  let wasDesktop = mq.matches;
  const handleResize = () => {
    const isDesktop = mq.matches;
    if (isDesktop && !wasDesktop) setOpen(false);
    wasDesktop = isDesktop;
  };

  mq.addEventListener?.("change", handleResize);
  window.addEventListener("resize", handleResize, { passive: true });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) return;
    const insideNav = event.target.closest("#site-nav");
    const insideToggle = event.target.closest(".nav-toggle");
    const insideDrawer = event.target.closest(".nav-drawer");
    if (!insideNav && !insideToggle && !insideDrawer) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      setOpen(false);
    }
  });

  log();
}

export function initScrollspy() {
  const links = $$("#site-nav a[href^='#']");
  if (!links.length) return;

  const map = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
  const setCurrent = (id) => {
    if (!id || !map.has(id)) return;
    links.forEach((link) => link.removeAttribute("aria-current"));
    map.get(id)?.setAttribute("aria-current", "true");
  };

  const sections = [...document.querySelectorAll("section[id]")].filter((section) => map.has(section.id));
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));

  (document.getElementById("site-nav") || document).addEventListener(
    "click",
    (event) => {
      const link = event.target.closest("a[href^='#']");
      if (!link || !links.includes(link)) return;
      setCurrent(link.getAttribute("href").slice(1));
    },
    { passive: true }
  );

  if (location.hash) setCurrent(location.hash.slice(1));
  log(links.length);
}

export function initSmartNav() {
  const path = location.pathname;
  if (/(?:^|\/)(index\.html)?$/.test(path) || path.endsWith("/")) return;

  const map = {
    "#menu": "menu.html",
    "#galeria": "galeria.html",
  };

  const links = document.querySelectorAll(".site-nav a[href^='#']");
  if (!links.length) return;

  links.forEach((link) => {
    const replacement = map[link.getAttribute("href") || ""];
    if (replacement) link.setAttribute("href", replacement);
  });

  log(links.length);
}

export function initAriaCurrent() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a"));
  const path = (location.pathname.split("/").pop() || "").replace(".html", "");
  const hash = (location.hash || "").replace("#", "");

  links.forEach((link) => link.removeAttribute("aria-current"));

  const matches = (link, value) => {
    if (!value) return false;
    const href = link.getAttribute("href") || "";
    return href.includes(`#${value}`) || href.endsWith(`${value}.html`) || href.includes(`/${value}.html`) || href.includes(`/${value}`);
  };

  if (path) {
    for (const link of links) {
      if (matches(link, path)) {
        link.setAttribute("aria-current", "page");
        return;
      }
    }
  }

  if (hash) {
    for (const link of links) {
      if (matches(link, hash)) {
        link.setAttribute("aria-current", "page");
        return;
      }
    }
  }

  log(links.length);
}

export function initStickyShadow() {
  const update = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  log();
}
