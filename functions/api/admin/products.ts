import { requireAdmin } from "../../_lib/auth";
import { bumpVersion, mapProduct } from "../../_lib/catalog";
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
import { normalizeProduct } from "../../_lib/payload";

/* eslint-disable @typescript-eslint/no-explicit-any */

function fallbackSlug(nameEn: string | null, nameBn: string): string {
  const base = (nameEn || nameBn)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base && /^[a-z0-9-]+$/.test(base)
    ? `${base.slice(0, 60)}`
    : `product-${Date.now().toString(36)}`;
}

/** POST /api/admin/products — create a product. */
export const onRequestPost = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["POST"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const body = await readJson<any>(context.request);
    const input = normalizeProduct(body);
    if (!input.slug) input.slug = fallbackSlug(input.nameEn, input.nameBn);

    try {
      const rows = await sql`
        insert into products
          (category_id, slug, name_bn, name_en, price, price_max, price_unit,
           price_note, min_order, size_label, image_url, gallery, description,
           badge, wa_message, service_id, is_active, is_featured, sort_order)
        values
          (${input.categoryId}, ${input.slug}, ${input.nameBn}, ${input.nameEn},
           ${input.price}, ${input.priceMax}, ${input.priceUnit},
           ${input.priceNote}, ${input.minOrder}, ${input.sizeLabel},
           ${input.imageUrl}, ${JSON.stringify(input.gallery)}::jsonb,
           ${input.description}, ${input.badge}, ${input.waMessage},
           ${input.serviceId}, ${input.isActive}, ${input.isFeatured},
           ${input.sortOrder})
        returning *
      `;
      await bumpVersion(sql);
      const row = rows[0];
      const category = input.categoryId
        ? (await sql`select slug from categories where id = ${input.categoryId}`)[0]
        : undefined;
      return json(
        { product: mapProduct({ ...row, category_slug: category?.slug ?? null }) },
        201,
      );
    } catch (error: any) {
      if (error?.code === "23505") {
        throw new HttpError(409, "এই slug দিয়ে আগেই একটি প্রোডাক্ট আছে।");
      }
      throw error;
    }
  });

/**
 * PUT /api/admin/products — bulk price adjustment.
 * Body: { mode: "percent" | "amount", value: number,
 *         ids?: string[], categoryId?: number | null, serviceId?: string, scope?: "all" }
 */
export const onRequestPut = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["PUT"]);
    assertSameOrigin(context.request);
    const admin = await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const body = await readJson<any>(context.request);

    const mode = body.mode === "amount" ? "amount" : "percent";
    const value = Number(body.value);
    if (!Number.isFinite(value) || value === 0 || Math.abs(value) > 100_000) {
      throw new HttpError(400, "পরিবর্তনের পরিমাণ সঠিক নয়।");
    }

    const ids: string[] = Array.isArray(body.ids) ? body.ids.map(String) : [];
    const scopeAll = body.scope === "all";
    if (!ids.length && !scopeAll && body.categoryId === undefined) {
      throw new HttpError(
        400,
        "কোন প্রোডাক্টে দাম বদলাবে তা বেছে নিন (ids, categoryId অথবা scope=all)।",
      );
    }

    let products: any[];
    if (ids.length) {
      products = (await sql`
        select id, price, price_max from products where id::text = any(${ids}::text[])
      `) as any[];
    } else if (body.categoryId !== undefined && body.categoryId !== null) {
      products = (await sql`
        select id, price, price_max from products where category_id = ${Number(body.categoryId)}
      `) as any[];
    } else {
      products = (await sql`select id, price, price_max from products`) as any[];
    }

    const adjust = (input: number) => {
      const next =
        mode === "percent" ? input * (1 + value / 100) : input + value;
      return Math.max(1, Math.round(next));
    };

    let changed = 0;
    for (const product of products) {
      if (product.price === null && product.price_max === null) continue;
      const oldPrice = product.price === null ? null : Number(product.price);
      const oldMax = product.price_max === null ? null : Number(product.price_max);
      const newPrice = oldPrice === null ? null : adjust(oldPrice);
      const newMax = oldMax === null ? null : Math.max(newPrice ?? 0, adjust(oldMax));
      if (newPrice === oldPrice && newMax === oldMax) continue;
      await sql`
        update products
        set price = ${newPrice}, price_max = ${newMax}, updated_at = now()
        where id = ${product.id}
      `;
      await sql`
        insert into price_history (product_id, old_price, new_price, changed_by)
        values (${product.id}, ${oldPrice}, ${newPrice}, ${admin.email})
      `;
      changed += 1;
    }

    await bumpVersion(sql);
    return json({ changed, total: products.length });
  });
