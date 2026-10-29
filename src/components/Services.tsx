import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SERVICE_IMAGES } from "@/data/services";
import { useServices } from "@/lib/catalog";
import { servicePath } from "@/lib/seo";
import { waLink } from "@/lib/site";
import { Container, WhatsAppIcon } from "./ui";

export const SERVICE_LABELS: Record<string, string> = {
  "ld-packet": "পলি ও LD প্যাকেট প্রিন্টিং",
  "foil-packet": "ফয়েল প্যাকেট ও পাউচ",
  "custom-box": "কাস্টম বক্স প্রিন্টিং",
  sticker: "স্টিকার ও লেবেল প্রিন্টিং",
  cylinder: "প্রিন্টিং সিলিন্ডার",
  "art-paper": "আর্ট পেপার প্রিন্টিং",
  "security-poly": "সিকিউরিটি শ্রিংক সিল",
  offset: "অফসেট প্রিন্টিং",
  other: "অন্যান্য প্রিন্টিং",
  "ready-made": "রেডিমেড প্যাকেট",
};
const order = [
  "ld-packet",
  "foil-packet",
  "custom-box",
  "sticker",
  "cylinder",
  "security-poly",
  "art-paper",
  "offset",
  "other",
];
const packaging = new Set([
  "ld-packet",
  "foil-packet",
  "custom-box",
  "cylinder",
  "security-poly",
]);
export function Services() {
  const [filter, setFilter] = useState("সব সেবা");
  const allServices = useServices();
  const services = order
    .map((id) => allServices.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .filter(
      (s) =>
        filter === "সব সেবা" ||
        (filter === "প্যাকেজিং" ? packaging.has(s.id) : !packaging.has(s.id)),
    );
  return (
    <section id="services" className="scroll-mt-28 bg-white py-12 sm:py-20">
      <Container>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="kicker">MADE FOR YOUR BRAND</p>
            <h2 className="mt-3 text-[27px] font-extrabold leading-snug text-royal-900 sm:text-4xl">
              প্যাকেজিং হোক
              <br className="hidden sm:block" />
              আপনার ব্র্যান্ডের পরিচয়।
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              নিজের লোগো, ডিজাইন ও সাইজে তৈরি করুন প্যাকেট, বক্স বা লেবেল।
              বিস্তারিত, ন্যূনতম অর্ডার ও মূল্য ধারণা দেখে সেবাটি বেছে নিন।
            </p>
          </div>
          <a
            href="#quote"
            className="inline-flex min-h-11 w-fit items-center gap-3 rounded-full border border-line px-5 text-sm font-bold text-royal-900 hover:border-royal-800"
          >
            আপনার প্রয়োজন জানান
            <ArrowUpRight size={17} />
          </a>
        </div>
        <div
          className="mb-6 mt-7 flex flex-wrap gap-2"
          role="group"
          aria-label="সেবার ধরন"
        >
          {["সব সেবা", "প্যাকেজিং", "প্রিন্টিং"].map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`min-h-11 rounded-full px-5 py-2 text-sm font-semibold ${filter === f ? "bg-royal-900 text-white" : "bg-mist text-muted hover:bg-royal-50"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.id}
              className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-soft"
            >
              <a
                href={servicePath(s.id)}
                aria-label={`${SERVICE_LABELS[s.id]} বিস্তারিত`}
                className="relative block aspect-[1.65] overflow-hidden bg-[#f3f3ef]"
              >
                <img
                  src={SERVICE_IMAGES[s.id]?.[0]}
                  alt={`${SERVICE_LABELS[s.id]} — নমুনা`}
                  width={660}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-royal-900">
                  {packaging.has(s.id)
                    ? "CUSTOM PACKAGING"
                    : "PRINT & BRANDING"}
                </span>
                <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-royal-900 transition-colors group-hover:bg-royal-900 group-hover:text-white">
                  <ArrowUpRight size={19} />
                </span>
              </a>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-600">
                  {s.title}
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-royal-900">
                  <a href={servicePath(s.id)}>{SERVICE_LABELS[s.id]}</a>
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {s.shortSummary || s.summary}
                </p>
                <div className="my-4 flex flex-wrap gap-2">
                  {s.facts?.slice(0, 2).map((f) => (
                    <span
                      key={f.label}
                      className="rounded-md bg-[#f6f4ee] px-2.5 py-1.5 text-[11px] text-royal-800"
                    >
                      {f.label}: {f.value}
                    </span>
                  ))}
                </div>
                {s.approx && (
                  <p className="mb-4 text-sm font-bold text-royal-900">
                    {s.approx}
                    <span className="ml-2 text-[10px] font-normal text-muted">
                      আনুমানিক
                    </span>
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-4">
                  <a
                    href={servicePath(s.id)}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-royal-900"
                  >
                    বিস্তারিত দেখুন
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href={waLink(s.cta.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SERVICE_LABELS[s.id]} WhatsApp-এ কোটেশন নিন`}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#edf5ef] px-3 text-xs font-bold text-[#176b46]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    কোটেশন
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs leading-6 text-muted">
          উল্লিখিত দাম প্রাথমিক ধারণা। সাইজ, ম্যাটেরিয়াল, রঙ ও পরিমাণ অনুযায়ী
          চূড়ান্ত কোটেশন দেওয়া হবে।
        </p>
      </Container>
    </section>
  );
}
