/* initToursFilters */
export function initToursFilters() {
  const form = document.querySelector("[data-filters]");
  const list = document.querySelector("[data-tours-list]");
  if (!form || !list) return;

  const typeSelect = form.querySelector("[data-filter-type]");
  const regionSelect = form.querySelector("[data-filter-region]");
  const sortSelect = form.querySelector("[data-sort]");
  const resultLabel = form.querySelector("[data-results-count]");
  const cards = Array.from(list.querySelectorAll("[data-type]"));

  const update = () => {
    const typeValue = typeSelect?.value || "all";
    const regionValue = regionSelect?.value || "all";
    const sortValue = sortSelect?.value || "price-asc";

    const filtered = cards.filter((card) => {
      const matchesType = typeValue === "all" || card.dataset.type === typeValue;
      const matchesRegion = regionValue === "all" || card.dataset.region === regionValue;
      return matchesType && matchesRegion;
    });

    cards.forEach((card) => {
      card.hidden = !filtered.includes(card);
    });

    const sorted = sortCards(filtered, sortValue);
    sorted.forEach((card) => list.appendChild(card));

    if (resultLabel) {
      resultLabel.textContent = filtered.length.toString();
    }
  };

  typeSelect?.addEventListener("change", update);
  regionSelect?.addEventListener("change", update);
  sortSelect?.addEventListener("change", update);

  update();
}

/* sortCards */
function sortCards(cards, sortValue) {
  const sorted = [...cards];
  const [key, order] = sortValue.split("-");
  sorted.sort((a, b) => {
    const aValue = Number(a.dataset[key === "price" ? "price" : "days"]);
    const bValue = Number(b.dataset[key === "price" ? "price" : "days"]);
    return order === "asc" ? aValue - bValue : bValue - aValue;
  });
  return sorted;
}

export function initFiltersDropdowns() {
  const selects = document.querySelectorAll(".filters select");
  if (!selects.length) return;

  selects.forEach((select) => {
    if (select.closest(".dropdown")) return;

    const label = select.closest("label") || select.parentNode; // FIX – bierzemy cały label
    const wrapper = document.createElement("div");
    wrapper.className = "dropdown";

    label.parentNode.insertBefore(wrapper, label); // FIX – owijamy label wrapperem
    wrapper.appendChild(label); // FIX

    const button = document.createElement("button");
    button.type = "button";
    button.className = "dropdown__button";
    button.innerHTML = `
      <span class="dropdown__label">${select.selectedOptions[0]?.textContent || ""}</span>
      <span class="dropdown__icon"></span>
    `;
    wrapper.appendChild(button);

    const list = document.createElement("ul");
    list.className = "dropdown__list";
    wrapper.appendChild(list);

    Array.from(select.options).forEach((opt) => {
      const li = document.createElement("li");
      li.className = "dropdown__option";
      li.textContent = opt.textContent;
      li.dataset.value = opt.value;

      li.addEventListener("click", () => {
        select.value = opt.value;
        const labelSpan = button.querySelector(".dropdown__label");
        if (labelSpan) {
          labelSpan.textContent = opt.textContent;
        }
        wrapper.classList.remove("is-open");
        select.dispatchEvent(new Event("change"));
      });

      list.appendChild(li);
    });

    button.addEventListener("click", () => {
      const isOpen = wrapper.classList.contains("is-open");
      document.querySelectorAll(".dropdown.is-open").forEach((d) => d.classList.remove("is-open"));
      if (!isOpen) wrapper.classList.add("is-open");
    });
  });

  document.addEventListener("click", (e) => {
    const openDropdowns = document.querySelectorAll(".dropdown.is-open");
    openDropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("is-open");
      }
    });
  });
}
