// Loads services from JSON, renders list and applies filters/sorting
const STORAGE_KEY = "translogix-services-filters";

function loadState() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderServices(services, container) {
  container.innerHTML = "";
  services.forEach((service) => {
    const article = document.createElement("article");
    article.className = "card service-card";
    article.dataset.type = service.type;
    article.dataset.category = service.category;
    const route = service.route || "Trasa na zapytanie";
    const short = service.shortDescription || service.description;
    const icon = service.icon || service.image;
    const linkTarget = service.slug ? `service.html?service=${service.slug}` : `service.html?id=${service.id}`;

    article.innerHTML = `
      <img src="${icon}" alt="${service.name} - ikona usługi">
      <div class="service-card__header">
        <h3>${service.name}</h3>
        <p class="text-muted">${route}</p>
      </div>
      <p>${short}</p>
      <div class="filters">
        ${service.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <a class="btn" href="${linkTarget}">Szczegóły</a>
    `;
    container.appendChild(article);
  });
}

function filterServices(services, state) {
  let result = [...services];
  if (state.filter && state.filter !== "all") {
    result = result.filter((s) => s.type === state.filter || s.category === state.filter);
  }
  if (state.price) {
    result = result.filter((s) => s.price <= state.price);
  }
  if (state.sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (state.sort === "time-asc") result.sort((a, b) => a.time - b.time);
  return result;
}

export async function initServicesFilters() {
  const container = document.getElementById("services-list");
  const chips = document.querySelectorAll(".filters .filter-chip");
  const priceRange = document.getElementById("priceRange");
  const sortSelect = document.getElementById("sort");
  const countEl = document.getElementById("results-count");
  if (!container || !chips.length) return;

  const response = await fetch("assets/data/services.json");
  const allServices = await response.json();
  const params = new URLSearchParams(window.location.search);
  const urlFilter = params.get("filter");
  let state = { filter: "all", price: Number(priceRange?.value) || 10000, sort: "none", ...loadState() };
  if (urlFilter) state.filter = urlFilter;

  const update = () => {
    const filtered = filterServices(allServices, state);
    renderServices(filtered, container);
    if (countEl) {
      countEl.textContent = filtered.length
        ? `Wyswietlono ${filtered.length}/${allServices.length}`
        : "Brak wynikow dla wybranych filtrow.";
    }
    if (state.filter && state.filter !== "all") {
      params.set("filter", state.filter);
    } else {
      params.delete("filter");
    }
    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
    saveState(state);
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      state.filter = chip.dataset.filter;
      chip.setAttribute("aria-pressed", "true");
      chips.forEach((c) => c !== chip && c.setAttribute("aria-pressed", "false"));
      update();
    });
    if (chip.dataset.filter === state.filter) chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", chip.classList.contains("is-active"));
  });

  if (priceRange) {
    priceRange.value = state.price;
    priceRange.addEventListener("input", () => {
      state.price = Number(priceRange.value);
      update();
    });
  }

  if (sortSelect) {
    sortSelect.value = state.sort;
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      update();
    });
  }

  update();
}

const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

if (priceRange && priceValue) {
  priceValue.textContent = priceRange.value;

  priceRange.addEventListener("input", () => {
    priceValue.textContent = priceRange.value;
  });
}
