import type {
  Category,
  LandingBlock,
  LandingPage,
  PriceUnit,
  Product,
  SiteSettings,
} from "../../shared/types";
import { HttpError } from "./http";

/* eslint-disable @typescript-eslint/no-explicit-any */

const PRICE_UNITS: PriceUnit[] = ["kg", "piece", "packet", "sqft", "unit"];
const BLOCK_TYPES = [
  "hero",
  "text",
  "products",
  "features",
  "image",
  "cta",
  "faq",
  "html",
];

export function optionalText(
  value: unknown,
  field: string,
  max = 4000,
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") throw new HttpError(400, `${field} সঠিক নয়।`);
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > max) {
    throw new HttpError(400, `${field} সর্বোচ্চ ${max} অক্ষরের হতে পারবে।`);
  }
  return trimmed;
}

export function requiredText(value: unknown, field: string, max = 4000): string {
  const text = optionalText(value, field, max);
  if (!text) throw new HttpError(400, `${field} আবশ্যক।`);
  return text;
}

export function optionalNumber(
  value: unknown,
  field: string,
  { min = 0, max = 100_000_000 }: { min?: number; max?: number } = {},
): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new HttpError(400, `${field} সংখ্যা হতে হবে।`);
  if (parsed < min || parsed > max) {
    throw new HttpError(400, `${field} ${min}–${max} এর মধ্যে হতে হবে।`);
  }
  return Math.round(parsed * 100) / 100;
}

export function optionalInt(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(-100_000, Math.min(100_000, Math.round(parsed)));
}

export function bool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1 || value === "1") return true;
  if (value === "false" || value === 0 || value === "0") return false;
  return fallback;
}

export function slug(value: unknown, field = "slug"): string {
  const text = requiredText(value, field, 90).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text)) {
    throw new HttpError(
      400,
      `${field} শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা ও হাইফেন দিয়ে হবে (যেমন: foil-packet)।`,
    );
  }
  return text;
}

/* -------------------------------- products -------------------------------- */

export interface ProductInput {
  categoryId: number | null;
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
  serviceId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export function normalizeProduct(
  body: any,
  existing?: Product,
): ProductInput {
  const price = optionalNumber(body.price, "দাম");
  const priceMax = optionalNumber(body.priceMax, "সর্বোচ্চ দাম");
  if (price !== null && priceMax !== null && priceMax < price) {
    throw new HttpError(400, "সর্বোচ্চ দাম সর্বনিম্ন দামের চেয়ে কম হতে পারবে না।");
  }
  const unit = String(body.priceUnit || existing?.priceUnit || "kg") as PriceUnit;
  if (!PRICE_UNITS.includes(unit)) {
    throw new HttpError(400, "দামের একক সঠিক নয়।");
  }
  const gallery = Array.isArray(body.gallery)
    ? body.gallery
        .filter((item: unknown) => typeof item === "string")
        .slice(0, 12)
        .map((item: string) => item.slice(0, 500))
    : (existing?.gallery ?? []);

  return {
    categoryId:
      body.categoryId === null || body.categoryId === ""
        ? null
        : body.categoryId === undefined
          ? (existing?.categoryId ?? null)
          : optionalInt(body.categoryId),
    slug: body.slug ? slug(body.slug) : (existing?.slug ?? ""),
    nameBn: requiredText(body.nameBn ?? existing?.nameBn, "প্রোডাক্টের নাম", 160),
    nameEn: optionalText(body.nameEn ?? existing?.nameEn, "ইংরেজি নাম", 160),
    price,
    priceMax,
    priceUnit: unit,
    priceNote: optionalText(body.priceNote, "দামের নোট", 200),
    minOrder: optionalText(body.minOrder, "ন্যূনতম অর্ডার", 80),
    sizeLabel: optionalText(body.sizeLabel, "সাইজ", 120),
    imageUrl: optionalText(body.imageUrl, "ছবির লিংক", 800),
    gallery,
    description: optionalText(body.description, "বিবরণ", 4000),
    badge: optionalText(body.badge, "ব্যাজ", 40),
    waMessage: optionalText(body.waMessage, "WhatsApp মেসেজ", 1200),
    serviceId: optionalText(body.serviceId, "সার্ভিস", 60),
    isActive: bool(body.isActive, existing?.isActive ?? true),
    isFeatured: bool(body.isFeatured, existing?.isFeatured ?? false),
    sortOrder: optionalInt(body.sortOrder, existing?.sortOrder ?? 0),
  };
}

/* ------------------------------- categories ------------------------------- */

export interface CategoryInput {
  slug: string;
  titleBn: string;
  titleEn: string | null;
  description: string | null;
  group: "readymade" | "extra";
  sortOrder: number;
  isActive: boolean;
}

export function normalizeCategory(
  body: any,
  existing?: Category,
): CategoryInput {
  return {
    slug: body.slug ? slug(body.slug) : (existing?.slug ?? ""),
    titleBn: requiredText(body.titleBn ?? existing?.titleBn, "ক্যাটাগরির নাম", 120),
    titleEn: optionalText(body.titleEn, "ইংরেজি নাম", 120),
    description: optionalText(body.description, "বিবরণ", 1000),
    group: body.group === "extra" ? "extra" : "readymade",
    sortOrder: optionalInt(body.sortOrder, existing?.sortOrder ?? 0),
    isActive: bool(body.isActive, existing?.isActive ?? true),
  };
}

/* ----------------------------- landing pages ----------------------------- */

export interface LandingInput {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  blocks: LandingBlock[];
  theme: { accent: string; background: string };
  isPublished: boolean;
  indexable: boolean;
  showInNav: boolean;
}

const COLOR = /^#[0-9a-fA-F]{3,8}$/;

export function normalizeLanding(
  body: any,
  existing?: LandingPage,
): LandingInput {
  const blocks = body.blocks === undefined ? (existing?.blocks ?? []) : body.blocks;
  if (!Array.isArray(blocks)) throw new HttpError(400, "ব্লক লিস্ট সঠিক নয়।");
  if (blocks.length > 40) throw new HttpError(400, "সর্বোচ্চ ৪০টি ব্লক যোগ করা যাবে।");
  for (const block of blocks) {
    if (!block || typeof block !== "object" || !BLOCK_TYPES.includes(block.type)) {
      throw new HttpError(400, "অজানা ব্লক টাইপ পাওয়া গেছে।");
    }
  }
  const serialized = JSON.stringify(blocks);
  if (serialized.length > 400_000) {
    throw new HttpError(413, "ল্যান্ডিং পেজের কনটেন্ট অনেক বড়।");
  }
  const theme = body.theme ?? existing?.theme ?? {};
  return {
    slug: body.slug ? slug(body.slug) : (existing?.slug ?? ""),
    title: requiredText(body.title ?? existing?.title, "পেজের নাম", 160),
    seoTitle: optionalText(body.seoTitle ?? existing?.seoTitle, "SEO টাইটেল", 160) ?? "",
    seoDescription:
      optionalText(body.seoDescription ?? existing?.seoDescription, "SEO বর্ণনা", 320) ??
      "",
    ogImage: optionalText(body.ogImage ?? existing?.ogImage, "OG ছবি", 800) ?? "",
    blocks: blocks as LandingBlock[],
    theme: {
      accent: COLOR.test(String(theme.accent)) ? String(theme.accent) : "#142a5e",
      background: COLOR.test(String(theme.background))
        ? String(theme.background)
        : "#f6f4ee",
    },
    isPublished: bool(body.isPublished, existing?.isPublished ?? true),
    indexable: bool(body.indexable, existing?.indexable ?? true),
    showInNav: bool(body.showInNav, existing?.showInNav ?? false),
  };
}

/* -------------------------------- settings -------------------------------- */

export function normalizeSettings(
  body: any,
  existing: SiteSettings,
): SiteSettings {
  const contact = body.contact ?? {};
  const estimator = body.estimator ?? {};
  const whatsapp = String(contact.whatsappNumber ?? existing.contact.whatsappNumber)
    .replace(/\D/g, "");
  if (!/^\d{10,15}$/.test(whatsapp)) {
    throw new HttpError(400, "WhatsApp নম্বর ১০–১৫ সংখ্যার হতে হবে (দেশের কোডসহ)।");
  }
  return {
    contact: {
      whatsappNumber: whatsapp,
      whatsappDisplay:
        optionalText(contact.whatsappDisplay, "WhatsApp ডিসপ্লে", 40) ??
        existing.contact.whatsappDisplay,
      phoneDisplay:
        optionalText(contact.phoneDisplay, "ফোন ডিসপ্লে", 40) ??
        existing.contact.phoneDisplay,
      phoneDial:
        optionalText(contact.phoneDial, "ফোন নম্বর", 20) ??
        existing.contact.phoneDial,
      email: optionalText(contact.email, "ইমেইল", 120) ?? existing.contact.email,
    },
    announcement: optionalText(body.announcement, "ঘোষণা", 300) ?? "",
    estimator: {
      cylinderRatePer100cm2:
        optionalNumber(estimator.cylinderRatePer100cm2, "সিলিন্ডার রেট", {
          min: 0.1,
          max: 1000,
        }) ?? existing.estimator.cylinderRatePer100cm2,
      ldMin: optionalNumber(estimator.ldMin, "LD সর্বনিম্ন", { max: 100000 }) ??
        existing.estimator.ldMin,
      ldMax: optionalNumber(estimator.ldMax, "LD সর্বোচ্চ", { max: 100000 }) ??
        existing.estimator.ldMax,
      foilMin: optionalNumber(estimator.foilMin, "Foil সর্বনিম্ন", { max: 100000 }) ??
        existing.estimator.foilMin,
      foilMax: optionalNumber(estimator.foilMax, "Foil সর্বোচ্চ", { max: 100000 }) ??
        existing.estimator.foilMax,
      ldMinKg: optionalNumber(estimator.ldMinKg, "LD ন্যূনতম KG", { max: 100000 }) ??
        existing.estimator.ldMinKg,
      foilMinKg:
        optionalNumber(estimator.foilMinKg, "Foil ন্যূনতম KG", { max: 100000 }) ??
        existing.estimator.foilMinKg,
    },
  };
}
