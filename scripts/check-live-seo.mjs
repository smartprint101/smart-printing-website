import { readFile } from "node:fs/promises";

// Run after deploying the full dist/ directory. Never submits anything to Google.
const canonicalOrigin = "https://smartpackagingbd.com";
const target = new URL(process.argv[2] || canonicalOrigin).origin;
console.log(`Checking deployed/static site at ${target}\n`);
const sitemap = await readFile("dist/sitemap.xml", "utf8").catch(() => {
  throw new Error("Run npm run build first so the expected URL list exists.");
});
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);
let failures = 0;
async function check(path, validate, { binary = false } = {}) {
  try {
    const response = await fetch(`${target}${path}`, {
      signal: AbortSignal.timeout(15000),
    });
    const body = binary
      ? Buffer.from(await response.arrayBuffer())
      : await response.text();
    await validate(response, body);
    console.log(`PASS ${path}`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${path}: ${error.message}`);
  }
}
function require(condition, message) {
  if (!condition) throw new Error(message);
}
await check("/robots.txt", (res, text) => {
  require(res.status === 200 &&
    /text\/plain/i.test(
      res.headers.get("content-type") || "",
    ), "Expected HTTP 200 and text/plain, not an HTML fallback");
  require(/^User-agent:/im.test(text) &&
    text.includes(
      `${canonicalOrigin}/sitemap.xml`,
    ), "Expected actual robots rules and canonical sitemap");
  require(!/^\s*Disallow:\s*\/\s*(?:#.*)?$/im.test(text), "robots.txt blocks the entire site");
});
await check("/sitemap.xml", (res, text) => {
  require(res.status === 200 &&
    /(?:xml|text\/plain)/i.test(
      res.headers.get("content-type") || "",
    ), "Expected HTTP 200 and an XML response");
  const actual = [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  require(text.includes("<urlset") &&
    actual.length === paths.length &&
    new Set(actual).size === actual.length &&
    paths.every((path) => actual.includes(`${canonicalOrigin}${path}`)),
    "Sitemap URLs are missing, duplicated or point to an unexpected origin");
});
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
function validatePng(res, data, minSize) {
  require(res.status === 200, `Expected HTTP 200, received ${res.status}`);
  require(
    /image\/png/i.test(res.headers.get("content-type") || ""),
    "Expected image/png, not an HTML fallback",
  );
  require(
    !/noindex/i.test(res.headers.get("x-robots-tag") || ""),
    "Image is marked noindex",
  );
  require(
    data.length >= 24 && data.subarray(0, 8).equals(pngSignature),
    "Expected actual PNG image bytes",
  );
  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  require(
    width === height && width >= minSize,
    `Expected a square image at least ${minSize}px, received ${width}x${height}`,
  );
}
for (const [path, minSize] of [
  ["/favicon.png", 49],
  ["/apple-touch-icon.png", 49],
  ["/brand-logo.png", 112],
]) {
  await check(path, (res, data) => validatePng(res, data, minSize), {
    binary: true,
  });
}
await check(
  "/favicon.ico",
  (res, data) => {
    require(res.status === 200, `Expected HTTP 200, received ${res.status}`);
    require(
      data.length >= 6 && data.subarray(0, 4).equals(Buffer.from([0, 0, 1, 0])),
      "Expected ICO bytes, not an HTML fallback",
    );
  },
  { binary: true },
);

// Sequential checks avoid putting load on a small business hosting account.
const seenTitles = new Set();
const seenDescriptions = new Set();
for (const path of paths) {
  await check(path, (res, html) => {
    require(res.status === 200, `Expected HTTP 200, received ${res.status}`);
    const final = new URL(res.url);
    require(final.origin === target && final.pathname === path,
      `Unexpected final URL ${res.url}`);
    require(/text\/html/i.test(
      res.headers.get("content-type") || "",
    ), "Expected an HTML page");
    require(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ===
      `${canonicalOrigin}${path}`, "Wrong canonical: old build or homepage fallback");
    require([...html.matchAll(/<h1\b/g)].length ===
      1, "Expected one pre-rendered H1");
    require(!/noindex/i.test(res.headers.get("x-robots-tag") || "") &&
      !/<meta name="robots" content="[^"]*noindex/i.test(html),
      "Page is marked noindex");
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = html.match(/<meta name="description" content="(.*?)"/s)?.[1];
    require(title && description, "Missing title or description");
    require(!seenTitles.has(title) && !seenDescriptions.has(description), "Duplicate title or description");
    seenTitles.add(title);
    seenDescriptions.add(description);
    const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
    require(json, "Missing JSON-LD");
    const schema = JSON.parse(json);
    require(schema["@context"] === "https://schema.org" && Array.isArray(schema["@graph"]),
      "JSON-LD graph has an unexpected format");
    const expectedType = path.startsWith("/services/") ? "Service" : path.startsWith("/guides/") ? "Article" : "LocalBusiness";
    require(schema["@graph"].some((item) => item["@type"] === expectedType),
      `Missing ${expectedType} in JSON-LD`);
    if (path === "/") {
      require(
        /<link\b[^>]*rel="icon"[^>]*href="\/favicon\.png"/i.test(html),
        "Homepage does not declare the crawlable PNG favicon",
      );
      const business = schema["@graph"].find((item) => item["@type"] === "LocalBusiness");
      require(
        business?.logo === `${canonicalOrigin}/brand-logo.png`,
        "Organization logo is missing or points to a different URL",
      );
    }
    require(!/wa\.me\/8801689318187/.test(
      html,
    ), "An old WhatsApp destination remains");
  });
}
await check("/__seo-check-page-that-does-not-exist__/", (res) => {
  require(res.status ===
    404, `Expected real HTTP 404, received ${res.status}; remove the SPA homepage fallback`);
});

// Redirects are hosting-specific and meaningful only against the canonical live host.
if (target === canonicalOrigin) {
  for (const [start, expected] of [
    ["http://smartpackagingbd.com/", `${canonicalOrigin}/`],
    ["https://www.smartpackagingbd.com/", `${canonicalOrigin}/`],
    [`${canonicalOrigin}/services/ld-packet`, `${canonicalOrigin}/services/ld-packet/`],
  ]) {
    try {
      let current = start;
      let verified = false;
      const visited = new Set();
      const hops = [];
      for (let i = 0; i < 6; i++) {
        require(!visited.has(current), "Redirect loop");
        visited.add(current);
        const response = await fetch(current, {
          redirect: "manual",
          signal: AbortSignal.timeout(15000),
        });
        if (response.status >= 300 && response.status < 400) {
          require([301, 308].includes(response.status), `Expected a permanent redirect, received ${response.status}`);
          const location = response.headers.get("location");
          require(location, "Redirect has no Location header");
          hops.push(response.status);
          current = new URL(location, current).href;
          continue;
        }
        require(response.status === 200 && current === expected,
          `Expected HTTP 200 at ${expected}, got ${response.status} at ${current}`);
        require(hops.length > 0, "Expected a permanent redirect to the canonical URL");
        verified = true;
        break;
      }
      require(verified, "Redirect chain did not reach an HTTP 200 canonical URL");
      console.log(`PASS ${start} → ${expected} (${hops.join(" → ")})`);
    } catch (error) {
      failures++;
      console.error(`FAIL ${start}: ${error.message}`);
    }
  }
}
console.log(
  `\n${failures ? `${failures} check(s) failed. Fix deployment before requesting indexing.` : "All routing and SEO checks passed. JSON-LD syntax was checked, not Google rich-result eligibility. Next: Search Console and Business Profile verification."}`,
);
process.exitCode = failures ? 1 : 0;
