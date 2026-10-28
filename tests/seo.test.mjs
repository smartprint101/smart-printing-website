import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const origin = "https://smartpackagingbd.com";
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
const titles = new Set();
const descriptions = new Set();

test("sitemap contains the home page, ten service routes and three guides", () => {
  assert.equal(urls.length, 14);
  assert.equal(new Set(urls).size, 14);
  assert.ok(urls.includes(`${origin}/`));
  assert.ok(
    urls.every((url) => url.startsWith(`${origin}/`) && url.endsWith("/")),
  );
  assert.ok(!sitemap.includes("#"));
});

for (const url of urls) {
  const path = new URL(url).pathname;
  test(`indexable, self-contained SEO HTML: ${path}`, async () => {
    const html = await readFile(`dist${path}index.html`, "utf8");
    assert.match(html, /<html lang="bn">/);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.equal([...html.matchAll(/<title>/g)].length, 1);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = html.match(
      /<meta name="description" content="(.*?)"/s,
    )?.[1];
    assert.ok(title && description);
    assert.ok(!titles.has(title), `duplicate title: ${title}`);
    assert.ok(
      !descriptions.has(description),
      `duplicate description: ${description}`,
    );
    titles.add(title);
    descriptions.add(description);
    assert.equal(html.match(/<link rel="canonical" href="(.*?)"/)?.[1], url);
    assert.equal(
      html.match(/<meta property="og:url" content="(.*?)"/)?.[1],
      url,
    );
    assert.match(html, /content="index, follow, max-image-preview:large"/);
    assert.match(html, /<div id="root">[\s\S]*<main/);
    assert.match(html, /href="https:\/\/wa.me\//);
    const structured = [
      ...html.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs,
      ),
    ];
    assert.equal(structured.length, 1);
    const schema = JSON.parse(structured[0][1]);
    assert.equal(schema["@context"], "https://schema.org");
    const business = schema["@graph"].find(
      (item) => item["@type"] === "LocalBusiness",
    );
    assert.equal(business.address.addressCountry, "BD");
    assert.equal(business.telephone, "+8801689318187");
    assert.ok(!business.aggregateRating, "do not invent ratings");
    assert.equal(business.contactPoint[0].telephone, "+8801660191039");
    if (path.startsWith("/services/")) {
      assert.ok(schema["@graph"].some((item) => item["@type"] === "Service"));
      assert.ok(
        schema["@graph"].some((item) => item["@type"] === "BreadcrumbList"),
      );
      assert.match(html, /কীভাবে অর্ডার করবেন/);
    }
    if (path.startsWith("/guides/")) {
      assert.ok(schema["@graph"].some((item) => item["@type"] === "Article"));
      assert.ok(
        schema["@graph"].some((item) => item["@type"] === "BreadcrumbList"),
      );
    }
    for (const match of html.matchAll(/href="https:\/\/wa.me\/(\d+)/g)) {
      assert.equal(
        match[1],
        "8801660191039",
        `incorrect WhatsApp target on ${path}`,
      );
    }
    assert.ok(
      !html.includes('https://www.facebook.com/"'),
      "no placeholder Facebook link",
    );
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)"/g)) {
      await access(`dist${match[1]}`);
    }
    for (const match of html.matchAll(/href="(\/services\/[^"#?]+)"/g)) {
      assert.ok(
        urls.includes(`${origin}${match[1]}`),
        `broken service link: ${match[1]}`,
      );
    }
  });
}

test("robots points at the canonical sitemap and permits crawling", async () => {
  const robots = await readFile("dist/robots.txt", "utf8");
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.ok(!robots.includes("Disallow: /"));
  await access("dist/social-preview.jpg");
});

test("404 content is not indexable or included in the sitemap", async () => {
  const html = await readFile("dist/404.html", "utf8");
  assert.match(html, /noindex, follow/);
  assert.match(html, /পেজটি পাওয়া যায়নি/);
  assert.ok(!html.includes('rel="canonical"'));
  assert.ok(!urls.some((url) => url.includes("404")));
});

test("all crawlable internal URLs and hash targets resolve, including navigation and guide links", async () => {
  const pages = new Map();
  for (const url of urls)
    pages.set(
      new URL(url).pathname,
      await readFile(`dist${new URL(url).pathname}index.html`, "utf8"),
    );
  for (const [path, html] of pages) {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `duplicate id on ${path}`);
    for (const match of html.matchAll(/href="([^"<>]+)"/g)) {
      if (!match[1].startsWith("/") && !match[1].startsWith("#")) continue;
      const target = new URL(
        match[1].replaceAll("&amp;", "&"),
        `${origin}${path}`,
      );
      if (target.pathname.startsWith("/assets/")) continue; // assets checked above
      assert.ok(
        pages.has(target.pathname),
        `${path} links to unknown page ${target.pathname}`,
      );
      if (target.hash) {
        const targetHTML = pages.get(target.pathname);
        assert.ok(
          targetHTML.includes(
            `id="${decodeURIComponent(target.hash.slice(1))}"`,
          ),
          `${path} links to missing ${target.pathname}${target.hash}`,
        );
      }
    }
  }
});

test("homepage is product-first, with all products and service links in the initial HTML", async () => {
  const html = await readFile("dist/index.html", "utf8");
  const main = html.slice(html.indexOf("<main"));
  assert.ok(main.indexOf('id="products"') < main.indexOf('id="services"'));
  assert.ok(main.includes("রেডিমেড প্রোডাক্ট"));
  assert.ok(main.includes("ফয়েল প্যাকেট"));
  assert.ok(main.includes("জিপার প্যাকেট"));
  assert.match(html, /autocomplete="tel"/i);
  assert.ok(
    !html.includes("প্রতিষ্ঠানের সাথে কাজের অভিজ্ঞতা"),
    "no unverified customer counters",
  );
});
