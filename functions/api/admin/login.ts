import { login, sessionCookie } from "../../_lib/auth";
import type { RequestContext } from "../../_lib/env";
import {
  HttpError,
  assertSameOrigin,
  handle,
  json,
  readJson,
  requireMethod,
} from "../../_lib/http";

/** Very small per-isolate throttle; Cloudflare Access should be the real gate. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function guard(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    throw new HttpError(
      429,
      "অনেকবার ভুল চেষ্টা হয়েছে। ১০ মিনিট পরে আবার চেষ্টা করুন।",
    );
  }
  if (!entry || entry.resetAt <= now) {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
  }
}

function recordFailure(ip: string): void {
  const entry = attempts.get(ip);
  if (entry) entry.count += 1;
  else attempts.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
}

export const onRequestPost = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["POST"]);
    assertSameOrigin(context.request);
    const ip =
      context.request.headers.get("cf-connecting-ip") || "unknown";
    guard(ip);

    const body = await readJson<{ email?: string; password?: string }>(
      context.request,
    );
    const email = (body.email || "").trim();
    const password = body.password || "";
    if (!email || !password) {
      throw new HttpError(400, "ইমেইল ও পাসওয়ার্ড দিন।");
    }

    try {
      const { token, user } = await login(context.env, context.request, email, password);
      attempts.delete(ip);
      return json(
        { user: { email: user.email, name: user.name } },
        200,
        { "set-cookie": sessionCookie(token) },
      );
    } catch (error) {
      recordFailure(ip);
      throw error;
    }
  });
