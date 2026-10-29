import { requireAdmin } from "../../../_lib/auth";
import { bumpVersion, mapCategory } from "../../../_lib/catalog";
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
import { normalizeCategory } from "../../../_lib/payload";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** PATCH /api/admin/categories/:id */
export const onRequestPatch = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["PATCH"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const id = Number(context.params.id);
    if (!Number.isFinite(id)) throw new HttpError(400, "আইডি সঠিক নয়।");
    const rows = await sql`select * from categories where id = ${id} limit 1`;
    if (!rows.length) throw new HttpError(404, "ক্যাটাগরি পাওয়া যায়নি।");
    const input = normalizeCategory(
      await readJson<any>(context.request),
      mapCategory(rows[0]),
    );
    const updated = await sql`
      update categories set
        slug = ${input.slug},
        title_bn = ${input.titleBn},
        title_en = ${input.titleEn},
        description = ${input.description},
        grp = ${input.group},
        sort_order = ${input.sortOrder},
        is_active = ${input.isActive},
        updated_at = now()
      where id = ${id}
      returning *
    `;
    await bumpVersion(sql);
    return json({ category: mapCategory(updated[0]) });
  });

/** DELETE /api/admin/categories/:id — products keep existing but lose the category. */
export const onRequestDelete = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["DELETE"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const id = Number(context.params.id);
    const rows = await sql`delete from categories where id = ${id} returning id`;
    if (!rows.length) throw new HttpError(404, "ক্যাটাগরি পাওয়া যায়নি।");
    await bumpVersion(sql);
    return json({ ok: true });
  });
