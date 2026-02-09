// Renders single service detail from JSON based on URL param
export async function initServiceDetail() {
  const wrapper = document.getElementById("service-detail");
  if (!wrapper) return;

  const params = new URLSearchParams(window.location.search);
  const slugParam = params.get("service");
  const idParam = Number(params.get("id"));

  const response = await fetch("assets/data/services.json");
  const services = await response.json();
  const service = services.find((s) => (slugParam && s.slug === slugParam) || (!slugParam && s.id === idParam));
  if (!service) {
    wrapper.innerHTML = `<p>Nie znaleziono usługi. <a href="services.html">Wróć do listy usług</a>.</p>`;
    return;
  }

  document.title = `${service.name} | TransLogix`;
  const iconSrc = service.icon || service.image;

  wrapper.innerHTML = `
    <nav aria-label="Okruszki">
      <a href="services.html">Usługi</a> > <span aria-current="page">${service.name}</span>
    </nav>
    <h1>${service.name}</h1>
    <p class="lead">${service.description}</p>
    <div class="grid grid-2">
      <div class="card">
        <img src="${iconSrc}" alt="${service.name} - ikona usługi">
        <p><strong>Trasa:</strong> ${service.route}</p>
        <p><strong>Limit:</strong> ${service.weightLimit || "na zapytanie"}</p>
        <p><strong>Czas realizacji:</strong> ${service.eta || `${service.time} h`}</p>
        <p><strong>Cena orientacyjna:</strong> od ${service.price} zł netto</p>
        <p><strong>Ładunki:</strong> ${service.loadTypes || "Palety, LTL/FTL"}</p>
        <p><strong>Bezpieczeństwo:</strong> ${service.security || "Monitoring GPS, plomby, check-call"}</p>
        <p><strong>Dokumenty:</strong> ${service.documents || "CMR, potwierdzenie dostawy"}</p>
        <p><strong>Opcje:</strong> ${service.extras || "Express, ubezpieczenie, ADR/chłodnia"}</p>
        <div class="filters">
          ${service.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
      <div class="card">
        <h2>Najważniejsze korzyści</h2>
        <ul class="service-details">
          ${Array.isArray(service.audience) ? service.audience.map((item) => `<li>${item}</li>`).join("") : ""}
        </ul>
        <h3>Co dalej?</h3>
        <p>Wypełnij formularz, a dyspozytor wróci w 15 minut z potwierdzeniem.</p>
        <a class="btn" href="contact.html#quote">Zapytaj o termin</a>
        <a class="btn" href="pricing.html#calculator">Sprawdź stawkę</a>
      </div>
    </div>
  `;
}
