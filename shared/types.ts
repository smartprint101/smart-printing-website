/**
 * Types shared by the public website, the admin panel and the Cloudflare
 * Pages Functions (API). Keep this file free of runtime imports so it can be
 * used from the browser, from Workers and from Node scripts.
 */

export type PriceUnit = "kg" | "piece" | "packet" | "sqft" | "unit";

export interface Category {
  id: number;
  slug: string;
  titleBn: string;
  titleEn: string | null;
  description: string | null;
  /** "readymade" = shown in the main ready-made grid, "extra" = own section below. */
  group: "readymade" | "extra";
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  categoryId: number | null;
  categorySlug: string | null;
  slug: string;
  nameBn: string;
  nameEn: string | null;
  price: number | null;
  priceMax: number | null;
  priceUnit: PriceUnit;
  priceNote: string | null;
  minOrder: string | null;
  sizeLabel: string | null;
  imageUrl: string | null;
  gallery: string[];
  description: string | null;
  badge: string | null;
  waMessage: string | null;
  /** Service page this product belongs to (e.g. "ready-made"). */
  serviceId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  updatedAt?: string;
}

export interface ServiceFact {
  label: string;
  value: string;
}

/** Admin edits layered over the service content stored in the codebase. */
export interface ServiceOverride {
  serviceId: string;
  title: string | null;
  shortSummary: string | null;
  approx: string | null;
  approxLabel: string | null;
  facts: ServiceFact[] | null;
  note: string | null;
  isActive: boolean;
  sortOrder: number | null;
}

export interface EstimatorSettings {
  /** Taka per 100 cm² of engraved cylinder area. */
  cylinderRatePer100cm2: number;
  ldMin: number;
  ldMax: number;
  foilMin: number;
  foilMax: number;
  ldMinKg: number;
  foilMinKg: number;
}

export interface ContactSettings {
  whatsappNumber: string;
  whatsappDisplay: string;
  phoneDisplay: string;
  phoneDial: string;
  email: string;
}

export interface SiteSettings {
  contact: ContactSettings;
  announcement: string;
  estimator: EstimatorSettings;
}

export type SettingsKey = keyof SiteSettings;

/* ------------------------------- Landing pages ------------------------------ */

export interface LandingBlockBase {
  id: string;
}

export interface HeroBlock extends LandingBlockBase {
  type: "hero";
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  theme: "light" | "dark";
}

export interface TextBlock extends LandingBlockBase {
  type: "text";
  title: string;
  html: string;
}

export interface ProductsBlock extends LandingBlockBase {
  type: "products";
  title: string;
  subtitle: string;
  productIds: string[];
}

export interface FeaturesBlock extends LandingBlockBase {
  type: "features";
  title: string;
  items: { title: string; text: string }[];
}

export interface ImageBlock extends LandingBlockBase {
  type: "image";
  imageUrl: string;
  alt: string;
  caption: string;
}

export interface CtaBlock extends LandingBlockBase {
  type: "cta";
  title: string;
  text: string;
  buttonText: string;
  buttonUrl: string;
}

export interface FaqBlock extends LandingBlockBase {
  type: "faq";
  title: string;
  items: { q: string; a: string }[];
}

export interface HtmlBlock extends LandingBlockBase {
  type: "html";
  html: string;
  allowScripts: boolean;
}

export type LandingBlock =
  | HeroBlock
  | TextBlock
  | ProductsBlock
  | FeaturesBlock
  | ImageBlock
  | CtaBlock
  | FaqBlock
  | HtmlBlock;

export type LandingBlockType = LandingBlock["type"];

export interface LandingTheme {
  accent: string;
  background: string;
}

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  blocks: LandingBlock[];
  theme: LandingTheme;
  isPublished: boolean;
  /** false = <meta name="robots" content="noindex"> and kept out of the sitemap. */
  indexable: boolean;
  showInNav: boolean;
  updatedAt?: string;
}

export interface LandingPageSummary {
  slug: string;
  title: string;
  showInNav: boolean;
}

/* ---------------------------------- API ---------------------------------- */

export interface PublicCatalog {
  /** false until `npm run db:setup` has seeded the database; the site then uses its built-in catalog. */
  seeded: boolean;
  version: string;
  categories: Category[];
  products: Product[];
  services: ServiceOverride[];
  landingPages: LandingPageSummary[];
  settings: Partial<SiteSettings>;
}

export interface AdminSession {
  email: string;
  name: string | null;
  expiresAt: string;
}

export interface AdminData {
  catalog: PublicCatalog;
  landingPages: LandingPage[];
  settings: SiteSettings;
  stats: { products: number; categories: number; landingPages: number; lastUpdated: string | null };
}

export interface ApiError {
  error: string;
}

export type PriceHistoryEntry = {
  productId: string;
  oldPrice: number | null;
  newPrice: number | null;
  changedAt: string;
};
