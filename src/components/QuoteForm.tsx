import { useState, type ReactNode, type FormEvent } from "react";
import { CheckCircle2, ShieldCheck, Send } from "lucide-react";
import { Container, SectionHeading, Reveal, WhatsAppIcon } from "./ui";
import { SERVICES_FOR_FORM } from "@/data/services";
import { waLink } from "@/lib/site";
import { cn } from "@/utils/cn";

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[13px] font-semibold text-ink">
        {label} {required && <span className="text-gold-600">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-royal-400 focus:ring-2 focus:ring-royal-100";

export function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    mobile: "",
    service: "",
    size: "",
    quantity: "",
    colours: "",
    design: "না",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.service) return;

    const msg = [
      "নতুন কোটেশন অনুরোধ:",
      `নাম: ${form.name}`,
      form.company && `কোম্পানি: ${form.company}`,
      `মোবাইল: ${form.mobile}`,
      `সার্ভিস: ${form.service}`,
      form.size && `Product Size: ${form.size}`,
      form.quantity && `Quantity: ${form.quantity}`,
      form.colours && `Number of Colours: ${form.colours}`,
      `Design আছে কি?: ${form.design}`,
      form.message && `বার্তা: ${form.message}`,
      "",
      "আপনার তৈরি ডিজাইন থাকলে WhatsApp-এ যুক্ত করে পাঠিয়ে দিন।",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(msg), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section id="quote" className="scroll-mt-24 bg-mist py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            center
            eyebrow="কোটেশন নিন"
            title="আপনার প্রয়োজনীয় তথ্য পাঠান"
            subtitle="নিচের ফর্মটি পূরণ করুন — Submit করলে তথ্য WhatsApp-এ পাঠানো হবে এবং আমরা দ্রুত আনুমানিক quotation দেব।"
          />
        </Reveal>

        <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col justify-between gap-6 rounded-2xl bg-royal-900 p-7 text-white">
              <div>
                <h3 className="text-xl font-bold">কেন কোটেশন নেবেন?</h3>
                <ul className="mt-4 space-y-3 text-[14px] text-royal-100/85">
                  {[
                    "আপনার specification অনুযায়ী আনুমানিক মূল্য।",
                    "Minimum Order ও Cylinder সম্পর্কে স্পষ্ট ধারণা।",
                    "বাজেট অনুযায়ী বিকল্প Solution পরামর্শ।",
                    "Design Support (সংশ্লিষ্ট কাজে)।",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-[13px] text-royal-100/80">
                <p className="flex items-center gap-2 font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-gold-300" />
                  দ্রুত ও নিরাপদ
                </p>
                <p className="mt-1.5">
                  ফর্মের তথ্য সরাসরি WhatsApp-এ যায়। কোনো অগ্রিম পেমেন্ট নয় — শুধু আলোচনা শুরু করুন।
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-3">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-line bg-white p-10 text-center shadow-card">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">
                  ধন্যবাদ! তথ্য প্রস্তুত হয়েছে
                </h3>
                <p className="mt-2 max-w-md text-[15px] text-muted">
                  WhatsApp উইন্ডো খুলে গেলে <strong>Send</strong> করে আমাদের সাথে তথ্য শেয়ার করুন।
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-5 text-sm font-semibold text-royal-700 underline-offset-4 hover:underline"
                >
                  আরেকটি কোটেশন অনুরোধ করুন
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="নাম" required>
                    <input
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="আপনার নাম"
                      required
                    />
                  </Field>

                  <Field label="কোম্পানির নাম">
                    <input
                      className={inputCls}
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="কোম্পানি / ব্র্যান্ড"
                    />
                  </Field>

                  <Field label="মোবাইল নম্বর" required className="sm:col-span-2">
                    <input
                      className={inputCls}
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      placeholder="01XXXXXXXXX"
                      inputMode="tel"
                      required
                    />
                  </Field>

                  <Field label="আপনার প্রয়োজনীয় সার্ভিস" required className="sm:col-span-2">
                    <select
                      className={cn(inputCls, "appearance-none bg-white")}
                      value={form.service}
                      onChange={(e) => update("service", e.target.value)}
                      required
                    >
                      <option value="">সার্ভিস নির্বাচন করুন</option>
                      {SERVICES_FOR_FORM.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Product Size">
                    <input
                      className={inputCls}
                      value={form.size}
                      onChange={(e) => update("size", e.target.value)}
                      placeholder="যেমন 8 × 12 inch"
                    />
                  </Field>

                  <Field label="Quantity">
                    <input
                      className={inputCls}
                      value={form.quantity}
                      onChange={(e) => update("quantity", e.target.value)}
                      placeholder="যেমন 150 KG / 500 pcs"
                    />
                  </Field>

                  <Field label="Number of Colours">
                    <input
                      className={inputCls}
                      value={form.colours}
                      onChange={(e) => update("colours", e.target.value)}
                      placeholder="যেমন 4 Colour"
                    />
                  </Field>

                  <Field label="Design আছে কি?" className="sm:col-span-2">
                    <div className="flex gap-2">
                      {["হ্যাঁ", "না"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => update("design", opt)}
                          className={cn(
                            "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                            form.design === opt
                              ? "border-royal-600 bg-royal-50 text-royal-700"
                              : "border-line bg-white text-muted hover:border-royal-200"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-[12px] text-muted">
                      আপনার তৈরি ডিজাইন থাকলে WhatsApp-এ যুক্ত করে পাঠিয়ে দিন।
                    </p>
                  </Field>

                  <Field label="Additional Message" className="sm:col-span-2">
                    <textarea
                      rows={3}
                      className={cn(inputCls, "resize-none")}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="অতিরিক্ত তথ্য বা প্রশ্ন লিখুন…"
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-b from-[#2bd76a] to-[#20c95e] px-6 py-3.5 text-base font-bold text-white shadow-[0_14px_34px_-12px_rgba(37,211,102,0.6)] transition-transform hover:from-[#2ee07a] hover:to-[#23d363] active:scale-[0.99]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  কোটেশনের জন্য পাঠান
                  <Send className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-[12px] text-muted">
                  Submit করলে আপনার তথ্য WhatsApp-এ প্রস্তুত হবে — Send করে শেয়ার করুন।
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
