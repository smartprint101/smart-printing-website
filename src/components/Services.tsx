import { useEffect, useState } from "react";
import {
  Gift,
  Info,
  Check,
  X,
  Eye,
  Wallet,
  Sparkles,
  Package as PackageIcon,
  Lightbulb,
  Target,
} from "lucide-react";
import { Container, SectionHeading, Reveal, Button, WhatsAppIcon } from "./ui";
import { SERVICES, SERVICE_IMAGES, PACKET_SERVICE_IDS, type Service, type ReadymadeProduct } from "@/data/services";
import { waLink, waLinkPacket, CONTACT } from "@/lib/site";
import { cn } from "@/utils/cn";

/* -------------------------------------------------
   Highlighted Title Component
-------------------------------------------------- */
function HighlightedTitle({
  title,
  highlight,
  className,
}: {
  title: string;
  highlight: string;
  className?: string;
}) {
  const parts = title.split(highlight);
  return (
    <span className={className}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="relative inline-block bg-linear-to-r from-gold-500 to-gold-600 bg-clip-text font-extrabold text-transparent">
              {highlight}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-linear-to-r from-gold-400 to-gold-600 opacity-60" />
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------
   Image Slideshow Component (Auto-changing)
-------------------------------------------------- */
function ServiceImageSlideshow({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  const images = SERVICE_IMAGES[service.id] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const { icon: Icon, title } = service;

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative flex w-full shrink-0 items-center justify-center overflow-hidden bg-linear-to-br from-royal-800 via-royal-700 to-royal-900",
          className
        )}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(224,194,95,0.35),transparent_55%)]" />
        </div>
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
          <Icon className="h-7 w-7 text-gold-300" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full shrink-0 overflow-hidden bg-mist", className)}>
      <img
        src={images[currentIndex]}
        alt={`${title} — নমুনা ${currentIndex + 1}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-royal-950/20 via-transparent to-transparent" />

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-6 bg-gold-400" : "w-1.5 bg-white/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------
   Compact Service Card
-------------------------------------------------- */
function ServiceCard({ service, onDetail }: { service: Service; onDetail: (s: Service) => void }) {
  const packet = PACKET_SERVICE_IDS.has(service.id);
  const Icon = service.icon;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-royal-200 hover:shadow-soft">
      <ServiceImageSlideshow service={service} className="h-48 sm:h-52" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-700"><Icon className="h-4 w-4" /></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-600">Service {service.no}</span>
        </div>
        <h3 className="mt-4 text-base font-extrabold leading-snug text-royal-900">{service.title}</h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted">{service.shortSummary || service.summary}</p>
        {service.approx && <p className="mt-3 text-sm font-bold text-royal-700">{service.approx}</p>}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <button type="button" onClick={() => onDetail(service)} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-royal-200 px-2 text-xs font-bold text-royal-700 transition-colors hover:bg-royal-50">
            <Eye className="h-4 w-4" /> বিস্তারিত
          </button>
          <a href={packet ? waLinkPacket(service.cta.message) : waLink(service.cta.message)} target="_blank" rel="noopener noreferrer" aria-label={`${service.title} সম্পর্কে WhatsApp করুন`} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-royal-900 px-2 text-xs font-bold text-white transition-colors hover:bg-royal-700">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------
   Ready-made Products Grid (Inside Modal)
-------------------------------------------------- */
function ReadymadeProductsGrid({ products }: { products: ReadymadeProduct[] }) {
  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-2">
        <PackageIcon className="h-5 w-5 text-gold-600" />
        <h4 className="text-[15px] font-bold text-ink">আমাদের প্রোডাক্ট তালিকা</h4>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <div
            key={product.name}
            className="group overflow-hidden rounded-2xl border border-line bg-white transition-all hover:border-gold-300 hover:shadow-card"
          >
            <div className="relative h-40 overflow-hidden bg-mist">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-royal-800 backdrop-blur">
                Min: {product.minOrder}
              </div>
            </div>

            <div className="p-3.5">
              <h5 className="text-[14px] font-bold text-ink">{product.name}</h5>
              <div className="mt-2 space-y-1">
                <p className="flex items-center gap-1.5 text-[12px] text-muted">
                  <span className="font-semibold text-gold-700">দাম:</span>
                  <span className="font-bold text-ink">{product.price}</span>
                </p>
                <p className="flex items-center gap-1.5 text-[12px] text-muted">
                  <span className="font-semibold text-gold-700">সাইজ:</span>
                  <span>{product.size}</span>
                </p>
              </div>

              <a
                href={waLinkPacket(product.waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 text-[12px] font-bold text-white shadow-sm transition-colors hover:bg-[#1fb858]"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                অর্ডার করুন
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-royal-100 bg-royal-50 p-4">
        <p className="flex items-center gap-2 text-[13px] font-bold text-royal-800">
          <Info className="h-4 w-4 text-royal-600" />
          প্রয়োজনীয় তথ্য
        </p>
        <ul className="mt-2.5 space-y-1.5">
          <li className="flex items-start gap-2 text-[12px] text-royal-700">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
            <span>মাত্র 1 KG থেকে অর্ডার করা যায় — কোনো মিনিমাম বড় অর্ডার নেই</span>
          </li>
          <li className="flex items-start gap-2 text-[12px] text-royal-700">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
            <span>সব সাইজ স্টকে উপলব্ধ — চাহিদা মতো নিতে পারবেন</span>
          </li>
          <li className="flex items-start gap-2 text-[12px] text-royal-700">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
            <span>দাম সাইজ ও পরিমাণ অনুযায়ী কম-বেশি হতে পারে</span>
          </li>
          <li className="flex items-start gap-2 text-[12px] text-royal-700">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
            <span>ঢাকার ভেতরে 1-2 দিনে, ঢাকার বাইরে 2-4 দিনে ডেলিভারি</span>
          </li>
          <li className="flex items-start gap-2 text-[12px] text-royal-700">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
            <span>যেকোনো প্রশ্নের জন্য WhatsApp-এ অর্ডার বাটনে ক্লিক করুন</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Detail Modal
-------------------------------------------------- */
function DetailModal({ service, onClose }: { service: Service | null; onClose: () => void }) {
  useEffect(() => {
    if (!service) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [service, onClose]);

  if (!service) return null;
  const packet = PACKET_SERVICE_IDS.has(service.id);
  const hasAltCta = !!service.altCta;

  return (
    <div className="fixed inset-0 z-80 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-royal-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-soft sm:max-h-[86vh] sm:rounded-3xl">
        {/* Header image */}
        <div className="relative h-48 shrink-0 sm:h-56">
          <ServiceImageSlideshow service={service} className="h-full" />
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-royal-800 shadow-card backdrop-blur transition-colors hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-royal-700 backdrop-blur">
              SERVICE {service.no}
            </span>
            {service.approx && (
              <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-bold text-royal-900">
                {service.approx}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-royal-700 to-royal-900 text-white">
              <service.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[18px] font-extrabold leading-snug text-ink sm:text-[20px]">
                <HighlightedTitle title={service.title} highlight={service.titleHighlight} />
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted sm:text-[14px]">{service.summary}</p>
            </div>
          </div>

          {/* What is it? */}
          {service.whatIsIt && (
            <div className="mt-5 rounded-2xl border border-royal-100 bg-royal-50 p-4">
              <p className="flex items-center gap-2 text-[14px] font-bold text-royal-800">
                <Lightbulb className="h-4 w-4 text-gold-500" />
                এটা আসলে কী?
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-royal-700">{service.whatIsIt}</p>
            </div>
          )}

          {/* Approx + facts */}
          {(service.approx || service.facts) && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.approx && (
                <div className="rounded-xl bg-gold-50 p-4 ring-1 ring-gold-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-700">
                    {service.approxLabel || "আনুমানিক মূল্য"}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-ink">{service.approx}</p>
                </div>
              )}
              {service.facts && (
                <div className="grid grid-cols-2 gap-2">
                  {service.facts.map((f) => (
                    <div key={f.label} className="rounded-xl border border-line bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{f.label}</p>
                      <p className="mt-0.5 text-[13px] font-bold text-ink">{f.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div className="mt-5">
              <p className="flex items-center gap-2 text-[14px] font-bold text-ink">
                <Sparkles className="h-4 w-4 text-gold-500" />
                সুবিধাসমূহ
              </p>
              <ul className="mt-2.5 space-y-2">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suitable For */}
          {service.suitableFor && service.suitableFor.length > 0 && (
            <div className="mt-5">
              <p className="flex items-center gap-2 text-[14px] font-bold text-ink">
                <Target className="h-4 w-4 text-gold-500" />
                কোন কোন প্রোডাক্টের জন্য উপযোগী
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {service.suitableFor.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-royal-50 px-3 py-1.5 text-[12px] font-medium text-royal-700 ring-1 ring-royal-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ready-made Products Grid */}
          {service.readymadeProducts && service.readymadeProducts.length > 0 && (
            <ReadymadeProductsGrid products={service.readymadeProducts} />
          )}

          {/* Bullets */}
          {service.bullets && (
            <ul className="mt-5 space-y-2.5">
              {service.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Comparison for cylinder */}
          {service.comparison && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.comparison.map((c, i) => (
                <div
                  key={c.title}
                  className={cn(
                    "rounded-2xl border p-4",
                    i === 0 ? "border-gold-200 bg-gold-50" : "border-line bg-white"
                  )}
                >
                  <p className="flex items-center justify-between text-[14px] font-bold text-ink">
                    {c.title}
                    <span
                      className={cn(
                        "ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        i === 0 ? "bg-gold-200 text-gold-800" : "bg-mist text-muted"
                      )}
                    >
                      {i === 0 ? "Premium" : "Budget"}
                    </span>
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {c.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-[12px] leading-relaxed text-muted">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Grid items */}
          {service.gridItems && service.gridItems.length > 0 && (
            <div className="mt-5">
              <p className="text-[13px] font-semibold text-ink">এই সেবায় যা আছে</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {service.gridItems.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-mist px-3 py-1 text-[12px] font-medium text-royal-800 ring-1 ring-line"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extra Info (Art Paper vs Sticker) */}
          {service.extraInfo && (
            <div className="mt-5 rounded-2xl border-2 border-gold-200 bg-linear-to-br from-gold-50 to-white p-4">
              <p className="flex items-center gap-2 text-[14px] font-bold text-ink">
                <Info className="h-4 w-4 text-gold-600" />
                {service.extraInfo.title}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-royal-700">{service.extraInfo.content}</p>
            </div>
          )}

          {/* Extra detail */}
          {service.detailExtra && (
            <div className="mt-5 rounded-xl bg-mist p-4 ring-1 ring-line">
              <p className="flex items-center gap-2 text-[13px] font-bold text-royal-800">
                <Sparkles className="h-4 w-4 text-gold-500" />
                অতিরিক্ত তথ্য
              </p>
              <ul className="mt-2 space-y-1.5">
                {service.detailExtra.map((d) => (
                  <li key={d} className="text-[13px] leading-relaxed text-muted">
                    • {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Offer + note */}
          {service.offer && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-royal-50 px-4 py-3 ring-1 ring-royal-100">
              <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
              <p className="text-[13px] font-semibold text-royal-800">{service.offer}</p>
            </div>
          )}
          {service.note && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-mist px-4 py-3 text-[12px] italic leading-relaxed text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted/70" />
              <span>{service.note}</span>
            </p>
          )}

          {/* Budget alternative — ONLY for Service 1, 2, 3 */}
          {hasAltCta && (
            <div className="mt-6 rounded-2xl border border-gold-200 bg-linear-to-br from-gold-50 to-white p-4">
              <p className="flex items-center gap-2 text-[14px] font-bold text-ink">
                <Wallet className="h-4 w-4 text-gold-600" />
                বাজেট কম?
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                অল্প খরচে বিকল্প Packaging Solution জানতে আমাদের সাথে কথা বলুন — আপনার বাজেট অনুযায়ী সেরা অপশন সাজিয়ে দেব।
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <Button
                  href={waLink(service.altCta!.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlineGold"
                  size="sm"
                  className="w-full justify-center"
                >
                  <Wallet className="h-4 w-4" />
                  বিকল্প দেখুন
                </Button>
                <Button
                  href={packet ? waLinkPacket(service.cta.message) : waLink(service.cta.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="sm"
                  className="w-full justify-center"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky footer CTA */}
        <div className="sticky bottom-0 border-t border-line bg-white p-4 sm:p-5">
          <Button
            href={packet ? waLinkPacket(service.cta.message) : waLink(service.cta.message)}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            className="w-full justify-center"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {service.cta.text}
          </Button>
          <p className="mt-2 text-center text-[11px] text-muted">
            {packet ? `Packet/Cylinder WhatsApp: ${CONTACT.whatsappPacketDisplay}` : `WhatsApp: ${CONTACT.whatsappDisplay}`}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Main Services Component
-------------------------------------------------- */
export function Services() {
  const [selected, setSelected] = useState<Service | null>(null);
  const services = SERVICES.filter((service) => service.id !== "ready-made");

  return (
    <section id="services" className="scroll-mt-24 bg-mist py-10 sm:py-16">
      <Container className="px-3.5 sm:px-6">
        <Reveal>
          <SectionHeading
            center
            eyebrow="আমাদের সেবা"
            title={<>আপনার ব্র্যান্ডের জন্য আমাদের সেবা</>}
            subtitle="কাস্টম প্রিন্টিং থেকে প্যাকেজিং—আপনার প্রয়োজন অনুযায়ী সঠিক সেবাটি বেছে নিন।"
          />
        </Reveal>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 50} className="h-full">
              <ServiceCard service={service} onDetail={setSelected} />
            </Reveal>
          ))}
        </div>
      </Container>

      <DetailModal service={selected} onClose={() => setSelected(null)} />
    </section>
  );
}