import { build } from "vite";
import { readFile, writeFile, mkdir, rename, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";

// A static HTML document per route: crawlers and visitors receive the same content.
await build();
process.env.BUILD_TARGET = "ssr";
await build({
  build: {
    ssr: "src/entry-server.tsx",
    outDir: ".cache/ssr",
    emptyOutDir: true,
  },
});
const { render, pagePaths, SITE_URL } = await import(
  pathToFileURL(resolve(".cache/ssr/entry-server.js")).href
);
const template = await readFile("dist/index.html", "utf8");
if (
  !template.includes("<!-- seo:start -->") ||
  !template.includes('<div id="root"></div>')
) {
  throw new Error(
    "Static HTML template markers are missing; refusing to publish an empty SPA.",
  );
}
if (new Set(pagePaths).size !== pagePaths.length) {
  throw new Error("Duplicate routes in the sitemap/static export.");
}
for (const path of [...pagePaths, "/404/"]) {
  const { html, head } = render(path);
  const document = template
    .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, () => head)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);
  const file = path === "/404/" ? "dist/404.html" : `dist${path}index.html`;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, document);
}
// The admin panel is a client-only SPA kept out of the sitemap and search results.
await mkdir("dist/admin", { recursive: true });
await rename("dist/admin.html", "dist/admin/index.html").catch((error) => {
  console.warn("Could not move admin.html:", error.message);
});
// Hosts without directory-index rewriting still get a usable /admin.html.
await writeFile(
  "dist/admin.html",
  '<!doctype html><html lang="bn"><head><meta charset="utf-8" />' +
    '<meta name="robots" content="noindex, nofollow" />' +
    '<meta http-equiv="refresh" content="0; url=/admin/" />' +
    "<title>অ্যাডমিন প্যানেল</title></head>" +
    '<body><p><a href="/admin/">অ্যাডমিন প্যানেলে যান</a></p></body></html>\n',
);

// Published landing pages live at /lp/<slug>/ and are rendered by a Pages
// Function. Include them in the sitemap when a live catalog is reachable at
// build time (Cloudflare Pages sets CATALOG_API_URL).
const extraPaths = [];
if (process.env.CATALOG_API_URL) {
  try {
    const response = await fetch(
      `${process.env.CATALOG_API_URL.replace(/\/+$/, "")}/api/catalog`,
    );
    if (response.ok) {
      const catalog = await response.json();
      for (const page of catalog.landingPages ?? []) {
        if (page && typeof page.slug === "string" && page.slug) {
          extraPaths.push(`/lp/${page.slug}/`);
        }
      }
    }
  } catch (error) {
    console.warn("Landing pages were not added to the sitemap:", error.message);
  }
}

const allPaths = [...pagePaths, ...extraPaths];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPaths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile("dist/sitemap.xml", xml);
await access("dist/admin/index.html");
console.log(
  `Prerendered ${pagePaths.length} indexable pages, 404.html, admin panel and sitemap.xml${extraPaths.length ? ` (+${extraPaths.length} landing pages)` : ""}.`,
);
