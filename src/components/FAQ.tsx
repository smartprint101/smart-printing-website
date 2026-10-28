import { Plus } from "lucide-react";
import { Container } from "./ui";
import { waLink } from "@/lib/site";

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
  {
    q: "Cylinder-এর দাম কীভাবে নির্ধারিত হয়?",
    a: "Size ও specification অনুযায়ী।",
  },
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
  return (
    <section id="faq" className="scroll-mt-28 bg-white py-12 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <p className="kicker">GOOD QUESTIONS, CLEAR ANSWERS</p>
            <h2 className="mt-3 text-3xl font-extrabold text-royal-900">
              কিছু সাধারণ প্রশ্ন।
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              অর্ডার, ডিজাইন বা ন্যূনতম পরিমাণ নিয়ে প্রশ্ন? উত্তর দেখে নিন।
            </p>
            <a
              href={waLink("প্যাকেজিং নিয়ে আমার একটি প্রশ্ন আছে: ")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-royal-900 underline underline-offset-4"
            >
              অন্য প্রশ্ন থাকলে WhatsApp করুন
            </a>
          </div>
          <div className="border-t border-line">
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                className="faq-item border-b border-line"
                open={i === 0}
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] font-bold leading-7 text-royal-900">
                  {f.q}
                  <Plus size={18} className="shrink-0 text-muted" />
                </summary>
                <p className="pb-5 pr-6 text-sm leading-7 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
