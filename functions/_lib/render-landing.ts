import type {
  LandingBlock,
  LandingPage,
  PriceUnit,
  Product,
  SiteSettings,
} from "../../shared/types";

/**
 * Server-renders an admin-built landing page to complete HTML.
 *
 * Rendering happens in a Pages Function so `/lp/<slug>/` works on Cloudflare
 * Pages without a build step, keeps full SEO metadata and stays fast.
 */

const escapeHtml = (value: unknown): string =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]!,
  );

const escapeAttr = escapeHtml;

const UNIT_LABELS: Record<PriceUnit, string> = {
  kg: "কেজি",
  piece: "পিস",
  packet: "প্যাকেট",
  sqft: "স্কয়ার ফিট",
  unit: "ইউনিট",
};

function amount(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function priceLabel(product: Product): string {
  if (product.price === null || product.price === undefined) {
    return escapeHtml(product.priceNote || "কোটেশন নিন");
  }
  const min = amount(Number(product.price));
  const max = product.priceMax;
  const range =
    max !== null && max !== undefined && Number(max) !== Number(product.price)
      ? `৳${min}–${amount(Number(max))}`
      : `৳${min}`;
  return `${range} / ${UNIT_LABELS[product.priceUnit] ?? ""}`.trim();
}

function waLink(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Remove scripts and inline handlers from author HTML unless explicitly allowed. */
export function sanitizeAuthorHtml(html: string, allowScripts: boolean): string {
  if (allowScripts) return html;
  return html
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<script\b[^>]*>/gi, "")
    .replace(/<\/script\s*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

function renderBlock(
  block: LandingBlock,
  products: Product[],
  settings: SiteSettings,
): string {
  switch (block.type) {
    case "hero": {
      const dark = block.theme === "dark";
      return `<section class="hero${dark ? " hero-dark" : ""}">
  <div class="wrap hero-grid">
    <div>
      ${block.eyebrow ? `<p class="eyebrow">${escapeHtml(block.eyebrow)}</p>` : ""}
      <h1>${escapeHtml(block.title)}</h1>
      ${block.subtitle ? `<p class="lede">${escapeHtml(block.subtitle)}</p>` : ""}
      ${
        block.ctaText
          ? `<a class="btn" href="${escapeAttr(
              block.ctaUrl || waLink(settings.contact.whatsappNumber),
            )}"${block.ctaUrl?.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${escapeHtml(block.ctaText)}</a>`
          : ""
      }
    </div>
    ${
      block.imageUrl
        ? `<img class="hero-img" src="${escapeAttr(block.imageUrl)}" alt="${escapeAttr(block.title)}" width="900" height="700" loading="eager" decoding="async" />`
        : ""
    }
  </div>
</section>`;
    }
    case "text":
      return `<section class="wrap block">
  ${block.title ? `<h2>${escapeHtml(block.title)}</h2>` : ""}
  <div class="prose">${sanitizeAuthorHtml(block.html, false)}</div>
</section>`;
    case "products": {
      const items = products
        .filter((product) => block.productIds.map(String).includes(product.id) ||
          block.productIds.map(String).includes(product.slug))
        .filter((product) => product.isActive);
      if (!items.length) return "";
      return `<section class="wrap block">
  ${block.title ? `<h2>${escapeHtml(block.title)}</h2>` : ""}
  ${block.subtitle ? `<p class="lede">${escapeHtml(block.subtitle)}</p>` : ""}
  <div class="cards">
    ${items
      .map(
        (product) => `<article class="card">
      ${
        product.imageUrl
          ? `<img src="${escapeAttr(product.imageUrl)}" alt="${escapeAttr(product.nameBn)}" width="480" height="420" loading="lazy" decoding="async" />`
          : ""
      }
      <h3>${escapeHtml(product.nameBn)}</h3>
      <p class="price">${priceLabel(product)}</p>
      ${product.minOrder ? `<p class="muted">ন্যূনতম অর্ডার: ${escapeHtml(product.minOrder)}</p>` : ""}
      <a class="btn btn-sm" href="${escapeAttr(
        waLink(
          settings.contact.whatsappNumber,
          product.waMessage ||
            `আসসালামু আলাইকুম। আমি ${product.nameBn} সম্পর্কে জানতে চাই।`,
        ),
      )}" target="_blank" rel="noopener noreferrer">অর্ডার করুন</a>
    </article>`,
      )
      .join("\n")}
  </div>
</section>`;
    }
    case "features":
      return `<section class="wrap block">
  ${block.title ? `<h2>${escapeHtml(block.title)}</h2>` : ""}
  <div class="features">
    ${block.items
      .map(
        (item) => `<div class="feature">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </div>`,
      )
      .join("\n")}
  </div>
</section>`;
    case "image":
      return `<section class="wrap block">
  <figure class="figure">
    <img src="${escapeAttr(block.imageUrl)}" alt="${escapeAttr(block.alt || "ছবি")}" width="1200" height="800" loading="lazy" decoding="async" />
    ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}
  </figure>
</section>`;
    case "cta":
      return `<section class="wrap block">
  <div class="cta-box">
    <div>
      <h2>${escapeHtml(block.title)}</h2>
      ${block.text ? `<p>${escapeHtml(block.text)}</p>` : ""}
    </div>
    <a class="btn" href="${escapeAttr(
      block.buttonUrl || waLink(settings.contact.whatsappNumber),
    )}" target="_blank" rel="noopener noreferrer">${escapeHtml(block.buttonText || "WhatsApp যোগাযোগ")}</a>
  </div>
</section>`;
    case "faq":
      return `<section class="wrap block">
  ${block.title ? `<h2>${escapeHtml(block.title)}</h2>` : ""}
  <div class="faq">
    ${block.items
      .map(
        (item) => `<details>
      <summary>${escapeHtml(item.q)}</summary>
      <p>${escapeHtml(item.a)}</p>
    </details>`,
      )
      .join("\n")}
  </div>
</section>`;
    case "html":
      return `<section class="wrap block block-html">${sanitizeAuthorHtml(
        block.html,
        block.allowScripts,
      )}</section>`;
    default:
      return "";
  }
}

const STYLES = `
:root{--accent:ACCENT;--bg:BG;--ink:#142a5e;--muted:#5b6273;--line:#e3dfd5}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Noto Sans Bengali","Manrope",system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.75}
img{max-width:100%;height:auto;display:block}
a{color:inherit}
.wrap{width:100%;max-width:1120px;margin:0 auto;padding:0 20px}
header.lp-head{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.lp-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 20px;max-width:1120px;margin:0 auto}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;text-decoration:none;color:var(--ink)}
.brand img{width:34px;height:34px;border-radius:8px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:10px 22px;border-radius:999px;background:var(--accent);color:#fff;font-weight:700;font-size:15px;text-decoration:none;transition:opacity .2s}
.btn:hover{opacity:.9}
.btn-sm{min-height:40px;padding:8px 16px;font-size:13px;background:#fff;color:var(--accent);border:1px solid var(--accent)}
.hero{padding:56px 0 40px}
.hero-grid{display:grid;gap:32px;align-items:center}
@media(min-width:900px){.hero-grid{grid-template-columns:1.1fr .9fr}}
.hero h1{font-size:clamp(28px,4.4vw,46px);line-height:1.35;margin:10px 0 0;letter-spacing:-.01em}
.hero .lede{font-size:17px;color:var(--muted);margin:16px 0 24px;max-width:56ch}
.hero-img{border-radius:22px;box-shadow:0 24px 60px -30px rgba(20,42,94,.5);background:#fff;object-fit:cover;aspect-ratio:9/7;width:100%}
.hero-dark{background:var(--accent);color:#fff}
.hero-dark .lede{color:rgba(255,255,255,.82)}
.hero-dark .btn{background:#fff;color:var(--accent)}
.eyebrow{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#996034;margin:0}
.hero-dark .eyebrow{color:#f0c48a}
.block{padding:36px 0}
.block h2{font-size:clamp(22px,2.6vw,30px);margin:0 0 16px;line-height:1.45}
.block .lede{color:var(--muted);margin:-6px 0 22px;max-width:60ch}
.prose{font-size:16px;color:#33384a}
.prose p{margin:0 0 14px}
.prose h3{font-size:19px;margin:24px 0 10px}
.prose ul,.prose ol{padding-left:22px;margin:0 0 14px}
.prose img{border-radius:14px;margin:12px 0}
.cards{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
.card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:6px}
.card img{aspect-ratio:1.1;width:100%;object-fit:contain;background:#fafaf8;border-radius:12px}
.card h3{font-size:16px;margin:6px 0 0}
.price{font-weight:800;margin:0;color:var(--ink)}
.muted{color:var(--muted);font-size:12px;margin:0}
.card .btn{margin-top:auto}
.features{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.feature{background:#fff;border:1px solid var(--line);border-radius:18px;padding:20px}
.feature h3{margin:0 0 6px;font-size:17px}
.feature p{margin:0;color:var(--muted);font-size:15px}
.figure{margin:0}
.figure img{border-radius:20px;width:100%;object-fit:cover}
.figure figcaption{margin-top:10px;color:var(--muted);font-size:13px;text-align:center}
.cta-box{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px;background:var(--accent);color:#fff;border-radius:24px;padding:28px}
.cta-box h2{margin:0 0 6px;font-size:24px}
.cta-box p{margin:0;color:rgba(255,255,255,.82)}
.cta-box .btn{background:#fff;color:var(--accent)}
.faq{display:grid;gap:10px}
.faq details{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 18px}
.faq summary{cursor:pointer;font-weight:700}
.faq p{margin:8px 0 0;color:var(--muted)}
.block-html{font-size:16px}
footer.lp-foot{background:#0f2149;color:#cfd7ea;margin-top:40px;padding:34px 0;font-size:14px}
footer.lp-foot a{color:#fff;text-decoration:none}
.lp-wa{position:fixed;right:18px;bottom:18px;z-index:30;width:56px;height:56px;border-radius:999px;background:#22c55e;display:grid;place-items:center;box-shadow:0 12px 30px -8px rgba(0,0,0,.4)}
.lp-wa svg{width:30px;height:30px;fill:#fff}
`;

export function renderLandingPage(
  page: LandingPage,
  products: Product[],
  settings: SiteSettings,
  siteUrl: string,
): string {
  const canonical = `${siteUrl}/lp/${page.slug}/`;
  const title = page.seoTitle || page.title;
  const description =
    page.seoDescription ||
    page.title + " — Smart Printing Packaging, ঢাকা।";
  const styles = STYLES.replace("ACCENT", page.theme.accent).replace(
    "BG",
    page.theme.background,
  );
  const body = page.blocks
    .map((block) => renderBlock(block, products, settings))
    .join("\n");

  const productIds = new Set(
    page.blocks.flatMap((block) =>
      block.type === "products" ? block.productIds.map(String) : [],
    ),
  );
  const items = products.filter(
    (product) =>
      product.isActive &&
      (productIds.has(product.id) || productIds.has(product.slug)),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: "bn-BD",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "হোম", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: page.title, item: canonical },
        ],
      },
      ...(items.length
        ? [
            {
              "@type": "ItemList",
              name: page.title,
              itemListElement: items.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: product.nameBn,
                url: `${siteUrl}/services/ready-made/`,
              })),
            },
          ]
        : []),
    ],
  };

  return `<!doctype html>
<html lang="bn">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeAttr(description)}" />
<meta name="robots" content="${page.indexable ? "index, follow, max-image-preview:large" : "noindex, follow"}" />
<link rel="canonical" href="${escapeAttr(canonical)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Smart Printing Packaging" />
<meta property="og:locale" content="bn_BD" />
<meta property="og:title" content="${escapeAttr(title)}" />
<meta property="og:description" content="${escapeAttr(description)}" />
<meta property="og:url" content="${escapeAttr(canonical)}" />
${page.ogImage ? `<meta property="og:image" content="${escapeAttr(page.ogImage)}" />` : ""}
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/favicon.png" type="image/png" sizes="192x192" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Noto+Sans+Bengali:wght@400;600;700;800&display=swap" rel="stylesheet" />
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
<style>${styles}</style>
</head>
<body>
<header class="lp-head">
  <div class="lp-bar">
    <a class="brand" href="/">
      <img src="/brand-logo.png" alt="Smart Printing Packaging" width="34" height="34" />
      <span>Smart Printing Packaging</span>
    </a>
    <a class="btn btn-sm" href="${escapeAttr(waLink(settings.contact.whatsappNumber))}" target="_blank" rel="noopener noreferrer">WhatsApp: ${escapeHtml(settings.contact.whatsappDisplay)}</a>
  </div>
</header>
<main>
${body}
</main>
<footer class="lp-foot">
  <div class="wrap">
    <p style="margin:0 0 6px"><strong style="color:#fff">Smart Printing Packaging</strong></p>
    <p style="margin:0 0 6px">১০১ কে পি ঘোষ রোড, আরমানীটোলা, বংশাল, ঢাকা-১১০০</p>
    <p style="margin:0">ফোন: <a href="tel:${escapeAttr(settings.contact.phoneDial)}">${escapeHtml(settings.contact.phoneDisplay)}</a> · WhatsApp: <a href="${escapeAttr(waLink(settings.contact.whatsappNumber))}" target="_blank" rel="noopener noreferrer">${escapeHtml(settings.contact.whatsappDisplay)}</a> · <a href="/">সাইটে ফিরে যান</a></p>
  </div>
</footer>
<a class="lp-wa" href="${escapeAttr(waLink(settings.contact.whatsappNumber))}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp-এ যোগাযোগ করুন">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.86 1.21 3.06c.15.2 2.09 3.34 5.06 4.55 2.06.84 2.86.91 3.89.77.62-.09 1.26-.52 1.44-1.02.18-.5.18-.92.13-1.01-.06-.1-.23-.16-.53-.31zM12.04 21.5c-1.63 0-3.23-.44-4.62-1.27l-.33-.2-3.44.9.92-3.35-.22-.35a9.44 9.44 0 0 1-1.45-5.04c0-5.22 4.25-9.47 9.47-9.47 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46z"/></svg>
</a>
</body>
</html>`;
}

export { escapeHtml };
