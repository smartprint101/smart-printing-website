import type { AdminSession } from "../../shared/types";
import type { Sql } from "./db";
import { database } from "./db";
import type { Env } from "./env";
import { HttpError } from "./http";
import { randomToken, sha256Hex, verifyPassword } from "./password";

export const SESSION_COOKIE = "sp_admin";
const SESSION_DAYS = 7;
const SESSION_SECONDS = SESSION_DAYS * 24 * 60 * 60;

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

function cookieAttributes(maxAge: number): string {
  return `Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; ${cookieAttributes(SESSION_SECONDS)}`;
}

export function clearedCookie(): string {
  return `${SESSION_COOKIE}=; ${cookieAttributes(0)}`;
}

export function parseCookies(request: Request): Record<string, string> {
  const header = request.headers.get("cookie");
  if (!header) return {};
  const cookies: Record<string, string> = {};
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    cookies[part.slice(0, index).trim()] = part.slice(index + 1).trim();
  }
  return cookies;
}

export async function login(
  env: Env,
  request: Request,
  email: string,
  password: string,
): Promise<{ token: string; user: AdminUser }> {
  const sql = database(env);
  const rows = await sql`
    select id, email, name, password_hash
    from admin_users
    where lower(email) = ${email.trim().toLowerCase()}
    limit 1
  `;
  const user = rows[0];
  // Always run a verification to keep the response time similar.
  const valid = await verifyPassword(
    password,
    user?.password_hash ||
      "pbkdf2_sha256$210000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
  );
  if (!user || !valid) {
    throw new HttpError(401, "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
  }

  const token = randomToken(32);
  const tokenHash = await sha256Hex(token);
  await sql`delete from sessions where expires_at < now()`;
  await sql`
    insert into sessions (token_hash, user_id, expires_at, user_agent)
    values (${tokenHash}, ${user.id}, now() + make_interval(days => ${SESSION_DAYS}),
            ${request.headers.get("user-agent")?.slice(0, 300) ?? null})
  `;
  await sql`update admin_users set last_login_at = now() where id = ${user.id}`;
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name ?? null },
  };
}

export async function sessionFromRequest(
  env: Env,
  request: Request,
): Promise<(AdminSession & { id: string }) | null> {
  if (!env.DATABASE_URL) return null;
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return null;
  const sql = database(env);
  const tokenHash = await sha256Hex(token);
  const rows = await sql`
    select u.id, u.email, u.name, s.expires_at
    from sessions s
    join admin_users u on u.id = s.user_id
    where s.token_hash = ${tokenHash} and s.expires_at > now()
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? null,
    expiresAt: new Date(row.expires_at).toISOString(),
  };
}

export async function requireAdmin(
  env: Env,
  request: Request,
): Promise<AdminSession & { id: string }> {
  const session = await sessionFromRequest(env, request);
  if (!session) {
    throw new HttpError(401, "লগইন প্রয়োজন।");
  }
  return session;
}

export async function logout(env: Env, request: Request): Promise<void> {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token || !env.DATABASE_URL) return;
  const sql = database(env);
  await sql`delete from sessions where token_hash = ${await sha256Hex(token)}`;
}

export async function changePassword(
  sql: Sql,
  userId: string,
  currentPassword: string,
  newPasswordHash: string,
): Promise<void> {
  const rows = await sql`select password_hash from admin_users where id = ${userId}`;
  const stored = rows[0]?.password_hash;
  if (!stored || !(await verifyPassword(currentPassword, stored))) {
    throw new HttpError(400, "বর্তমান পাসওয়ার্ড সঠিক নয়।");
  }
  await sql`
    update admin_users set password_hash = ${newPasswordHash} where id = ${userId}
  `;
  await sql`delete from sessions where user_id = ${userId}`;
}
