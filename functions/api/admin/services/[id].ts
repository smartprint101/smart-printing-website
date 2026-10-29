import { requireAdmin } from "../../../_lib/auth";
import { bumpVersion, mapServiceOverride } from "../../../_lib/catalog";
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
import {
  bool,
  optionalInt,
  optionalText,
} from "../../../_lib/payload";

/* eslint-disable @typescript-eslint/no-explicit-any */

const KNOWN_SERVICES = new Set([
  "cylinder",
  "ld-packet",
  "foil-packet",
  "sticker",
  "art-paper",
  "custom-box",
  "ready-made",
  "security-poly",
  "offset",
  "other",
]);

/** PUT /api/admin/services/:id — edit the price/summary of a service page. */
export const onRequestPut = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["PUT"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const serviceId = context.params.id;
    if (!KNOWN_SERVICES.has(serviceId)) {
      throw new HttpError(404, "অজানা সার্ভিস।");
    }
    const sql = database(context.env);
    const body = await readJson<any>(context.request);

    const facts = Array.isArray(body.facts)
      ? body.facts
          .filter(
            (fact: any) =>
              fact && typeof fact.label === "string" && typeof fact.value === "string",
          )
          .slice(0, 8)
          .map((fact: any) => ({
            label: String(fact.label).slice(0, 60),
            value: String(fact.value).slice(0, 120),
          }))
      : null;

    const rows = await sql`
      insert into service_overrides
        (service_id, title, short_summary, approx, approx_label, facts, note,
         is_active, sort_order, updated_at)
      values
        (${serviceId}, ${optionalText(body.title, "টাইটেল", 160)},
         ${optionalText(body.shortSummary, "সংক্ষিপ্ত বিবরণ", 400)},
         ${optionalText(body.approx, "দাম", 120)},
         ${optionalText(body.approxLabel, "দামের লেবেল", 60)},
         ${facts ? JSON.stringify(facts) : null}::jsonb,
         ${optionalText(body.note, "নোট", 600)},
         ${bool(body.isActive, true)}, ${optionalInt(body.sortOrder, 0)},
         now())
      on conflict (service_id) do update set
        title = excluded.title,
        short_summary = excluded.short_summary,
        approx = excluded.approx,
        approx_label = excluded.approx_label,
        facts = excluded.facts,
        note = excluded.note,
        is_active = excluded.is_active,
        sort_order = excluded.sort_order,
        updated_at = now()
      returning *
    `;
    await bumpVersion(sql);
    return json({ service: mapServiceOverride(rows[0]) });
  });
