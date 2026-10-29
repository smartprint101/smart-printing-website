import seed from "../../data/seed/catalog.json";
import type {
  AdminData,
  Category,
  LandingPage,
  Product,
  PublicCatalog,
  ServiceOverride,
  SiteSettings,
} from "../../shared/types";
import { toIso, type Sql } from "./db";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

export const SEED_SETTINGS: SiteSettings = {
  contact: { ...(seed.settings.contact as SiteSettings["contact"]) },
  announcement: seed.settings.announcement,
  estimator: { ...(seed.settings.estimator as SiteSettings["estimator"]) },
};

/* -------------------------------- mappers -------------------------------- */

export function mapCategory(row: Row): Category {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    titleBn: String(row.title_bn),
    titleEn: row.title_en ?? null,
    description: row.description ?? null,
    group: row.grp === "extra" ? "extra" : "readymade",
    sortOrder: Number(row.sort_order ?? 0),
    isActive: row.is_active !== false,
  };
}

export function mapProduct(row: Row): Product {
  return {
    id: String(row.id),
    categoryId: row.category_id === null ? null : Number(row.category_id),
    categorySlug: row.category_slug ?? null,
    slug: String(row.slug),
    nameBn: String(row.name_bn),
    nameEn: row.name_en ?? null,
    price: row.price === null ? null : Number(row.price),
    priceMax: row.price_max === null ? null : Number(row.price_max),
    priceUnit: row.price_unit ?? "kg",
    priceNote: row.price_note ?? null,
    minOrder: row.min_order ?? null,
    sizeLabel: row.size_label ?? null,
    imageUrl: row.image_url ?? null,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    description: row.description ?? null,
    badge: row.badge ?? null,
    waMessage: row.wa_message ?? null,
    serviceId: row.service_id ?? null,
    isActive: row.is_active !== false,
    isFeatured: Boolean(row.is_featured),
    sortOrder: Number(row.sort_order ?? 0),
    updatedAt: toIso(row.updated_at) ?? undefined,
  };
}

export function mapServiceOverride(row: Row): ServiceOverride {
  return {
    serviceId: String(row.service_id),
    title: row.title ?? null,
    shortSummary: row.short_summary ?? null,
    approx: row.approx ?? null,
    approxLabel: row.approx_label ?? null,
    facts: Array.isArray(row.facts) ? row.facts : null,
    note: row.note ?? null,
    isActive: row.is_active !== false,
    sortOrder: row.sort_order === null ? null : Number(row.sort_order),
  };
}

export function mapLandingPage(row: Row): LandingPage {
  const theme = (row.theme ?? {}) as Record<string, string>;
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
    ogImage: row.og_image ?? "",
    blocks: Array.isArray(row.blocks) ? row.blocks : [],
    theme: {
      accent: theme.accent || "#142a5e",
      background: theme.background || "#f6f4ee",
    },
    isPublished: row.is_published !== false,
    indexable: row.indexable !== false,
    showInNav: Boolean(row.show_in_nav),
    updatedAt: toIso(row.updated_at) ?? undefined,
  };
}

export function mapSettings(rows: Row[]): SiteSettings {
  const store = new Map(rows.map((row) => [String(row.key), row.value]));
  const contact = store.get("contact") as Partial<SiteSettings["contact"]> | undefined;
  const estimator = store.get("estimator") as
    | Partial<SiteSettings["estimator"]>
    | undefined;
  const announcement = store.get("announcement");
  return {
    contact: { ...SEED_SETTINGS.contact, ...(contact ?? {}) },
    announcement:
      typeof announcement === "string"
        ? announcement
        : SEED_SETTINGS.announcement,
    estimator: { ...SEED_SETTINGS.estimator, ...(estimator ?? {}) },
  };
}

/* -------------------------------- queries -------------------------------- */

export async function getSettingsRows(sql: Sql): Promise<Row[]> {
  return (await sql`select key, value from site_settings`) as Row[];
}

export async function getPublicCatalog(sql: Sql): Promise<PublicCatalog> {
  const [settingsRows, categories, products, services, landingPages] =
    await Promise.all([
      getSettingsRows(sql),
      sql`select * from categories order by sort_order, id`,
      sql`
        select p.*, c.slug as category_slug
        from products p
        left join categories c on c.id = p.category_id
        order by p.sort_order, p.created_at
      `,
      sql`select * from service_overrides order by sort_order nulls last`,
      sql`
        select slug, title, show_in_nav
        from landing_pages
        where is_published = true
        order by updated_at desc
      `,
    ]);

  const store = new Map(settingsRows.map((row) => [String(row.key), row.value]));
  const seeded = store.get("seeded") === true || store.get("seeded") === "true";
  const version =
    typeof store.get("catalog_version") === "string"
      ? (store.get("catalog_version") as string)
      : "seed";

  return {
    seeded,
    version,
    categories: (categories as Row[]).map(mapCategory),
    products: (products as Row[]).map(mapProduct),
    services: (services as Row[]).map(mapServiceOverride),
    landingPages: (landingPages as Row[]).map((row) => ({
      slug: String(row.slug),
      title: String(row.title),
      showInNav: Boolean(row.show_in_nav),
    })),
    settings: seeded ? mapSettings(settingsRows) : {},
  };
}

export async function getLandingPages(sql: Sql): Promise<LandingPage[]> {
  const rows = (await sql`select * from landing_pages order by updated_at desc`) as Row[];
  return rows.map(mapLandingPage);
}

export async function getLandingPageBySlug(
  sql: Sql,
  slug: string,
): Promise<LandingPage | null> {
  const rows = (await sql`
    select * from landing_pages where slug = ${slug} limit 1
  `) as Row[];
  return rows.length ? mapLandingPage(rows[0]) : null;
}

export async function getAdminData(sql: Sql): Promise<AdminData> {
  const [catalog, landingPages, settingsRows, stats] = await Promise.all([
    getPublicCatalog(sql),
    getLandingPages(sql),
    getSettingsRows(sql),
    sql`
      select
        (select count(*)::int from products) as products,
        (select count(*)::int from categories) as categories,
        (select count(*)::int from landing_pages) as landing_pages,
        (select max(updated_at) from products) as last_updated
    `,
  ]);
  const row = (stats as Row[])[0] ?? {};
  return {
    catalog,
    landingPages,
    settings: mapSettings(settingsRows),
    stats: {
      products: Number(row.products ?? 0),
      categories: Number(row.categories ?? 0),
      landingPages: Number(row.landing_pages ?? 0),
      lastUpdated: toIso(row.last_updated),
    },
  };
}

/** Mark the catalog as changed so open pages know to refetch. */
export async function bumpVersion(sql: Sql): Promise<void> {
  const stamp = new Date().toISOString();
  await sql`
    insert into site_settings (key, value)
    values ('catalog_version', to_jsonb(${stamp}::text))
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
}

export async function saveSetting(
  sql: Sql,
  key: string,
  value: unknown,
): Promise<void> {
  await sql`
    insert into site_settings (key, value)
    values (${key}, ${JSON.stringify(value)}::jsonb)
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
}
