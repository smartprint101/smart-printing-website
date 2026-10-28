import { test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const productionOrigin = "https://smartpackagingbd.com";
const paths = [
  ...readFileSync("dist/sitemap.xml", "utf8").matchAll(/<loc>(.*?)<\/loc>/g),
].map((match) => new URL(match[1]).pathname);
const test = base.extend<{ browserHealth: void }>({
  browserHealth: [
    async ({ page, baseURL }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          /hydration|Minified React error|didn't match/i.test(message.text())
        )
          errors.push(message.text());
      });
      // Do not send analytics or customer messages while testing.
      await page.route("**/*", (route) =>
        route.request().url().startsWith(`${baseURL}/`)
          ? route.continue()
          : route.abort(),
      );
      await use();
      expect(errors, "No runtime or hydration errors").toEqual([]);
    },
    { auto: true },
  ],
});

test("every sitemap route renders correctly without horizontal overflow", async ({
  page,
}) => {
  for (const path of paths) {
    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${productionOrigin}${path}`,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path,
    ).toBe(true);
    expect(
      await page.locator('img[src^="/assets/"]').evaluateAll(
        (images) =>
          images.filter((image) => {
            const img = image as HTMLImageElement;
            return (
              img.loading !== "lazy" &&
              (!img.complete || img.naturalWidth === 0)
            );
          }).length,
      ),
      `Images load on ${path}`,
    ).toBe(0);
    const targets = await page
      .locator('a[href^="https://wa.me/"]')
      .evaluateAll((links) =>
        links.map((link) => new URL((link as HTMLAnchorElement).href).pathname),
      );
    expect(targets.length).toBeGreaterThan(0);
    expect(
      targets.every((target) => target === "/8801660191039"),
      path,
    ).toBe(true);
  }
});

test("product and service filters work, including empty search recovery", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.locator("#products article")).toHaveCount(5);
  await page.getByRole("button", { name: "পলি ও সিল", exact: true }).click();
  await expect(page.locator("#products article")).toHaveCount(2);
  await page.getByRole("button", { name: "সব প্রোডাক্ট", exact: true }).click();
  await page.getByRole("searchbox", { name: "প্রোডাক্ট খুঁজুন" }).fill("Foil");
  await expect(page.locator("#products article")).toHaveCount(1);
  await page
    .getByRole("searchbox", { name: "প্রোডাক্ট খুঁজুন" })
    .fill("no-such-product");
  await expect(page.locator("#products article")).toHaveCount(0);
  await page
    .getByRole("button", { name: "সব প্রোডাক্ট দেখুন", exact: true })
    .click();
  await expect(page.locator("#products article")).toHaveCount(5);
  await page.getByRole("button", { name: "প্রিন্টিং", exact: true }).click();
  await expect(page.locator("#services article")).toHaveCount(4);
  await page.getByRole("button", { name: "সব সেবা", exact: true }).click();
  await expect(page.locator("#services article")).toHaveCount(9);
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: testInfo.outputPath("storefront.png") });
});

test("quotation validates Bangladeshi numbers and prepares the correct WhatsApp message", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.open = (url) => {
      (window as Window & { openedQuote?: string }).openedQuote = String(url);
      return null;
    };
  });
  await page.locator('input[name="name"]').fill("Test Customer");
  await page.locator('input[name="mobile"]').fill("012");
  await page.locator('select[name="service"]').selectOption("LD Packet");
  await page
    .getByRole("button", { name: "WhatsApp-এ তথ্য প্রস্তুত করুন", exact: true })
    .click();
  await expect(page.locator("#quote-error")).toBeVisible();
  await page.locator('input[name="mobile"]').fill("০১৬৬০১৯১০৩৯");
  await page
    .getByRole("button", { name: "WhatsApp-এ তথ্য প্রস্তুত করুন", exact: true })
    .click();
  await expect(page.locator("#quote-error")).toHaveCount(0);
  const opened = await page.evaluate(
    () => (window as Window & { openedQuote?: string }).openedQuote,
  );
  expect(new URL(opened!).pathname).toBe("/8801660191039");
  expect(new URL(opened!).searchParams.get("text")).toContain("01660191039");
  await expect(
    page.getByRole("link", { name: /প্রস্তুত মেসেজটি WhatsApp-এ খুলুন/ }),
  ).toBeVisible();
});

test("service quotation retains the service context", async ({ page }) => {
  await page.goto("/services/foil-packet/");
  await expect(page.locator('select[name="service"]')).toHaveValue(
    "Foil Packet",
  );
});

test("FAQ and mobile menu support keyboard use and resizing", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const faq = page.locator("#faq details").nth(1);
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
  if (testInfo.project.name === "desktop") return;
  const toggle = page.getByRole("button", { name: "মেনু খুলুন", exact: true });
  await toggle.click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("explicit index.html URLs hydrate as their canonical pages", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "One viewport covers route normalization",
  );
  for (const path of paths) {
    const response = await page.goto(`${path}index.html`, {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${productionOrigin}${path}`,
    );
    await expect(page.locator("h1")).not.toHaveText("পেজটি পাওয়া যায়নি");
  }
});

test("all pages pass automated mobile accessibility checks", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "Full mobile sweep; desktop homepage checked separately",
  );
  for (const path of paths) {
    await page.goto(path, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      path,
    ).toEqual([]);
  }
});

test("desktop homepage passes automated accessibility checks", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("finder and calculator complete their customer journeys", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#tools details").first().locator("summary").click();
  const finder = page.locator("#product-finder");
  await finder.getByRole("button", { name: /শুরু করুন/ }).click();
  await finder.getByRole("button", { name: /মুদি আইটেম/ }).click();
  await finder.getByRole("button", { name: /প্রিমিয়াম/ }).click();
  await finder
    .getByRole("button", { name: /হ্যাঁ, লোগো\/নাম প্রিন্ট করতে চাই/ })
    .click();
  await expect(
    finder.locator('a[href^="https://wa.me/"]').first(),
  ).toHaveAttribute("href", /^https:\/\/wa.me\/8801660191039/);
  await page.locator("#tools details").nth(1).locator("summary").click();
  const calc = page.locator("#budget");
  await calc.locator('input[type="number"]').nth(0).fill("220");
  await calc.locator('input[type="number"]').nth(1).fill("230");
  await calc.getByRole("button", { name: "হিসাব করুন", exact: true }).click();
  await expect(page.locator("#budget-result")).toBeVisible();
  await expect(page.locator("#budget-result")).toContainText("26,312");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("content and FAQ remain usable without JavaScript", async ({
  browser,
  baseURL,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    await context.route("**/*", (route) =>
      route.request().url().startsWith(`${baseURL}/`)
        ? route.continue()
        : route.abort(),
    );
    const page = await context.newPage();
    for (const path of [
      "/",
      "/services/foil-packet/",
      "/guides/packaging-quotation-checklist/",
    ]) {
      await page.goto(`${baseURL}${path}`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("h2").first()).toBeVisible();
    }
    await page.goto(`${baseURL}/`);
    const question = page.locator("#faq details").nth(1);
    await question.locator("summary").click();
    await expect(question.locator("p")).toBeVisible();
  } finally {
    await context.close();
  }
});

test("unknown URLs return HTTP 404 and the exported error page is noindex", async ({
  request,
  page,
}) => {
  const missing = await request.get("/__missing-page-for-regression-test__/");
  expect(missing.status()).toBe(404);
  await page.goto("/404.html", { waitUntil: "networkidle" });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await expect(page.locator("h1")).toHaveText("পেজটি পাওয়া যায়নি");
});
