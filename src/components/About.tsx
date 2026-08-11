import {
  ArrowRight,
  Calculator,
  Package,
  Disc3,
  ShoppingBag,
  Sticker as StickerIcon,
  Newspaper,
  Box,
  PackageCheck,
  Printer,
  Shield,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { Container, Eyebrow, Reveal, Button, WhatsAppIcon } from "./ui";
import { waLink, COMPANY } from "@/lib/site";
import aboutImg from "@/assets/about-facility.jpg";

// ==================== 10 SERVICES LIST ====================

const services = [
  { id: "cylinder", label: "Printing Cylinder", icon: Disc3 },
  { id: "ld-packet", label: "LD Packet", icon: ShoppingBag },
  { id: "foil-packet", label: "Foil Packet", icon: Package },
  { id: "sticker", label: "Sticker Printing", icon: StickerIcon },
  { id: "art-paper", label: "Art Paper Print", icon: Newspaper },
  { id: "custom-box", label: "Custom Box", icon: Box },
  { id: "ready-made", label: "Ready-made Packet", icon: PackageCheck },
  { id: "security-poly", label: "Security Poly", icon: Shield },
  { id: "offset", label: "Offset Printing", icon: Printer },
  { id: "other", label: "Other Packaging", icon: LayoutGrid },
];

// ==================== FEATURED TOOLS (Highlighted) ====================

const featuredTools = [
  {
    id: "product-finder",
    href: "#product-finder",
    icon: Package,
    label: "প্যাকেট ফাইন্ডার",
    desc: "৩টা প্রশ্নে সঠিক প্যাকেট খুঁজুন",
    badge: "🎯 নতুন",
    gradient: "from-royal-700 to-royal-900",
  },
  {
    id: "calculator",
    href: "#budget",
    icon: Calculator,
    label: "বাজেট ক্যালকুলেটর",
    desc: "তাৎক্ষণিক প্রাইস হিসাব করুন",
    badge: "⚡ ফ্রি টুল",
    gradient: "from-gold-500 to-gold-700",
  },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image side */}
          <Reveal className="relative">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-2xl border-l-2 border-t-2 border-gold-400" />
              <div className="overflow-hidden rounded-2xl shadow-soft">
                <img
                  src={aboutImg}
                  alt="Smart Printing Packaging production facility"
                  className="h-[340px] w-full object-cover sm:h-[440px]"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-3 rounded-2xl border border-line bg-white px-5 py-4 shadow-card sm:-right-6">
                <p className="text-3xl font-extrabold text-royal-700">{COMPANY.established}</p>
                <p className="text-xs font-medium text-muted">সাল থেকে কার্যক্রম</p>
              </div>
            </div>
          </Reveal>

          {/* Copy side */}
          <div>
            <Reveal>
              <Eyebrow>আমাদের সম্পর্কে</Eyebrow>
              <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-ink sm:text-[32px]">
                এক জায়গায় Printing ও Packaging-এর{" "}
                <span className="text-royal-700">সম্পূর্ণ সমাধান</span>
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                Smart Printing Packaging একটি পূর্ণাঙ্গ Printing &amp; Packaging Solution Provider,
                যা বিভিন্ন ব্যবসা ও ব্র্যান্ডের জন্য Custom Packaging, Flexible Packaging, Printing
                এবং Packaging-related solutions প্রদান করে।
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {COMPANY.established} সাল থেকে যাত্রা শুরু করে আমরা ছোট-বড় ব্যবসা, ব্র্যান্ড ও
                প্রোডাক্ট-ভিত্তিক কোম্পানির প্রয়োজন অনুযায়ী বিশ্বস্ত ও পেশাদার Printing ও Packaging
                সমাধান দিয়ে আসছি।
              </p>
            </Reveal>

            {/* ⭐ FEATURED TOOLS - 2 Highlighted Cards */}
            <Reveal delay={120}>
              <div className="mt-7">
                <p className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-gold-600">
                  <Sparkles className="h-4 w-4" />
                  আমাদের ফ্রি টুল
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {featuredTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <a
                        key={tool.id}
                        href={tool.href}
                        className="group relative overflow-hidden rounded-2xl border-2 border-gold-200 bg-linear-to-br from-gold-50 to-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-soft"
                        aria-label={tool.label}
                      >
                        {/* Badge */}
                        <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold text-royal-700 shadow-sm ring-1 ring-gold-200">
                          {tool.badge}
                        </span>

                        {/* Icon */}
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${tool.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Label */}
                        <p className="mt-3 text-[14px] font-extrabold text-ink group-hover:text-royal-800">
                          {tool.label}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-muted">
                          {tool.desc}
                        </p>

                        {/* Arrow */}
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-gold-700 transition-transform group-hover:translate-x-1">
                          <span>এখনই চেক করুন</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            {/* 10 SERVICES LIST */}
            <Reveal delay={180}>
              <div className="mt-6">
                <p className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-royal-700">
                  <Package className="h-4 w-4" />
                  আমাদের ১০টি সেবা
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <a
                        key={service.id}
                        href="#services"
                        className="group flex items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-2 transition-all hover:border-gold-300 hover:bg-gold-50"
                        aria-label={`${service.label} - বিস্তারিত দেখুন`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mist text-royal-700 transition-colors group-hover:bg-gold-100 group-hover:text-gold-700">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="flex-1 text-[12px] font-semibold text-ink group-hover:text-royal-800 sm:text-[13px]">
                          {service.label}
                        </span>
                        <ArrowRight className="h-3 w-3 shrink-0 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-gold-600" />
                      </a>
                    );
                  })}
                </div>
                <p className="mt-2 text-center text-[11px] text-muted">
                  💡 যেকোনো সেবায় ক্লিক করুন — বিস্তারিত দেখুন
                </p>
              </div>
            </Reveal>

            {/* CTA Buttons */}
            <Reveal delay={240}>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="#quote" variant="gold">
                  কোটেশন নিন
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button href={waLink()} target="_blank" rel="noopener noreferrer" variant="outlineGold">
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp করুন
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}