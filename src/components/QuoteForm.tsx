import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Send } from "lucide-react";
import { Container, WhatsAppIcon } from "./ui";
import { SERVICES_FOR_FORM } from "@/data/services";
import { CONTACT, waLink } from "@/lib/site";

const inputClass =
  "min-h-12 w-full rounded-xl border border-line bg-[#fcfcfa] px-4 py-3 text-base text-royal-900 placeholder:text-muted/65 focus:border-royal-600 focus:outline-none focus:ring-2 focus:ring-royal-100";
const normalizePhone = (value: string) =>
  value
    .replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit)))
    .replace(/[\s()-]/g, "");

export function QuoteForm({
  initialService = "",
}: {
  initialService?: string;
}) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    service: SERVICES_FOR_FORM.includes(initialService) ? initialService : "",
    size: "",
    quantity: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [prepared, setPrepared] = useState("");
  const update = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setPrepared("");
    setError("");
  };
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const mobile = normalizePhone(form.mobile);
    if (!form.name.trim()) {
      setError("আপনার নাম লিখুন।");
      return;
    }
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(mobile)) {
      setError("সঠিক বাংলাদেশি মোবাইল নম্বর দিন, যেমন 01660191039।");
      return;
    }
    const message = [
      "প্যাকেজিং কোটেশন অনুরোধ",
      `নাম: ${form.name.trim()}`,
      `মোবাইল: ${mobile}`,
      `সেবা: ${form.service}`,
      form.size.trim() && `সাইজ: ${form.size.trim()}`,
      form.quantity.trim() && `পরিমাণ: ${form.quantity.trim()}`,
      form.message.trim() && `বিস্তারিত: ${form.message.trim()}`,
      "সাইজ, ম্যাটেরিয়াল, চূড়ান্ত দাম ও ডেলিভারির সময় জানাবেন।",
    ]
      .filter(Boolean)
      .join("\n");
    setError("");
    setPrepared(message);
    window.fbq?.("trackCustom", "QuotePrepared", { service: form.service });
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  }
  return (
    <section id="quote" className="scroll-mt-28 bg-white py-12 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <p className="kicker">LET’S MAKE IT HAPPEN</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-snug text-royal-900 sm:text-4xl">
              আপনার পরিকল্পনা,
              <br />
              আমাদের জানান।
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">
              তিনটি প্রয়োজনীয় তথ্য দিলেই শুরু। সাইজ বা ম্যাটেরিয়াল না জানলেও
              সমস্যা নেই—আমরা আলোচনা করে বুঝে নেব।
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {[
                "আপনার তথ্য দিয়ে WhatsApp মেসেজ তৈরি হবে",
                "WhatsApp-এ নিজে Send করে পাঠাবেন",
                "চূড়ান্ত দাম ও শর্ত বুঝে অর্ডার করবেন",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#176b46]" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-fit items-center gap-3 rounded-2xl bg-[#f0f5ee] p-4 text-[#176b46]"
            >
              <WhatsAppIcon className="h-6 w-6" />
              <span>
                <span className="block text-xs">
                  ফর্ম ছাড়াও সরাসরি কথা বলুন
                </span>
                <span className="mt-1 block text-lg font-extrabold">
                  {CONTACT.whatsappDisplay}
                </span>
              </span>
              <ArrowUpRight size={20} />
            </a>
          </div>
          <form
            onSubmit={submit}
            className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <h3 className="font-bold text-royal-900">কোটেশনের তথ্য</h3>
              <span className="text-xs text-muted">* চিহ্নিত তথ্য প্রয়োজন</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-royal-900">
                আপনার নাম *
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="নাম লিখুন"
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-royal-900">
                মোবাইল নম্বর *
                <input
                  name="mobile"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  maxLength={20}
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value)}
                  aria-describedby={error ? "quote-error" : undefined}
                  placeholder="01XXXXXXXXX"
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className="text-sm font-semibold text-royal-900 sm:col-span-2">
                কোন সেবাটি প্রয়োজন? *
                <select
                  name="service"
                  required
                  value={form.service}
                  onChange={(e) => update("service", e.target.value)}
                  className={`${inputClass} mt-2`}
                >
                  <option value="">একটি সেবা বেছে নিন</option>
                  {SERVICES_FOR_FORM.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                  <option>পরামর্শ চাই / নিশ্চিত নই</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-royal-900">
                সাইজ <span className="font-normal text-muted">(ঐচ্ছিক)</span>
                <input
                  name="size"
                  maxLength={100}
                  value={form.size}
                  onChange={(e) => update("size", e.target.value)}
                  placeholder="যেমন 8 × 12 inch"
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className="text-sm font-semibold text-royal-900">
                পরিমাণ <span className="font-normal text-muted">(ঐচ্ছিক)</span>
                <input
                  name="quantity"
                  maxLength={100}
                  value={form.quantity}
                  onChange={(e) => update("quantity", e.target.value)}
                  placeholder="যেমন 150 KG / 500 pcs"
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className="text-sm font-semibold text-royal-900 sm:col-span-2">
                আর কিছু জানাতে চান?{" "}
                <span className="font-normal text-muted">(ঐচ্ছিক)</span>
                <textarea
                  name="message"
                  rows={3}
                  maxLength={1500}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="পণ্যের ধরন, ডিজাইন বা কোনো প্রশ্ন…"
                  className={`${inputClass} mt-2 resize-y`}
                />
              </label>
            </div>
            {error && (
              <p
                id="quote-error"
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#176b46] px-4 py-3 font-bold text-white transition-colors hover:bg-[#105436]"
            >
              <Send size={18} />
              WhatsApp-এ তথ্য প্রস্তুত করুন
            </button>
            <p className="mt-3 text-xs leading-6 text-muted">
              এখানে কোনো পেমেন্ট লাগবে না। সাবমিট করলে তথ্য এই সাইটের সার্ভারে
              সংরক্ষিত হয় না; WhatsApp-এ Send করলে আপনি তথ্য শেয়ার করবেন।
            </p>
            {prepared && (
              <div
                role="status"
                className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-7 text-green-900"
              >
                <p>
                  তথ্য প্রস্তুত। WhatsApp-এ <strong>Send</strong> করে পাঠান।
                  উইন্ডো না খুললে নিচের লিংক ব্যবহার করুন।
                </p>
                <a
                  href={waLink(prepared)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center font-bold underline"
                >
                  প্রস্তুত মেসেজটি WhatsApp-এ খুলুন
                  <ArrowUpRight size={16} />
                </a>
              </div>
            )}
            <noscript>
              <p className="mt-4 text-sm">
                ফর্ম ব্যবহারে JavaScript প্রয়োজন। উপরের WhatsApp নম্বরে সরাসরি
                যোগাযোগ করতে পারেন।
              </p>
            </noscript>
          </form>
        </div>
      </Container>
    </section>
  );
}
