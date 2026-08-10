import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./ui";
import { CONTACT, waLink } from "@/lib/site";

export function FloatingCTA() {
  return (
    <>
      {/* Desktop floating WhatsApp */}
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp-এ যোগাযোগ করুন"
        className="group fixed bottom-6 right-6 z-50 hidden items-center gap-0 md:flex"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap rounded-l-full bg-[#1fb858] py-3 pl-0 text-sm font-bold text-white opacity-0 transition-all duration-300 group-hover:max-w-[180px] group-hover:pl-4 group-hover:pr-2 group-hover:opacity-100">
          WhatsApp করুন
        </span>
        <span className="wa-pulse flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-10px_rgba(37,211,102,0.7)] transition-transform group-hover:scale-105">
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </a>

      {/* Mobile bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-2 border-t border-line bg-white/95 p-2.5 backdrop-blur md:hidden">
        <a
          href={`tel:${CONTACT.phoneDial}`}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-royal-200 bg-white py-2.5 text-sm font-bold text-royal-700"
        >
          <Phone className="h-4 w-4" />
          কল
        </a>
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-sm font-bold text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href="#quote"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-gold-300 to-gold-500 py-2.5 text-sm font-bold text-royal-900"
        >
          কোটেশন
        </a>
      </div>
    </>
  );
}
