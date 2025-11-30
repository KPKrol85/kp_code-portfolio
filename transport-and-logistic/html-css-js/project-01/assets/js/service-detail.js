// Renders single service detail from JSON based on URL param
export async function initServiceDetail() {
  const wrapper = document.getElementById("service-detail");
  if (!wrapper) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  if (!id) {
    wrapper.innerHTML = "<p>Brak identyfikatora usługi.</p>";
    return;
  }

  const response = await fetch("assets/data/services.json");
  const services = await response.json();
  const service = services.find((s) => s.id === id);
  if (!service) {
    wrapper.innerHTML = "<p>Nie znaleziono usługi.</p>";
    return;
  }

  document.title = `${service.name} | TransLogix`;
  wrapper.innerHTML = `
    <nav aria-label="Okruszki">
      <a href="services.html">Usługi</a> › <span aria-current="page">${service.name}</span>
    </nav>
    <h1>${service.name}</h1>
    <p class="lead">${service.description}</p>
    <div class="grid grid-2">
      <div class="card">
        <img src="${service.image}" alt="${service.name}">
        <p><strong>Trasa:</strong> ${service.route}</p>
        <p><strong>Limit:</strong> ${service.weightLimit}</p>
        <p><strong>Czas realizacji:</strong> ${service.time} h</p>
        <p><strong>Cena:</strong> od ${service.price} zł netto</p>
        <div class="filters">
          ${service.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
      <div class="card">
        <h2>Potrzebujesz tej usługi?</h2>
        <p>Wypełnij formularz, a dyspozytor wróci w 15 minut z potwierdzeniem.</p>
        <a class="btn" href="contact.html#quote">Zapytaj o termin</a>
        <a class="btn" href="pricing.html#calculator">Sprawdź stawkę</a>
      </div>
    </div>
  `;
}
