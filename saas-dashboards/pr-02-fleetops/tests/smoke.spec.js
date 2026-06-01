const { test, expect } = require("@playwright/test");

async function openFresh(page, hash = "#/") {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(`/${hash}`);
}

async function loginAsDemo(page) {
  await openFresh(page, "#/login");
  await expect(page.getByRole("heading", { name: "Zaloguj się", level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Kontynuuj jako demo" }).click();
  await expect(page).toHaveURL(/#\/app$/);
  await expect(page.getByRole("heading", { name: "Przegląd", level: 1 })).toBeVisible();
}

async function getRouteScrollState(page) {
  return page.evaluate(() => {
    const getScrollTop = (selector) => {
      const element = document.querySelector(selector);
      return element ? Math.round(element.scrollTop || 0) : 0;
    };

    const routeContainer = document.querySelector(".app-main") || document.querySelector("main") || document.getElementById("app");
    const routeTop = routeContainer ? Math.round(routeContainer.getBoundingClientRect().top) : 0;
    const root = document.scrollingElement || document.documentElement;
    const values = {
      windowY: Math.round(window.scrollY || window.pageYOffset || 0),
      scrollingElementTop: Math.round(root?.scrollTop || 0),
      htmlTop: Math.round(document.documentElement.scrollTop || 0),
      bodyTop: Math.round(document.body.scrollTop || 0),
      appTop: getScrollTop("#app"),
      mainTop: getScrollTop("main"),
      appMainTop: getScrollTop(".app-main"),
      routeTop,
    };

    return {
      ...values,
      maxScrollTop: Math.max(
        values.windowY,
        values.scrollingElementTop,
        values.htmlTop,
        values.bodyTop,
        values.appTop,
        values.mainTop,
        values.appMainTop
      ),
    };
  });
}

async function scrollPageDown(page) {
  await page.evaluate(() => {
    const scrollToBottom = (element) => {
      if (!element) return;

      if (element === document.scrollingElement || element === document.documentElement || element === document.body) {
        window.scrollTo(0, element.scrollHeight);
        element.scrollTop = element.scrollHeight;
        return;
      }

      if (typeof element.scrollTo === "function") {
        element.scrollTo({ top: element.scrollHeight, left: 0, behavior: "auto" });
      } else if ("scrollTop" in element) {
        element.scrollTop = element.scrollHeight;
      }
    };

    [
      document.scrollingElement,
      document.documentElement,
      document.body,
      document.getElementById("app"),
      document.querySelector("main"),
      document.querySelector(".app-main"),
    ].forEach(scrollToBottom);
  });
  await expect.poll(async () => (await getRouteScrollState(page)).maxScrollTop).toBeGreaterThan(0);
}

async function expectPageTop(page) {
  await expect.poll(async () => (await getRouteScrollState(page)).maxScrollTop).toBe(0);

  const state = await getRouteScrollState(page);
  expect(state.routeTop).toBeGreaterThanOrEqual(0);
  expect(state.routeTop).toBeLessThanOrEqual(120);
}

async function expectCrudErrorsLinked(page, scenario) {
  await page.locator(`.sidebar nav a[data-route="${scenario.route}"]`).click();
  await expect(page.getByRole("heading", { name: scenario.heading, level: 1 })).toBeVisible();
  await page.getByRole("button", { name: scenario.addButton }).click();
  const dialog = page.getByRole("dialog", { name: scenario.dialog });
  await expect(dialog).toBeVisible();

  for (const name of scenario.fields) {
    const field = dialog.locator(`[name="${name}"]`);
    const error = dialog.locator(`[data-error-for="${name}"]`);
    const fieldId = `${scenario.prefix}-${name}`;
    const errorId = `${fieldId}-error`;

    await expect(field).toHaveAttribute("id", fieldId);
    await expect(error).toHaveAttribute("id", errorId);
    await expect(field).toHaveAttribute("aria-describedby", new RegExp(`(^|\\s)${errorId}(\\s|$)`));
  }

  await dialog.getByRole("button", { name: scenario.submitButton }).click();

  for (const name of scenario.invalidFields) {
    await expect(dialog.locator(`[name="${name}"]`)).toHaveAttribute("aria-invalid", "true");
    await expect(dialog.locator(`[data-error-for="${name}"]`)).not.toHaveText("");
  }

  await dialog.getByRole("button", { name: "Anuluj" }).click();
}

test("landing loads and demo login reaches the app shell", async ({ page }) => {
  await openFresh(page);
  await expect(page.locator("#app")).not.toBeEmpty();
  await expect(page.getByRole("heading", { name: /FleetOps/, level: 1 })).toBeVisible();

  await loginAsDemo(page);
  await expect(page.locator(".sidebar")).toContainText("demo@fleetops.app");
});

test("route changes reset scroll position after rendering", async ({ page }) => {
  await openFresh(page);
  await scrollPageDown(page);
  await page.getByRole("link", { name: "Porozmawiajmy" }).click();
  await expect(page).toHaveURL(/#\/contact$/);
  await expect(page.getByRole("heading", { name: "Kontakt", level: 1 })).toBeVisible();
  await expectPageTop(page);

  await scrollPageDown(page);
  await page.locator('.site-header__link[href="#/pricing"]').click();
  await expect(page).toHaveURL(/#\/pricing$/);
  await expect(page.getByRole("heading", { name: "Cennik FleetOps", level: 1 })).toBeVisible();
  await expectPageTop(page);

  await scrollPageDown(page);
  await page.locator('a.site-header__action[href="#/login"]').click();
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole("heading", { name: "Zaloguj się", level: 1 })).toBeVisible();
  await expectPageTop(page);

  await page.getByRole("button", { name: "Kontynuuj jako demo" }).click();
  await expect(page).toHaveURL(/#\/app$/);
  await expect(page.getByRole("heading", { name: "Przegląd", level: 1 })).toBeVisible();
  await page.locator('.sidebar nav a[data-route="/app/orders"]').click();
  await expect(page).toHaveURL(/#\/app\/orders$/);
  await expect(page.getByRole("heading", { name: "Zlecenia", level: 1 })).toBeVisible();
  await expectPageTop(page);
  await scrollPageDown(page);
  await page.locator('.sidebar nav a[data-route="/app/reports"]').click();
  await expect(page).toHaveURL(/#\/app\/reports$/);
  await expect(page.getByRole("heading", { name: "Raporty", level: 1 })).toBeVisible();
  await expectPageTop(page);
});

test("mobile drawer route changes reset visible scroll position", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await openFresh(page);
  await scrollPageDown(page);
  await page.locator("#navToggle").click();
  await page.locator('#mobileNav a[href="#/contact"]').click();
  await expect(page).toHaveURL(/#\/contact$/);
  await expect(page.getByRole("heading", { name: "Kontakt", level: 1 })).toBeVisible();
  await expectPageTop(page);

  await scrollPageDown(page);
  await page.locator("#navToggle").click();
  await page.locator('#mobileNav a[href="#/pricing"]').click();
  await expect(page).toHaveURL(/#\/pricing$/);
  await expect(page.getByRole("heading", { name: "Cennik FleetOps", level: 1 })).toBeVisible();
  await expectPageTop(page);

  await openFresh(page, "#/login");
  await page.getByRole("button", { name: "Kontynuuj jako demo" }).click();
  await expect(page).toHaveURL(/#\/app$/);
  await expect(page.getByRole("heading", { name: "Przegląd", level: 1 })).toBeVisible();
  await page.locator("#drawerToggle").click();
  await page.locator('#appDrawer a[data-route="/app/orders"]').click();
  await expect(page).toHaveURL(/#\/app\/orders$/);
  await expect(page.getByRole("heading", { name: "Zlecenia", level: 1 })).toBeVisible();
  await expectPageTop(page);
  await scrollPageDown(page);
  await page.locator("#drawerToggle").click();
  await page.locator('#appDrawer a[data-route="/app/reports"]').click();
  await expect(page).toHaveURL(/#\/app\/reports$/);
  await expect(page.getByRole("heading", { name: "Raporty", level: 1 })).toBeVisible();
  await expectPageTop(page);
});

test("toast feedback exposes stable polite and assertive live regions", async ({ page }) => {
  await openFresh(page, "#/login");
  await page.getByLabel("E-mail").fill("smoke@fleetops.app");
  await page.getByLabel("Hasło").fill("test");
  await page.getByRole("button", { name: "Zaloguj się" }).click();
  await expect(page).toHaveURL(/#\/app$/);

  const statusRegion = page.locator("#fleetops-toast-status");
  const alertRegion = page.locator("#fleetops-toast-alert");

  await expect(statusRegion).toHaveAttribute("role", "status");
  await expect(statusRegion).toHaveAttribute("aria-live", "polite");
  await expect(statusRegion).toHaveAttribute("aria-atomic", "true");
  await expect(alertRegion).toHaveAttribute("role", "alert");
  await expect(alertRegion).toHaveAttribute("aria-live", "assertive");
  await expect(alertRegion).toHaveAttribute("aria-atomic", "true");
  await expect(statusRegion).toHaveText("Zalogowano");

  await page.locator("#roleSwitcher").selectOption("u_drv_1");
  await page.locator('.sidebar nav a[data-route="/app/orders"]').click();
  const firstOrder = page.locator("tr.order-row").first();
  await expect(firstOrder).toBeVisible();
  await firstOrder.locator('[data-order-menu] .dropdown-trigger').click();
  await firstOrder.locator('[data-order-action="edit"]').click({ force: true });
  await expect(alertRegion).toContainText("Brak uprawnień:");
});

test("dropdowns use disclosure semantics and close with Escape", async ({ page }) => {
  const ariaMenuSelector = '[role="menu"], [aria-haspopup="menu"], [role="menuitem"]';

  await openFresh(page);
  await expect(page.locator(ariaMenuSelector)).toHaveCount(0);

  await loginAsDemo(page);
  await page.locator('.sidebar nav a[data-route="/app/orders"]').click();
  await expect(page.getByRole("heading", { name: "Zlecenia", level: 1 })).toBeVisible();
  await expect(page.locator(ariaMenuSelector)).toHaveCount(0);

  const firstDropdown = page.locator("[data-order-menu]").first();
  const trigger = firstDropdown.locator(".dropdown-trigger");
  const panel = firstDropdown.locator(".dropdown-menu");

  await expect(trigger).toHaveAttribute("aria-controls", /order-actions-\d+/);
  await expect(panel).toHaveAttribute("id", /order-actions-\d+/);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(panel).not.toBeVisible();

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(panel).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("core app routes render route-level headings", async ({ page }) => {
  await loginAsDemo(page);

  const routes = [
    { path: "/app", heading: "Przegląd" },
    { path: "/app/orders", heading: "Zlecenia" },
    { path: "/app/fleet", heading: "Flota" },
    { path: "/app/drivers", heading: "Kierowcy" },
    { path: "/app/reports", heading: "Raporty" },
    { path: "/app/settings", heading: "Ustawienia" },
  ];

  for (const route of routes) {
    await page.locator(`.sidebar nav a[data-route="${route.path}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${route.path}$`));
    await expect(page.getByRole("heading", { name: route.heading, level: 1 })).toBeVisible();
  }
});

test("CRUD validation errors are programmatically associated with fields", async ({ page }) => {
  await loginAsDemo(page);

  const scenarios = [
    {
      route: "/app/orders",
      heading: "Zlecenia",
      addButton: "Dodaj zlecenie",
      dialog: "Dodaj zlecenie",
      submitButton: "Dodaj zlecenie",
      prefix: "orders-form",
      fields: ["client", "route", "status", "eta", "priority"],
      invalidFields: ["client", "route", "eta"],
    },
    {
      route: "/app/fleet",
      heading: "Flota",
      addButton: "Dodaj pojazd",
      dialog: "Dodaj pojazd",
      submitButton: "Dodaj pojazd",
      prefix: "fleet-form",
      fields: ["id", "type", "status", "lastCheck", "driver"],
      invalidFields: ["id", "type", "lastCheck"],
    },
    {
      route: "/app/drivers",
      heading: "Kierowcy",
      addButton: "Dodaj kierowcę",
      dialog: "Dodaj kierowcę",
      submitButton: "Dodaj kierowcę",
      prefix: "drivers-form",
      fields: ["name", "status", "phone", "lastTrip"],
      invalidFields: ["name", "phone"],
    },
  ];

  for (const scenario of scenarios) {
    await expectCrudErrorsLinked(page, scenario);
  }
});

test("orders CRUD flow escapes user-entered HTML-like text", async ({ page }) => {
  const dialogs = [];
  page.on("dialog", async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.dismiss();
  });

  await loginAsDemo(page);
  await page.locator('.sidebar nav a[data-route="/app/orders"]').click();
  await expect(page.getByRole("heading", { name: "Zlecenia", level: 1 })).toBeVisible();
  await expect(page.locator("table.table")).toBeVisible();

  const htmlLikeClient = "<img src=x onerror=alert(1)>";
  const editedClient = "Smoke Test Edited Client";

  await page.getByRole("button", { name: "Dodaj zlecenie" }).click();
  const addOrderDialog = page.getByRole("dialog", { name: "Dodaj zlecenie" });
  await expect(addOrderDialog).toBeVisible();
  await page.getByLabel("Klient").fill(htmlLikeClient);
  await page.getByLabel("Trasa").fill("Warszawa - Poznan");
  await page.getByLabel("Status").selectOption("in-progress");
  await page.getByLabel("ETA").fill("2026-12-31");
  await page.getByLabel("Priorytet").selectOption("high");
  await addOrderDialog.getByRole("button", { name: "Dodaj zlecenie" }).click();

  const createdRow = page.locator("tr.order-row").filter({ hasText: htmlLikeClient }).first();
  await expect(createdRow).toBeVisible();
  await expect(createdRow).toContainText(htmlLikeClient);
  await expect(createdRow.locator("img")).toHaveCount(0);
  expect(dialogs).toEqual([]);

  await createdRow.locator('[data-order-menu] .dropdown-trigger').click();
  await createdRow.locator('[data-order-action="edit"]').click();
  await expect(page.getByRole("dialog", { name: /Edytuj FO-/ })).toBeVisible();
  await page.getByLabel("Klient").fill(editedClient);
  await page.getByRole("button", { name: "Zapisz zmiany" }).click();

  const editedRow = page.locator("tr.order-row").filter({ hasText: editedClient }).first();
  await expect(editedRow).toBeVisible();

  await editedRow.locator('[data-order-menu] .dropdown-trigger').click();
  await editedRow.locator('[data-order-action="delete"]').click();
  await expect(page.getByRole("dialog", { name: "Potwierdzenie usunięcia" })).toBeVisible();
  await page.locator(".modal").getByRole("button", { name: "Usuń" }).click();
  await expect(page.locator("tr.order-row").filter({ hasText: editedClient })).toHaveCount(0);
});
