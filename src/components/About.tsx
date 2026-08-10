import { CheckCircle2, ArrowRight } from "lucide-react";
import { Container, Eyebrow, Reveal, Button, WhatsAppIcon } from "./ui";
import { waLink, COMPANY } from "@/lib/site";
import aboutImg from "@/assets/about-facility.jpg";

const capabilities = [
  "Packaging",
  "Printing",
  "Custom branded products",
  "Flexible packaging",
  "Paper products",
  "Labels",
  "Boxes",
  "Bags",
  "Printing solutions",
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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

            <Reveal delay={140}>
              <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {capabilities.map((c) => (
                  <div key={c} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-500" />
                    <span className="text-[15px] font-medium text-ink">{c}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
