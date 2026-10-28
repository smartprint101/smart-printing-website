import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Package,
  Sparkles,
  Calculator,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Container, SectionHeading, Reveal, Button, WhatsAppIcon } from "./ui";
import { waLink } from "@/lib/site";
import { cn } from "@/utils/cn";

// ==================== TYPES ====================

type ProductType =
  | "grocery"
  | "dry-food"
  | "bottle-jar"
  | "cosmetics"
  | "medicine"
  | "garments"
  | "electronics"
  | "ecommerce"
  | "gift"
  | "office"
  | "other";

type BudgetType = "premium" | "starter" | "budget";
type BrandType = "print" | "sticker" | "plain";

interface Recommendation {
  primary: {
    name: string;
    icon: string;
    reason: string;
    moq: string;
    delivery: string;
  };
  needsSticker: boolean;
  needsBox: boolean;
  boxNote?: string;
  extraNote?: string;
  showCostCalculator: boolean; // LD/Foil হলে true
  otherOption?: boolean; // "অন্য কিছু" হলে সরাসরি WhatsApp
}

// ==================== QUIZ DATA ====================

const PRODUCT_OPTIONS: {
  value: ProductType;
  icon: string;
  label: string;
  desc: string;
}[] = [
  {
    value: "grocery",
    icon: "🍚",
    label: "মুদি আইটেম",
    desc: "চাল, ডাল, আটা, ময়দা, চিনি, লবণ",
  },
  {
    value: "dry-food",
    icon: "🍪",
    label: "শুকনো খাবার",
    desc: "চিপস, বিস্কুট, মসলা, চা, কফি, নুডলস, শুঁটকি",
  },
  {
    value: "bottle-jar",
    icon: "🍯",
    label: "বোতল/জারের পণ্য",
    desc: "মধু, আচার, সস, কেচাপ, জুস",
  },
  {
    value: "cosmetics",
    icon: "💄",
    label: "কসমেটিক্স",
    desc: "ক্রিম, সাবান, শ্যাম্পু, পারফিউম",
  },
  {
    value: "medicine",
    icon: "💊",
    label: "ঔষধ",
    desc: "ট্যাবলেট, সিরাপ, মলম",
  },
  {
    value: "garments",
    icon: "👕",
    label: "গার্মেন্টস",
    desc: "জামা, জুতা, গহনা, শাড়ি",
  },
  {
    value: "electronics",
    icon: "📱",
    label: "ইলেকট্রনিক্স",
    desc: "মোবাইল, চার্জার, LED",
  },
  {
    value: "ecommerce",
    icon: "🛒",
    label: "ই-কমার্স",
    desc: "অনলাইন অর্ডার শিপিং",
  },
  {
    value: "gift",
    icon: "🎁",
    label: "গিফট আইটেম",
    desc: "চকলেট, মিষ্টি, গিফট হ্যাম্পার",
  },
  {
    value: "office",
    icon: "🏢",
    label: "অফিস/কর্পোরেট",
    desc: "ব্রশিউর, কার্ড, ব্যাগ",
  },
  {
    value: "other",
    icon: "❓",
    label: "অন্য কিছু / নিশ্চিত না",
    desc: "কাস্টম সমাধান দরকার",
  },
];

const BUDGET_OPTIONS: {
  value: BudgetType;
  icon: string;
  label: string;
  desc: string;
  range: string;
}[] = [
  {
    value: "premium",
    icon: "⭐",
    label: "প্রিমিয়াম",
    desc: "Custom Print + Full Branding",
    range: "৮০,০০০+ টাকা",
  },
  {
    value: "starter",
    icon: "🚀",
    label: "শুরু করার মতো",
    desc: "Ready-made + Sticker",
    range: "৩০,০০০ - ৮০,০০০ টাকা",
  },
  {
    value: "budget",
    icon: "💰",
    label: "বাজেট ফ্রেন্ডলি",
    desc: "Ready-made Plain + Sticker",
    range: "৩০,০০০ টাকার কম",
  },
];

const BRAND_OPTIONS: {
  value: BrandType;
  icon: string;
  label: string;
  desc: string;
}[] = [
  {
    value: "print",
    icon: "🎨",
    label: "হ্যাঁ, লোগো/নাম প্রিন্ট করতে চাই",
    desc: "Custom Print (সিলিন্ডার লাগবে)",
  },
  {
    value: "sticker",
    icon: "🏷️",
    label: "Sticker লাগিয়ে Brand করবো",
    desc: "Ready-made প্যাকেট + Custom Sticker",
  },
  {
    value: "plain",
    icon: "📦",
    label: "না, Plain প্যাকেট হলেই চলবে",
    desc: "Ready-made Plain প্যাকেট",
  },
];

// ==================== RECOMMENDATION LOGIC ====================

function getRecommendation(
  product: ProductType,
  budget: BudgetType,
  brand: BrandType
): Recommendation {
  // "অন্য কিছু" — সরাসরি WhatsApp
  if (product === "other") {
    return {
      primary: {
        name: "কাস্টম সমাধান",
        icon: "💬",
        reason:
          "আপনার পণ্যের ধরন unique। সঠিক প্যাকেজিং সাজেশন পেতে আমাদের এক্সপার্টের সাথে কথা বলুন।",
        moq: "আপনার প্রয়োজন অনুযায়ী",
        delivery: "প্রয়োজন অনুযায়ী",
      },
      needsSticker: false,
      needsBox: false,
      showCostCalculator: false,
      otherOption: true,
    };
  }

  // মুদি আইটেম → LD Packet
  if (product === "grocery") {
    if (budget === "premium" && brand === "print") {
      return {
        primary: {
          name: "Custom Print LD Packet",
          icon: "🍚",
          reason:
            "চাল-ডালের জন্য LD প্যাকেট সবচেয়ে ভালো। Custom Print-এ আপনার Brand-এর সম্পূর্ণ Identity তৈরি হবে। ৪টি সিলিন্ডার দিয়ে আকর্ষণীয় ডিজাইন করা যাবে।",
          moq: "১৫০ KG থেকে",
          delivery: "১০-১৫ দিন",
        },
        needsSticker: true,
        needsBox: false,
        showCostCalculator: true,
        extraNote: "৪টি Cylinder লাগবে (Custom Print-এর জন্য)",
      };
    }
    return {
      primary: {
        name: "Ready-made LD Packet",
        icon: "🍚",
        reason:
          "চাল-ডালের জন্য LD প্যাকেট perfect। Ready-made প্যাকেটে Sticker লাগিয়ে দ্রুত Brand করা যায়। কম বাজেটে শুরু করার best option।",
        moq: "৫০০ পিস থেকে",
        delivery: "৩-৫ দিন",
      },
      needsSticker: brand !== "plain",
      needsBox: false,
      showCostCalculator: true,
    };
  }

  // শুকনো খাবার → Foil Packet
  if (product === "dry-food") {
    if (budget === "premium" && brand === "print") {
      return {
        primary: {
          name: "Custom Print Foil Packet",
          icon: "🍪",
          reason:
            "শুকনো খাবারের freshness ধরে রাখতে Foil প্যাকেট best। Custom Print দিয়ে Premium Brand look আসবে। ৫টি সিলিন্ডারে অসাধারণ ডিজাইন সম্ভব।",
          moq: "২০০ KG থেকে",
          delivery: "১২-১৮ দিন",
        },
        needsSticker: true,
        needsBox: false,
        showCostCalculator: true,
        extraNote: "৫টি Cylinder লাগবে (Custom Print-এর জন্য)",
      };
    }
    return {
      primary: {
        name: "Ready-made Foil Packet",
        icon: "🍪",
        reason:
          "শুকনো খাবারের জন্য Foil প্যাকেট perfect — Moisture থেকে রক্ষা করে। Ready-made + Sticker দিয়ে দ্রুত Market-এ যাওয়া যায়।",
        moq: "৫০০ পিস থেকে",
        delivery: "৩-৫ দিন",
      },
      needsSticker: brand !== "plain",
      needsBox: false,
      showCostCalculator: true,
    };
  }

  // বোতল/জার → Sticker + Box
  if (product === "bottle-jar") {
    return {
      primary: {
        name: "Custom Sticker (Label)",
        icon: "🏷️",
        reason:
          "বোতল/জারের জন্য সবচেয়ে গুরুত্বপূর্ণ হলো সুন্দর Sticker Label। এটাই আপনার Product-এর মূল Brand Identity। সাথে Outer Box থাকলে Professional look আসবে।",
        moq: "৫০০ পিস থেকে",
        delivery: "৩-৭ দিন",
      },
      needsSticker: true,
      needsBox: true,
      boxNote: "Outer Box থাকলে Gift/Retail-এ better sell হয়",
      showCostCalculator: false,
    };
  }

  // কসমেটিক্স → Box + Sticker
  if (product === "cosmetics") {
    return {
      primary: {
        name: "Custom Box + Premium Sticker",
        icon: "💄",
        reason:
          "কসমেটিক্সের সৌন্দর্য প্যাকেজিং-এই। Premium Custom Box + Attractive Sticker Label ছাড়া Beauty Product Sell করা কঠিন। কাস্টমারের Trust এতেই বাড়ে।",
        moq: "২০০ পিস থেকে",
        delivery: "৭-১০ দিন",
      },
      needsSticker: true,
      needsBox: true,
      boxNote: "Premium Box কাস্টমারের কাছে High-quality feel দেয়",
      showCostCalculator: false,
    };
  }

  // ঔষধ → Box MUST + Sticker
  if (product === "medicine") {
    return {
      primary: {
        name: "Medicine Box + Label Sticker",
        icon: "💊",
        reason:
          "ঔষধের জন্য Box বাধ্যতামূলক (DGDA Standard)। সাথে Product Info, Batch, Expiry-সহ Professional Sticker দরকার। এটা Regulatory Compliance-এর জন্যও জরুরি।",
        moq: "৫০০ পিস থেকে",
        delivery: "৭-১০ দিন",
      },
      needsSticker: true,
      needsBox: true,
      boxNote: "ঔষধের জন্য Box বাধ্যতামূলক (আইনি প্রয়োজন)",
      extraNote: "⚠️ ঔষধের জন্য DGDA Approved Box দরকার",
      showCostCalculator: false,
    };
  }

  // গার্মেন্টস → Box / Poly Bag
  if (product === "garments") {
    if (budget === "premium") {
      return {
        primary: {
          name: "Premium Garments Box + Tissue Paper",
          icon: "👕",
          reason:
            "প্রিমিয়াম গার্মেন্টসের জন্য সুন্দর Box + Tissue Paper Packaging দিলে Product-এর Value বাড়ে। Unboxing Experience আপনার Brand-কে Memorable করে।",
          moq: "২০০ পিস থেকে",
          delivery: "৭-১০ দিন",
        },
        needsSticker: true,
        needsBox: true,
        boxNote: "Premium Box + Tissue Paper + Thank You Card",
        showCostCalculator: false,
      };
    }
    return {
      primary: {
        name: "Poly Bag + Brand Sticker",
        icon: "👕",
        reason:
          "গার্মেন্টসের জন্য Poly Bag সবচেয়ে Cost-effective। Brand Sticker লাগিয়ে সহজে Identity তৈরি করা যায়। Online Sell-এর জন্য perfect।",
        moq: "৫০০ পিস থেকে",
        delivery: "৩-৭ দিন",
      },
      needsSticker: true,
      needsBox: false,
      showCostCalculator: false,
    };
  }

  // ইলেকট্রনিক্স → Custom Box MUST
  if (product === "electronics") {
    return {
      primary: {
        name: "Custom Electronics Box + Sticker",
        icon: "📱",
        reason:
          "ইলেকট্রনিক্সের জন্য Sturdy Custom Box বাধ্যতামূলক — Product Protection ও Brand Value দুটোই দেয়। Inner Foam/Insert সহ Professional Packaging দরকার।",
        moq: "২০০ পিস থেকে",
        delivery: "১০-১৫ দিন",
      },
      needsSticker: true,
      needsBox: true,
      boxNote: "Custom Box বাধ্যতামূলক (Protection + Branding)",
      extraNote: "Inner Foam/Insert সহ Complete Packaging Solution",
      showCostCalculator: false,
    };
  }

  // ই-কমার্স → Mailer Box
  if (product === "ecommerce") {
    if (budget === "premium") {
      return {
        primary: {
          name: "Custom Print Mailer Box",
          icon: "🛒",
          reason:
            "ই-কমার্স Brand-এর জন্য Custom Mailer Box game-changer। Unboxing Video, Social Media Share — সবকিছুতে আপনার Brand দেখা যাবে। Repeat Customer বাড়াবে।",
          moq: "৩০০ পিস থেকে",
          delivery: "১০-১৪ দিন",
        },
        needsSticker: true,
        needsBox: true,
        boxNote: "Custom Print Mailer Box + Thank You Card",
        showCostCalculator: false,
      };
    }
    return {
      primary: {
        name: "Ready-made Mailer Box + Sticker",
        icon: "🛒",
        reason:
          "শুরুর দিকে Ready-made Mailer Box + Custom Sticker দিয়ে দ্রুত Ship করতে পারবেন। কম খরচে Professional Look।",
        moq: "৫০০ পিস থেকে",
        delivery: "৫-৭ দিন",
      },
      needsSticker: true,
      needsBox: true,
      boxNote: "Ready-made Mailer Box + Brand Sticker",
      showCostCalculator: false,
    };
  }

  // গিফট → Premium Box
  if (product === "gift") {
    return {
      primary: {
        name: "Premium Gift Box + Paper Bag",
        icon: "🎁",
        reason:
          "গিফট প্যাকেজিং আপনার Product-কে Special বানায়। Premium Rigid Box + Ribbon + Paper Bag combo দিলে কাস্টমার মুগ্ধ হবেই। Wedding/Corporate Gift-এ perfect।",
        moq: "১০০ পিস থেকে",
        delivery: "১০-১৫ দিন",
      },
      needsSticker: true,
      needsBox: true,
      boxNote: "Premium Box + Paper Bag + Custom Sticker (Complete Set)",
      showCostCalculator: false,
    };
  }

  // অফিস/কর্পোরেট → Print + Bag
  if (product === "office") {
    if (budget === "premium") {
      return {
        primary: {
          name: "Offset Print + Premium Paper Bag",
          icon: "🏢",
          reason:
            "Corporate Branding-এর জন্য Offset Print quality সবচেয়ে ভালো। Brochure, Business Card, Paper Bag — সব একসাথে করলে Consistent Brand Identity তৈরি হবে।",
          moq: "৫০০ পিস থেকে",
          delivery: "৭-১০ দিন",
        },
        needsSticker: false,
        needsBox: false,
        showCostCalculator: false,
        extraNote: "Offset Printing + Premium Paper Bag Combo",
      };
    }
    return {
      primary: {
        name: "Digital Print + Paper Bag",
        icon: "🏢",
        reason:
          "কম quantity-তে Digital Printing best। দ্রুত Delivery, কম খরচে Professional look। Small Business/Startup-এর জন্য perfect।",
        moq: "১০০ পিস থেকে",
        delivery: "৩-৭ দিন",
      },
      needsSticker: false,
      needsBox: false,
      showCostCalculator: false,
    };
  }

  // Default fallback
  return {
    primary: {
      name: "কাস্টম সমাধান",
      icon: "📦",
      reason:
        "আপনার প্রয়োজন অনুযায়ী কাস্টম সমাধান দিতে পারি। বিস্তারিত জানতে যোগাযোগ করুন।",
      moq: "আপনার প্রয়োজন অনুযায়ী",
      delivery: "৭-১৫ দিন",
    },
    needsSticker: false,
    needsBox: false,
    showCostCalculator: false,
    otherOption: true,
  };
}

// ==================== META PIXEL HELPERS ====================

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const trackPixelEvent = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", event, params);
  }
};

// ==================== MAIN COMPONENT ====================

export function ProductFinder() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [budget, setBudget] = useState<BudgetType | null>(null);
  const [brand, setBrand] = useState<BrandType | null>(null);

  const recommendation =
    product && budget && brand ? getRecommendation(product, budget, brand) : null;

  const handleStart = () => {
    setStep(1);
    trackPixelEvent("PacketFinderStart", {
      content_name: "Product Finder Quiz Started",
      content_category: "Quiz",
    });
  };

  const handleProductSelect = (p: ProductType) => {
    setProduct(p);
    // "অন্য কিছু" হলে সরাসরি Result-এ যাবে
    if (p === "other") {
      setBudget("starter");
      setBrand("sticker");
      setStep(3);
      trackPixelEvent("PacketFinderResult", {
        content_name: "Product Finder - Other Selected",
        content_category: "Quiz",
      });
    } else {
      setStep(2);
    }
  };

  const handleBudgetSelect = (b: BudgetType) => {
    setBudget(b);
    setStep(3);
  };

  const handleBrandSelect = (b: BrandType) => {
    setBrand(b);
    setStep(3);
    trackPixelEvent("PacketFinderResult", {
      content_name: "Product Finder Quiz Completed",
      content_category: "Quiz",
      product_type: product,
      budget_type: budget,
      brand_type: b,
    });
  };

  const handleBack = () => {
    if (step === 3) {
      // Result থেকে Back → Brand step-এ
      if (product === "other") {
        // "অন্য কিছু" হলে Product step-এ ফিরবে
        setStep(1);
        setBudget(null);
        setBrand(null);
      } else {
        setStep(2);
        setBrand(null);
      }
    } else if (step === 2) {
      setStep(1);
      setBudget(null);
    } else if (step === 1) {
      setStep(0);
      setProduct(null);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setProduct(null);
    setBudget(null);
    setBrand(null);
  };

  const handleQuoteClick = () => {
    trackPixelEvent("PacketFinderQuoteClick", {
      content_name: "Product Finder Quotation",
      content_category: "Lead Generation",
      value: 0.0,
      currency: "BDT",
    });
  };

  const handleCostCalculatorClick = () => {
    trackPixelEvent("PacketFinderCalculatorClick", {
      content_name: "Cost Calculator from Product Finder",
      content_category: "Tool",
    });
  };

  // WhatsApp message builder
  const buildWhatsAppMessage = (): string => {
    if (!recommendation) return "";

    const productLabel =
      PRODUCT_OPTIONS.find((p) => p.value === product)?.label || "";
    const budgetLabel =
      BUDGET_OPTIONS.find((b) => b.value === budget)?.label || "";
    const brandLabel =
      BRAND_OPTIONS.find((b) => b.value === brand)?.label || "";

    let msg = `আসসালামু আলাইকুম। আমি আপনাদের প্যাকেট ফাইন্ডার ব্যবহার করেছি:\n\n`;
    msg += `📦 পণ্য: ${productLabel}\n`;

    if (product !== "other") {
      msg += `💰 বাজেট: ${budgetLabel}\n`;
      msg += `🎨 ব্র্যান্ডিং: ${brandLabel}\n`;
    }

    msg += `\n✅ Recommendation:\n`;
    msg += `${recommendation.primary.icon} ${recommendation.primary.name}\n`;

    if (recommendation.needsSticker) msg += `+ Custom Sticker\n`;
    if (recommendation.needsBox) msg += `+ Box Packaging\n`;

    msg += `\nবিস্তারিত জানতে চাই।`;
    return msg;
  };

  return (
    <section
      id="product-finder"
      className="scroll-mt-24 bg-linear-to-b from-mist to-white py-14 sm:py-20"
    >
      <Container>
        <Reveal>
          <SectionHeading
            center
            eyebrow="Product Finder"
            title="আপনার সঠিক প্যাকেট খুঁজে নিন"
            subtitle="মাত্র ৩টি প্রশ্নের উত্তর দিন — আমরা আপনার পণ্যের জন্য সঠিক প্যাকেজিং সাজেশন দেবো।"
          />
        </Reveal>

        <div className="mt-8 mx-auto max-w-3xl">
          {/* Progress Bar */}
          {step > 0 && step < 3 && (
            <Reveal>
              <div className="mb-6">
                <div className="flex items-center justify-between text-[12px] font-semibold text-muted">
                  <span>ধাপ {step} / 3</span>
                  <span>{Math.round((step / 3) * 100)}% সম্পন্ন</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full bg-linear-to-r from-gold-400 to-gold-600 transition-all duration-500"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>
            </Reveal>
          )}

          {/* STEP 0: Intro / Start */}
          {step === 0 && (
            <Reveal>
              <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-gold-400 to-gold-600 text-white shadow-lg">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-[22px] font-extrabold text-ink sm:text-[26px]">
                  ৩ টি প্রশ্নে সঠিক প্যাকেট খুঁজুন
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted sm:text-[15px]">
                  আপনার পণ্য, বাজেট ও ব্র্যান্ডিং প্রয়োজন অনুযায়ী <br className="hidden sm:block" />
                  সবচেয়ে উপযুক্ত প্যাকেজিং সলিউশন পান — সম্পূর্ণ ফ্রি!
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { icon: "📦", label: "কোন পণ্য?" },
                    { icon: "💰", label: "কেমন বাজেট?" },
                    { icon: "🎨", label: "কী ব্র্যান্ডিং?" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-line bg-mist p-3 text-center"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <p className="mt-1 text-[11px] font-semibold text-royal-800 sm:text-[13px]">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleStart}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-b from-gold-300 to-gold-500 px-6 py-3.5 text-[15px] font-bold text-royal-900 shadow-lg transition-all hover:from-gold-200 hover:to-gold-400"
                >
                  শুরু করুন
                  <ArrowRight className="h-5 w-5" />
                </button>

                <p className="mt-4 text-[12px] text-muted">
                  ⚡ মাত্র ৩০ সেকেন্ডে ফলাফল পাবেন
                </p>
              </div>
            </Reveal>
          )}

          {/* STEP 1: Product Selection */}
          {step === 1 && (
            <Reveal>
              <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
                <div className="mb-5">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-gold-600">
                    প্রশ্ন ১ / ৩
                  </p>
                  <h3 className="mt-1 text-[18px] font-extrabold text-ink sm:text-[22px]">
                    আপনি কী পণ্য প্যাকেজ করতে চান?
                  </h3>
                  <p className="mt-1 text-[13px] text-muted">
                    নিচের যে কোনো একটি বেছে নিন
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {PRODUCT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleProductSelect(opt.value)}
                      className={cn(
                        "group flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all hover:border-gold-400 hover:bg-gold-50",
                        product === opt.value
                          ? "border-gold-500 bg-gold-50"
                          : "border-line bg-white"
                      )}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="text-[14px] font-bold text-ink group-hover:text-royal-800">
                          {opt.label}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-muted">
                          {opt.desc}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-gold-600" />
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-royal-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    পিছনে
                  </button>
                  <p className="text-[11px] text-muted">
                    💡 নিচে scroll করে সব option দেখুন
                  </p>
                </div>
              </div>
            </Reveal>
          )}

          {/* STEP 2: Budget Selection */}
          {step === 2 && (
            <Reveal>
              <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
                <div className="mb-5">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-gold-600">
                    প্রশ্ন ২ / ৩
                  </p>
                  <h3 className="mt-1 text-[18px] font-extrabold text-ink sm:text-[22px]">
                    আপনি প্যাকেট কী রকম চান?
                  </h3>
                  <p className="mt-1 text-[13px] text-muted">
                    আপনার বাজেট অনুযায়ী বেছে নিন
                  </p>
                </div>

                <div className="grid gap-3">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleBudgetSelect(opt.value)}
                      className={cn(
                        "group flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all hover:border-gold-400 hover:bg-gold-50",
                        budget === opt.value
                          ? "border-gold-500 bg-gold-50"
                          : "border-line bg-white"
                      )}
                    >
                      <span className="text-3xl">{opt.icon}</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[15px] font-bold text-ink group-hover:text-royal-800">
                            {opt.label}
                          </p>
                          <span className="rounded-full bg-royal-50 px-2 py-0.5 text-[10px] font-semibold text-royal-700 ring-1 ring-royal-100">
                            {opt.range}
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] leading-relaxed text-muted">
                          {opt.desc}
                        </p>
                      </div>
                      <ArrowRight className="mt-1.5 h-5 w-5 shrink-0 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-gold-600" />
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-royal-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    পিছনে
                  </button>
                </div>
              </div>
            </Reveal>
          )}

          {/* STEP 3: Brand Selection or Result */}
          {step === 3 && !recommendation && product !== "other" && (
            <Reveal>
              <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
                <div className="mb-5">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-gold-600">
                    প্রশ্ন ৩ / ৩
                  </p>
                  <h3 className="mt-1 text-[18px] font-extrabold text-ink sm:text-[22px]">
                    আপনার কোম্পানির নামে প্যাকেট করবেন?
                  </h3>
                  <p className="mt-1 text-[13px] text-muted">
                    ব্র্যান্ডিং pattern বেছে নিন
                  </p>
                </div>

                <div className="grid gap-3">
                  {BRAND_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleBrandSelect(opt.value)}
                      className={cn(
                        "group flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all hover:border-gold-400 hover:bg-gold-50",
                        brand === opt.value
                          ? "border-gold-500 bg-gold-50"
                          : "border-line bg-white"
                      )}
                    >
                      <span className="text-3xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="text-[15px] font-bold text-ink group-hover:text-royal-800">
                          {opt.label}
                        </p>
                        <p className="mt-1 text-[12px] leading-relaxed text-muted">
                          {opt.desc}
                        </p>
                      </div>
                      <ArrowRight className="mt-1.5 h-5 w-5 shrink-0 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-gold-600" />
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-royal-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    পিছনে
                  </button>
                </div>
              </div>
            </Reveal>
          )}

          {/* STEP 3: RESULT */}
          {step === 3 && recommendation && (
            <Reveal>
              <div className="space-y-4">
                {/* Success Header */}
                <div className="rounded-3xl border-2 border-gold-300 bg-linear-to-br from-gold-50 to-white p-5 shadow-card sm:p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold-400 to-gold-600 text-white shadow-lg">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-600">
                        আপনার Recommendation
                      </p>
                      <h3 className="text-[18px] font-extrabold text-ink sm:text-[22px]">
                        সঠিক প্যাকেট পাওয়া গেছে!
                      </h3>
                    </div>
                  </div>

                  {/* Primary Recommendation */}
                  <div className="mt-5 rounded-2xl bg-white p-4 ring-2 ring-gold-200 sm:p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-4xl">{recommendation.primary.icon}</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-600">
                          🏆 Primary Product
                        </p>
                        <h4 className="mt-0.5 text-[17px] font-extrabold text-royal-800 sm:text-[19px]">
                          {recommendation.primary.name}
                        </h4>
                        <p className="mt-2 text-[13px] leading-relaxed text-muted">
                          {recommendation.primary.reason}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-royal-50 px-2.5 py-1 text-[11px] font-semibold text-royal-700 ring-1 ring-royal-100">
                            📦 MOQ: {recommendation.primary.moq}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-royal-50 px-2.5 py-1 text-[11px] font-semibold text-royal-700 ring-1 ring-royal-100">
                            🚚 Delivery: {recommendation.primary.delivery}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 ring-1 ring-green-200">
                            ✨ ডিজাইন: ফ্রি!
                          </span>
                        </div>

                        {recommendation.extraNote && (
                          <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-mist p-2.5 text-[12px] text-royal-800">
                            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                            <p>{recommendation.extraNote}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sticker Recommendation */}
                  {recommendation.needsSticker && (
                    <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-line">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">🏷️</span>
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-royal-600">
                            + Add On
                          </p>
                          <h4 className="mt-0.5 text-[15px] font-bold text-ink">
                            Custom Sticker (Label)
                          </h4>
                          <p className="mt-1 text-[12px] leading-relaxed text-muted">
                            আপনার Logo + Brand Name + MRP + Weight + Barcode সহ Professional Sticker। ৫০০ পিস থেকে, ডিজাইন সম্পূর্ণ ফ্রি।
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Box Recommendation */}
                  {recommendation.needsBox && (
                    <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-line">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">📦</span>
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-royal-600">
                            + Add On
                          </p>
                          <h4 className="mt-0.5 text-[15px] font-bold text-ink">
                            Box Packaging
                          </h4>
                          <p className="mt-1 text-[12px] leading-relaxed text-muted">
                            {recommendation.boxNote ||
                              "Professional Look আনে, কাস্টমারের Trust বাড়ায়। ২০০ পিস থেকে, ডিজাইন ফ্রি।"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
                  <p className="text-center text-[14px] font-bold text-ink">
                    এখন কী করবেন?
                  </p>

                  <div className="mt-4 grid gap-2.5">
                    {/* Quotation Button (Primary) */}
                    <Button
                      href="#quote"
                      onClick={handleQuoteClick}
                      variant="gold"
                      size="lg"
                      className="w-full justify-center"
                    >
                      <FileText className="h-4 w-4" />
                      ফ্রি কোটেশন নিন
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    {/* WhatsApp Button */}
                    <Button
                      href={waLink(buildWhatsAppMessage())}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="whatsapp"
                      size="lg"
                      className="w-full justify-center"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      WhatsApp-এ কথা বলুন
                    </Button>

                    {/* Cost Calculator Button (only for LD/Foil) */}
                    {recommendation.showCostCalculator && (
                      <Button
                        href="#budget"
                        onClick={handleCostCalculatorClick}
                        variant="outlineGold"
                        size="lg"
                        className="w-full justify-center"
                      >
                        <Calculator className="h-4 w-4" />
                        Cost Calculator দেখুন
                      </Button>
                    )}
                  </div>

                  {/* Info Note */}
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-mist p-3 text-[12px]">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    <p className="leading-relaxed text-muted">
                      💡 <strong className="text-ink">বাজেটে সমস্যা?</strong> বিকল্প সলিউশন জানতে WhatsApp-এ কথা বলুন। আমরা আপনার প্রয়োজন অনুযায়ী কাস্টম সমাধান দেবো।
                    </p>
                  </div>

                  {/* Back / Restart */}
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-royal-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      পিছনে
                    </button>
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-royal-700 transition-colors hover:text-royal-900"
                    >
                      <RotateCcw className="h-4 w-4" />
                      আবার শুরু করুন
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}