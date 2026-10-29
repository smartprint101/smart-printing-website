import { database, hasDatabase } from "../_lib/db";
import { getPublicCatalog } from "../_lib/catalog";
import type { RequestContext } from "../_lib/env";
import { handle, json } from "../_lib/http";

const EMPTY_CATALOG = {
  seeded: false,
  version: "seed",
  categories: [],
  products: [],
  services: [],
  landingPages: [],
  settings: {},
};

/** Public catalog consumed by the storefront (prices, products, settings). */
export const onRequestGet = ({ env }: RequestContext) =>
  handle(async () => {
    if (!hasDatabase(env)) {
      return json(EMPTY_CATALOG, 200, { "cache-control": "public, max-age=60" });
    }
    const catalog = await getPublicCatalog(database(env));
    return json(catalog, 200, {
      "cache-control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
    });
  });
