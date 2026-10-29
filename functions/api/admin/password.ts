import { changePassword, clearedCookie, requireAdmin } from "../../_lib/auth";
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
import { assertStrongPassword, hashPassword } from "../../_lib/password";

/**
 * POST /api/admin/password — change the admin password.
 * All sessions are revoked, so the admin has to log in again.
 */
export const onRequestPost = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["POST"]);
    assertSameOrigin(context.request);
    const admin = await requireAdmin(context.env, context.request);
    const body = await readJson<{ currentPassword?: string; newPassword?: string }>(
      context.request,
    );
    if (!body.currentPassword) {
      throw new HttpError(400, "বর্তমান পাসওয়ার্ড দিন।");
    }
    const newPassword = assertStrongPassword(body.newPassword);
    const sql = database(context.env);
    await changePassword(
      sql,
      admin.id,
      body.currentPassword,
      await hashPassword(newPassword),
    );
    return json(
      { ok: true, message: "পাসওয়ার্ড বদলানো হয়েছে। আবার লগইন করুন।" },
      200,
      { "set-cookie": clearedCookie() },
    );
  });
