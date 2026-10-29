import { useSyncExternalStore } from "react";
import type {
  Category,
  PriceUnit,
  Product,
  PublicCatalog,
  ServiceOverride,
  SiteSettings,
} from "@shared/types";
import {
  DEFAULT_CATALOG,
  DEFAULT_PRODUCT_BY_SLUG,
  DEFAULT_SETTINGS,
} from "@/data/catalog-defaults";
import { SERVICES, type Service } from "@/data/services";
import { applyContactOverride, waLink } from "@/lib/site";

/**
 * Live product catalog.
 *
 * The first render always uses the built-in catalog (identical on the server
 * and in the browser, so hydration stays clean). A fetch to `/api/catalog`
 * then swaps in the admin-managed Neon data. If the API is unavailable — local
 * `vite preview`, static hosting, offline — the built-in prices stay in place.
 */

let catalog: PublicCatalog = DEFAULT_CATALOG;
let mergedServices: Service[] = SERVICES;
let started = false;
const listeners = new Set<() => void>();

function normalizeServiceOverrides(
  overrides: ServiceOverride[] | undefined,
): ServiceOverride[] {
  if (!Array.isArray(overrides)) return [];
  return overrides.filter(
    (override) =>
      override &&
      typeof override.serviceId === "string" &&
      SERVICES.some((service) => service.id === override.serviceId),
  );
}

function mergeServices(overrides: ServiceOverride[]): Service[] {
  if (!overrides.length) return SERVICES;
  const byId = new Map(overrides.map((item) => [item.serviceId, item]));
  const merged = SERVICES.map((service) => {
    const override = byId.get(service.id);
    if (!override) return service;
    return {
      ...service,
      title: override.title || service.title,
      shortSummary: override.shortSummary || service.shortSummary,
      approx: override.approx ?? service.approx,
      approxLabel: override.approxLabel ?? service.approxLabel,
      facts: override.facts?.length ? override.facts : service.facts,
      note: override.note ?? service.note,
    };
  });
  const hidden = new Set(
    overrides.filter((item) => item.isActive === false).map((item) => item.serviceId),
  );
  return hidden.size ? merged.filter((service) => !hidden.has(service.id)) : merged;
}

function mergeCatalog(incoming: PublicCatalog): PublicCatalog {
  const categories =
    incoming.seeded && incoming.categories?.length
      ? incoming.categories
      : DEFAULT_CATALOG.categories;
  const products =
    incoming.seeded && Array.isArray(incoming.products)
      ? incoming.products.map((product) => ({
          ...product,
          gallery: Array.isArray(product.gallery) ? product.gallery : [],
          imageUrl:
            product.imageUrl ||
            DEFAULT_PRODUCT_BY_SLUG.get(product.slug)?.imageUrl ||
            null,
        }))
      : DEFAULT_CATALOG.products;
  return {
    seeded: Boolean(incoming.seeded),
    version: incoming.version || "live",
    categories,
    products,
    services: normalizeServiceOverrides(incoming.services),
    landingPages: Array.isArray(incoming.landingPages)
      ? incoming.landingPages
      : [],
    settings: { ...DEFAULT_SETTINGS, ...(incoming.settings || {}) },
  };
}

async function load(): Promise<void> {
  if (started) return;
  started = true;
  if (typeof window === "undefined" || typeof fetch !== "function") return;
  try {
    const response = await fetch("/api/catalog", {
      headers: { accept: "application/json" },
    });
    if (!response.ok) return;
    const data = (await response.json()) as PublicCatalog;
    if (!data || typeof data !== "object" || !data.settings) return;
    const merged = mergeCatalog(data);
    catalog = merged;
    mergedServices = mergeServices(merged.services);
    if (merged.settings.contact) {
      applyContactOverride(merged.settings.contact);
    }
    listeners.forEach((listener) => listener());
  } catch {
    /* Static host or offline: keep built-in catalog. */
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  void load();
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => catalog;
const getServerSnapshot = () => DEFAULT_CATALOG;

/** Full live catalog (products, categories, settings). */
export function useCatalog(): PublicCatalog {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Service content with the admin's price/summary overrides applied. */
export function useServices(): Service[] {
  useCatalog();
  return mergedServices;
}

export function useSiteSettings(): SiteSettings {
  const state = useCatalog();
  return { ...DEFAULT_SETTINGS, ...state.settings };
}

export function useVisibleCategories(): Category[] {
  const { categories } = useCatalog();
  return categories
    .filter((category) => category.isActive)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function useActiveProducts(): Product[] {
  const { products } = useCatalog();
  return products
    .filter((product) => product.isActive)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/* ------------------------------- formatting ------------------------------- */

export const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  kg: "কেজি",
  piece: "পিস",
  packet: "প্যাকেট",
  sqft: "স্কয়ার ফিট",
  unit: "ইউনিট",
};

const number = new Intl.NumberFormat("en-IN");

export function formatAmount(value: number): string {
  return number.format(value);
}

/** "৳৫৩০–৫৭০" or "কোটেশন নিন" when no price is published. */
export function formatPriceShort(product: Product): string {
  if (product.price === null || product.price === undefined) {
    return product.priceNote || "কোটেশন নিন";
  }
  const min = formatAmount(product.price);
  const max = product.priceMax;
  if (max !== null && max !== undefined && Number(max) !== Number(product.price)) {
    return `৳${min}–${formatAmount(Number(max))}`;
  }
  return `৳${min}`;
}

/** "৳৫৩০–৫৭০ / কেজি" */
export function formatPrice(product: Product): string {
  if (product.price === null || product.price === undefined) {
    return product.priceNote || "কোটেশন নিন";
  }
  return `${formatPriceShort(product)} / ${PRICE_UNIT_LABELS[product.priceUnit] ?? ""}`.trim();
}

export function productImage(product: Product): string {
  return (
    product.imageUrl ||
    DEFAULT_PRODUCT_BY_SLUG.get(product.slug)?.imageUrl ||
    "/brand-logo.png"
  );
}

export function productWaLink(product: Product): string {
  const message =
    product.waMessage ||
    `আসসালামু আলাইকুম। আমি ${product.nameBn} সম্পর্কে জানতে চাই। সাইজ, দাম ও স্টক জানাবেন:`;
  return waLink(message);
}

/** Resolve a product by slug or id, used by landing page blocks. */
export function findCatalogProduct(
  products: Product[],
  key: string,
): Product | undefined {
  return products.find(
    (product) => product.id === key || product.slug === key,
  );
}
