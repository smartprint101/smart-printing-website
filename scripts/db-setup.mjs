#!/usr/bin/env node
/**
 * One-time (and repeatable) Neon setup for the admin panel.
 *
 *   npm run db:setup                       # needs .env with DATABASE_URL
 *   ADMIN_PASSWORD='StrongPass123' npm run db:setup
 *   npm run db:setup -- --password='StrongPass123' --email=you@example.com
 *
 * Creates every table, seeds the default catalog and creates/updates the
 * admin user. Safe to re-run: existing rows and prices are never overwritten.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { neon } from "@neondatabase/serverless";
import { hashPassword, assertStrongPassword } from "./lib/password.mjs";

const root = path.resolve(import.meta.dirname, "..");

/** Minimal .env / .dev.vars reader (no extra dependency). */
async function loadEnvFile(file) {
  if (!existsSync(file)) return;
  const text = await readFile(file, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

for (const file of [".env", ".env.local", ".dev.vars"]) {
  await loadEnvFile(path.join(root, file));
}

const args = new Map(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...rest] = arg.replace(/^--/, "").split("=");
      return [key, rest.join("=") || "true"];
    }),
);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "DATABASE_URL পাওয়া যায়নি। Neon-এর connection string .env ফাইলে দিন:\n" +
      '  DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"',
  );
  process.exit(1);
}

const email = (args.get("email") || process.env.ADMIN_EMAIL || "admin@smartpackagingbd.com")
  .trim()
  .toLowerCase();
const password = args.get("password") || process.env.ADMIN_PASSWORD || "";
const adminName = process.env.ADMIN_NAME || "Smart Printing Admin";

const sql = neon(databaseUrl);

console.log("→ Neon-এ টেবিল তৈরি করা হচ্ছে…");
const schema = await readFile(path.join(root, "db", "schema.sql"), "utf8");
for (const statement of schema.split(/;\s*(?:\r?\n|$)/)) {
  const query = statement.trim();
  if (!query) continue;
  await sql.query(query);
}

console.log("→ ডিফল্ট ক্যাটাগরি ও প্রোডাক্ট সিড করা হচ্ছে…");
const seed = JSON.parse(
  await readFile(path.join(root, "data", "seed", "catalog.json"), "utf8"),
);

for (const category of seed.categories) {
  await sql`
    insert into categories (slug, title_bn, title_en, grp, sort_order)
    values (${category.slug}, ${category.titleBn}, ${category.titleEn ?? null},
            ${category.group}, ${category.sortOrder})
    on conflict (slug) do nothing
  `;
}

const categories = await sql`select id, slug from categories`;
const categoryId = new Map(categories.map((row) => [row.slug, row.id]));

for (const product of seed.products) {
  await sql`
    insert into products
      (category_id, slug, name_bn, name_en, price, price_max, price_unit,
       min_order, size_label, service_id, is_featured, sort_order, badge)
    values
      (${categoryId.get(product.categorySlug) ?? null}, ${product.slug},
       ${product.nameBn}, ${product.nameEn ?? null}, ${product.price},
       ${product.priceMax ?? null}, ${product.priceUnit},
       ${product.minOrder ?? null}, ${product.sizeLabel ?? null},
       ${product.serviceId ?? null}, ${Boolean(product.isFeatured)},
       ${product.sortOrder}, 'READY-MADE')
    on conflict (slug) do nothing
  `;
}

console.log("→ সাইট সেটিংস…");
for (const [key, value] of Object.entries(seed.settings)) {
  await sql`
    insert into site_settings (key, value)
    values (${key}, ${JSON.stringify(value)}::jsonb)
    on conflict (key) do nothing
  `;
}
await sql`
  insert into site_settings (key, value)
  values ('seeded', 'true'::jsonb)
  on conflict (key) do update set value = 'true'::jsonb, updated_at = now()
`;

console.log("→ অ্যাডমিন ইউজার…");
const existing = await sql`select id from admin_users where email = ${email}`;
if (existing.length === 0) {
  if (!password) {
    console.error(
      `অ্যাডমিন ইউজার ${email} নেই। পাসওয়ার্ড দিয়ে আবার চালান:\n` +
        "  ADMIN_PASSWORD='কমপক্ষে-১০-অক্ষর-ও-একটি-সংখ্যা' npm run db:setup",
    );
    process.exit(1);
  }
  assertStrongPassword(password);
  await sql`
    insert into admin_users (email, name, password_hash)
    values (${email}, ${adminName}, ${hashPassword(password)})
  `;
  console.log(`   ✓ অ্যাডমিন তৈরি হয়েছে: ${email}`);
} else if (password) {
  assertStrongPassword(password);
  await sql`
    update admin_users
    set password_hash = ${hashPassword(password)}, name = ${adminName}
    where email = ${email}
  `;
  await sql`delete from sessions where user_id = ${existing[0].id}`;
  console.log(`   ✓ পাসওয়ার্ড আপডেট হয়েছে: ${email}`);
} else {
  console.log(`   • অ্যাডমিন আগেই আছে: ${email} (পাসওয়ার্ড অপরিবর্তিত)`);
}

const [{ count: productCount }] = await sql`select count(*)::int as count from products`;
const [{ count: categoryCount }] = await sql`select count(*)::int as count from categories`;
console.log(
  `\n✓ Neon সেটআপ সম্পন্ন — ${categoryCount}টি ক্যাটাগরি, ${productCount}টি প্রোডাক্ট।\n` +
    "এবার Cloudflare Pages-এ DATABASE_URL যোগ করে ডিপ্লয় করুন, তারপর /admin/ এ লগইন করুন।",
);
