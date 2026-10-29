import { requireAdmin } from "../../_lib/auth";
import type { RequestContext } from "../../_lib/env";
import {
  HttpError,
  assertSameOrigin,
  handle,
  json,
  requireMethod,
} from "../../_lib/http";

/**
 * POST /api/admin/publish — trigger a Cloudflare Pages deploy hook so new
 * landing pages land in the sitemap and any static content is rebuilt.
 */
export const onRequestPost = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["POST"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);
    const hook = context.env.DEPLOY_HOOK_URL;
    if (!hook) {
      throw new HttpError(
        400,
        "DEPLOY_HOOK_URL সেট করা নেই। Cloudflare Pages → Settings → Builds & deployments → Deploy hook তৈরি করে Environment variables-এ যোগ করুন।",
      );
    }
    const response = await fetch(hook, { method: "POST" });
    if (!response.ok) {
      throw new HttpError(502, "ডিপ্লয় হুক সফল হয়নি।");
    }
    return json({ ok: true, message: "নতুন ডিপ্লয় শুরু হয়েছে।" });
  });
