export const renderNotFoundView = (container) => {
  container.innerHTML = `
    <main id="main" class="container">
      <div class="card">
        <h1>404</h1>
        <p>Nie znaleziono widoku. Sprawdź adres lub wróć do dashboardu.</p>
        <a class="btn btn--primary" href="#/dashboard">Wróć do dashboardu</a>
      </div>
    </main>
  `;
};
