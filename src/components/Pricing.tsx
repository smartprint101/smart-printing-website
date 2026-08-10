import { AlertTriangle, ArrowRight } from "lucide-react";
import { Container, SectionHeading, Reveal, Button, WhatsAppIcon } from "./ui";
import { waLink } from "@/lib/site";

const PRICE_CARDS = [
  { name: "Custom LD Packet", price: "৳৪২০–৪৬০ / KG", note: "Minimum 150 KG", tag: "আনুমানিক" },
  { name: "Custom Foil Packet", price: "৳৫০০–৫৫০ / KG", note: "Minimum 200 KG", tag: "আনুমানিক" },
  { name: "Sticker Printing", price: "৳৭,০০০ / packet", note: "400-sheet packet (10×15 inch)", tag: "আনুমানিক" },
  { name: "Sticker Dry Cutting", price: "৳৭,৫০০ / packet", note: "Dry Cutting সহ", tag: "আনুমানিক" },
  { name: "Art Paper", price: "৳৯,০০০–৯,৫০০", note: "500 sheets (20×30 inch)", tag: "আনুমানিক" },
  { name: "Custom Box", price: "Size & Spec অনুযায়ী", note: "Paper/Board, Printing, Finishing", tag: "Quote" },
  {
    name: "Ready-made Packaging",
    price: "1 KG থেকে",
    note: "Zipper / LD / Foil · Size & Quantity অনুযায়ী",
    tag: "Quote",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            center
            eyebrow="প্রাথমিক মূল্য ধারণা"
            title="আনুমানিক মূল্য এক নজরে"
            subtitle="নিচের মূল্যগুলো শুধু প্রাথমিক ধারণা — সঠিক মূল্যের জন্য আপনার specification প্রয়োজন।"
          />
        </Reveal>

        <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2 lg:grid-cols-3">
          {PRICE_CARDS.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 70}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[17px] font-bold leading-tight text-ink sm:text-lg">{c.name}</h3>
                  <span
                    className={
                      "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide " +
                      (c.tag === "Quote" ? "bg-royal-50 text-royal-700" : "bg-gold-100 text-gold-700")
                    }
                  >
                    {c.tag}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-extrabold leading-tight text-royal-700 sm:text-[28px]">
                  {c.price}
                </p>
                <p className="mt-1.5 text-[13px] text-muted">{c.note}</p>
                <div className="mt-4 h-px w-full bg-line" />
                <a
                  href={waLink(`আমি ${c.name} এর সঠিক মূল্য জানতে চাই। আমার specification: `)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-royal-700 underline-offset-4 hover:underline"
                >
                  সঠিক মূল্য জানুন
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Disclaimer */}
        <Reveal delay={100}>
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-gold-200 bg-gold-50 p-6 sm:flex-row sm:items-center sm:p-7">
            <AlertTriangle className="h-8 w-8 shrink-0 text-gold-600" />
            <p className="flex-1 text-[15px] leading-relaxed text-ink">
              উপরের মূল্যগুলো <strong>প্রাথমিক/আনুমানিক ধারণা মাত্র</strong>। Size, Thickness, Material,
              Colour, Printing, Quantity, Design, Cylinder এবং বর্তমান বাজারদরের উপর চূড়ান্ত মূল্য নির্ভর করে।
            </p>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-8 text-center">
            <Button
              href={waLink("আমি সঠিক মূল্য জানতে চাই। আমার প্রয়োজন পাঠাচ্ছি:")}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
            >
              <WhatsAppIcon className="h-5 w-5" />
              সঠিক মূল্য জানতে WhatsApp-এ প্রয়োজন পাঠান
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
