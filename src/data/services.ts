import {
  Disc3,
  ShoppingBag,
  Package,
  Sticker as StickerIcon,
  Newspaper,
  Box,
  PackageCheck,
  Printer,
  Shield,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

// ==================== IMAGE IMPORTS ====================

import cylinderAI from "@/assets/services/cylinder.webp";
import artPaperImage from "@/assets/services/art-paper.webp";

// LD Packet (5 images)
import ldPacket1 from "@/assets/services2/printed-ld-packet-1.webp";
import ldPacket2 from "@/assets/services2/printed-ld-packet-2.webp";
import ldPacket3 from "@/assets/services2/printed-ld-packet-3.webp";
import ldPacket4 from "@/assets/services2/printed-ld-packet-4.webp";
import ldPacket5 from "@/assets/services2/printed-ld-packet-5.webp";

// Foil Packet (5 images)
import foilPacket1 from "@/assets/services2/foil-pouch-1.webp";
import foilPacket2 from "@/assets/services2/foil-pouch-2.webp";
import foilPacket3 from "@/assets/services2/foil-pouch-3.webp";
import foilPacket4 from "@/assets/services2/foil-pouch-4.webp";
import foilPacket5 from "@/assets/services2/foil-pouch-5.webp";

// Sticker (4 images)
import sticker1 from "@/assets/services2/Sticker1.webp";
import sticker2 from "@/assets/services2/Sticker2.webp";
import sticker3 from "@/assets/services2/Sticker3.webp";
import sticker4 from "@/assets/services2/Sticker4.webp";

// Box (4 images)
import box1 from "@/assets/services2/box1.webp";
import box2 from "@/assets/services2/box2.webp";
import box3 from "@/assets/services2/box3.webp";
import box4 from "@/assets/services2/box4.webp";

// Ready-made Packet (5 images)
import readymadeFoil from "@/assets/services2/foilradymet.webp";
import readymadeZipper from "@/assets/services2/geperradymet.webp";
import readymadeLd from "@/assets/services2/Ldradymet.webp";
import readymadeShrink from "@/assets/services2/srinkradymet.webp";
import readymadeSquare from "@/assets/services2/suquretradymet.webp";

// Security Poly (3 images)
import security1 from "@/assets/services2/Security1.webp";
import security2 from "@/assets/services2/Security2.webp";
import security3 from "@/assets/services2/Security3.webp";

// Offset
import offsetImage from "@/assets/services2/offset.webp";

// ==================== SERVICE IMAGES (Array for slideshow) ====================

export const SERVICE_IMAGES: Record<string, string[]> = {
  cylinder: [cylinderAI],
  "ld-packet": [ldPacket1, ldPacket2, ldPacket3, ldPacket4, ldPacket5],
  "foil-packet": [
    foilPacket1,
    foilPacket2,
    foilPacket3,
    foilPacket4,
    foilPacket5,
  ],
  sticker: [sticker1, sticker2, sticker3, sticker4],
  "art-paper": [artPaperImage],
  "custom-box": [box1, box2, box3, box4],
  "ready-made": [
    readymadeFoil,
    readymadeZipper,
    readymadeLd,
    readymadeShrink,
    readymadeSquare,
  ],
  "security-poly": [security1, security2, security3],
  offset: [offsetImage],
  other: [offsetImage, artPaperImage, sticker1, box1],
};

export const PACKET_SERVICE_IDS = new Set([
  "cylinder",
  "ld-packet",
  "foil-packet",
  "custom-box",
  "ready-made",
  "security-poly",
]);

// ==================== TYPES ====================

export interface ServiceFact {
  label: string;
  value: string;
}

export interface ReadymadeProduct {
  name: string;
  image: string;
  price: string;
  size: string;
  minOrder: string;
  waMessage: string;
}

export interface Service {
  id: string;
  no: string;
  icon: LucideIcon;
  title: string;
  titleHighlight: string; // যে অংশটা highlight হবে
  summary: string;
  shortSummary?: string;
  whatIsIt?: string; // "এটা আসলে কী"
  benefits?: string[]; // সুবিধা
  suitableFor?: string[]; // কোন কোন প্রোডাক্টে উপযোগী
  approx?: string;
  approxLabel?: string;
  facts?: ServiceFact[];
  bullets?: string[];
  gridItems?: string[];
  offer?: string;
  note?: string;
  comparison?: { title: string; items: string[] }[];
  cta: { text: string; message: string };
  altCta?: { text: string; message: string };
  featured?: boolean;
  detailExtra?: string[];
  readymadeProducts?: ReadymadeProduct[]; // Ready-made packet-এর জন্য
  extraInfo?: { title: string; content: string }; // Art Paper-এর মতো extra section-এর জন্য
}

// ==================== SERVICES DATA ====================

export const SERVICES: Service[] = [
  // ==================== 1. CYLINDER ====================
  {
    id: "cylinder",
    no: "01",
    icon: Disc3,
    title: "Packaging Printing Cylinder",
    titleHighlight: "Cylinder",
    summary:
      "প্যাকেজিং প্রিন্টিং সিলিন্ডার হলো একটি বিশেষ engraved rotary tool, যা flexible packaging (LD, Foil, BOPP) প্রিন্ট করার জন্য অপরিহার্য। আপনার ডিজাইনকে প্রতিটি প্যাকেটে নিখুঁতভাবে ছাপাতে এই সিলিন্ডার ব্যবহার করা হয়।",
    shortSummary:
      "Custom LD/Foil packaging-এর জন্য অপরিহার্য engraved printing cylinder — একবার বানালে বছরের পর বছর ব্যবহারযোগ্য।",
    whatIsIt:
      "সিলিন্ডার হলো একটা ধাতব রোলার যার গায়ে আপনার ডিজাইন খোদাই (engrave) করা থাকে। রোটোগ্রাভিউর প্রিন্টিং মেশিনে এই সিলিন্ডার ঘুরে ঘুরে প্লাস্টিক ফিল্মে কালি ছাপায়। প্রতিটি রঙের জন্য আলাদা সিলিন্ডার লাগে।",
    benefits: [
      "একবার তৈরি করলে হাজার হাজার প্যাকেট ছাপানো যায়",
      "প্রতিটি প্যাকেটে একই মানের নিখুঁত প্রিন্ট নিশ্চিত করে",
      "দীর্ঘমেয়াদে খরচ অনেক কমে যায় (bulk production-এ)",
      "উন্নত মানের ছবি ও ডিটেইল ছাপানো সম্ভব",
      "সঠিক যত্নে বছরের পর বছর পুনঃব্যবহারযোগ্য",
    ],
    suitableFor: [
      "LD Packet (মুদিপণ্য, মসলা, ফুড)",
      "Foil Packet (স্ন্যাকস, চিপস, কফি)",
      "BOPP Packet",
      "Zipper Pouch",
      "যেকোনো Flexible Packaging",
    ],
    bullets: [
      "Cylinder-এর size ও specification অনুযায়ী খরচ নির্ধারিত হয়",
      "প্রতিটি নতুন ডিজাইন/সাইজের জন্য আলাদা Cylinder set প্রয়োজন",
      "একই ডিজাইনে পুনরায় প্রিন্টিং-এ সিলিন্ডার পুনঃব্যবহার করা যায়",
      "সাধারণত ৪-৮ কালারের সেট বেশি ব্যবহৃত হয়",
    ],
    note: "Cylinder প্রয়োজন হয় আমাদের Custom LD ও Foil printed packaging সেবার ক্ষেত্রে। একটাই সিলিন্ডার সেট দিয়ে বছরের পর বছর প্রিন্ট করা যায়।",
    comparison: [
      {
        title: "Digital Cylinder",
        items: [
          "উন্নত মানের print quality",
          "নিখুঁত reproduction ও ডিটেইল",
          "প্রিমিয়াম ব্র্যান্ডিং-এর জন্য উপযুক্ত",
          "খরচ তুলনামূলক বেশি",
        ],
      },
      {
        title: "বাংলা Cylinder",
        items: [
          "কম খরচের সাশ্রয়ী অপশন",
          "সাধারণ প্রিন্টিং কাজের জন্য যথেষ্ট",
          "বাজেট-বান্ধব সমাধান",
          "সাধারণ প্যাকেজিং-এর জন্য উপযুক্ত",
        ],
      },
    ],
    detailExtra: [
      "প্রতিটি Cylinder আপনার artwork-এর CMYK color separation অনুযায়ী engrave করা হয়",
      "সংরক্ষণ: শুকনো ও ঠান্ডা জায়গায় রাখলে ৫-১০ বছর ভালো থাকে",
      "নতুন কালার বা সাইজ পরিবর্তন হলে নতুন Cylinder set লাগবে",
      "সিলিন্ডার তৈরিতে সাধারণত ৭-১৫ দিন সময় লাগে",
    ],
    cta: {
      text: "সিলিন্ডার অর্ডার করুন",
      message:
        "আসসালামু আলাইকুম। আমার প্যাকেটের জন্য Printing Cylinder প্রয়োজন। ডিজাইন ও Specification পাঠাচ্ছি, অনুগ্রহ করে মূল্য ও সময় জানান:",
    },
    altCta: {
      text: "বাজেট কম? বিকল্প জানুন",
      message:
        "আমার বাজেট কম। Cylinder-এর কম খরচের বিকল্প Solution সম্পর্কে জানান:",
    },
    featured: true,
  },

  // ==================== 2. LD PACKET ====================
  {
    id: "ld-packet",
    no: "02",
    icon: ShoppingBag,
    title: "Custom Printed LD Packet",
    titleHighlight: "LD Packet",
    summary:
      "নিজের নামে পলি প্যাকেট প্রিন্টিং করাতে চাইলে LD (Low Density Polyethylene) প্যাকেট বিবেচনা করতে পারেন। পণ্যের ধরন ও সাইজ অনুযায়ী ব্র্যান্ডের নাম, লোগো ও ডিজাইন দিয়ে কাস্টম প্যাকেট তৈরি করা যায়।",
    shortSummary:
      "নিজের নাম, লোগো ও ডিজাইনে কাস্টম LD পলি প্যাকেট প্রিন্টিং।",
    whatIsIt:
      "LD প্যাকেট হলো Low Density Polyethylene (LDPE) দিয়ে তৈরি নরম, স্বচ্ছ বা রঙিন প্লাস্টিকের প্যাকেট। এটি হালকা, নমনীয় এবং সহজে ছাপানো যায়। আপনার ব্র্যান্ডের লোগো, নাম ও ডিজাইন এতে প্রিন্ট করে প্রফেশনাল প্যাকেজিং তৈরি করা হয়।",
    benefits: [
      "কম খরচে প্রফেশনাল ব্র্যান্ডেড প্যাকেজিং",
      "হালকা ও নমনীয় — সহজে বহনযোগ্য",
      "৪০-১২০ মাইক্রন পর্যন্ত thickness পাওয়া যায়",
      "২-৮ কালার পর্যন্ত প্রিন্ট করা যায়",
      "Side seal ও Bottom seal দুটোই সম্ভব",
      "খাদ্যপণ্যের জন্য উপযোগী ম্যাটেরিয়াল ও প্রয়োজনীয় সনদ অর্ডারের আগে নিশ্চিত করুন",
    ],
    suitableFor: [
      "মুদিপণ্য (চাল, ডাল, আটা, চিনি)",
      "মসলা (হলুদ, মরিচ, ধনে)",
      "স্ন্যাকস ও ফুড প্রোডাক্ট",
      "গার্মেন্টস প্যাকেজিং",
      "সাধারণ consumer product",
      "Bakery items",
    ],
    approxLabel: "আনুমানিক মূল্য",
    approx: "৳৪২০–৪৬০ / কেজি",
    facts: [
      { label: "Minimum Order", value: "150 KG" },
      { label: "Cylinder", value: "প্রয়োজন" },
      { label: "Thickness", value: "40-120 micron" },
      { label: "Colors", value: "2-8 Color" },
    ],
    bullets: [
      "চূড়ান্ত মূল্য Size, Thickness, Colour, Material ও বর্তমান বাজারদরের উপর নির্ভর করে",
      "Estimated project budget (Cylinder সহ): ৳৭০,০০০–৳১,২০,০০০+",
      "একবার সিলিন্ডার হয়ে গেলে পরবর্তী অর্ডারে খরচ অনেক কম হবে",
    ],
    note: "এটি প্রাথমিক বাজেট ধারণা মাত্র। আপনার সঠিক প্রয়োজন অনুযায়ী Final quotation-এর জন্য WhatsApp করুন।",
    detailExtra: [
      "সাধারণ thickness: 40-120 micron, আপনার প্রোডাক্ট অনুযায়ী পরামর্শ দেওয়া হবে",
      "Side seal, Bottom seal, Center seal অপশন উপলব্ধ",
      "স্বচ্ছ, দুধ সাদা বা রঙিন — যেকোনো ব্যাকগ্রাউন্ডে প্রিন্ট সম্ভব",
      "Delivery time: সাধারণত ১৫-২০ কার্যদিবস",
    ],
    cta: {
      text: "LD প্যাকেট অর্ডার করুন",
      message:
        "আসসালামু আলাইকুম। আমি Custom Printed LD Packet অর্ডার করতে চাই। Size, Quantity ও ডিজাইন জানাচ্ছি, দাম ও সময় জানান:",
    },
    altCta: {
      text: "বাজেট কম? বিকল্প জানুন",
      message:
        "আমার বাজেট কম। অল্প খরচে LD Packet-এর বিকল্প Solution সম্পর্কে জানান:",
    },
  },

  // ==================== 3. FOIL PACKET ====================
  {
    id: "foil-packet",
    no: "03",
    icon: Package,
    title: "Custom Printed Foil Packet",
    titleHighlight: "Foil Packet",
    summary:
      "নিজের নাম ও লোগোসহ কাস্টম ফয়েল প্যাকেট বা পাউচ প্রিন্ট করান। পণ্যের প্রয়োজন অনুযায়ী ফিল্মের লেয়ার, সাইজ ও সিলিং বেছে নেওয়া জরুরি।",
    shortSummary:
      "নিজের ব্র্যান্ডের নামে ফয়েল প্যাকেট ও পাউচ প্রিন্টিং।",
    whatIsIt:
      "ফয়েল বা মেটালাইজড প্যাকেট একাধিক স্তরের ল্যামিনেটেড ফিল্ম হতে পারে। সব চকচকে পাউচে অ্যালুমিনিয়াম ফয়েল থাকে না এবং বাধা-ক্ষমতা এক নয়। পণ্যের আলো, বাতাস ও আর্দ্রতার প্রয়োজন জানিয়ে প্রস্তাবিত layer structure ও sealing যাচাই করুন।",
    benefits: [
      "প্রিমিয়াম মেটালিক শাইনি লুক — শেলফে চোখে পড়ে",
      "পণ্যের প্রয়োজন অনুযায়ী আলো, আর্দ্রতা ও বাতাসের বাধা-ক্ষমতা বিবেচনা করুন",
      "পণ্যের উপযোগী structure বেছে নিলে সংরক্ষণে সহায়ক হতে পারে",
      "খাদ্যপণ্যের জন্য উপযোগী ম্যাটেরিয়াল ও সিলিং যাচাই করুন",
      "Zipper, Euro hole, Window অপশন উপলব্ধ",
      "Stand-up pouch বা flat pouch দুটোই সম্ভব",
    ],
    suitableFor: [
      "স্ন্যাকস ও চিপস",
      "কফি, চা ও পাউডার",
      "কসমেটিক্স ও স্কিনকেয়ার",
      "মেডিসিন ও হেলথ প্রোডাক্ট",
      "প্রিমিয়াম ফুড ব্র্যান্ড",
      "মসলা ও ড্রাই ফুড",
    ],
    approxLabel: "আনুমানিক মূল্য",
    approx: "৳৫০০–৫৫০ / কেজি",
    facts: [
      { label: "Minimum Order", value: "200 KG" },
      { label: "Cylinder", value: "প্রয়োজন" },
      { label: "Structure", value: "3-4 Layer" },
      { label: "Colors", value: "2-8 Color" },
    ],
    bullets: [
      "চূড়ান্ত মূল্য Size, Structure, Colour, Material ও market condition অনুযায়ী পরিবর্তিত হয়",
      "Estimated project budget (Cylinder সহ): ৳৭০,০০০–৳১,২০,০০০+",
      "Premium metallic finish প্রোডাক্টকে শেলফে আকর্ষণীয় করে তোলে",
    ],
    note: "এটি প্রাথমিক বাজেট ধারণা মাত্র। আপনার সঠিক প্রয়োজন অনুযায়ী Final quotation-এর জন্য WhatsApp করুন।",
    detailExtra: [
      "Structure উদাহরণ: PET / MET-PET / PE বা BOPP / MET-CPP",
      "Zipper, Euro hole, Tear notch, Window — প্রয়োজন অনুযায়ী যোগ করা যায়",
      "Matte বা Glossy finish উপলব্ধ",
      "Stand-up pouch বেশি জনপ্রিয় প্রিমিয়াম প্রোডাক্টের জন্য",
    ],
    cta: {
      text: "ফয়েল প্যাকেট অর্ডার করুন",
      message:
        "আসসালামু আলাইকুম। আমি Custom Printed Foil Packet অর্ডার করতে চাই। Size, Quantity ও ডিজাইন জানাচ্ছি, দাম ও সময় জানান:",
    },
    altCta: {
      text: "বাজেট কম? বিকল্প জানুন",
      message:
        "আমার বাজেট কম। অল্প খরচে Foil Packet-এর বিকল্প Solution সম্পর্কে জানান:",
    },
  },

  // ==================== 4. STICKER ====================
  {
    id: "sticker",
    no: "04",
    icon: StickerIcon,
    title: "Sticker Printing",
    titleHighlight: "Sticker",
    summary:
      "নিজের নাম ও লোগো দিয়ে স্টিকার ও লেবেল প্রিন্টিং করান। প্যাকেট, বক্স, বোতল বা জারে লাগানোর জন্য পণ্যের সাইজ ও উপযোগী স্টিকার ম্যাটেরিয়াল বেছে নিন।",
    shortSummary:
      "প্যাকেট, বক্স ও বোতলের জন্য ব্র্যান্ড স্টিকার এবং পণ্যের লেবেল প্রিন্টিং।",
    whatIsIt:
      "স্টিকার হলো একদিকে আঠাযুক্ত (adhesive) প্রিন্ট করা কাগজ বা প্লাস্টিকের লেবেল, যা পণ্য, বোতল বা প্যাকেটে ব্যবহারের আগে পৃষ্ঠ ও আঠার উপযোগিতা যাচাই করা প্রয়োজন। আমরা 10×15 inch শীট আকারে স্টিকার সরবরাহ করি।",
    benefits: [
      "ব্র্যান্ডিং ও প্রোডাক্ট আইডেন্টিফিকেশনে সহজ",
      "একই শীটে একাধিক ছোট স্টিকার প্রিন্ট করা যায়",
      "কম খরচে বেশি পরিমাণে স্টিকার পাওয়া যায়",
      "ল্যামিনেশন ও পানির সংস্পর্শের প্রয়োজন অনুযায়ী উপযোগিতা যাচাই করুন",
      "কাস্টম শেপে ডাই কাটিং সম্ভব",
      "দ্রুত delivery",
    ],
    suitableFor: [
      "প্রোডাক্ট লেবেল (বোতল, জার)",
      "ব্র্যান্ড ট্যাগ ও লোগো স্টিকার",
      "কসমেটিক্স প্রোডাক্ট লেবেল",
      "ফুড প্রোডাক্ট লেবেল",
      "প্রোমোশনাল ও গিফট স্টিকার",
      "বারকোড ও প্রাইস ট্যাগ",
    ],
    approxLabel: "Printing",
    approx: "৳৭,০০০ / packet",
    facts: [
      { label: "Sheet Size", value: "10 × 15 inch" },
      { label: "Quantity", value: "400 sheets / packet" },
      { label: "Dry Cutting", value: "৳৭,৫০০ / packet" },
      { label: "Finishing", value: "Matte / Glossy" },
    ],
    bullets: [
      "প্রতি শিটে কাস্টমারের প্রয়োজনীয় Sticker Size অনুযায়ী যতগুলো Sticker fit হবে, সেই অনুযায়ী মোট quantity পাওয়া যাবে",
      "নির্দিষ্ট Sticker quantity নিশ্চিত করতে চূড়ান্ত dimension ও layout প্রয়োজন",
      "Dry cutting করলে individual sticker আলাদা করে delivery হবে",
    ],
    detailExtra: [
      "আর্ট পেপার, PVC, Vinyl বা Chromo — বিভিন্ন material উপলব্ধ",
      "Matte, Glossy বা Transparent finish",
      "ল্যামিনেশন ও পানির সংস্পর্শে কার্যকারিতা সম্পর্কে জেনে নিন",
      "Custom die-cut shape সম্ভব",
    ],
    extraInfo: {
      title: "স্টিকার ও লেবেল প্রিন্টিংয়ের আগে কী যাচাই করবেন?",
      content:
        "স্টিকারটি বোতল, জার, প্যাকেট নাকি বক্সের কোন পৃষ্ঠে লাগাবেন তা জানান। লেবেলের চূড়ান্ত সাইজ, শিটে বিন্যাস, প্রয়োজনীয় পরিমাণ ও কাটিংয়ের ধরন ঠিক করুন। আঠা, ম্যাটেরিয়াল ও ব্যবহার পরিবেশ মিলিয়ে নমুনা পরীক্ষা করুন; প্রুফে বানান ও barcode-এর পাঠযোগ্যতা দেখুন।",
    },
    cta: {
      text: "স্টিকার অর্ডার করুন",
      message:
        "আসসালামু আলাইকুম। আমি Sticker Printing করাতে চাই। Sticker Size ও Quantity পাঠাচ্ছি, দাম ও সময় জানান:",
    },
  },

  // ==================== 5. ART PAPER ====================
  {
    id: "art-paper",
    no: "05",
    icon: Newspaper,
    title: "Art Paper Printing",
    titleHighlight: "Art Paper",
    summary:
      "উচ্চ মানের আর্ট পেপারে প্রফেশনাল প্রিন্টিং — Standard 20×30 inch শীটে আপনার প্রয়োজনীয় final size অনুযায়ী একাধিক piece layout করা যায়। ব্রোশিওর, লিফলেট, ম্যাগাজিন কভার, পোস্টারের জন্য পারফেক্ট।",
    shortSummary:
      "মোটা আর্ট পেপারে হাই-কোয়ালিটি প্রিন্ট — 20×30 শীটে একাধিক পিস লেআউট।",
    whatIsIt:
      "আর্ট পেপার হলো coated, smooth surface-এর উচ্চ মানের কাগজ। এতে ছবি ও রঙ খুব ভালোভাবে ফোটে। সাধারণত 80-350 GSM পর্যন্ত পাওয়া যায় — যত বেশি GSM, তত মোটা কাগজ।",
    benefits: [
      "উজ্জ্বল ও নিখুঁত রঙের প্রিন্ট",
      "মসৃণ ও প্রিমিয়াম ফিনিশ",
      "একাধিক GSM অপশন (80-350)",
      "Lamination করে আরও টেকসই করা যায়",
      "Cutting, folding, embossing সহজ",
      "প্রফেশনাল প্রেজেন্টেশনের জন্য আদর্শ",
    ],
    suitableFor: [
      "ব্রোশিওর ও লিফলেট",
      "ম্যাগাজিন ও ক্যাটালগ কভার",
      "পোস্টার ও ফ্লায়ার",
      "গিফট ট্যাগ ও কার্ড",
      "মেনু কার্ড",
      "প্রোডাক্ট ইনসার্ট",
    ],
    approxLabel: "আনুমানিক মূল্য",
    approx: "৳৯,০০০–৯,৫০০",
    facts: [
      { label: "Sheet Size", value: "20 × 30 inch" },
      { label: "Quantity", value: "500 sheets" },
      { label: "GSM Options", value: "80-350 GSM" },
      { label: "Finishing", value: "Matte / Glossy" },
    ],
    bullets: [
      "মোট piece quantity নির্ভর করে — final product size, layout, bleed ও cutting requirement-এর উপর",
      "একটি ২০×৩০ শীটে ছোট আকারের হলে অনেক পিস আসে",
      "ল্যামিনেশনের ধরন ও ব্যবহারের পরিবেশ অনুযায়ী টেকসইভাব যাচাই করুন",
    ],
    extraInfo: {
      title: "আর্ট পেপার ও স্টিকারের পার্থক্য",
      content:
        "আর্ট পেপার হলো সাধারণ কাগজ — পেছনে কোনো আঠা নেই, তাই এটা কোথাও চিপকানো যায় না। এটা প্রিন্ট করে ব্রোশিওর, লিফলেট, কার্ড বা পোস্টার হিসেবে ব্যবহার হয়। অন্যদিকে স্টিকারের পেছনে আঠা (adhesive) লাগানো থাকে, যেটা খোসা তুলে যেকোনো surface-এ চিপকানো যায়। সহজ কথায় — আর্ট পেপার হাতে ধরে পড়ার জিনিস, স্টিকার হলো লাগানোর জিনিস।",
    },
    detailExtra: [
      "GSM অনুযায়ী দাম পরিবর্তিত হয় (যত বেশি GSM, তত বেশি দাম)",
      "Single side বা Both side প্রিন্ট সম্ভব",
      "Matt/Gloss lamination, Spot UV, Foiling — বিভিন্ন finishing অপশন",
      "Delivery time: সাধারণত ৫-৭ কার্যদিবস",
    ],
    cta: {
      text: "আর্ট পেপার অর্ডার করুন",
      message:
        "আসসালামু আলাইকুম। আমি Art Paper Printing করাতে চাই। Product size ও quantity পাঠাচ্ছি, দাম ও সময় জানান:",
    },
  },

  // ==================== 6. CUSTOM BOX ====================
  {
    id: "custom-box",
    no: "06",
    icon: Box,
    title: "Custom Printed Box",
    titleHighlight: "Custom Box",
    summary:
      "নিজের ব্র্যান্ডের নাম, লোগো ও পণ্যের মাপ অনুযায়ী কাস্টম প্যাকেজিং বক্স প্রিন্টিং। বক্সের ধরন, বোর্ড, ডিজাইন ও প্রয়োজনীয় পরিমাণ জানিয়ে অর্ডারের তথ্য নিন।",
    shortSummary:
      "নিজের নামে কাস্টম প্রিন্টেড বক্স ও ফোল্ডিং কার্টন।",
    whatIsIt:
      "Custom Box হলো আপনার প্রোডাক্টের সঠিক মাপ অনুযায়ী তৈরি প্রিন্টেড কার্টন বা বক্স। এটি Duplex board, Swedish board বা Kraft paper দিয়ে তৈরি হয়। ফোল্ডিং কার্টন বা রিজিড বক্স — দুই ধরনের অপশন রয়েছে।",
    benefits: [
      "প্রোডাক্টের সঠিক মাপে ফিট",
      "প্রিমিয়াম ব্র্যান্ডিং লুক",
      "পণ্যের সুরক্ষার চাহিদা অনুযায়ী বক্সের গঠন ও বোর্ড যাচাই করুন",
      "শেলফে আকর্ষণীয় প্রেজেন্টেশন",
      "Matt/Gloss/Spot UV finishing অপশন",
      "Foiling, Embossing সম্ভব",
    ],
    suitableFor: [
      "খাদ্য পণ্য (মিষ্টি, কেক, বিস্কুট)",
      "কসমেটিক্স ও স্কিনকেয়ার",
      "গিফট আইটেম",
      "ইলেকট্রনিক্স প্রোডাক্ট",
      "গার্মেন্টস ও অ্যাকসেসরিজ",
      "মেডিসিন ও হেলথ প্রোডাক্ট",
    ],
    gridItems: [
      "খাদ্য",
      "কসমেটিক্স",
      "Retail",
      "Gift",
      "FMCG",
      "Product packaging",
    ],
    note: "মূল্য Size, Board GSM, Printing color, Finishing ও Quantity অনুযায়ী নির্ধারিত হবে। WhatsApp-এ মাপ ও ডিজাইন পাঠিয়ে সঠিক quote নিন।",
    detailExtra: [
      "Board: 250-400 GSM Duplex / Swedish board",
      "Lamination: Matt / Gloss / Spot UV উপলব্ধ",
      "Foiling (Gold/Silver), Embossing, Window cutting সম্ভব",
      "একটা খোলা স্যাম্পল Box আগে দেখে নিতে পারবেন",
      "Delivery time: সাধারণত ১০-১৫ কার্যদিবস",
    ],
    cta: {
      text: "কাস্টম বক্স অর্ডার করুন",
      message:
        "আসসালামু আলাইকুম। আমি Custom Printed Box অর্ডার করতে চাই। Product-এর বিবরণ, Size ও Quantity পাঠাচ্ছি, দাম জানান:",
    },
  },

  // ==================== 7. READY-MADE PACKET (Featured!) ====================
  {
    id: "ready-made",
    no: "07",
    icon: PackageCheck,
    title: "Ready-made Packet",
    titleHighlight: "Ready-made Packet",
    summary:
      "স্টকে থাকা রেডি-মেড প্যাকেট — Foil, Zipper, LD, Shrink ও Security Seal। ছোট পরিমাণে (মাত্র ১ কেজি থেকে) কিনতে পারবেন, কোনো সিলিন্ডার বা মিনিমাম বড় অর্ডার লাগবে না।",
    shortSummary:
      "স্টক Foil / Zipper / LD / Shrink / Square প্যাকেট — মাত্র 1 KG থেকেই নিতে পারবেন।",
    whatIsIt:
      "Ready-made প্যাকেট হলো আগে থেকেই তৈরি করে রাখা প্লেইন বা সাধারণ প্রিন্টেড প্যাকেট। এতে কোনো কাস্টম ডিজাইন বা সিলিন্ডার লাগে না। ছোট ব্যবসায়ী, স্টার্টআপ বা যারা কম পরিমাণে প্যাকেট চান তাদের জন্য পারফেক্ট সমাধান।",
    benefits: [
      "মাত্র ১ কেজি থেকে অর্ডার করা যায়",
      "কোনো সিলিন্ডার খরচ নেই",
      "তাৎক্ষণিক ডেলিভারি (স্টকে থাকলে)",
      "ছোট ব্যবসার জন্য আদর্শ",
      "বিভিন্ন সাইজ ও ধরনের অপশন",
      "কম বিনিয়োগে শুরু করা যায়",
    ],
    suitableFor: [
      "ছোট ও মাঝারি ব্যবসা",
      "নতুন স্টার্টআপ",
      "হোম-বেইজড ব্যবসা",
      "অনলাইন সেলার",
      "টেস্টিং বা ট্রায়াল অর্ডার",
      "মৌসুমি ব্যবসা",
    ],
    facts: [
      { label: "Minimum Order", value: "1 KG" },
      { label: "Available", value: "সব সাইজ" },
      { label: "Cylinder", value: "প্রয়োজন নেই" },
      { label: "Delivery", value: "দ্রুত" },
    ],
    readymadeProducts: [
      {
        name: "ফয়েল প্যাকেট",
        image: readymadeFoil,
        price: "৳৫৩০–৫৭০ / KG",
        size: "All Size Available",
        minOrder: "1 KG",
        waMessage:
          "আসসালামু আলাইকুম। আমি Ready-made ফয়েল প্যাকেট অর্ডার করতে চাই। প্রয়োজনীয় সাইজ ও পরিমাণ জানাচ্ছি:",
      },
      {
        name: "জিপার প্যাকেট",
        image: readymadeZipper,
        price: "৳৫০০–৫৫০ / KG",
        size: "All Size Available",
        minOrder: "1 KG",
        waMessage:
          "আসসালামু আলাইকুম। আমি Ready-made জিপার প্যাকেট অর্ডার করতে চাই। প্রয়োজনীয় সাইজ ও পরিমাণ জানাচ্ছি:",
      },
      {
        name: "এলডি প্যাকেট",
        image: readymadeLd,
        price: "৳৪২০–৪৬০ / KG",
        size: "All Size Available",
        minOrder: "1 KG",
        waMessage:
          "আসসালামু আলাইকুম। আমি Ready-made এলডি প্যাকেট অর্ডার করতে চাই। প্রয়োজনীয় সাইজ ও পরিমাণ জানাচ্ছি:",
      },
      {
        name: "শ্রিংক পলি",
        image: readymadeShrink,
        price: "৳৩৫০–৫৫০ / KG",
        size: "All Size Available",
        minOrder: "1 KG",
        waMessage:
          "আসসালামু আলাইকুম। আমি Ready-made শ্রিংক পলি অর্ডার করতে চাই। প্রয়োজনীয় সাইজ ও পরিমাণ জানাচ্ছি:",
      },
      {
        name: "সিকিউরিটি সিল",
        image: readymadeSquare,
        price: "৳৪৫০–৬০০ / KG",
        size: "All Size Available",
        minOrder: "1 KG",
        waMessage:
          "আসসালামু আলাইকুম। আমি Ready-made সিকিউরিটি সিল অর্ডার করতে চাই। প্রয়োজনীয় সাইজ ও পরিমাণ জানাচ্ছি:",
      },
    ],
    detailExtra: [
      "অর্ডারের আগে প্রোডাক্টের স্টক ও ডেলিভারির সময় নিশ্চিত করুন",
      "চাহিদা মতো যেকোনো পরিমাণ (১ কেজি থেকে ১০০+ কেজি)",
      "প্লেইন (সাদা) বা সাধারণ প্রিন্টেড অপশন",
      "ঢাকার ভেতরে সম্ভাব্য ডেলিভারি সময় অর্ডারের আগে নিশ্চিত করুন",
      "ঢাকার বাইরে কুরিয়ার ও সম্ভাব্য সময় আলোচনা করে নিশ্চিত করুন",
    ],
    note: "উপরের দাম আনুমানিক — সাইজ ও পরিমাণ অনুযায়ী কম-বেশি হতে পারে। প্রতিটি প্রোডাক্টের নিচের 'অর্ডার করুন' বাটনে ক্লিক করে WhatsApp-এ যোগাযোগ করুন।",
    cta: {
      text: "সব প্রোডাক্ট দেখুন",
      message:
        "আসসালামু আলাইকুম। আমি Ready-made Packet সম্পর্কে বিস্তারিত জানতে চাই। উপলব্ধ সব প্রোডাক্টের তালিকা ও দাম পাঠান:",
    },
    featured: true,
  },

  // ==================== 8. SECURITY POLY (NEW!) ====================
  {
    id: "security-poly",
    no: "08",
    icon: Shield,
    title: "Security Poly",
    titleHighlight: "Security Poly",
    summary:
      "সিকিউরিটি পলি একটি heat-shrink সিল, যা বোতল বা জারের মুখে লাগানোর প্রয়োজন অনুযায়ী বেছে নেওয়া হয়। সাইজ, লাগানোর পদ্ধতি ও পাত্রের সঙ্গে উপযোগিতা আগে যাচাই করুন।",
    shortSummary:
      "বোতল বা জারের মুখে ব্যবহারের জন্য heat-shrink সিল; সাইজ ও উপযোগিতা নিশ্চিত করুন।",
    whatIsIt:
      "Shrink seal তাপের সাহায্যে বোতল বা জারের মুখে লাগানো হয় এবং সিল খোলার চিহ্ন বোঝাতে সহায়ক হতে পারে। এটি নিজে থেকে leak-proof বা tamper-proof হওয়ার নিশ্চয়তা নয়। ম্যাটেরিয়াল, পাত্র ও প্রয়োগপদ্ধতি অনুযায়ী পরীক্ষা করুন।",
    benefits: [
      "সিল খোলা হয়েছে কি না বোঝাতে সহায়তা করে",
      "সিল খোলার চিহ্ন দেখা যায় কি না ব্যবহারের আগে পরীক্ষা করুন",
      "সঠিক সিলিং ও বোতলের উপযোগিতা অর্ডারের আগে যাচাই করুন",
      "প্রোডাক্টে প্রফেশনাল লুক আনে",
      "কাস্টমারের আস্থা বাড়ায়",
      "খাদ্য, কসমেটিক্স বা অন্যান্য পণ্যের জন্য উপযোগিতা আগে নিশ্চিত করুন",
    ],
    suitableFor: [
      "পানির বোতল ও কোমল পানীয়",
      "সস, জ্যাম, আচারের জার",
      "মধু, ঘি, তেলের বোতল",
      "কসমেটিক্স ও স্কিনকেয়ার বোতল",
      "মেডিসিন ও সিরাপের বোতল",
      "কেমিক্যাল ও ক্লিনিং প্রোডাক্ট",
    ],
    approxLabel: "আনুমানিক মূল্য",
    approx: "৳৫০০–৬০০ / কেজি",
    facts: [
      { label: "Minimum Order", value: "20 KG" },
      { label: "Material", value: "PVC / PET Shrink" },
      { label: "Application", value: "হট এয়ার গান" },
      { label: "Shrink Rate", value: "ম্যাটেরিয়াল অনুযায়ী যাচাই করুন" },
    ],
    bullets: [
      "লাগানোর উপযুক্ত পদ্ধতি ও সময় ম্যাটেরিয়াল ও পাত্র অনুযায়ী যাচাই করুন",
      "বিভিন্ন সাইজ ও ডায়ামিটার অনুযায়ী পাওয়া যায়",
      "স্বচ্ছ বা প্রিন্টেড দুই ধরনের অপশন",
      "প্রোডাক্টে perforation (ছিদ্র) দেওয়া যায় সহজে খোলার জন্য",
    ],
    detailExtra: [
      "তাপ প্রয়োগের সঠিক তাপমাত্রা ও পদ্ধতি সরবরাহকারীর নির্দেশনা থেকে নিশ্চিত করুন",
      "প্রয়োজনীয় shrink capacity ম্যাটেরিয়াল অনুযায়ী যাচাই করুন",
      "স্বচ্ছ ও প্রিন্টেড দুই অপশনেই উপলব্ধ",
      "কাস্টম প্রিন্টের জন্য আলাদা অর্ডার নিতে হবে",
      "সাধারণত ১-২ সপ্তাহে delivery",
    ],
    note: "20 কেজি থেকে অর্ডার করতে হবে। সাইজ ও পরিমাণ অনুযায়ী দাম কম-বেশি হতে পারে।",
    cta: {
      text: "সিকিউরিটি পলি অর্ডার করুন",
      message:
        "আসসালামু আলাইকুম। আমি Security Poly (Shrink Seal) অর্ডার করতে চাই। বোতল/জারের সাইজ ও পরিমাণ জানাচ্ছি, দাম ও সময় জানান:",
    },
  },

  // ==================== 9. OFFSET PRINTING ====================
  {
    id: "offset",
    no: "09",
    icon: Printer,
    title: "Offset Printing",
    titleHighlight: "Offset",
    summary:
      "অফসেট প্রিন্টিং হলো সবচেয়ে জনপ্রিয় ও উচ্চ মানের কমার্শিয়াল প্রিন্টিং পদ্ধতি — কর্পোরেট মেটেরিয়াল, বই, ম্যাগাজিন, প্যাকেজিং, লিফলেট, ব্রোশিওর সহ সব ধরনের কাগজে ছাপার জন্য।",
    shortSummary:
      "কর্পোরেট কার্ড, ব্রোশিওর, লিফলেট, প্যাকেজিং ম্যাটেরিয়াল — উচ্চ মানের অফসেট প্রিন্ট।",
    whatIsIt:
      "Offset Printing হলো এমন একটি প্রিন্টিং পদ্ধতি যেখানে প্লেট থেকে কালি রাবার ব্ল্যাঙ্কেটে যায়, তারপর কাগজে ছাপা হয়। এই পদ্ধতিতে খুব উচ্চ মানের ও নিখুঁত রঙের প্রিন্ট পাওয়া যায়, বিশেষ করে বেশি পরিমাণে প্রিন্ট করার সময় প্রতি পিসের খরচ অনেক কমে যায়।",
    benefits: [
      "উচ্চ মানের নিখুঁত প্রিন্ট কোয়ালিটি",
      "বেশি পরিমাণে কম খরচ",
      "CMYK + Pantone কালার সাপোর্ট",
      "বিভিন্ন paper stock-এ প্রিন্ট করা যায়",
      "Long-run production-এ আদর্শ",
      "Consistent quality প্রতিটি পিসে",
    ],
    suitableFor: [
      "বিজনেস কার্ড ও লেটারহেড",
      "ব্রোশিওর ও ক্যাটালগ",
      "বই ও ম্যাগাজিন",
      "লিফলেট ও ফ্লায়ার",
      "প্যাকেজিং কার্টন",
      "ক্যালেন্ডার ও পোস্টার",
    ],
    offer: "ডিজাইন সাপোর্ট ও শর্ত কোটেশনে নিশ্চিত করুন",
    bullets: [
      "Design Confirm করার দিন ৫০% Advance দিতে হবে",
      "Design Confirm-এর পর সাধারণত ৭ দিনের মধ্যে Product প্রস্তুত করা হবে",
      "বেশি quantity-তে per-piece দাম অনেক কমে",
    ],
    note: "প্রতিটি কাজের নির্দিষ্ট delivery time কাজের পরিমাণ ও জটিলতার উপর নির্ভর করে।",
    detailExtra: [
      "CMYK 4-color process printing",
      "Pantone spot color উপলব্ধ",
      "80 GSM থেকে 400 GSM পর্যন্ত paper support",
      "Lamination, UV coating, Foiling — সব finishing অপশন",
      "Cutting, folding, binding — complete solution",
    ],
    extraInfo: {
      title: "অফসেট প্রিন্টিংয়ের artwork ও কোটেশন কীভাবে প্রস্তুত করবেন?",
      content:
        "ব্রোশিওর, লিফলেট, কার্টন বা অন্য কাজের চূড়ান্ত মাপ, পেপার, রং, এক বা দুই পিঠে প্রিন্ট এবং পরিমাণ জানান। artwork-এর ফাইল ফরম্যাট, bleed ও কাটিংয়ের সীমা প্রিন্টারের সঙ্গে মিলিয়ে নিন। প্রিন্টের আগে বানান ও রঙের প্রুফ দেখুন; সেটআপ, ফিনিশিং ও ডেলিভারিসহ মোট কোটেশন নিশ্চিত করুন।",
    },
    cta: {
      text: "অফসেট প্রিন্ট অর্ডার করুন",
      message:
        "আসসালামু আলাইকুম। আমি Offset Printing করাতে চাই। কাজের বিবরণ ও পরিমাণ পাঠাচ্ছি, দাম ও সময় জানান:",
    },
  },

  // ==================== 10. OTHER ====================
  {
    id: "other",
    no: "10",
    icon: LayoutGrid,
    title: "Other Printing & Packaging",
    titleHighlight: "Other Printing",
    summary:
      "উপরের সেবাগুলো ছাড়াও আপনার আরও যেকোনো প্রিন্টিং বা প্যাকেজিং প্রয়োজন — Paper Bag, Shopping Bag, Label, Carton, LDP, বাংলা Printing সহ সব ধরনের কাস্টম সমাধান।",
    shortSummary:
      "Paper Bag, Shopping Bag, Label, Carton, LDP সহ অন্যান্য প্রিন্টিং ও প্যাকেজিং।",
    whatIsIt:
      "নির্দিষ্ট সেবা পেজে প্রয়োজনীয় প্রিন্টিং বা প্যাকেজিং না পেলে WhatsApp-এ বিস্তারিত জানান। কাজের প্রাপ্যতা, ম্যাটেরিয়াল ও শর্ত আলোচনা করে নিশ্চিত করুন।",
    benefits: [
      "বিভিন্ন কাস্টম প্রিন্টিংয়ের প্রয়োজন নিয়ে আলোচনা",
      "One-stop প্যাকেজিং সলিউশন",
      "ম্যাটেরিয়াল ও প্রাপ্যতা অনুযায়ী কাজের শর্ত যাচাই",
      "ছোট বা বড় অর্ডারের ন্যূনতম পরিমাণ ও শর্ত যাচাই",
      "বিশেষজ্ঞ পরামর্শ",
      "প্রতিযোগিতামূলক মূল্য",
    ],
    suitableFor: [
      "Paper Bag ও Shopping Bag",
      "কার্টন ও শিপিং বক্স",
      "প্রোডাক্ট লেবেল ও ট্যাগ",
      "বাংলা বই ও প্রকাশনা",
      "LDP প্রিন্টিং",
      "যেকোনো Custom Packaging",
    ],
    gridItems: [
      "Paper Bag",
      "Shopping Bag",
      "Label",
      "Carton",
      "LDP",
      "বাংলা Printing",
      "Other Packaging",
      "Custom Solutions",
    ],
    bullets: [
      "LDP / বাংলা Printing: রঙ ও Specification অনুযায়ী মূল্য নির্ধারিত হবে",
      "অন্যান্য প্রোডাক্ট: Size, Material, Colour, Quantity ও Specification অনুযায়ী মূল্য",
      "কাস্টম আইডিয়া থাকলে প্রয়োজন জানান; কাজের প্রাপ্যতা ও শর্ত নিশ্চিত করুন",
    ],
    detailExtra: [
      "Paper Bag: বিভিন্ন সাইজ ও GSM-এ পাওয়া যায়",
      "Shopping Bag: হ্যান্ডেল ও নন-হ্যান্ডেল অপশন",
      "Kraft, White, Brown — বিভিন্ন material",
      "কাস্টম ডিজাইনে লোগো প্রিন্ট সম্ভব",
    ],
    cta: {
      text: "আপনার প্রয়োজন জানান",
      message:
        "আসসালামু আলাইকুম। আমার একটি Printing/Packaging প্রয়োজন আছে যা আপনাদের অন্য সার্ভিসে নেই। বিস্তারিত জানাচ্ছি:",
    },
  },
];

// ==================== SERVICES FOR FORM ====================

export const SERVICES_FOR_FORM = [
  "LD Packet",
  "Foil Packet",
  "Cylinder",
  "Sticker",
  "Art Paper",
  "Custom Box",
  "Ready-made Packet",
  "Security Poly",
  "Offset Printing",
  "Paper Bag",
  "Shopping Bag",
  "Label",
  "Carton",
  "Other",
];

/** Match detailed service pages to the existing quotation dropdown values. */
export const SERVICE_FORM_VALUES: Record<string, string> = {
  "ld-packet": "LD Packet",
  "foil-packet": "Foil Packet",
  cylinder: "Cylinder",
  sticker: "Sticker",
  "art-paper": "Art Paper",
  "custom-box": "Custom Box",
  "ready-made": "Ready-made Packet",
  "security-poly": "Security Poly",
  offset: "Offset Printing",
  other: "Other",
};
