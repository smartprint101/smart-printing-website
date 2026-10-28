import { ArrowUpRight, Check, Phone, BookOpen } from "lucide-react";
import {
  SERVICES,
  SERVICE_IMAGES,
  PACKET_SERVICE_IDS,
  type Service,
} from "@/data/services";
import { SERVICE_SEO, servicePath } from "@/lib/seo";
import { ADDRESS, CONTACT, waLink, waLinkPacket } from "@/lib/site";
import { Button, Container, WhatsAppIcon } from "./ui";

export function ServiceDirectory() {
  return (
    <section id="packaging-guide" className="bg-white py-14 sm:py-20">
      <Container>
        <h2 className="text-2xl font-extrabold text-royal-900 sm:text-3xl">
          আপনার পণ্যের জন্য কোন প্যাকেজিং প্রয়োজন?
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          প্যাকেজিং তৈরির আগে পণ্যের ধরন, ওজন, সংরক্ষণের প্রয়োজন এবং বাজেট
          বিবেচনা করুন। কাস্টম প্রিন্টেড প্যাকেটের জন্য ডিজাইন ও সিলিন্ডারের
          প্রয়োজন হতে পারে; কম পরিমাণে শুরু করতে রেডিমেড প্যাকেট ও স্টিকার
          বিকল্প হিসেবে বিবেচনা করতে পারেন। নিচের সেবা থেকে ব্যবহার, ম্যাটেরিয়াল
          ও অর্ডারের বিস্তারিত জানুন।
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href={servicePath(s.id)}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-mist p-4 text-sm font-bold text-royal-800 transition-colors hover:border-gold-400"
            >
              {SERVICE_SEO[s.id].heading}{" "}
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-extrabold text-royal-900">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-muted"
          >
            <Check className="mt-1 h-4 w-4 shrink-0 text-gold-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ServicePage({ service: s }: { service: Service }) {
  const images = SERVICE_IMAGES[s.id] ?? [];
  const quote = PACKET_SERVICE_IDS.has(s.id)
    ? waLinkPacket(s.cta.message)
    : waLink(s.cta.message);
  return (
    <>
      <article className="bg-[#f6f4ee] py-8 sm:py-14">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <ol className="flex flex-wrap gap-2">
              <li>
                <a href="/" className="text-royal-700 underline">
                  হোম
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{s.title}</li>
            </ol>
          </nav>
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#80502c]">
                {s.title} · Dhaka, Bangladesh
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-snug text-royal-900 sm:text-4xl">
                {SERVICE_SEO[s.id].heading}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted">
                {s.summary}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <Button
                  className="min-h-12"
                  href={quote}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  কোটেশন নিন
                </Button>
                <Button
                  className="min-h-12"
                  href={`tel:${CONTACT.phoneDial}`}
                  variant="royal"
                >
                  <Phone className="h-4 w-4" />
                  কল করুন
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {s.facts?.slice(0, 2).map((f) => (
                  <span
                    key={f.label}
                    className="rounded-lg border border-[#ddd9cf] bg-white px-3 py-2 text-xs text-royal-800"
                  >
                    {f.label}: <strong>{f.value}</strong>
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                {ADDRESS.lines.join(" ")} · সাইজ, পরিমাণ ও ডিজাইন জানিয়ে
                অর্ডারের বিস্তারিত নিশ্চিত করুন।
              </p>
            </div>
            {images[0] && (
              <img
                src={images[0]}
                alt={`${s.title} — প্যাকেজিং নমুনা, Smart Printing Packaging`}
                width={720}
                height={540}
                fetchPriority="high"
                className="aspect-[4/3] w-full rounded-2xl border border-line bg-white object-contain"
              />
            )}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-8">
              {s.whatIsIt && (
                <section>
                  <h2 className="text-xl font-extrabold text-royal-900">
                    {s.title} কী ও কীভাবে ব্যবহার হয়?
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {s.whatIsIt}
                  </p>
                </section>
              )}
              <InfoList title="কোন পণ্যের জন্য উপযোগী?" items={s.suitableFor} />
              <InfoList title="সুবিধা ও বৈশিষ্ট্য" items={s.benefits} />
              <InfoList title="সেবার বিস্তারিত" items={s.bullets} />
              <InfoList title="এই সেবায় যা আছে" items={s.gridItems} />
              <InfoList
                title="অর্ডারের আগে যা জানা প্রয়োজন"
                items={s.detailExtra}
              />
              {s.comparison?.map((c) => (
                <InfoList key={c.title} title={c.title} items={c.items} />
              ))}
              {s.extraInfo && (
                <section className="mt-8">
                  <h2 className="text-xl font-extrabold text-royal-900">
                    {s.extraInfo.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {s.extraInfo.content}
                  </p>
                </section>
              )}
              {s.readymadeProducts && (
                <section className="mt-8">
                  <h2 className="text-xl font-extrabold text-royal-900">
                    রেডিমেড প্যাকেটের সাইজ ও আনুমানিক দাম
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {s.readymadeProducts.map((p) => (
                      <div
                        key={p.name}
                        className="rounded-xl border border-line p-4"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          width={320}
                          height={320}
                          className="aspect-square w-full object-contain"
                        />
                        <h3 className="mt-3 font-bold text-royal-900">
                          {p.name}
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                          সাইজ: {p.size}
                        </p>
                        <p className="mt-2 text-sm text-muted">
                          আনুমানিক দাম: {p.price}
                        </p>
                        <p className="mt-2 text-sm text-muted">
                          ন্যূনতম অর্ডার: {p.minOrder}
                        </p>
                        <a
                          className="mt-3 inline-block text-sm font-bold text-royal-700 underline"
                          href={waLinkPacket(p.waMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          স্টক ও চূড়ান্ত দাম জানতে যোগাযোগ করুন
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section className="mt-8 rounded-xl bg-mist p-5">
                <h2 className="text-xl font-extrabold text-royal-900">
                  কীভাবে অর্ডার করবেন?
                </h2>
                <ol className="mt-4 list-inside list-decimal space-y-3 text-sm leading-relaxed text-muted">
                  <li>
                    পণ্যের ধরন, প্যাকেট বা প্রিন্টের সাইজ এবং প্রয়োজনীয় পরিমাণ
                    জানান।
                  </li>
                  <li>লোগো, ডিজাইন বা পছন্দের নমুনা থাকলে WhatsApp-এ পাঠান।</li>
                  <li>
                    ম্যাটেরিয়াল, প্রিন্টিং, চূড়ান্ত দাম ও ডেলিভারির সময় নিশ্চিত
                    করে অর্ডার দিন।
                  </li>
                </ol>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  এই পেজের মূল্য ধারণা চূড়ান্ত কোটেশন নয়। ম্যাটেরিয়াল, পরিমাণ,
                  ডিজাইন ও বাজারদর অনুযায়ী দাম পরিবর্তিত হতে পারে।
                </p>
              </section>
            </div>
            <aside className="space-y-6">
              <a
                href="/guides/packaging-quotation-checklist/"
                className="flex min-h-14 items-center gap-3 rounded-xl border border-line bg-white p-4 text-sm font-bold text-royal-900"
              >
                <BookOpen className="h-5 w-5 shrink-0 text-gold-600" />
                কোটেশন নেওয়ার আগে চেকলিস্ট দেখুন
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
              <section className="rounded-2xl border border-line bg-white p-6">
                <h2 className="text-xl font-extrabold text-royal-900">
                  অর্ডারের তথ্য
                </h2>
                {s.facts && (
                  <dl className="mt-4 space-y-4">
                    {s.facts.map((f) => (
                      <div key={f.label}>
                        <dt className="text-sm font-semibold text-royal-800">
                          {f.label}
                        </dt>
                        <dd className="mt-1 text-sm leading-relaxed text-muted">
                          {f.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                {s.approx && (
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {s.approxLabel || "আনুমানিক মূল্য"}: {s.approx}
                  </p>
                )}
                {s.note && (
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {s.note}
                  </p>
                )}
                {s.offer && (
                  <p className="mt-4 text-sm font-semibold text-royal-800">
                    {s.offer}
                  </p>
                )}
                <Button
                  href={quote}
                  variant="whatsapp"
                  className="mt-5 w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {s.cta.text}
                </Button>
              </section>
              {images.slice(1, 3).map((image, i) => (
                <img
                  key={image}
                  src={image}
                  alt={`${s.title} — নমুনা ${i + 2}`}
                  width={480}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full rounded-2xl bg-white object-contain"
                />
              ))}
            </aside>
          </div>
        </Container>
      </article>
      <ServiceDirectory />
    </>
  );
}
