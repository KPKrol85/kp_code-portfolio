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

test("landing loads and demo login reaches the app shell", async ({ page }) => {
  await openFresh(page);
  await expect(page.locator("#app")).not.toBeEmpty();
  await expect(page.getByRole("heading", { name: /FleetOps/, level: 1 })).toBeVisible();

  await loginAsDemo(page);
  await expect(page.locator(".sidebar")).toContainText("demo@fleetops.app");
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

  await page.getByRole("button", { name: "Add order" }).click();
  await expect(page.getByRole("dialog", { name: "Dodaj zlecenie" })).toBeVisible();
  await page.getByLabel("Klient").fill(htmlLikeClient);
  await page.getByLabel("Trasa").fill("Warszawa - Poznan");
  await page.getByLabel("Status").selectOption("in-progress");
  await page.getByLabel("ETA").fill("2026-12-31");
  await page.getByLabel("Priorytet").selectOption("high");
  await page.getByRole("button", { name: "Dodaj zlecenie" }).click();

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
  await expect(page.getByRole("dialog", { name: "Potwierdzenie usuniecia" })).toBeVisible();
  await page.locator(".modal").getByRole("button", { name: "Usun" }).click();
  await expect(page.locator("tr.order-row").filter({ hasText: editedClient })).toHaveCount(0);
});
