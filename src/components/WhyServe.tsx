import {
  Layers,
  Boxes,
  Gift,
  Printer,
  PackageCheck,
  MessageCircle,
  Package,
  UtensilsCrossed,
  Soup,
  ShoppingCart,
  Store,
  SprayCan,
  ShoppingBasket,
  Rocket,
  Briefcase,
  Building2,
  Factory,
  Box,
  type LucideIcon,
} from "lucide-react";
import { Container, SectionHeading, Reveal, Eyebrow } from "./ui";

const REASONS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Layers, title: "Printing & Packaging এক জায়গায়", desc: "একাধিক সেবা এক ছাদের নিচে।" },
  { icon: Boxes, title: "Custom Packaging Solution", desc: "আপনার ব্র্যান্ড ও প্রোডাক্ট অনুযায়ী।" },
  { icon: Gift, title: "Design Support FREE", desc: "সংশ্লিষ্ট Printing/Packaging কাজে।" },
  { icon: Printer, title: "Multiple Printing Options", desc: "Offset, Digital ও অন্যান্য।" },
  { icon: PackageCheck, title: "Ready-made Packaging", desc: "1 KG থেকে সহজলভ্য।" },
  { icon: MessageCircle, title: "WhatsApp-এ দ্রুত যোগাযোগ", desc: "Online support ২৪/৭।" },
];

const SERVE: { icon: LucideIcon; label: string }[] = [
  { icon: Package, label: "FMCG Brands" },
  { icon: UtensilsCrossed, label: "Food Businesses" },
  { icon: Soup, label: "Restaurants" },
  { icon: ShoppingCart, label: "E-commerce Businesses" },
  { icon: Store, label: "Retail Businesses" },
  { icon: SprayCan, label: "Cosmetics & Personal Care" },
  { icon: ShoppingBasket, label: "Grocery Brands" },
  { icon: Rocket, label: "Startups" },
  { icon: Briefcase, label: "Small Businesses" },
  { icon: Building2, label: "Corporate Businesses" },
  { icon: Factory, label: "Manufacturers" },
  { icon: Box, label: "Product-based Businesses" },
];

export function WhyChooseUs() {
  return (
    <section className="scroll-mt-24 bg-mist py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            center
            eyebrow="কেন আমরা"
            title="কেন Smart Printing Packaging"
            subtitle="স্বচ্ছ মূল্য, কাস্টম সমাধান এবং দ্রুত যোগাযোগের ওপর নির্ভর করে আস্থা।"
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 70}>
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-soft">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-royal-50 text-royal-700 transition-colors group-hover:bg-gold-100 group-hover:text-gold-700">
                  <r.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold text-ink">{r.title}</h3>
                  <p className="mt-1 text-[14px] text-muted">{r.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function WhoWeServe() {
  return (
    <section className="scroll-mt-24 bg-white py-14 sm:py-20">
      <Container>
        <Reveal className="text-center">
          <Eyebrow>Who We Serve</Eyebrow>
          <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-ink sm:text-[32px]">
            কারা আমাদের সেবা নিতে পারেন?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
            যাদের Printing &amp; Packaging প্রয়োজন — ছোট ব্যবসা থেকে বড় ব্র্যান্ড, সবার জন্য সমাধান।
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:grid-cols-3 lg:grid-cols-4">
          {SERVE.map((s, i) => (
            <Reveal key={s.label} delay={(i % 4) * 60}>
              <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-soft">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-royal-50 text-royal-700 transition-colors group-hover:bg-royal-700 group-hover:text-white">
                  <s.icon className="h-7 w-7" />
                </span>
                <span className="text-[15px] font-semibold text-ink">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
