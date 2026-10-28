export const SITE_URL = "https://smartpackagingbd.com";

// ============================================================
// Central, editable company configuration for Smart Printing Packaging
// ============================================================

export const COMPANY = {
  name: "Smart Printing Packaging",
  nameShort: "Smart Printing",
  established: 2018,
  tagline: "আপনার ব্র্যান্ডের জন্য Printing & Packaging Solution",
};

const WHATSAPP_NUMBER = "8801660191039";
const WHATSAPP_DISPLAY = "01660-191039";

export const CONTACT = {
  phoneDisplay: "+880 1689-318187",
  phoneDial: "+8801689318187",
  // All product, service and quotation enquiries use this one WhatsApp number.
  whatsappNumber: WHATSAPP_NUMBER, // wa.me format (no +, no spaces)
  whatsappDisplay: WHATSAPP_DISPLAY,
  // Compatibility aliases for packet tools; intentionally the same contact.
  whatsappPacketNumber: WHATSAPP_NUMBER,
  whatsappPacketDisplay: WHATSAPP_DISPLAY,
  email: "nationalprintingar@gmail.com",
  // Editable: replace with the official Facebook page link
  facebook: "https://www.facebook.com/",
  facebookLabel: "Smart Printing Packaging",
};

export const ADDRESS = {
  lines: ["১০১ কে পি ঘোষ রোড,", "আরমানীটোলা, বংশাল,", "ঢাকা-১১০০, বাংলাদেশ"],
  mapEmbed:
    "https://maps.google.com/maps?q=101%20K%20P%20Ghosh%20Road%2C%20Armanitola%2C%20Dhaka%201100&t=&z=16&ie=UTF8&iwloc=&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=101+K+P+Ghosh+Road+Armanitola+Bangshal+Dhaka+1100",
};

export const HOURS = {
  office: "শনি–বৃহস্পতি: ১০AM – ৭PM",
  friday: "শুক্রবার বন্ধ",
  online: "অনলাইন সাপোর্ট ২৪/৭",
  note: "অফিস শুক্রবার বন্ধ, তবে অনলাইন যোগাযোগ ও সাপোর্ট ২৪/৭ চালু থাকবে।",
};

export const NAV_LINKS = [
  { label: "প্রোডাক্ট", href: "#products" },
  { label: "কাস্টম সেবা", href: "#services" },
  { label: "অর্ডারের নিয়ম", href: "#process" },
  { label: "প্যাকেজিং গাইড", href: "#guides" },
  { label: "যোগাযোগ", href: "#contact" },
];

/** Build a WhatsApp deep link with an optional pre-filled message. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** WhatsApp link for Cylinder / LD Packet / Foil Packet / Custom Packaging. */
export function waLinkPacket(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsappPacketNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "আসসালামু আলাইকুম, আমি Smart Printing Packaging থেকে Printing / Packaging সম্পর্কে জানতে চাই।";
