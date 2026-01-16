import { createElement, clearElement } from "../utils/dom.js";
import { validators } from "../utils/validators.js";
import { showToast } from "../components/toast.js";
import { withButtonLoading } from "../utils/ui-state.js";

const company = {
  brand: "KP_Code Digital Vault",
  owner: "Kamil Krcl",
  address: "ul. Marynarki Wojennej 12/31, 33-100 Tarncw, Polska",
  phone: "+48 533 537 091",
  email: "kontakt@kp-code.pl",
};

export const renderContact = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Kontakt" }));

  const info = createElement("div", { className: "card" }, [
    createElement("h2", { text: company.brand }),
    createElement("p", { text: company.owner }),
    createElement("p", { text: company.address }),
    createElement("p", { text: company.phone }),
    createElement("p", { text: company.email }),
  ]);

  const form = createElement("form", { className: "card" });
  form.appendChild(createElement("h2", { text: "Napisz do nas" }));
  const nameField = createElement("input", {
    className: "input",
    attrs: { id: "contact-name", type: "text", placeholder: "Imic i nazwisko" },
  });
  const emailField = createElement("input", {
    className: "input",
    attrs: { id: "contact-email", type: "email", placeholder: "E-mail" },
  });
  const messageField = createElement("textarea", {
    className: "textarea",
    attrs: { id: "contact-message", rows: "4", placeholder: "Wiadomo~?" },
  });
  const errorBox = createElement("div", { className: "form-error" });

  form.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", { text: "Imic i nazwisko", attrs: { for: "contact-name" } }),
      nameField,
    ])
  );
  form.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", { text: "E-mail", attrs: { for: "contact-email" } }),
      emailField,
    ])
  );
  form.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", { text: "Wiadomo~?", attrs: { for: "contact-message" } }),
      messageField,
    ])
  );
  form.appendChild(errorBox);
  const submitButton = createElement("button", {
    className: "button block",
    text: "Wy~lij (mock)",
    attrs: { type: "submit" },
  });
  form.appendChild(submitButton);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    withButtonLoading(
      submitButton,
      async () => {
        errorBox.textContent = "";
        const errors = [];
        if (!validators.required(nameField.value)) {
          errors.push("Uzupe^nij imic i nazwisko.");
        }
        if (!validators.email(emailField.value)) {
          errors.push("Podaj poprawny e-mail.");
        }
        if (!validators.required(messageField.value)) {
          errors.push("Wpisz wiadomo~?.");
        }
        if (errors.length) {
          errorBox.textContent = errors.join(" ");
          return;
        }
        showToast("Wiadomo~? zosta^a wys^ana (demo).");
        form.reset();
      },
      { loadingText: "Wysylanie..." }
    );
  });

  const layout = createElement("div", { className: "grid grid-2 section" }, [info, form]);
  container.appendChild(layout);
  main.appendChild(container);
};
