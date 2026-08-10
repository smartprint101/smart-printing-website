import { Phone, Mail, MapPin } from "lucide-react";
import { Container, WhatsAppIcon, FacebookIcon } from "./ui";
import { Logo } from "./Logo";
import { NAV_LINKS, CONTACT, ADDRESS, waLink } from "@/lib/site";

const SERVICE_LINKS = [
  "Cylinder",
  "LD Packet",
  "Foil Packet",
  "Sticker",
  "Art Paper",
  "Box",
  "Offset Printing",
  "Digital Printing",
  "Packaging Design",
  "Ready-made Packaging",
];

export function Footer() {
  return (
    <footer className="bg-royal-950 text-royal-100/75">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed">
              আপনার ব্র্যান্ডের জন্য Printing &amp; Packaging Solution — Custom Packaging, Flexible
              Packaging, Offset &amp; Digital Printing এবং আরও অনেক কিছু।
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-royal-100 ring-1 ring-white/10 transition-colors hover:bg-[#25D366] hover:text-white"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-royal-100 ring-1 ring-white/10 transition-colors hover:bg-[#1877F2] hover:text-white"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href={`tel:${CONTACT.phoneDial}`}
                aria-label="Call"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-royal-100 ring-1 ring-white/10 transition-colors hover:bg-gold-400 hover:text-royal-900"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-gold-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Services</h4>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 text-[14px] sm:grid-cols-2">
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <a href="#services" className="transition-colors hover:text-gold-300">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-[14px]">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={`tel:${CONTACT.phoneDial}`} className="hover:text-gold-300">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">
                  {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={`mailto:${CONTACT.email}`} className="break-all hover:text-gold-300">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{ADDRESS.lines.join(" ")}</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-center text-[13px] sm:flex-row sm:text-left">
          <p>© 2026 Smart Printing Packaging. All Rights Reserved.</p>
          <p className="text-royal-100/50">স্যাম্পল ওয়েবসাইট — চূড়ান্ত ডেভেলপমেন্টের পূর্বে অনুমোদনের জন্য।</p>
        </Container>
      </div>
    </footer>
  );
}
