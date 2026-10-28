import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import sharp from "sharp";

const origin = "https://smartpackagingbd.com";
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
const titles = new Set();
const descriptions = new Set();

test("sitemap contains the home page, ten service routes and five guides", () => {
  assert.equal(urls.length, 16);
  assert.equal(new Set(urls).size, 16);
  assert.ok(urls.includes(`${origin}/`));
  assert.ok(urls.includes(`${origin}/guides/own-brand-packet-printing/`));
  assert.ok(urls.includes(`${origin}/guides/food-packaging-printing/`));
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
    for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(img, /\balt="[^"]*"/, `image alt missing on ${path}`);
      assert.match(img, /\bwidth="\d+"/, `image width missing on ${path}`);
      assert.match(img, /\bheight="\d+"/, `image height missing on ${path}`);
    }
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
    assert.equal(business.logo, `${origin}/brand-logo.png`);
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
      if (
        target.pathname.startsWith("/assets/") ||
        /\.(?:png|ico|jpe?g|webp|svg)$/i.test(target.pathname)
      ) {
        await access(`dist${target.pathname}`);
        continue;
      }
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

test("search favicon and organization logo are real, square and crawlable assets", async () => {
  const html = await readFile("dist/index.html", "utf8");
  const head = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
  const iconTags = [...head.matchAll(/<link\b[^>]*\brel="icon"[^>]*>/g)];
  assert.equal(iconTags.length, 1);
  assert.match(iconTags[0][0], /href="\/favicon\.png"/);
  assert.match(iconTags[0][0], /type="image\/png"/);
  assert.match(iconTags[0][0], /sizes="192x192"/);
  assert.ok(!iconTags[0][0].includes("data:"));
  assert.match(
    head,
    /rel="apple-touch-icon"[^>]*href="\/apple-touch-icon\.png"/,
  );

  for (const [file, size] of [
    ["favicon.png", 192],
    ["apple-touch-icon.png", 180],
    ["brand-logo.png", 512],
  ]) {
    const image = await sharp(`dist/${file}`).metadata();
    assert.equal(image.format, "png");
    assert.equal(image.width, size);
    assert.equal(image.height, size);
  }
  const ico = await readFile("dist/favicon.ico");
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 3);
  assert.deepEqual([ico[6], ico[22], ico[38]], [16, 32, 48]);
  for (let i = 0; i < 3; i++) {
    const entry = 6 + i * 16;
    const length = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    assert.ok(offset >= 54 && offset + length <= ico.length);
    const image = await sharp(ico.subarray(offset, offset + length)).metadata();
    assert.equal(image.width, ico[entry]);
    assert.equal(image.height, ico[entry + 1]);
  }
});

test("Bengali packaging queries have useful matching content and crawlable links", async () => {
  const home = await readFile("dist/index.html", "utf8");
  assert.match(home, /<title>প্যাকেজিং: প্যাকেট, বক্স ও স্টিকার প্রিন্টিং/);
  assert.match(home, /নিজের নামে প্যাকেট/);
  assert.match(home, /পলি ও ফয়েল প্যাকেট/);
  assert.match(home, /স্টিকার ও লেবেল প্রিন্টিং/);
  assert.match(home, /href="\/guides\/own-brand-packet-printing\/"/);
  for (const [id, phrase] of [
    ["ld-packet", "পলি প্যাকেট প্রিন্টিং"],
    ["foil-packet", "ফয়েল প্যাকেট প্রিন্টিং"],
    ["custom-box", "প্যাকেজিং বক্স প্রিন্টিং"],
    ["sticker", "স্টিকার ও লেবেল প্রিন্টিং"],
  ]) {
    const html = await readFile(`dist/services/${id}/index.html`, "utf8");
    assert.ok(html.includes(`<title>${phrase}`), `${id} title`);
    assert.match(html, new RegExp(`<h1[^>]*>${phrase}`), `${id} H1`);
    assert.match(html, /href="\/guides\/own-brand-packet-printing\/"/);
  }
  const guide = await readFile(
    "dist/guides/own-brand-packet-printing/index.html",
    "utf8",
  );
  assert.match(guide, /নিজের নামে প্যাকেট কীভাবে তৈরি করবেন/);
  assert.match(guide, /পণ্য কীভাবে প্যাকেট করবেন ও সিল পরীক্ষা করবেন/);
  assert.match(guide, /প্যাকেজিং প্রিন্টিংয়ের খরচ কীসের ওপর নির্ভর করে/);
  assert.ok((guide.match(/id="guide-section-\d+"/g) || []).length >= 8);
  for (const id of [
    "ld-packet",
    "foil-packet",
    "custom-box",
    "sticker",
    "ready-made",
  ]) {
    assert.ok(guide.includes(`href="/services/${id}/"`), `missing ${id} link`);
  }
});

test("food packaging guide is substantive, cautious and connected to relevant services", async () => {
  const guide = await readFile("dist/guides/food-packaging-printing/index.html", "utf8");
  assert.match(guide, /খাবারের প্যাকেট প্রিন্টিং/);
  assert.match(guide, /food packaging printing/);
  assert.match(guide, /খাদ্য-সংস্পর্শ ও ম্যাটেরিয়ালের প্রমাণ যাচাই/);
  assert.match(guide, /কোনো নির্দিষ্ট ম্যাটেরিয়ালের সনদ বা উপযোগিতার নিশ্চয়তা নয়/);
  assert.ok((guide.match(/id="guide-section-\d+"/g) || []).length >= 7);
  for (const id of ["ld-packet", "foil-packet", "custom-box", "sticker", "ready-made"]) {
    assert.ok(guide.includes(`href="/services/${id}/"`), `missing ${id} link`);
    const service = await readFile(`dist/services/${id}/index.html`, "utf8");
    assert.ok(service.includes('href="/guides/food-packaging-printing/"'));
  }
});

test("service guidance avoids unverified protection guarantees", async () => {
  const foil = await readFile("dist/services/foil-packet/index.html", "utf8");
  const box = await readFile("dist/services/custom-box/index.html", "utf8");
  const seal = await readFile("dist/services/security-poly/index.html", "utf8");
  const offset = await readFile("dist/services/offset/index.html", "utf8");
  const sticker = await readFile("dist/services/sticker/index.html", "utf8");
  assert.match(foil, /সব চকচকে পাউচে অ্যালুমিনিয়াম ফয়েল থাকে না/);
  assert.ok(!box.includes("প্রোডাক্ট সুরক্ষা নিশ্চিত করে"));
  assert.match(seal, /leak-proof বা tamper-proof হওয়ার নিশ্চয়তা নয়/);
  assert.match(offset, /অফসেট প্রিন্টিংয়ের artwork ও কোটেশন/);
  assert.match(sticker, /স্টিকার ও লেবেল প্রিন্টিংয়ের আগে কী যাচাই করবেন/);
});

test("keyword map targets actual sitemap URLs and does not fabricate measurements", async () => {
  const map = await readFile("docs/KEYWORD-MAP.bn.csv", "utf8");
  const mapped = [...map.matchAll(/https:\/\/smartpackagingbd\.com\/[^,\r\n"]*/g)].map((match) => match[0]);
  assert.ok(mapped.length >= 30);
  assert.ok(mapped.every((url) => urls.includes(url)), "keyword target missing from sitemap");
  for (const line of map.trim().split(/\r?\n/).slice(1)) {
    assert.match(line, /,অজানা,অজানা,/, "volume and difficulty should remain unknown");
  }
});

test("deployment checker detects extra sitemap URLs, noindex headers and invalid JSON-LD", async () => {
  const { createServer } = await import("node:http");
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const run = promisify(execFile);
  let mode = "healthy";
  const server = createServer(async (request, response) => {
    const path = new URL(request.url, "http://localhost").pathname;
    const file = path.endsWith("/") ? `dist${path}index.html` : `dist${path}`;
    try {
      let data = await readFile(file);
      if (mode === "extra-sitemap" && path === "/sitemap.xml") {
        data = Buffer.from(data.toString().replace("</urlset>", `<url><loc>${origin}/unexpected/</loc></url></urlset>`));
      }
      if (mode === "bad-json" && path === "/services/foil-packet/") {
        data = Buffer.from(data.toString().replace(/(<script type="application\/ld\+json">).*?(<\/script>)/s, "$1{invalid JSON$2"));
      }
      if (mode === "noindex-header" && path === "/services/ld-packet/") {
        response.setHeader("X-Robots-Tag", "noindex");
      }
      const mime = file.endsWith(".html") ? "text/html" : file.endsWith(".xml") ? "application/xml" : file.endsWith(".txt") ? "text/plain" : file.endsWith(".png") ? "image/png" : "image/x-icon";
      response.writeHead(200, { "Content-Type": mime });
      response.end(data);
    } catch {
      response.writeHead(404);
      response.end("not found");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const target = `http://127.0.0.1:${server.address().port}`;
  try {
    const check = () => run(process.execPath, ["scripts/check-live-seo.mjs", target]);
    const healthy = await check();
    assert.match(healthy.stdout, /All routing and SEO checks passed/);
    for (const [badMode, expected] of [
      ["extra-sitemap", /FAIL \/sitemap.xml/],
      ["noindex-header", /FAIL \/services\/ld-packet\//],
      ["bad-json", /FAIL \/services\/foil-packet\//],
    ]) {
      mode = badMode;
      await assert.rejects(check(), (error) => {
        assert.equal(error.code, 1);
        assert.match(error.stderr, expected);
        return true;
      });
    }
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
