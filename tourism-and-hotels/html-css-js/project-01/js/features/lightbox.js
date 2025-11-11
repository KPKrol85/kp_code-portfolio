// js/features/lightbox.js
// Accessible lightbox z delegacją zdarzeń i wsparciem klawiatury
export function initLightbox() {
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  const img = lightbox.querySelector(".lightbox__img");
  const caption = lightbox.querySelector(".lightbox__caption");
  const closeBtns = lightbox.querySelectorAll("[data-lightbox-close]");
  const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
  const nextBtn = lightbox.querySelector("[data-lightbox-next]");
  const dialogEl = lightbox.querySelector(".lightbox__dialog");

  // helper: element faktycznie widoczny (nie display:none)
  const isVisible = (el) => !!(el.offsetParent || el.getClientRects().length);

  // Zbieramy elementy TYLKO z aktywnej kategorii (albo wszystkie, gdy 'all')
  const items = () => {
    const activeCat = document.body.dataset.galleryFilter || "all";
    const all = Array.from(document.querySelectorAll(".gallery-grid [data-lightbox-item]"));
    return all.filter((a) => {
      const cat = a.getAttribute("data-cat-item");
      const matchCat = activeCat === "all" || cat === activeCat;
      return matchCat && isVisible(a);
    });
  };

  let index = 0;
  let lastFocused = null;

  function renderFromAnchor(a) {
    const fullSrc = a.getAttribute("href");
    const thumbImg = a.querySelector("img");
    const text = a.getAttribute("data-caption") || thumbImg?.alt || "";

    if (img && fullSrc) {
      img.src = fullSrc;
      img.removeAttribute("width");
      img.removeAttribute("height");
      img.alt = text || "Podgląd";
    }
    if (caption) caption.textContent = text;
  }

  function open(i, focusOrigin) {
    const list = items();
    if (!list.length) return;
    index = ((i % list.length) + list.length) % list.length;

    renderFromAnchor(list[index]);
    lastFocused = focusOrigin || document.activeElement;

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    (dialogEl || prevBtn || nextBtn || closeBtns[0])?.focus();
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function show(delta) {
    const list = items();
    if (!list.length) return;
    index = (index + delta + list.length) % list.length;
    renderFromAnchor(list[index]);
  }

  // DELEGACJA: klik w jakikolwiek [data-lightbox-item] w obrębie .gallery-grid
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-lightbox-item]");
    if (!a) return;
    if (!a.closest(".gallery-grid")) return;

    e.preventDefault(); // nie przechodzimy do JPG
    const list = items();
    // jeżeli kliknięty element nie jest w aktualnym zbiorze (np. filtr się właśnie zmienił) — wyjdź grzecznie
    const i = list.indexOf(a);
    if (i === -1) return;
    open(i, a);
  });

  // Gdy filtr kategorii się zmieni (set w body), resetuj indeks jeśli trzeba
  const observer = new MutationObserver(() => {
    const list = items();
    if (lightbox.hidden) return; // tylko gdy otwarty
    if (!list.length) return close();
    // jeżeli aktualny index poza zakresem po filtracji – wróć na 0
    if (index >= list.length) index = 0;
    renderFromAnchor(list[index]);
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ["data-gallery-filter"] });

  // Przyciski
  closeBtns.forEach((btn) => btn.addEventListener("click", close));
  lightbox.querySelector(".lightbox__backdrop")?.addEventListener("click", close);
  prevBtn?.addEventListener("click", () => show(-1));
  nextBtn?.addEventListener("click", () => show(1));

  // Klawiatura
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(-1);
    if (e.key === "ArrowRight") show(1);
    if (e.key === "Tab") {
      const focusables = [...lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((el) => !el.hasAttribute("disabled"));
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
  });
}
