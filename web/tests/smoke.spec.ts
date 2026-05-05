import { test, expect } from "@playwright/test";

test("Landing loads and links work", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Seren" }).first()).toBeVisible();

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /privacy/i })).toBeVisible();

  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: /terms/i })).toBeVisible();

  expect(consoleErrors, `Console errors: ${consoleErrors.join("\n")}`).toEqual([]);
});

test("Auth page loads and can attempt login", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto("/auth");
  await expect(page.getByRole("heading", { name: /save your assessment/i })).toBeVisible();

  // smoke: fill credentials and click login (server may reject, but button must be alive)
  await page.locator('button[type="button"]').filter({ hasText: "Log in" }).first().click();
  await page.getByPlaceholder("you@example.com").fill("dermatologist@seren.local");
  await page.getByPlaceholder("••••••••").fill("1234");
  await page.locator("form").getByRole("button", { name: /^log in$/i }).click();

  // If successful, we may redirect; if not, we should show an error message.
  await expect(page.locator("body")).toBeVisible();
  expect(consoleErrors, `Console errors: ${consoleErrors.join("\n")}`).toEqual([]);
});

test("Paywall loads and checkout route exists", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto("/paywall?returnTo=%2Fresults");
  await expect(page.getByRole("heading", { name: /unlock/i })).toBeVisible();

  await page.goto("/paywall/checkout?plan=journey&next=%2Fresults");
  await expect(page.getByText(/continue to doku/i)).toBeVisible();

  expect(consoleErrors, `Console errors: ${consoleErrors.join("\n")}`).toEqual([]);
});

