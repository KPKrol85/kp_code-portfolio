// js/pwa-install.js
// Delikatny prompt instalacji PWA (beforeinstallprompt)
// - Przycisk [data-install-pwa] pozostaje ukryty, aż event będzie dostępny
// - Nie zmienia istniejącego SW/manifestu

(() => {
  let deferredEvt = null;

  const btn = document.querySelector('[data-install-pwa]');
  if (!btn) return; // brak przycisku w danej podstronie

  // Ukryj przycisk na starcie (na wypadek przypadkowego braku atrybutu)
  btn.hidden = true;

  // Jeśli app już zainstalowana (standalone / display-mode), nic nie pokazuj
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Zablokuj natywny auto‑prompt i zapamiętaj event
    e.preventDefault();
    deferredEvt = e;
    // Pokaż przycisk instalacji
    btn.hidden = false;
  });

  btn.addEventListener('click', async () => {
    if (!deferredEvt) return;
    btn.disabled = true;
    try {
      deferredEvt.prompt();
      const choice = await deferredEvt.userChoice;
      // Po wyborze (akcept/odrzuć) chowamy przycisk, żeby nie męczyć użytkownika
      btn.hidden = true;
      deferredEvt = null;
    } catch {
      // W razie błędu – odblokuj przycisk, ale nie pokazuj alertów
      btn.disabled = false;
    }
  });

  // Po zainstalowaniu (np. z menu przeglądarki) – schowaj przycisk
  window.addEventListener('appinstalled', () => {
    btn.hidden = true;
    deferredEvt = null;
  });
})();

