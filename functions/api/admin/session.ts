import { clearedCookie, logout, sessionFromRequest } from "../../_lib/auth";
import type { RequestContext } from "../../_lib/env";
import { assertSameOrigin, handle, json } from "../../_lib/http";

/** GET /api/admin/session — is the current visitor logged in? */
export const onRequestGet = (context: RequestContext) =>
  handle(async () => {
    const session = await sessionFromRequest(context.env, context.request);
    if (!session) return json({ session: null }, 401);
    return json({
      session: { email: session.email, name: session.name, expiresAt: session.expiresAt },
    });
  });

/** DELETE /api/admin/session — log out. */
export const onRequestDelete = (context: RequestContext) =>
  handle(async () => {
    assertSameOrigin(context.request);
    await logout(context.env, context.request);
    return json({ ok: true }, 200, { "set-cookie": clearedCookie() });
  });
