import { requireAdmin } from "../../_lib/auth";
import {
  bumpVersion,
  getSettingsRows,
  mapSettings,
  saveSetting,
} from "../../_lib/catalog";
import { database } from "../../_lib/db";
import type { RequestContext } from "../../_lib/env";
import {
  assertSameOrigin,
  handle,
  json,
  readJson,
  requireMethod,
} from "../../_lib/http";
import { normalizeSettings } from "../../_lib/payload";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** PUT /api/admin/settings — contact details, announcement, calculator rates. */
export const onRequestPut = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["PUT"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const sql = database(context.env);
    const current = mapSettings(await getSettingsRows(sql));
    const input = normalizeSettings(
      await readJson<any>(context.request),
      current,
    );
    await saveSetting(sql, "contact", input.contact);
    await saveSetting(sql, "announcement", input.announcement);
    await saveSetting(sql, "estimator", input.estimator);
    await bumpVersion(sql);
    return json({ settings: input });
  });
