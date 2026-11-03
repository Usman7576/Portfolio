import { expect, test } from "@playwright/test";

test("home page shows the name and pitch before any 3D loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Muhammad Usman");
  await expect(page.getByRole("link", { name: "View projects" })).toBeVisible();
});

test("project cards lead to a case study", async ({ page }) => {
  await page.goto("/projects");
  const cards = page.getByRole("article");
  await expect(cards).toHaveCount(2);
  await page.getByRole("link", { name: "IntelliMeet" }).click();
  await expect(page).toHaveURL(/\/projects\/intellimeet$/);
  await expect(page.getByRole("heading", { name: "The problem" })).toBeVisible();
  await expect(page.getByText("1.8 s").first()).toBeVisible();
});

test("contact form shows server-side validation errors", async ({ page }) => {
  await page.goto("/contact");
  // Skip the browser's built-in checks so the server's validation is what's tested.
  await page.locator("form").evaluate((form: HTMLFormElement) => (form.noValidate = true));
  await page.getByLabel("Name").fill("Recruiter");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Message").fill("hi");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  await expect(page.getByText(/at least 10 characters/)).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue("Recruiter");
});

test("admin pages require sign-in", async ({ page }) => {
  for (const path of ["/admin", "/admin/projects", "/admin/resume", "/admin/messages"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/admin\/login$/);
  }
});

test("unknown pages get the custom 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This page doesn't exist" })).toBeVisible();
});

test("SEO files are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /admin");
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/projects/intellimeet");
  const og = await request.get("/opengraph-image");
  expect(og.headers()["content-type"]).toContain("image/png");
});
