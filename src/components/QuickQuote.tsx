import { Container, Reveal, Button, WhatsAppIcon, Eyebrow } from "./ui";
import { waLink } from "@/lib/site";

export function QuickQuote() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl border border-royal-100 bg-gradient-to-br from-royal-800 to-royal-950 px-6 py-12 text-center text-white shadow-soft sm:px-12 sm:py-14">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <div className="flex justify-center">
              <Eyebrow light>Quick Solution</Eyebrow>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              আপনার Packaging-এর জন্য সঠিক Solution খুঁজছেন?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-royal-100/85 sm:text-lg">
              আপনার Product, Size, Quantity বা Design-এর তথ্য আমাদের WhatsApp-এ পাঠান। আমরা আপনার প্রয়োজন
              অনুযায়ী সম্ভাব্য Printing &amp; Packaging Solution এবং আনুমানিক বাজেট সম্পর্কে ধারণা দেব।
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              {["Product", "Size", "Quantity", "Design"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-royal-100"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                href={waLink("আমি Packaging-এর জন্য সঠিক Solution চাই। আমার Product, Size, Quantity/Design তথ্য পাঠাচ্ছি:")}
                target="_blank"
                rel="noopener noreferrer"
                variant="gold"
                size="lg"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp-এ তথ্য পাঠান
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
