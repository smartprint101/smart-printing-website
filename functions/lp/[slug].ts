import { getLandingPageBySlug, getSettingsRows, mapProduct, mapSettings } from "../_lib/catalog";
import { database, hasDatabase } from "../_lib/db";
import type { RequestContext } from "../_lib/env";
import { renderLandingPage } from "../_lib/render-landing";

const SITE_URL = "https://smartpackagingbd.com";

const notFound = (message: string) =>
  new Response(
    `<!doctype html><html lang="bn"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, follow" />
<title>পেজটি পাওয়া যায়নি | Smart Printing Packaging</title>
<style>body{font-family:system-ui,sans-serif;background:#f6f4ee;color:#142a5e;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center}a{color:#142a5e}</style>
</head><body><div><h1>পেজটি পাওয়া যায়নি</h1><p>${message}</p><p><a href="/">সাইটে ফিরে যান</a></p></div></body></html>`,
    {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex",
      },
    },
  );

/** GET /lp/:slug/ — server-rendered landing page built in the admin panel. */
export const onRequestGet = async ({ params, env, request }: RequestContext) => {
  const slug = String(params.slug || "").toLowerCase();
  if (!/^[a-z0-9-]{2,90}$/.test(slug)) {
    return notFound("লিংকটি সঠিক নয়।");
  }
  if (!hasDatabase(env)) {
    return notFound("ডেটাবেজ কনফিগার করা হয়নি।");
  }
  const sql = database(env);
  try {
    const page = await getLandingPageBySlug(sql, slug);
    if (!page || !page.isPublished) {
      return notFound("এই ল্যান্ডিং পেজটি নেই অথবা এখনো প্রকাশ করা হয়নি।");
    }
    const [productRows, settingsRows] = await Promise.all([
      sql`
        select p.*, c.slug as category_slug
        from products p
        left join categories c on c.id = p.category_id
        where p.is_active = true
        order by p.sort_order
      `,
      getSettingsRows(sql),
    ]);
    const origin = env.SITE_URL || new URL(request.url).origin || SITE_URL;
    const html = renderLandingPage(
      page,
      (productRows as Record<string, unknown>[]).map(mapProduct),
      mapSettings(settingsRows as Record<string, unknown>[]),
      origin.replace(/\/+$/, "") || SITE_URL,
    );
    const etag = `W/"${page.updatedAt || "1"}-${page.slug}"`;
    if (request.headers.get("if-none-match") === etag) {
      return new Response(null, { status: 304, headers: { etag } });
    }
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        etag,
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    console.error("landing page error", error);
    return notFound("পেজটি লোড করা যায়নি। কিছুক্ষণ পরে চেষ্টা করুন।");
  }
};
