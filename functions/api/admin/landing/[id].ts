import { requireAdmin } from "../../../_lib/auth";
import { bumpVersion, mapLandingPage } from "../../../_lib/catalog";
import { database } from "../../../_lib/db";
import type { RequestContext } from "../../../_lib/env";
import {
  HttpError,
  assertSameOrigin,
  handle,
  json,
  readJson,
  requireMethod,
} from "../../../_lib/http";
import { normalizeLanding } from "../../../_lib/payload";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function findPage(sql: any, id: string) {
  const rows = await sql`select * from landing_pages where id::text = ${id} limit 1`;
  return rows[0] ? mapLandingPage(rows[0]) : null;
}

/** PATCH /api/admin/landing/:id — save title, blocks, HTML, publish state. */
export const onRequestPatch = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["PATCH"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const existing = await findPage(sql, context.params.id);
    if (!existing) throw new HttpError(404, "ল্যান্ডিং পেজ পাওয়া যায়নি।");
    const input = normalizeLanding(
      await readJson<any>(context.request),
      existing,
    );
    try {
      const rows = await sql`
        update landing_pages set
          slug = ${input.slug},
          title = ${input.title},
          seo_title = ${input.seoTitle},
          seo_description = ${input.seoDescription},
          og_image = ${input.ogImage},
          blocks = ${JSON.stringify(input.blocks)}::jsonb,
          theme = ${JSON.stringify(input.theme)}::jsonb,
          is_published = ${input.isPublished},
          indexable = ${input.indexable},
          show_in_nav = ${input.showInNav},
          updated_at = now()
        where id::text = ${context.params.id}
        returning *
      `;
      await bumpVersion(sql);
      return json({ landingPage: mapLandingPage(rows[0]) });
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new HttpError(409, "এই slug দিয়ে আগেই একটি ল্যান্ডিং পেজ আছে।");
      }
      throw error;
    }
  });

/** DELETE /api/admin/landing/:id */
export const onRequestDelete = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["DELETE"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const rows = await sql`
      delete from landing_pages where id::text = ${context.params.id} returning id
    `;
    if (!rows.length) throw new HttpError(404, "ল্যান্ডিং পেজ পাওয়া যায়নি।");
    await bumpVersion(sql);
    return json({ ok: true });
  });
