import { ArrowUpRight, Check, Layers, PenTool, Send } from "lucide-react";
import { Container } from "./ui";
import materials from "@/assets/materials-flatlay.webp";

export function ShoppingHelp() {
  return (
    <>
      <section
        id="process"
        className="scroll-mt-28 bg-[#f6f4ee] py-12 sm:py-20"
      >
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-14">
            <div>
              <p className="kicker">FROM IDEA TO PACKAGING</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-snug text-royal-900">
                অর্ডার করুন,
                <br />
                সহজ তিন ধাপে।
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                আগে কথা বলুন, তারপর সিদ্ধান্ত নিন। কোটেশন চাওয়া মানেই অর্ডার
                নিশ্চিত নয়।
              </p>
            </div>
            <ol className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: Layers,
                  title: "প্রয়োজন জানান",
                  text: "পণ্য, সাইজ ও পরিমাণ বেছে নিন। ডিজাইন বা নমুনা থাকলে পাঠান।",
                },
                {
                  icon: PenTool,
                  title: "কোটেশন বুঝে নিন",
                  text: "ম্যাটেরিয়াল, প্রিন্ট, চূড়ান্ত দাম ও কাজের সময় নিশ্চিত করুন।",
                },
                {
                  icon: Send,
                  title: "অর্ডার কনফার্ম করুন",
                  text: "ডিজাইন অনুমোদন ও শর্ত নিশ্চিত করে কাজ শুরু করুন।",
                },
              ].map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="border-t border-[#d5d0c4] pt-5">
                  <div className="flex items-center justify-between">
                    <Icon size={25} className="text-[#996034]" />
                    <span className="text-xs font-semibold text-muted">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-royal-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
      <section id="design-support" className="bg-white py-12 sm:py-20">
        <Container>
          <div className="grid overflow-hidden rounded-3xl bg-royal-900 lg:grid-cols-2">
            <div className="p-6 sm:p-10 lg:p-12">
              <p className="kicker !text-gold-300">DESIGNED TO STAND OUT</p>
              <h2 className="mt-4 text-3xl font-bold leading-snug text-white sm:text-4xl">
                ডিজাইন নেই?
                <br />
                শুরুটা একসাথেই করি।
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/75">
                লোগো ও পণ্যের তথ্য দিয়ে আলোচনা শুরু করুন। প্রয়োজন অনুযায়ী
                ডিজাইন সাপোর্ট, খরচ ও কাজের শর্ত কোটেশনের সময় নিশ্চিত করুন।
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/85">
                {["ব্র্যান্ড অনুযায়ী ডিজাইন", "প্রিন্টের আগে অনুমোদন"].map(
                  (t) => (
                    <span key={t} className="flex items-center gap-2">
                      <Check size={15} className="text-gold-300" />
                      {t}
                    </span>
                  ),
                )}
              </div>
              <a
                href="/#quote"
                className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#e6c59b] px-6 text-sm font-bold text-royal-900"
              >
                আপনার আইডিয়া জানান
                <ArrowUpRight size={18} />
              </a>
            </div>
            <figure className="relative min-h-56">
              <img
                src={materials}
                alt="প্যাকেজিং ম্যাটেরিয়াল ও ডিজাইনের নমুনা"
                width={800}
                height={620}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <figcaption className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-royal-900">
                নমুনা ভিজ্যুয়াল
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>
    </>
  );
}
