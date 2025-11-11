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

  // Zbieramy WSZYSTKIE elementy w galerii (ze wszystkich .gallery-grid)
  const items = () => Array.from(document.querySelectorAll(".gallery-grid [data-lightbox-item]"));
  let index = 0;
  let lastFocused = null;

  function renderFromAnchor(a) {
    // duże zdjęcie bierzemy z href
    const fullSrc = a.getAttribute("href");
    // podpis: najpierw data-caption, potem alt miniatury
    const thumbImg = a.querySelector("img");
    const text = a.getAttribute("data-caption") || thumbImg?.alt || "";

    if (img && fullSrc) {
      img.src = fullSrc;
      // opcjonalnie: jeżeli znamy rozmiary dużych plików, możemy je ustawić;
      // tu czyścimy width/height, żeby nie blokować przeskalowania
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

  // DELEGACJA: klik w jakikolwiek [data-lightbox-item]
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-lightbox-item]");
    if (!a) return;
    // upewnij się, że to w obrębie galerii
    if (!a.closest(".gallery-grid")) return;

    e.preventDefault(); // blokujemy przejście do JPG
    const list = items();
    const i = list.indexOf(a);
    open(i >= 0 ? i : 0, a);
  });

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
