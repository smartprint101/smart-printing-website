import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  PackageCheck,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import type { Product } from "@shared/types";
import {
  formatPriceShort,
  productImage,
  productWaLink,
  useActiveProducts,
  useVisibleCategories,
} from "@/lib/catalog";
import { Container, WhatsAppIcon } from "./ui";

function ProductCard({
  product,
  eager,
}: {
  product: Product;
  eager?: boolean;
}) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e3dfd5] bg-white transition-shadow hover:shadow-card">
      <a
        href="/services/ready-made/"
        aria-label={`${product.nameBn} — সাইজ ও বিস্তারিত`}
        className="relative block aspect-[1.1] overflow-hidden bg-[#fafaf8]"
      >
        <img
          src={productImage(product)}
          alt={`${product.nameBn} — রেডিমেড প্যাকেজিং বাংলাদেশ`}
          width={640}
          height={580}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-2 left-2 rounded-md border border-white/70 bg-white/90 px-2 py-1 text-[9px] font-bold tracking-wide text-royal-800">
          {product.badge || "READY-MADE"}
        </span>
      </a>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-[15px] font-bold text-royal-900">
          {product.nameBn}
        </h3>
        <p className="mt-2 text-[10px] text-muted">আনুমানিক মূল্য</p>
        <p className="mt-1 text-sm font-extrabold text-royal-900 sm:text-base">
          {formatPriceShort(product)}
        </p>
        {product.priceNote && (
          <p className="mt-1 text-[10px] leading-4 text-muted">
            {product.priceNote}
          </p>
        )}
        <p className="mt-2 text-[11px] leading-5 text-muted">
          ন্যূনতম {product.minOrder || "১ কেজি"} ·{" "}
          {product.sizeLabel || "সাইজ জেনে নিন"}
        </p>
        <a
          href={productWaLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${product.nameBn} WhatsApp-এ অর্ডার করুন`}
          className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg border border-royal-900 px-2 py-2 text-xs font-bold text-royal-900 transition-colors hover:bg-royal-900 hover:text-white"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          অর্ডার করুন
        </a>
      </div>
    </article>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          eager={product.isFeatured}
        />
      ))}
    </div>
  );
}

export function Products() {
  const categories = useVisibleCategories();
  const products = useActiveProducts();
  const [activeSlug, setActiveSlug] = useState("all");
  const [query, setQuery] = useState("");

  const readymadeCategories = categories.filter(
    (category) => category.group === "readymade",
  );
  const extraCategories = categories.filter(
    (category) => category.group === "extra",
  );

  const search = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      (product: Product) =>
        !search ||
        `${product.nameBn} ${product.nameEn ?? ""} ${product.slug}`
          .toLowerCase()
          .includes(search),
    [search],
  );

  const readymadeProducts = products.filter((product) =>
    readymadeCategories.some(
      (category) => category.slug === product.categorySlug,
    ),
  );
  // Products whose category was deleted stay visible under "all" instead of
  // silently disappearing from the site.
  const uncategorized = products.filter(
    (product) =>
      !categories.some((category) => category.slug === product.categorySlug),
  );
  const filtered = (
    activeSlug === "all"
      ? [...uncategorized, ...readymadeProducts]
      : readymadeProducts.filter(
          (product) => product.categorySlug === activeSlug,
        )
  ).filter(matches);

  const extraSections = extraCategories
    .map((category) => ({
      category,
      items: products.filter(
        (product) =>
          product.categorySlug === category.slug && matches(product),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <section
      id="home"
      className="scroll-mt-28 bg-[#f6f4ee] pb-9 pt-7 sm:pb-14 sm:pt-12"
    >
      <Container>
        <div id="products" className="scroll-mt-32">
          <div className="grid items-end gap-3 sm:gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div>
              <p className="kicker">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#a46a39]" />
                PACKAGING FOR YOUR NEXT BIG IDEA
              </p>
              <h1 className="mt-4 max-w-3xl text-[29px] font-extrabold leading-[1.45] text-royal-900 sm:text-[43px]">
                নিজের নামে প্যাকেট,
                <br />
                <span className="text-[#996034]">বক্স ও লেবেল প্রিন্টিং।</span>
              </h1>
            </div>
            <div className="pb-1">
              <p className="text-sm leading-7 text-muted sm:text-base">
                পলি ও ফয়েল প্যাকেট, প্যাকেজিং বক্স, স্টিকার ও লেবেল প্রিন্টিং।
                বাংলাদেশে নিজের লোগো ও ডিজাইনে কাস্টম প্যাকেজিং তৈরি করুন,
                অথবা রেডিমেড প্যাকেট বেছে নিন।
              </p>
              <a
                href="#services"
                className="mt-3 hidden min-h-11 items-center gap-2 sm:inline-flex text-sm font-bold text-royal-900"
              >
                কাস্টম প্রিন্টিং সেবা দেখুন
                <ArrowDown size={16} />
              </a>
            </div>
          </div>
          <div className="mb-5 mt-5 flex flex-wrap gap-x-6 gap-y-2 border-y border-[#ddd9cf] py-3 text-xs font-medium text-muted sm:mt-8">
            {[
              "১ কেজি থেকে রেডিমেড প্যাকেট",
              "সাইজ অনুযায়ী কোটেশন",
              "WhatsApp-এ সরাসরি অর্ডার",
            ].map((text, i) => (
              <span
                key={text}
                className={`${i === 2 ? "hidden sm:flex" : "flex"} items-center gap-2`}
              >
                <PackageCheck size={15} className="text-[#996034]" />
                {text}
              </span>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="kicker">THE PACKAGING EDIT</p>
              <h2 className="mt-1 text-2xl font-extrabold text-royal-900">
                রেডিমেড প্রোডাক্ট
              </h2>
            </div>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[#ddd9cf] bg-white px-3 sm:w-64">
              <Search className="h-4 w-4 shrink-0 text-muted" />
              <span className="sr-only">প্রোডাক্ট খুঁজুন</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="প্যাকেট খুঁজুন…"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
              />
            </label>
          </div>
          <div
            className="mb-5 mt-5 flex flex-wrap items-center gap-2"
            role="group"
            aria-label="প্রোডাক্টের ধরন"
          >
            <SlidersHorizontal
              size={15}
              className="mr-1 hidden text-muted sm:block"
            />
            {[{ slug: "all", titleBn: "সব প্রোডাক্ট" }, ...readymadeCategories].map(
              (category) => (
                <button
                  key={category.slug}
                  type="button"
                  aria-pressed={activeSlug === category.slug}
                  onClick={() => setActiveSlug(category.slug)}
                  className={`min-h-11 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    activeSlug === category.slug
                      ? "border-royal-900 bg-royal-900 text-white"
                      : "border-[#ddd9cf] bg-transparent text-muted hover:border-royal-500"
                  }`}
                >
                  {category.titleBn}
                </button>
              ),
            )}
            <span role="status" className="ml-auto text-xs text-muted">
              {filtered.length}টি প্রোডাক্ট
            </span>
          </div>
          {filtered.length ? (
            <ProductGrid products={filtered} />
          ) : (
            <div className="rounded-2xl border border-dashed border-[#ccc5b7] py-12 text-center">
              <p className="text-sm text-muted">
                এই নামে কোনো প্রোডাক্ট পাওয়া যায়নি।
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveSlug("all");
                }}
                className="mt-3 min-h-11 px-4 text-sm font-bold text-royal-900 underline"
              >
                সব প্রোডাক্ট দেখুন
              </button>
            </div>
          )}
          <div className="mt-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-xs leading-6 text-muted">
              দাম আনুমানিক। অর্ডারের আগে সাইজ, স্টক, চূড়ান্ত দাম ও ডেলিভারি
              নিশ্চিত করুন।
            </p>
            <a
              href="/services/ready-made/"
              className="inline-flex min-h-11 shrink-0 items-center gap-1 text-xs font-bold text-royal-900"
            >
              সাইজ ও অর্ডারের তথ্য
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {extraSections.map(({ category, items }) => (
          <div key={category.slug} className="mt-12 border-t border-[#ddd9cf] pt-9">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="kicker flex items-center gap-2">
                  <Sparkles size={13} className="text-[#996034]" />
                  {category.titleEn || "NEW CATEGORY"}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-royal-900">
                  {category.titleBn}
                </h2>
                {category.description && (
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    {category.description}
                  </p>
                )}
              </div>
              <span role="status" className="text-xs text-muted">
                {items.length}টি প্রোডাক্ট
              </span>
            </div>
            <div className="mt-5">
              <ProductGrid products={items} />
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
