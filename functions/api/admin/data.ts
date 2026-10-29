import { requireAdmin } from "../../_lib/auth";
import { getAdminData } from "../../_lib/catalog";
import { database } from "../../_lib/db";
import type { RequestContext } from "../../_lib/env";
import { handle, json } from "../../_lib/http";

/** GET /api/admin/data — everything the admin panel needs in one request. */
export const onRequestGet = (context: RequestContext) =>
  handle(async () => {
    await requireAdmin(context.env, context.request);
    const data = await getAdminData(database(context.env));
    return json(data);
  });
