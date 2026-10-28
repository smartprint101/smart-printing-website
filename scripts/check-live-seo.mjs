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
async function check(path, validate) {
  try {
    const response = await fetch(`${target}${path}`, {
      signal: AbortSignal.timeout(15000),
    });
    const body = await response.text();
    validate(response, body);
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
});
await check("/sitemap.xml", (res, text) => {
  require(res.status === 200 &&
    /(?:xml|text\/plain)/i.test(
      res.headers.get("content-type") || "",
    ), "Expected HTTP 200 and an XML response");
  require(text.includes("<urlset") &&
    paths.every((path) =>
      text.includes(`<loc>${canonicalOrigin}${path}</loc>`),
    ), "New sitemap URLs are missing");
});
// Sequential checks avoid putting load on a small business hosting account.
for (const path of paths) {
  await check(path, (res, html) => {
    require(res.status === 200, `Expected HTTP 200, received ${res.status}`);
    require(/text\/html/i.test(
      res.headers.get("content-type") || "",
    ), "Expected an HTML page");
    require(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ===
      `${canonicalOrigin}${path}`, "Wrong canonical: old build or homepage fallback");
    require([...html.matchAll(/<h1\b/g)].length ===
      1, "Expected one pre-rendered H1");
    require(html.includes("application/ld+json") &&
      !/<meta name="robots" content="[^"]*noindex/.test(
        html,
      ), "Missing JSON-LD or page marked noindex");
    require(!/wa\.me\/8801689318187/.test(
      html,
    ), "An old WhatsApp destination remains");
  });
}
await check("/__seo-check-page-that-does-not-exist__/", (res) => {
  require(res.status ===
    404, `Expected real HTTP 404, received ${res.status}; remove the SPA homepage fallback`);
});
console.log(
  `\n${failures ? `${failures} check(s) failed. Fix deployment before requesting indexing.` : "All live routing and SEO checks passed. Next: Search Console and Business Profile verification."}`,
);
process.exitCode = failures ? 1 : 0;
