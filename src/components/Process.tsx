import { useState } from "react";
import { Info, Banknote, Clock } from "lucide-react";
import { Container, SectionHeading, Reveal } from "./ui";
import { cn } from "@/utils/cn";

interface Flow {
  key: string;
  label: string;
  steps: { title: string; sub?: string }[];
  note?: string;
}

const FLOWS: Flow[] = [
  {
    key: "ld-foil",
    label: "Custom LD / Foil",
    steps: [
      { title: "প্রয়োজন ও Specification জানান" },
      { title: "Design Confirm করুন" },
      { title: "Cylinder Order" },
      { title: "Cylinder Payment — 100%", sub: "Cylinder-এর জন্য সম্পূর্ণ পেমেন্ট" },
      { title: "প্রায় ৫ দিনের মধ্যে Cylinder" },
      { title: "Production-এর জন্য 50% Advance" },
      { title: "প্রায় ১০ দিনের Production" },
      { title: "Final Payment" },
      { title: "Product Delivery / Collection" },
    ],
    note: "একটি নতুন Item/Design-এর জন্য নতুন Cylinder Set প্রয়োজন হতে পারে। একই Cylinder ভবিষ্যতে একই Item/Design-এর পুনরায় Printing-এ ব্যবহার করা যায়।",
  },
  {
    key: "offset",
    label: "Offset Printing",
    steps: [
      { title: "Design Confirm" },
      { title: "50% Advance", sub: "Design Confirm করার দিন" },
      { title: "Production" },
      { title: "Approximately 7 Days", sub: "Confirm-এর পর আনুমানিক" },
      { title: "Remaining Payment" },
      { title: "Delivery" },
    ],
    note: "প্রতিটি কাজের নির্দিষ্ট delivery time গ্যারান্টি দেওয়া হয় না — কাজের ধরন অনুযায়ী সময় কম-বেশি হতে পারে।",
  },
  {
    key: "other",
    label: "অন্যান্য সেবা",
    steps: [
      { title: "Requirement", sub: "আপনার প্রয়োজন জানান" },
      { title: "Quote", sub: "আনুমানিক মূল্য" },
      { title: "Design", sub: "প্রয়োজন অনুযায়ী" },
      { title: "Confirmation", sub: "কাজ কনফার্ম" },
      { title: "Production", sub: "উৎপাদন" },
      { title: "Delivery", sub: "ডেলিভারি" },
    ],
  },
];

export function Process() {
  const [active, setActive] = useState("ld-foil");
  const flow = FLOWS.find((f) => f.key === active)!;

  return (
    <section id="process" className="scroll-mt-24 bg-mist py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            center
            eyebrow="কাজের প্রক্রিয়া"
            title="কীভাবে কাজ এগোয়"
            subtitle="স্বচ্ছ ও সহজ একটি প্রক্রিয়া — প্রথম যোগাযোগ থেকে শুরু করে প্রোডাক্ট ডেলিভারি পর্যন্ত।"
          />
        </Reveal>

        {/* Tabs */}
        <Reveal delay={80}>
          <div className="mt-9 flex flex-wrap justify-center gap-2.5">
            {FLOWS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
                  active === f.key
                    ? "bg-royal-700 text-white shadow-card"
                    : "border border-line bg-white text-muted hover:border-royal-200 hover:text-royal-700"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Steps grid */}
        <ol className="relative mt-10 flex flex-col gap-3.5 sm:gap-4 lg:grid lg:grid-cols-3">
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-[19px] top-4 w-0.5 bg-line lg:hidden"
          />
          {flow.steps.map((step, i) => (
            <Reveal key={`${flow.key}-${i}`} delay={(i % 3) * 70}>
              <li className="relative flex items-start gap-4 lg:block">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-royal-700 text-sm font-bold text-white ring-4 ring-mist lg:mb-3">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-2xl border border-line bg-white p-4 shadow-card transition-colors hover:border-gold-300 lg:p-5">
                  <p className="text-[15px] font-bold leading-snug text-ink">{step.title}</p>
                  {step.sub && <p className="mt-1 text-[13px] text-muted">{step.sub}</p>}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        {flow.note && (
          <Reveal delay={120}>
            <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2.5 rounded-xl bg-mist px-5 py-4 text-sm leading-relaxed text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
              <span>{flow.note}</span>
            </p>
          </Reveal>
        )}

        {/* Payment summary */}
        <Reveal delay={120}>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal-50 text-royal-700">
                  <Banknote className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-ink">Custom LD / Foil — Payment</h3>
              </div>
              <ul className="mt-4 space-y-2 text-[14px] text-muted">
                <li>• Cylinder Order-এর সময় <strong className="text-ink">100% Cylinder Payment</strong>।</li>
                <li>• Cylinder আসার পর Production-এর জন্য <strong className="text-ink">50% Advance</strong>।</li>
                <li>• প্রোডাক্ট ডেলিভারি/কালেকশনের আগে <strong className="text-ink">বাকি Payment</strong>।</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal-50 text-royal-700">
                  <Clock className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-ink">Approximate Timeline</h3>
              </div>
              <ul className="mt-4 space-y-2 text-[14px] text-muted">
                <li>• Cylinder: Design/Cylinder Order-এর পর <strong className="text-ink">প্রায় ৫ দিন</strong>।</li>
                <li>• Production: <strong className="text-ink">প্রায় ১০ দিন</strong>।</li>
                <li>• Offset: Confirm-এর পর <strong className="text-ink">প্রায় ৭ দিন</strong>।</li>
              </ul>
              <p className="mt-3 text-[12px] italic text-muted">
                সময়গুলো আনুমানিক — কাজ ও specification অনুযায়ী পরিবর্তিত হতে পারে।
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
