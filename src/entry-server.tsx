import { renderToString } from "react-dom/server";
import App from "./App";
import { pagePaths, pageSEO, structuredData } from "./lib/seo";
import { SITE_URL } from "./lib/site";

export { pagePaths, SITE_URL };
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );

export function render(path: string) {
  const page = pageSEO(path);
  const head = `
    <title>${escape(page.title)}</title>
    <meta name="description" content="${escape(page.description)}" />
    <meta name="author" content="Smart Printing Packaging" />
    <meta name="robots" content="${page.known ? "index, follow, max-image-preview:large" : "noindex, follow"}" />
    ${page.known ? `<link rel="canonical" href="${escape(page.canonical)}" />` : ""}
    <meta property="og:type" content="${page.guide ? "article" : "website"}" />
    <meta property="og:site_name" content="Smart Printing Packaging" />
    <meta property="og:locale" content="bn_BD" />
    <meta property="og:title" content="${escape(page.title)}" />
    <meta property="og:description" content="${escape(page.description)}" />
    <meta property="og:url" content="${escape(page.canonical)}" />
    <meta property="og:image" content="${SITE_URL}/social-preview.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Smart Printing Packaging — Printing and Packaging in Bangladesh" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(page.title)}" />
    <meta name="twitter:description" content="${escape(page.description)}" />
    <meta name="twitter:image" content="${SITE_URL}/social-preview.jpg" />
    ${page.known ? `<script type="application/ld+json">${JSON.stringify(structuredData(path)).replace(/</g, "\\u003c")}</script>` : ""}
  `;
  return { html: renderToString(<App path={path} />), head };
}
