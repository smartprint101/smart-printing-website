// ============================================================
// Central, editable company configuration for Smart Printing Packaging
// ============================================================

export const COMPANY = {
  name: "Smart Printing Packaging",
  nameShort: "Smart Printing",
  established: 2018,
  tagline: "আপনার ব্র্যান্ডের জন্য Printing & Packaging Solution",
};

export const CONTACT = {
  phoneDisplay: "+880 1689-318187",
  phoneDial: "+8801689318187",
  // General WhatsApp (general services & support)
  whatsappNumber: "8801689318187", // wa.me format (no +, no spaces)
  whatsappDisplay: "+880 1689-318187",
  // Dedicated WhatsApp for Cylinder / LD Packet / Foil Packet / Custom Packaging
  whatsappPacketNumber: "8801660191039",
  whatsappPacketDisplay: "+880 1660-191039",
  email: "nationalprintingar@gmail.com",
  // Editable: replace with the official Facebook page link
  facebook: "https://www.facebook.com/",
  facebookLabel: "Smart Printing Packaging",
};

export const ADDRESS = {
  lines: ["১০১ কে পি ঘোষ রোড,", "আরমানীটোলা, বংশাল,", "ঢাকা-১১০০, বাংলাদেশ"],
  mapEmbed:
    "https://maps.google.com/maps?q=Armanitola%2C%20Bangshal%2C%20Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Armanitola+Bangshal+Dhaka",
};

export const HOURS = {
  office: "শনি–বৃহস্পতি: ১০AM – ৭PM",
  friday: "শুক্রবার বন্ধ",
  online: "অনলাইন সাপোর্ট ২৪/৭",
  note: "অফিস শুক্রবার বন্ধ, তবে অনলাইন যোগাযোগ ও সাপোর্ট ২৪/৭ চালু থাকবে।",
};

export const NAV_LINKS = [
  { label: "হোম", href: "#home" },
  { label: "আমাদের সম্পর্কে", href: "#about" },
  { label: "প্যাকেট ফাইন্ডার", href: "#product-finder" },
  { label: "আমাদের সেবা", href: "#services" },
  { label: "মূল্য ধারণা", href: "#pricing" },
  { label: "কাজের প্রক্রিয়া", href: "#process" },
  { label: "আমাদের কাজ", href: "#portfolio" },
  { label: "FAQ", href: "#faq" },
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