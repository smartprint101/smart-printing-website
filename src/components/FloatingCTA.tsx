import { FileText, Phone, ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "./ui";
import { CONTACT, waLink } from "@/lib/site";

export function FloatingCTA() {
  return (
    <>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp-এ যোগাযোগ করুন ${CONTACT.whatsappDisplay}`}
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#176b46] text-white shadow-soft transition-transform hover:-translate-y-1 md:flex"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      <nav
        aria-label="মোবাইল দ্রুত যোগাযোগ"
        className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_1fr_1fr_1.5fr] items-center border-t border-line bg-white/95 px-3 pt-2 backdrop-blur-xl md:hidden"
      >
        <a
          href="/#products"
          className="flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-semibold text-royal-800"
        >
          <ShoppingBag size={19} />
          প্রোডাক্ট
        </a>
        <a
          href={`tel:${CONTACT.phoneDial}`}
          className="flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-semibold text-royal-800"
        >
          <Phone size={19} />
          কল করুন
        </a>
        <a
          href="/#quote"
          className="flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-semibold text-royal-800"
        >
          <FileText size={19} />
          কোটেশন
        </a>
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#176b46] px-3 text-xs font-bold text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </nav>
    </>
  );
}
