import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./ui";
import { NAV_LINKS, CONTACT, waLink } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key !== "Tab") return;
      const links =
        panel.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
      if (!links?.length) return;
      const first = toggle.current;
      const last = links[links.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keyboard);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-xl">
      <div className="hidden border-b border-line bg-[#f6f4ee] sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs text-muted lg:px-8">
          <span className="flex items-center gap-2">
            <MapPin size={13} />
            আরমানীটোলা, ঢাকা · Printing & Packaging
          </span>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-semibold text-royal-800"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            {CONTACT.whatsappDisplay}
          </a>
        </div>
      </div>
      <nav
        aria-label="প্রধান নেভিগেশন"
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-4"
      >
        <a href="/" aria-label="Smart Printing Packaging — হোম">
          <Logo />
        </a>
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={`/${link.href}`}
              className="py-2 text-[13px] font-semibold text-muted transition-colors hover:text-royal-900"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/#quote"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-royal-900 px-5 text-sm font-bold text-white hover:bg-royal-700 sm:inline-flex"
          >
            কোটেশন নিন
            <ArrowUpRight size={16} />
          </a>
          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-royal-900 lg:hidden"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>
      {open && (
        <div
          ref={panel}
          id="mobile-menu"
          className="max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-line bg-white px-4 pb-28 pt-4 sm:px-6 lg:hidden"
        >
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-gold-600">
            Explore Smart Printing
          </p>
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={`/${link.href}`}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center justify-between border-b border-line px-3 py-4 text-base font-bold text-royal-900"
            >
              <span>
                <span className="mr-4 text-xs text-muted">0{i + 1}</span>
                {link.label}
              </span>
              <ArrowUpRight size={18} />
            </a>
          ))}
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#176b46] px-4 font-bold text-white"
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp · {CONTACT.whatsappDisplay}
          </a>
          <a
            href="/#quote"
            onClick={() => setOpen(false)}
            className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-royal-900 px-4 font-bold text-white"
          >
            কোটেশনের তথ্য দিন
          </a>
        </div>
      )}
    </header>
  );
}
