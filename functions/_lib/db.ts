import { neon } from "@neondatabase/serverless";
import type { Env } from "./env";
import { HttpError } from "./http";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Row = Record<string, any>;

/** Typed shape of the Neon HTTP client used across the API. */
export interface Sql {
  (strings: TemplateStringsArray, ...values: any[]): Promise<Row[]>;
  query(text: string, params?: any[]): Promise<Row[]>;
}

let cached: { url: string; sql: Sql } | null = null;

/** Reuse the Neon client inside a Worker isolate. */
export function database(env: Env): Sql {
  const url = env.DATABASE_URL;
  if (!url) {
    throw new HttpError(
      503,
      "ডেটাবেজ কনফিগার করা হয়নি (DATABASE_URL)। Cloudflare Pages-এর Environment variables দেখুন।",
    );
  }
  if (!cached || cached.url !== url) {
    cached = { url, sql: neon(url) as unknown as Sql };
  }
  return cached.sql;
}

export function hasDatabase(env: Env): boolean {
  return Boolean(env.DATABASE_URL);
}

/** Postgres timestamps arrive as strings or Date objects depending on driver. */
export function toIso(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}
