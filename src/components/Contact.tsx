import { Clock, MapPin, Mail, ArrowUpRight, Phone } from "lucide-react";
import { Container, WhatsAppIcon } from "./ui";
import { CONTACT, ADDRESS, HOURS, waLink } from "@/lib/site";

export function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-28 border-t border-line bg-[#f6f4ee] py-12 sm:py-20"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="kicker">A CONVERSATION IS A GOOD START</p>
            <h2 className="mt-3 text-3xl font-extrabold text-royal-900">
              চলুন, কথা বলি।
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              পণ্যের ছবি, সাইজ বা একটি আইডিয়া—যেখান থেকেই শুরু করুন, প্রয়োজনটি
              জানান।
            </p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-royal-900 p-5 text-white sm:p-6"
            >
              <div className="flex items-center gap-4">
                <WhatsAppIcon className="h-7 w-7 shrink-0 text-gold-300" />
                <span>
                  <span className="block text-xs text-white/70">
                    সব প্রোডাক্ট ও সেবার জন্য WhatsApp
                  </span>
                  <span className="mt-1 block text-2xl font-extrabold">
                    {CONTACT.whatsappDisplay}
                  </span>
                </span>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0" />
            </a>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <a
                href={`tel:${CONTACT.phoneDial}`}
                className="flex min-h-14 items-start gap-3 rounded-xl border border-[#ddd9cf] p-4"
              >
                <Phone size={18} className="mt-1 shrink-0 text-gold-600" />
                <span>
                  <span className="block text-xs text-muted">অফিস ফোন</span>
                  <span className="mt-1 block text-sm font-bold text-royal-900">
                    {CONTACT.phoneDisplay}
                  </span>
                </span>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex min-h-14 items-start gap-3 rounded-xl border border-[#ddd9cf] p-4"
              >
                <Mail size={18} className="mt-1 shrink-0 text-gold-600" />
                <span className="min-w-0">
                  <span className="block text-xs text-muted">ইমেইল</span>
                  <span className="mt-1 block break-all text-sm font-semibold text-royal-900">
                    {CONTACT.email}
                  </span>
                </span>
              </a>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 shrink-0 text-gold-600" />
                <div>
                  <h3 className="text-sm font-bold text-royal-900">
                    আমাদের ঠিকানা
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {ADDRESS.lines.join(" ")}
                  </p>
                  <a
                    href={ADDRESS.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center gap-1 text-xs font-bold text-royal-900 underline"
                  >
                    ম্যাপে ঠিকানা খুঁজুন
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="mt-1 shrink-0 text-gold-600" />
                <div>
                  <h3 className="text-sm font-bold text-royal-900">
                    অফিসের সময়
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {HOURS.office}
                    <br />
                    {HOURS.friday}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-muted">
                    অনলাইনে যেকোনো সময় মেসেজ রেখে যেতে পারেন।
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#ddd9cf] bg-white">
            <iframe
              title="Smart Printing Packaging — আরমানীটোলা, ঢাকা"
              src={ADDRESS.mapEmbed}
              width="640"
              height="480"
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
