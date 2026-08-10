import { Wallet, ArrowRight, MessageCircleQuestion } from "lucide-react";
import { Container, Reveal, Button, WhatsAppIcon, Eyebrow } from "./ui";
import { waLink } from "@/lib/site";

export function Budget() {
  return (
    <section className="relative overflow-hidden bg-royal-900 py-14 text-white sm:py-20">
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-royal-500/30 blur-3xl" />
      <div className="absolute -right-20 -top-10 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow light>বাজেট ধারণা</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Custom Printed Packaging করতে কত বাজেট লাগতে পারে?
          </h2>
        </Reveal>

        <Reveal delay={100} className="mx-auto mt-8 max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-gold-400/30 bg-white/5 p-8 text-center backdrop-blur sm:p-10">
            <div className="flex items-center justify-center gap-2 text-gold-300">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.16em]">
                Estimated Project Budget
              </span>
            </div>
            <p className="mt-3 text-4xl font-black leading-none text-gradient-gold sm:text-5xl">
              ৳৭০,০০০ – ৳১,২০,০০০+
            </p>
            <p className="mt-5 text-base leading-relaxed text-royal-100/85">
              Custom LD অথবা Foil Packet-এর ক্ষেত্রে <strong className="text-white">Cylinder সহ</strong> প্রাথমিক
              মোট বাজেট এই range-এর মধ্যে হতে পারে।
            </p>
            <p className="mt-3 text-sm text-royal-100/60">
              এটি কোনো fixed package price নয়। Final quotation আপনার Size, Material, Colour, Quantity,
              Printing এবং Cylinder specification অনুযায়ী নির্ধারিত হবে।
            </p>
            <div className="mt-7 flex justify-center">
              <Button
                href={waLink("আমি Custom Printed Packaging করতে চাই। আমার Budget অনুযায়ী Solution ও আনুমানিক quotation জানান:")}
                target="_blank"
                rel="noopener noreferrer"
                variant="gold"
                size="lg"
              >
                <WhatsAppIcon className="h-5 w-5" />
                আপনার Budget অনুযায়ী Solution জানুন
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Low budget alternative */}
        <Reveal delay={160}>
          <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 text-center sm:flex-row sm:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-400/20 text-gold-300">
              <MessageCircleQuestion className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="text-lg font-bold text-white">বাজেট কম?</p>
              <p className="text-sm text-royal-100/80">
                অল্প খরচে বিকল্প Printing &amp; Packaging Solution নিয়ে আমাদের সাথে কথা বলুন।
              </p>
            </div>
            <Button
              href={waLink("আমার বাজেট কম। অল্প খরচে বিকল্প Printing & Packaging Solution সম্পর্কে জানান:")}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlineLight"
              size="sm"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp করুন
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
