import { requireAdmin } from "../../_lib/auth";
import { bumpVersion, mapLandingPage } from "../../_lib/catalog";
import { database } from "../../_lib/db";
import type { RequestContext } from "../../_lib/env";
import {
  HttpError,
  assertSameOrigin,
  handle,
  json,
  readJson,
  requireMethod,
} from "../../_lib/http";
import { normalizeLanding } from "../../_lib/payload";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** POST /api/admin/landing — create a landing page. */
export const onRequestPost = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["POST"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const body = await readJson<any>(context.request);
    const input = normalizeLanding(body);
    if (!input.slug) throw new HttpError(400, "slug আবশ্যক।");
    try {
      const rows = await sql`
        insert into landing_pages
          (slug, title, seo_title, seo_description, og_image, blocks, theme,
           is_published, indexable, show_in_nav)
        values
          (${input.slug}, ${input.title}, ${input.seoTitle}, ${input.seoDescription},
           ${input.ogImage}, ${JSON.stringify(input.blocks)}::jsonb,
           ${JSON.stringify(input.theme)}::jsonb, ${input.isPublished},
           ${input.indexable}, ${input.showInNav})
        returning *
      `;
      await bumpVersion(sql);
      return json({ landingPage: mapLandingPage(rows[0]) }, 201);
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new HttpError(409, "এই slug দিয়ে আগেই একটি ল্যান্ডিং পেজ আছে।");
      }
      throw error;
    }
  });
