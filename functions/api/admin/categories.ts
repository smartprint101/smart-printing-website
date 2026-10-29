import { requireAdmin } from "../../_lib/auth";
import { bumpVersion, mapCategory } from "../../_lib/catalog";
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
import { normalizeCategory } from "../../_lib/payload";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** POST /api/admin/categories — create a category. */
export const onRequestPost = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["POST"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const body = await readJson<any>(context.request);
    const input = normalizeCategory(body);
    if (!input.slug) throw new HttpError(400, "slug আবশ্যক।");
    try {
      const rows = await sql`
        insert into categories
          (slug, title_bn, title_en, description, grp, sort_order, is_active)
        values
          (${input.slug}, ${input.titleBn}, ${input.titleEn}, ${input.description},
           ${input.group}, ${input.sortOrder}, ${input.isActive})
        returning *
      `;
      await bumpVersion(sql);
      return json({ category: mapCategory(rows[0]) }, 201);
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new HttpError(409, "এই slug দিয়ে আগেই একটি ক্যাটাগরি আছে।");
      }
      throw error;
    }
  });
