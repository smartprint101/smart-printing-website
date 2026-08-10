import { MapPin, Phone, Mail, Clock, Globe, Navigation } from "lucide-react";
import { Container, SectionHeading, Reveal, Button, WhatsAppIcon, FacebookIcon } from "./ui";
import { CONTACT, ADDRESS, HOURS, waLink, waLinkPacket } from "@/lib/site";
import { Logo } from "./Logo";

export function Contact() {
  const items = [
    {
      icon: Phone,
      label: "ফোন",
      value: CONTACT.phoneDisplay,
      href: `tel:${CONTACT.phoneDial}`,
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp (সাধারণ সেবা)",
      value: CONTACT.whatsappDisplay,
      href: waLink(),
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp (Packet / Cylinder)",
      value: CONTACT.whatsappPacketDisplay,
      href: waLinkPacket(),
    },
    {
      icon: Mail,
      label: "ইমেইল",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    {
      icon: FacebookIcon,
      label: "Facebook",
      value: CONTACT.facebookLabel,
      href: CONTACT.facebook,
    },
    {
      icon: MapPin,
      label: "ঠিকানা",
      value: ADDRESS.lines.join(" "),
      href: ADDRESS.mapLink,
    },
  ];

  return (
    <section id="contact" className="scroll-mt-24 bg-mist py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            center
            eyebrow="যোগাযোগ"
            title="আপনার প্রয়োজনটি আমাদের জানান"
            subtitle="নিচের যেকোনো মাধ্যমে যোগাযোগ করুন — অথবা সরাসরি WhatsApp-এ কথা বলুন।"
          />
        </Reveal>

        <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-2">
          {/* Left: details */}
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
              <Logo tone="dark" />
              <p className="mt-4 text-[15px] text-muted">
                আপনার ব্র্যান্ডের জন্য Printing &amp; Packaging Solution — সব সমাধান এক জায়গায়।
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {items.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-3 rounded-xl border border-line bg-mist/50 p-4 transition-colors hover:border-gold-300 hover:bg-white"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-royal-50 text-royal-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">
                        {label}
                      </span>
                      <span className="block break-words text-[14px] font-semibold text-ink">{value}</span>
                    </span>
                  </a>
                ))}
              </div>

              {/* Hours */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-center gap-2 text-ink">
                    <Clock className="h-4 w-4 text-gold-500" />
                    <span className="text-[13px] font-bold">Office</span>
                  </div>
                  <p className="mt-1.5 text-[13px] text-muted">{HOURS.office}</p>
                  <p className="text-[13px] font-semibold text-red-600">{HOURS.friday}</p>
                </div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-center gap-2 text-ink">
                    <Globe className="h-4 w-4 text-gold-500" />
                    <span className="text-[13px] font-bold">Online Support</span>
                  </div>
                  <p className="mt-1.5 text-[13px] font-semibold text-green-600">{HOURS.online}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-royal-50 px-4 py-3 text-[13px] font-medium text-royal-800 ring-1 ring-royal-100">
                {HOURS.note}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  className="w-full"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button href={`tel:${CONTACT.phoneDial}`} variant="royal" className="w-full">
                  <Phone className="h-4 w-4" />
                  কল করুন
                </Button>
                <Button
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlineGold"
                  className="w-full"
                >
                  <FacebookIcon className="h-4 w-4" />
                  Facebook
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Right: map */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-5 w-5 text-gold-500" />
                  <div>
                    <p className="text-sm font-bold text-ink">আমাদের ঠিকানা</p>
                    <p className="text-[13px] text-muted">আরমানীটোলা, বংশাল, ঢাকা</p>
                  </div>
                </div>
                <Button href={ADDRESS.mapLink} target="_blank" rel="noopener noreferrer" variant="outlineGold" size="sm">
                  <Navigation className="h-4 w-4" />
                  Directions
                </Button>
              </div>
              <iframe
                title="Smart Printing Packaging Location"
                src={ADDRESS.mapEmbed}
                className="h-full min-h-[360px] w-full flex-1"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
