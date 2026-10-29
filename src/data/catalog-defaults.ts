import seed from "@seed/catalog.json";
import readymadeFoil from "@/assets/services2/foilradymet.webp";
import readymadeZipper from "@/assets/services2/geperradymet.webp";
import readymadeLd from "@/assets/services2/Ldradymet.webp";
import readymadeShrink from "@/assets/services2/srinkradymet.webp";
import readymadeSquare from "@/assets/services2/suquretradymet.webp";
import type {
  Category,
  EstimatorSettings,
  PriceUnit,
  Product,
  PublicCatalog,
  SiteSettings,
} from "@shared/types";

/**
 * Built-in catalog.
 *
 * This is what the site renders during static prerendering, with JavaScript
 * disabled and whenever the database API is unreachable. Once the Neon
 * database is seeded, the browser replaces it with live data from
 * `/api/catalog` (see `src/lib/catalog.ts`).
 */

/** Bundled sample images, used when a product has no uploaded image yet. */
export const DEFAULT_PRODUCT_IMAGES: Record<string, string> = {
  "foil-packet": readymadeFoil,
  "zipper-packet": readymadeZipper,
  "ld-packet": readymadeLd,
  "shrink-poly": readymadeShrink,
  "security-seal": readymadeSquare,
};

export const DEFAULT_SETTINGS: SiteSettings = {
  contact: { ...(seed.settings.contact as SiteSettings["contact"]) },
  announcement: seed.settings.announcement,
  estimator: { ...(seed.settings.estimator as EstimatorSettings) },
};

export const DEFAULT_ESTIMATOR: EstimatorSettings = DEFAULT_SETTINGS.estimator;

export const DEFAULT_CATEGORIES: Category[] = seed.categories.map((c) => ({
  id: c.id,
  slug: c.slug,
  titleBn: c.titleBn,
  titleEn: c.titleEn ?? null,
  description: null,
  group: c.group === "readymade" ? "readymade" : "extra",
  sortOrder: c.sortOrder,
  isActive: true,
}));

export const DEFAULT_PRODUCTS: Product[] = seed.products.map((p, i) => ({
  id: `default-${p.slug}`,
  categoryId:
    DEFAULT_CATEGORIES.find((c) => c.slug === p.categorySlug)?.id ?? null,
  categorySlug: p.categorySlug,
  slug: p.slug,
  nameBn: p.nameBn,
  nameEn: p.nameEn ?? null,
  price: p.price,
  priceMax: p.priceMax ?? null,
  priceUnit: (p.priceUnit as PriceUnit) ?? "kg",
  priceNote: null,
  minOrder: p.minOrder ?? null,
  sizeLabel: p.sizeLabel ?? null,
  imageUrl: DEFAULT_PRODUCT_IMAGES[p.slug] ?? null,
  gallery: [],
  description: null,
  badge: "READY-MADE",
  waMessage: `আসসালামু আলাইকুম। আমি রেডিমেড ${p.nameBn} অর্ডার করতে চাই। প্রয়োজনীয় সাইজ ও পরিমাণ জানাচ্ছি:`,
  serviceId: p.serviceId ?? null,
  isActive: true,
  isFeatured: i < 2,
  sortOrder: p.sortOrder,
}));

export const DEFAULT_CATALOG: PublicCatalog = {
  seeded: false,
  version: "builtin",
  categories: DEFAULT_CATEGORIES,
  products: DEFAULT_PRODUCTS,
  services: [],
  landingPages: [],
  settings: DEFAULT_SETTINGS,
};

export const DEFAULT_PRODUCT_BY_SLUG = new Map(
  DEFAULT_PRODUCTS.map((product) => [product.slug, product]),
);
