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
    article.className = "card";
    article.innerHTML = `
      <img src="${service.image}" alt="${service.name}">
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <div class="filters">
        ${service.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <p><strong>Trasa:</strong> ${service.route}</p>
      <p><strong>Czas:</strong> ${service.time} h • <strong>Cena:</strong> ${service.price} zł</p>
      <a class="btn" href="service.html?id=${service.id}">Szczegóły</a>
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
  let state = { filter: "all", price: Number(priceRange?.value) || 10000, sort: "none", ...loadState() };

  const update = () => {
    const filtered = filterServices(allServices, state);
    renderServices(filtered, container);
    countEl.textContent = `${filtered.length} wyników`;
    saveState(state);
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      state.filter = chip.dataset.filter;
      update();
    });
    if (chip.dataset.filter === state.filter) chip.classList.add("is-active");
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
