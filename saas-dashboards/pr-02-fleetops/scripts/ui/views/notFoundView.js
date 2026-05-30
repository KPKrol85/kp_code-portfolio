function notFoundView() {
  const root = dom.h("div", "panel not-found-panel");

  root.innerHTML = `
    <div class="module-header not-found-panel__header">
      <h2>Nie znaleziono</h2>
    </div>
    <p class="muted not-found-panel__copy">
      Ta sekcja nie istnieje w aplikacji.
    </p>
    <a class="button button--primary" href="#/app">Wróć do dashboardu</a>
  `;

  return root;
}

window.notFoundView = notFoundView;
