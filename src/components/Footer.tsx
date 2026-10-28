import { ArrowUpRight } from "lucide-react";
import { Container, WhatsAppIcon } from "./ui";
import { Logo } from "./Logo";
import { CONTACT, waLink } from "@/lib/site";
import { SERVICES } from "@/data/services";
import { servicePath } from "@/lib/seo";
import { SERVICE_LABELS } from "./Services";
import { GUIDES, guidePath } from "@/data/guides";

export function Footer() {
  return (
    <footer className="bg-royal-950 pb-24 text-white/70 md:pb-0">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-16 lg:py-16">
          <div>
            <a href="/" aria-label="Smart Printing Packaging — হোম">
              <Logo tone="light" />
            </a>
            <p className="mt-5 max-w-xs text-sm leading-7">
              আপনার পণ্যকে নতুন পরিচয় দিতে প্রিন্টিং ও প্যাকেজিং সলিউশন।
              আরমানীটোলা, ঢাকা, বাংলাদেশ।
            </p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {CONTACT.whatsappDisplay}
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gold-300">
              প্রোডাক্ট ও সেবা
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href={servicePath(s.id)}
                    className="inline-flex min-h-10 items-center py-2 text-xs leading-5 transition-colors hover:text-white"
                  >
                    {SERVICE_LABELS[s.id]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gold-300">
              সাহায্য ও যোগাযোগ
            </h2>
            <ul className="mt-4 space-y-1">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <a
                    href={guidePath(g.slug)}
                    className="inline-block py-2 text-xs leading-6 hover:text-white"
                  >
                    {g.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/#faq"
                  className="inline-block min-h-10 py-2 text-xs hover:text-white"
                >
                  সাধারণ জিজ্ঞাসা
                </a>
              </li>
              <li>
                <a
                  href="/#contact"
                  className="inline-block min-h-10 py-2 text-xs hover:text-white"
                >
                  ঠিকানা ও অফিসের সময়
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 border-t border-white/10 py-5 text-[11px] sm:flex-row">
          <p>© 2026 Smart Printing Packaging. All rights reserved.</p>
          <p>Printing. Packaging. Your brand.</p>
        </div>
      </Container>
    </footer>
  );
}
