function notFoundView() {
  const root = dom.h("div", "panel");
  root.style.maxWidth = "520px";
  root.style.margin = "40px auto";
  root.style.textAlign = "center";

  root.innerHTML = `
    <div class="module-header" style="justify-content:center;">
      <h2>Nie znaleziono</h2>
    </div>
    <p class="muted" style="margin: 8px 0 20px;">
      Ta sekcja nie istnieje w aplikacji.
    </p>
    <a class="button primary" href="#/app">Wróć do dashboardu</a>
  `;

  return root;
}

window.notFoundView = notFoundView;
