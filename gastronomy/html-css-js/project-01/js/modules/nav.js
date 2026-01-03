import { $, $$, byTestId, log } from "./utils.js";

export function initMobileNav() {
  const toggle = byTestId("nav-toggle") || $(".nav-toggle");
  const nav = byTestId("site-nav") || $("#site-nav");
  if (!toggle || !nav) return;

  const mq = window.matchMedia("(min-width: 900px)");
  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  if (!toggle.hasAttribute("aria-controls")) {
    toggle.setAttribute("aria-controls", nav.id || "site-nav");
  }

  toggle.addEventListener(
    "click",
    () => setOpen(!document.body.classList.contains("nav-open")),
    { passive: true }
  );

  nav.addEventListener(
    "click",
    (event) => {
      if (event.target.closest("a")) setOpen(false);
    },
    { passive: true }
  );

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
    if (!insideNav && !insideToggle) setOpen(false);
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

  const sections = [...document.querySelectorAll("section[id]")].filter((section) =>
    map.has(section.id)
  );
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
    return (
      href.includes(`#${value}`) ||
      href.endsWith(`${value}.html`) ||
      href.includes(`/${value}.html`) ||
      href.includes(`/${value}`)
    );
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