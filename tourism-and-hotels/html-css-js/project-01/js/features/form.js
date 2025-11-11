// features/form.js — enhanced validation + date logic + Netlify submit
export function initForm() {
  const form = document.querySelector("[data-form]");
  if (!form) return;

  const success = form.querySelector(".form__success");
  const name = form.querySelector("#name");
  const email = form.querySelector("#email");
  const phone = form.querySelector("#phone");
  const checkin = form.querySelector("#checkin");
  const checkout = form.querySelector("#checkout");
  const guests = form.querySelector("#guests");
  const consent = form.querySelector("#consent");

  const $ = (id) => document.getElementById(id);

  function setError(input, msgId, show) {
    input?.setAttribute("aria-invalid", show ? "true" : "false");
    const msg = $(msgId);
    if (msg) msg.hidden = !show;
  }

  // --- Dates: min today, checkout >= checkin + 1 ---
  const todayISO = new Date().toISOString().slice(0, 10);
  if (checkin) checkin.min = todayISO;

  function nextDay(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d)) return "";
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  function syncCheckoutMin() {
    if (!checkout) return;
    if (checkin?.value) {
      const minOut = nextDay(checkin.value);
      checkout.min = minOut;
      if (checkout.value && checkout.value < minOut) checkout.value = minOut;
    } else {
      checkout.min = "";
    }
  }

  checkin?.addEventListener("change", syncCheckoutMin);
  syncCheckoutMin();

  // --- Live hints: optional, light UX ---
  guests?.addEventListener("input", () => {
    const n = parseInt(guests.value || "0", 10);
    setError(guests, "err-guests", !(n >= 1 && n <= 6));
  });

  // --- Submit ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let ok = true;

    // Name
    if (name) {
      const v = (name.value || "").trim().length > 1;
      setError(name, "err-name", !v);
      ok = ok && v;
    }

    // Email
    if (email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const v = re.test(email.value || "");
      setError(email, "err-email", !v);
      ok = ok && v;
    }

    // Phone (optional): if filled, must match
    if (phone && (phone.value || "").trim() !== "") {
      const rePL = /^(\+?\d{1,3})?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;
      const v = rePL.test(phone.value.trim());
      // tylko wizualnie, bez hard fail, ale można zaostrzyć:
      // setError(phone, 'err-phone', !v);
      ok = ok && v;
    }

    // Dates
    if (checkin) {
      const v = !!checkin.value;
      setError(checkin, "err-checkin", !v);
      ok = ok && v;
    }
    if (checkout) {
      const v = !!checkout.value && (!checkin?.value || checkout.value >= nextDay(checkin.value));
      setError(checkout, "err-checkout", !v);
      ok = ok && v;
    }

    // Guests
    if (guests) {
      const n = parseInt(guests.value || "0", 10);
      const v = n >= 1 && n <= 6;
      setError(guests, "err-guests", !v);
      ok = ok && v;
    }

    // Consent
    if (consent) {
      const v = consent.checked === true;
      setError(consent, "err-consent", !v);
      ok = ok && v;
    }

    // Honeypot (Netlify: name="website")
    const pot = new FormData(form).get("website");
    if ((pot || "").toString().trim() !== "") return; // drop bots silently

    if (!ok) {
      if (success) success.hidden = true;
      return;
    }

    // If form is Netlify-enabled — let it post
    if (form.hasAttribute("data-netlify")) {
      // Reset aria-invalid to avoid red borders on postback
      form.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.setAttribute("aria-invalid", "false"));
      form.submit(); // real submit to Netlify
      return;
    }

    // Demo fallback (no backend)
    if (success) success.hidden = false;
    form.reset();
    syncCheckoutMin();
    const btn = form.querySelector('button[type="submit"]');
    btn?.focus();
  });
}
