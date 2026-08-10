import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import { Button, Reveal, WhatsAppIcon } from "./ui";
import { waLink, COMPANY } from "@/lib/site";
import { SERVICE_IMAGES } from "@/data/services";

// Helper to get the first image from the array of images
const getFirstImg = (key: string) => SERVICE_IMAGES[key]?.[0] || "";

// Updated service list matching our 10 active services
const CAROUSEL_SERVICES = [
  { id: "cylinder", label: "Cylinder", src: getFirstImg("cylinder") },
  { id: "ld-packet", label: "LD Packet", src: getFirstImg("ld-packet") },
  { id: "foil-packet", label: "Foil Packet", src: getFirstImg("foil-packet") },
  { id: "sticker", label: "Sticker", src: getFirstImg("sticker") },
  { id: "art-paper", label: "Art Paper", src: getFirstImg("art-paper") },
  { id: "custom-box", label: "Custom Box", src: getFirstImg("custom-box") },
  { id: "ready-made", label: "Ready-made", src: getFirstImg("ready-made") },
  { id: "security-poly", label: "Security Poly", src: getFirstImg("security-poly") },
  { id: "offset", label: "Offset", src: getFirstImg("offset") },
  { id: "other", label: "Other Pack", src: getFirstImg("other") },
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % CAROUSEL_SERVICES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-royal-900 text-white">
      <div className="absolute inset-0 bg-linear-to-br from-royal-900 via-royal-800 to-royal-950" />
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-royal-500/20 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-3.5 py-8 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-16">
        <div className="max-w-[560px]">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/25 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300 sm:px-3.5 sm:py-1.5 sm:text-[11px]">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Printing & Packaging · Est. {COMPANY.established}
            </span>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-3 text-[20px] font-extrabold leading-[1.22] sm:mt-4 sm:text-[28px] lg:text-[38px]">
              আপনার ব্র্যান্ডের জন্য
              <br className="hidden sm:block" />
              প্রিন্টিং ও প্যাকেজিং—
              <span className="mt-1 block bg-linear-to-r from-gold-200 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                সব সমাধান এক জায়গায়
              </span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-3 max-w-[46ch] text-[12px] leading-relaxed text-royal-100/75 sm:text-[13px]">
              Custom Packaging, Flexible Packaging, Offset Printing & Packaging — আপনার প্রয়োজন অনুযায়ী দ্রুত সমাধান।
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row">
              <Button href="#quote" variant="gold" size="md" className="w-full sm:w-auto">
                কোটেশন নিন
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="md"
                className="w-full sm:w-auto"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp করুন
              </Button>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-royal-100/70 sm:text-xs">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-gold-300" /> ডিজাইন ফ্রি
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-gold-300" /> ২৪/৭ সাপোর্ট
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-gold-300" /> Custom Solution
              </span>
            </div>
          </Reveal>
        </div>

        {/* Right — Service Carousel */}
        <Reveal delay={140} className="relative">
          <div className="relative mx-auto max-w-[520px]">
            <div className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-gold-400/20 to-transparent blur-md sm:-inset-3 sm:rounded-4xl" />
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-royal-800 shadow-soft sm:rounded-2xl">
              {/* Carousel */}
              <div className="relative h-[200px] w-full sm:h-80 lg:h-[380px]">
                {CAROUSEL_SERVICES.map((item, idx) => (
                  <img
                    key={item.id}
                    src={item.src}
                    alt={item.label}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                    style={{ opacity: idx === current ? 1 : 0 }}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                ))}
                <div className="absolute inset-0 bg-linear-to-t from-royal-950/50 via-transparent to-transparent" />

                {/* Label for current service */}
                <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-royal-800 shadow-sm backdrop-blur sm:bottom-4 sm:left-4">
                  {CAROUSEL_SERVICES[current]?.label}
                </div>

                {/* Dots */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 sm:bottom-4 sm:right-4">
                  {CAROUSEL_SERVICES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Slide ${idx + 1}`}
                      onClick={() => setCurrent(idx)}
                      className={`h-1.5 rounded-full transition-all ${idx === current ? "w-6 bg-gold-300" : "w-1.5 bg-white/50"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* floating badge — only year */}
            <div className="absolute -left-2 top-5 rounded-lg border border-white/10 bg-white/95 px-3 py-2 shadow-card backdrop-blur sm:-left-4 sm:top-6 sm:rounded-xl sm:px-3.5">
              <p className="text-[16px] font-extrabold leading-none text-royal-800 sm:text-lg">{COMPANY.established}</p>
              <p className="mt-0.5 text-[9px] font-medium text-muted sm:text-[10px]">থেকে</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}