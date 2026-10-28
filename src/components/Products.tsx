import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  PackageCheck,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { SERVICES } from "@/data/services";
import { waLink } from "@/lib/site";
import { WhatsAppIcon, Container } from "./ui";

const products =
  SERVICES.find((s) => s.id === "ready-made")?.readymadeProducts ?? [];
const categories = ["সব প্রোডাক্ট", "প্যাকেট ও পাউচ", "পলি ও সিল"];
const englishNames = [
  "Foil packet pouch",
  "Zipper packet pouch",
  "LD packet poly",
  "Shrink poly",
  "Security seal",
];

export function Products() {
  const [category, setCategory] = useState(0);
  const [query, setQuery] = useState("");
  const filtered = products.filter(
    (p, i) =>
      (category === 0 || (category === 1 ? i < 3 : i >= 3)) &&
      `${p.name} ${englishNames[i]}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
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
                আপনার ব্র্যান্ডের জন্য
                <br />
                <span className="text-[#996034]">সঠিক প্যাকেজিং।</span>
              </h1>
            </div>
            <div className="pb-1">
              <p className="text-sm leading-7 text-muted sm:text-base">
                বাংলাদেশে রেডিমেড প্যাকেট বেছে নিন, অথবা নিজের লোগো ও ডিজাইনে
                কাস্টম প্যাকেজিং তৈরি করুন।
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
              "সাইজ অনুযায়ী কোটেশন",
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
            {categories.map((cat, i) => (
              <button
                key={cat}
                type="button"
                aria-pressed={category === i}
                onClick={() => setCategory(i)}
                className={`min-h-11 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${category === i ? "border-royal-900 bg-royal-900 text-white" : "border-[#ddd9cf] bg-transparent text-muted hover:border-royal-500"}`}
              >
                {cat}
              </button>
            ))}
            <span role="status" className="ml-auto text-xs text-muted">
              {filtered.length}টি প্রোডাক্ট
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {filtered.map((product) => (
              <article
                key={product.name}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e3dfd5] bg-white transition-shadow hover:shadow-card"
              >
                <a
                  href="/services/ready-made/"
                  aria-label={`${product.name} — সাইজ ও বিস্তারিত`}
                  className="relative block aspect-[1.1] overflow-hidden bg-[#fafaf8]"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} — রেডিমেড প্যাকেজিং বাংলাদেশ`}
                    width={640}
                    height={580}
                    loading={products.indexOf(product) < 2 ? "eager" : "lazy"}
                    fetchPriority={
                      products.indexOf(product) === 0 ? "high" : undefined
                    }
                    decoding="async"
                    className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 rounded-md border border-white/70 bg-white/90 px-2 py-1 text-[9px] font-bold tracking-wide text-royal-800">
                    READY-MADE
                  </span>
                </a>
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="text-[15px] font-bold text-royal-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-[10px] text-muted">
                    আনুমানিক মূল্য / কেজি
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-royal-900 sm:text-base">
                    {product.price.replace(/\s*\/\s*KG/i, "")}
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-muted">
                    ন্যূনতম {product.minOrder} · সাইজ জেনে নিন
                  </p>
                  <a
                    href={waLink(product.waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${product.name} WhatsApp-এ অর্ডার করুন`}
                    className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg border border-royal-900 px-2 py-2 text-xs font-bold text-royal-900 transition-colors hover:bg-royal-900 hover:text-white"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0" />
                    অর্ডার করুন
                  </a>
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <div className="rounded-2xl border border-dashed border-[#ccc5b7] py-12 text-center">
              <p className="text-sm text-muted">
                এই নামে কোনো প্রোডাক্ট পাওয়া যায়নি।
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory(0);
                }}
                className="mt-3 min-h-11 px-4 text-sm font-bold text-royal-900 underline"
              >
                সব প্রোডাক্ট দেখুন
              </button>
            </div>
          )}
          <div className="mt-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-xs leading-6 text-muted">
              দাম আনুমানিক। অর্ডারের আগে সাইজ, স্টক, চূড়ান্ত দাম ও ডেলিভারি
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
      </Container>
    </section>
  );
}
