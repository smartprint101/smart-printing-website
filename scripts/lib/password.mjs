import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Password hashing for the admin panel.
 *
 * Format: pbkdf2_sha256$<iterations>$<salt base64>$<hash base64>
 * The Cloudflare Functions verify this with Web Crypto — see
 * `functions/_lib/password.ts`. Keep both flavours in sync.
 */

export const ITERATIONS = 210_000;
const KEY_LENGTH = 32;

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, "sha256");
  return [
    "pbkdf2_sha256",
    String(ITERATIONS),
    salt.toString("base64"),
    hash.toString("base64"),
  ].join("$");
}

export function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256") return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations < 10_000) return false;
  const salt = Buffer.from(parts[2], "base64");
  const expected = Buffer.from(parts[3], "base64");
  const actual = pbkdf2Sync(password, salt, iterations, expected.length, "sha256");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Minimum password policy shared with the API and the admin UI. */
export function assertStrongPassword(password) {
  if (typeof password !== "string" || password.length < 10) {
    throw new Error("পাসওয়ার্ড কমপক্ষে ১০ অক্ষরের হতে হবে।");
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new Error("পাসওয়ার্ডে অন্তত একটি অক্ষর ও একটি সংখ্যা থাকতে হবে।");
  }
  return password;
}
