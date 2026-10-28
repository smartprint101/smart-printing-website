import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { GUIDES, guidePath, type PackagingGuide } from "@/data/guides";
import { SERVICE_LABELS } from "./Services";
import { servicePath } from "@/lib/seo";
import { waLink } from "@/lib/site";
import { Container, WhatsAppIcon } from "./ui";

export function GuideCards() {
  return (
    <section id="guides" className="scroll-mt-28 bg-[#f6f4ee] py-12 sm:py-20">
      <Container>
        <p className="kicker">A LITTLE KNOW-HOW GOES A LONG WAY</p>
        <h2 className="mt-3 text-3xl font-extrabold text-royal-900">
          অর্ডারের আগে, জেনে নিন।
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          ম্যাটেরিয়াল, বাজেট ও অর্ডারের প্রস্তুতি—সঠিক সিদ্ধান্তের ছোট্ট গাইড।
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {GUIDES.map((g, i) => (
            <article
              key={g.slug}
              className="flex flex-col rounded-2xl border border-[#dedacf] bg-white p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <BookOpen className="h-6 w-6 text-[#996034]" />
                <span className="text-xs text-muted">0{i + 1}</span>
              </div>
              <p className="mt-6 text-xs font-semibold text-gold-600">
                {g.label}
              </p>
              <h3 className="mt-3 text-xl font-bold leading-relaxed text-royal-900">
                <a href={guidePath(g.slug)}>{g.title}</a>
              </h3>
              <p className="mb-5 mt-3 text-sm leading-7 text-muted">
                {g.description}
              </p>
              <a
                href={guidePath(g.slug)}
                className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-bold text-royal-900"
              >
                গাইডটি পড়ুন
                <ArrowRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function GuidePage({ guide: g }: { guide: PackagingGuide }) {
  return (
    <>
      <article className="bg-white py-8 sm:py-14">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <a href="/">হোম</a>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <a href="/#guides">প্যাকেজিং গাইড</a>
          </nav>
          <div className="grid items-start gap-10 lg:grid-cols-[2fr_1fr] lg:gap-16">
            <div>
              <p className="kicker">PACKAGING GUIDE · {g.label}</p>
              <h1 className="mt-4 text-3xl font-extrabold leading-relaxed text-royal-900 sm:text-4xl">
                {g.title}
              </h1>
              <p className="mt-5 text-base leading-8 text-muted">
                {g.description}
              </p>
              <p className="mt-5 border-y border-line py-3 text-xs text-muted">
                প্রস্তুত করেছে: Smart Printing Packaging · ঢাকা, বাংলাদেশ
              </p>
              <nav
                aria-label="এই গাইডে যা আছে"
                className="mt-7 rounded-2xl bg-[#f6f4ee] p-5"
              >
                <p className="font-bold text-royal-900">এই গাইডে</p>
                <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-muted">
                  {g.sections.map((s, i) => (
                    <li key={s.heading}>
                      <a
                        href={`#guide-section-${i + 1}`}
                        className="inline-block py-1 underline-offset-4 hover:underline"
                      >
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              {g.sections.map((s, i) => (
                <section
                  key={s.heading}
                  id={`guide-section-${i + 1}`}
                  className="mt-9 scroll-mt-36"
                >
                  <h2 className="text-2xl font-bold leading-relaxed text-royal-900">
                    {s.heading}
                  </h2>
                  <p className="mt-4 text-[15px] leading-8 text-muted">
                    {s.text}
                  </p>
                  {s.points && (
                    <ul className="mt-4 list-outside list-disc space-y-3 pl-5 text-sm leading-7 text-muted">
                      {s.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <p className="mt-9 rounded-xl border border-line p-5 text-xs leading-6 text-muted">
                এটি সাধারণ প্রস্তুতিমূলক নির্দেশনা। পণ্যের উপযোগিতা,
                ম্যাটেরিয়াল, দাম ও ডেলিভারির শর্ত অর্ডারের আগে নিশ্চিত করুন।
              </p>
            </div>
            <aside className="rounded-2xl bg-royal-900 p-6 text-white lg:sticky lg:top-36">
              <p className="text-xs font-semibold tracking-widest text-gold-300">
                NEXT STEP
              </p>
              <h2 className="mt-3 text-xl font-bold">প্রয়োজনের সেবাটি দেখুন</h2>
              <div className="mt-4 space-y-1">
                {g.services.map((id) => (
                  <a
                    key={id}
                    href={servicePath(id)}
                    className="flex min-h-12 items-center justify-between gap-2 border-b border-white/15 py-3 text-sm font-semibold"
                  >
                    {SERVICE_LABELS[id]}
                    <ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
              <a
                href={waLink(
                  `আমি এই গাইডটি পড়েছি: ${g.title}। আমার পণ্যের প্যাকেজিং নিয়ে আলোচনা করতে চাই।`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-bold text-royal-900"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp-এ পরামর্শ নিন
              </a>
            </aside>
          </div>
        </Container>
      </article>
      <GuideCards />
    </>
  );
}
