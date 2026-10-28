import { build } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";

// A static HTML document per route: crawlers and visitors receive the same content.
await build();
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
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pagePaths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile("dist/sitemap.xml", xml);
console.log(
  `Prerendered ${pagePaths.length} indexable pages, 404.html and sitemap.xml.`,
);
