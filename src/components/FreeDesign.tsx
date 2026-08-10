import { Gift, ArrowRight } from "lucide-react";
import { Container, Reveal, Button, WhatsAppIcon } from "./ui";
import { waLink } from "@/lib/site";
import flatlay from "@/assets/materials-flatlay.jpg";

export function FreeDesign() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl bg-royal-900 shadow-soft">
          <div className="bg-grid absolute inset-0 opacity-50" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
                <Gift className="h-3.5 w-3.5" />
                Special Offer
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                আমাদের সাথে কাজ করলে{" "}
                <span className="text-gradient-gold">Design FREE</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-royal-100/85">
                Smart Printing Packaging-এর মাধ্যমে Printing বা Packaging-এর কাজ করলে প্রয়োজন অনুযায়ী
                Design Support FREE। আপনার প্রোডাক্টের জন্য Print-ready Design নিয়ে আলোচনা শুরু করুন।
              </p>
              <p className="mt-3 text-sm text-royal-100/60">
                * এটি প্রযোজ্য যখন সংশ্লিষ্ট Printing/Packaging কাজ Smart Printing Packaging-এর মাধ্যমে
                করা হয়।
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="#quote" variant="gold" size="lg">
                  কোটেশন নিন
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  href={waLink("আমি আপনাদের মাধ্যমে Printing/Packaging কাজ করতে চাই। Design Support সহ বিস্তারিত জানান:")}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlineLight"
                  size="lg"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp করুন
                </Button>
              </div>
            </div>

            <Reveal delay={120} className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/15 shadow-card">
                <img
                  src={flatlay}
                  alt="Premium packaging materials and printed elements"
                  className="h-56 w-full object-cover sm:h-72 lg:h-80"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-5 -left-4 rounded-2xl border border-line bg-white px-5 py-3 shadow-card">
                <p className="text-sm font-bold text-royal-800">Print-ready Artwork</p>
                <p className="text-xs text-muted">সংশ্লিষ্ট কাজে ফ্রি</p>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
