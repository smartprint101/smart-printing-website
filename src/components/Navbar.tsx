import { useEffect, useState } from "react";
import { Menu, X, Phone, Mail, Clock } from "lucide-react";
import { FacebookIcon } from "./ui";
import { Logo } from "./Logo";
import { Button, WhatsAppIcon } from "./ui";
import { NAV_LINKS, CONTACT, waLink } from "@/lib/site";
import { cn } from "@/utils/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");

  // Active section highlighting
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Top utility bar (scrolls away) */}
      <div className="hidden bg-royal-900 text-royal-100 lg:block">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-2 text-[13px] lg:px-8">
          <div className="flex items-center gap-4 lg:gap-6">
            <a href={`tel:${CONTACT.phoneDial}`} className="flex items-center gap-2 whitespace-nowrap transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5 text-gold-300" />
              {CONTACT.phoneDisplay}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="hidden items-center gap-2 whitespace-nowrap transition-colors hover:text-white xl:flex">
              <Mail className="h-3.5 w-3.5 text-gold-300" />
              {CONTACT.email}
            </a>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Clock className="h-3.5 w-3.5 text-gold-300" />
              অফিস শুক্রবার বন্ধ · অনলাইন ২৪/৭
            </span>
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 whitespace-nowrap transition-colors hover:text-white"
            >
              <FacebookIcon className="h-3.5 w-3.5 text-gold-300" />
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Main nav (sticky) */}
      <nav className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" aria-label="Smart Printing Packaging — হোম">
            <Logo />
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-2 py-2 text-[13px] font-medium transition-colors xl:px-3 xl:text-[15px]",
                  active === link.href
                    ? "text-royal-700"
                    : "text-muted hover:text-royal-700"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* WhatsApp — icon below xl, labelled button at xl+ */}
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp করুন"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm transition-colors hover:bg-[#1fb858] xl:hidden"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <Button
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="sm"
              ariaLabel="WhatsApp করুন"
              className="hidden xl:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </Button>

            {/* Primary CTA — desktop */}
            <Button href="#quote" variant="gold" size="sm" className="hidden lg:inline-flex">
              কোটেশন নিন
            </Button>

            {/* Hamburger — tablet & mobile */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-royal-800 lg:hidden"
              aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet panel */}
        {open && (
          <div className="border-t border-line bg-white lg:hidden">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-3 text-base font-medium transition-colors",
                    active === link.href
                      ? "bg-royal-50 text-royal-700"
                      : "text-ink hover:bg-mist"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <Button
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  onClick={() => setOpen(false)}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button href="#quote" variant="gold" onClick={() => setOpen(false)}>
                  কোটেশন নিন
                </Button>
              </div>
              <a
                href={`tel:${CONTACT.phoneDial}`}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold text-royal-800"
              >
                <Phone className="h-4 w-4 text-gold-500" />
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
