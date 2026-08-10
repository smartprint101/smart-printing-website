import { useState } from "react";
import { Plus, MessageCircleQuestion } from "lucide-react";
import { Container, SectionHeading, Reveal, Button, WhatsAppIcon } from "./ui";
import { waLink } from "@/lib/site";
import { cn } from "@/utils/cn";

const FAQS = [
  { q: "LD Packet-এর Minimum Order কত?", a: "150 KG।" },
  { q: "Foil Packet-এর Minimum Order কত?", a: "200 KG।" },
  {
    q: "Custom LD/Foil Packet-এর জন্য Cylinder লাগে কি?",
    a: "হ্যাঁ, Custom printed LD/Foil packaging-এর ক্ষেত্রে Cylinder প্রয়োজন।",
  },
  {
    q: "Cylinder কি একবারই বানাতে হয়?",
    a: "একই Item/Design-এর জন্য Cylinder একবার তৈরি করার পর পরবর্তী পুনরায় Printing-এ ব্যবহার করা যায়, যদি Cylinder ও specification উপযুক্ত থাকে।",
  },
  {
    q: "প্রতিটি নতুন Product-এর জন্য কি নতুন Cylinder লাগে?",
    a: "নতুন Item/Design অনুযায়ী নতুন Cylinder Set প্রয়োজন হতে পারে।",
  },
  { q: "Cylinder-এর দাম কীভাবে নির্ধারিত হয়?", a: "Size ও specification অনুযায়ী।" },
  {
    q: "Digital Cylinder ও বাংলা Cylinder-এর পার্থক্য কী?",
    a: "Digital Cylinder তুলনামূলক ভালো print quality-এর জন্য ব্যবহৃত হয় এবং এর cost বেশি। বাংলা Cylinder তুলনামূলক কম খরচের option, তবে print quality তুলনামূলক কম হতে পারে।",
  },
  {
    q: "Design কি করতে হবে?",
    a: "Smart Printing Packaging-এর মাধ্যমে relevant printing/packaging কাজ করলে Design Support FREE।",
  },
  {
    q: "Ready-made packaging কি পাওয়া যায়?",
    a: "হ্যাঁ। Zipper, LD এবং Foil ready-made packaging 1 KG থেকে নেওয়া যায়, availability ও size অনুযায়ী।",
  },
  {
    q: "Final price কীভাবে জানা যাবে?",
    a: "Size, quantity, material, colour, printing specification ও current market condition অনুযায়ী final quotation দেওয়া হবে। WhatsApp-এ তথ্য পাঠাতে হবে।",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="FAQ"
                title="সাধারণ জিজ্ঞাসা"
                subtitle="সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নগুলোর উত্তর। আরও কিছু জানতে চাইলে WhatsApp করুন।"
              />
              <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-royal-50 text-royal-700">
                    <MessageCircleQuestion className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">আরও প্রশ্ন আছে?</p>
                    <p className="text-[13px] text-muted">সরাসরি WhatsApp-এ জিজ্ঞাসা করুন।</p>
                  </div>
                </div>
                <Button
                  href={waLink("আমার একটি প্রশ্ন আছে: ")}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  className="mt-4 w-full"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp করুন
                </Button>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="space-y-3">
              {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                  <Reveal key={f.q} delay={(i % 4) * 50}>
                    <div
                      className={cn(
                        "overflow-hidden rounded-2xl border bg-white transition-colors",
                        isOpen ? "border-gold-300 shadow-card" : "border-line"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[15px] font-bold text-ink">{f.q}</span>
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all",
                            isOpen ? "rotate-45 bg-royal-700 text-white" : "bg-mist text-royal-700"
                          )}
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                      <div
                        className="grid transition-all duration-300 ease-out"
                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-4 text-[14px] leading-relaxed text-muted">{f.a}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
