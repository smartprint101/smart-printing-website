import { requireAdmin } from "../../../_lib/auth";
import { bumpVersion, mapProduct } from "../../../_lib/catalog";
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
import { normalizeProduct } from "../../../_lib/payload";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function loadRow(sql: any, id: string) {
  const rows = await sql`
    select p.*, c.slug as category_slug
    from products p
    left join categories c on c.id = p.category_id
    where p.id::text = ${id}
    limit 1
  `;
  return rows[0];
}

/** PATCH /api/admin/products/:id — update a product (price, image, text…). */
export const onRequestPatch = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["PATCH"]);
    assertSameOrigin(context.request);
    const admin = await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const id = context.params.id;
    const existingRow = await loadRow(sql, id);
    if (!existingRow) throw new HttpError(404, "প্রোডাক্ট পাওয়া যায়নি।");

    const body = await readJson<any>(context.request);
    const input = normalizeProduct(body, mapProduct(existingRow));
    if (!input.slug) {
      throw new HttpError(400, "slug আবশ্যক।");
    }

    try {
      await sql`
        update products set
          category_id = ${input.categoryId},
          slug = ${input.slug},
          name_bn = ${input.nameBn},
          name_en = ${input.nameEn},
          price = ${input.price},
          price_max = ${input.priceMax},
          price_unit = ${input.priceUnit},
          price_note = ${input.priceNote},
          min_order = ${input.minOrder},
          size_label = ${input.sizeLabel},
          image_url = ${input.imageUrl},
          gallery = ${JSON.stringify(input.gallery)}::jsonb,
          description = ${input.description},
          badge = ${input.badge},
          wa_message = ${input.waMessage},
          service_id = ${input.serviceId},
          is_active = ${input.isActive},
          is_featured = ${input.isFeatured},
          sort_order = ${input.sortOrder},
          updated_at = now()
        where id::text = ${id}
      `;
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new HttpError(409, "এই slug দিয়ে আগেই একটি প্রোডাক্ট আছে।");
      }
      throw error;
    }

    const oldPrice =
      existingRow.price === null ? null : Number(existingRow.price);
    if (oldPrice !== input.price) {
      await sql`
        insert into price_history (product_id, old_price, new_price, changed_by)
        values (${id}::uuid, ${oldPrice}, ${input.price}, ${admin.email})
      `;
    }

    await bumpVersion(sql);
    return json({ product: mapProduct(await loadRow(sql, id)) });
  });

/** DELETE /api/admin/products/:id */
export const onRequestDelete = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["DELETE"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const rows = await sql`
      delete from products where id::text = ${context.params.id} returning id
    `;
    if (!rows.length) throw new HttpError(404, "প্রোডাক্ট পাওয়া যায়নি।");
    await bumpVersion(sql);
    return json({ ok: true });
  });
