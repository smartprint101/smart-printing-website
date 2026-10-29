import { useState } from "react";
import {
  Sparkles,
  Calculator,
  RotateCcw,
  Info,
  Ruler,
  Palette,
  Package,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Container, SectionHeading, Reveal, Button, WhatsAppIcon } from "./ui";
import { useSiteSettings } from "@/lib/catalog";
import { waLink, waLinkPacket } from "@/lib/site";
import { cn } from "@/utils/cn";

// ==================== TYPES ====================

type ServiceType = "cylinder-only" | "cylinder-ld" | "cylinder-foil";

interface CalculationResult {
  adjustedW: number;
  adjustedH: number;
  wMultiplier: number;
  hMultiplier: number;
  perCylinderPrice: number;
  totalCylinderCost: number;
  packetMinCost?: number;
  packetMaxCost?: number;
  grandMinTotal: number;
  grandMaxTotal: number;
}

// ==================== HELPER FUNCTIONS ====================

// Format number to Bengali comma format
const formatBDT = (num: number): string => {
  return new Intl.NumberFormat("en-IN").format(Math.round(num));
};

// Adjust Width: W+80 must be ≥ 400, else multiply W until (W×n)+80 ≥ 400
const adjustWidth = (w: number): { adjusted: number; multiplier: number } => {
  let multiplier = 1;
  let adjusted = w * multiplier + 80;
  while (adjusted < 400 && multiplier < 20) {
    multiplier++;
    adjusted = w * multiplier + 80;
  }
  return { adjusted, multiplier };
};

// Adjust Height: H must be ≥ 380, else multiply H until (H×n) ≥ 380
const adjustHeight = (h: number): { adjusted: number; multiplier: number } => {
  let multiplier = 1;
  let adjusted = h * multiplier;
  while (adjusted < 380 && multiplier < 20) {
    multiplier++;
    adjusted = h * multiplier;
  }
  return { adjusted, multiplier };
};

// ==================== MAIN COMPONENT ====================

export function BudgetEstimator() {
  const { estimator: rates } = useSiteSettings();
  const [serviceType, setServiceType] = useState<ServiceType>("cylinder-only");
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [colors, setColors] = useState<number>(4);
  const [kg, setKg] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>("");
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const needsKg = serviceType !== "cylinder-only";
  const minKg =
    serviceType === "cylinder-ld"
      ? rates.ldMinKg
      : serviceType === "cylinder-foil"
        ? rates.foilMinKg
        : 0;

  const handleCalculate = () => {
    setError("");
    setResult(null);

    // Validation
    const w = parseFloat(width);
    const h = parseFloat(height);
    const kgNum = parseFloat(kg);

    if (!Number.isFinite(w) || w <= 0) {
      setError("অনুগ্রহ করে সঠিক Width (mm) দিন।");
      return;
    }
    if (!Number.isFinite(h) || h <= 0) {
      setError("অনুগ্রহ করে সঠিক Height (mm) দিন।");
      return;
    }
    if (colors < 1 || colors > 8) {
      setError("রঙের সংখ্যা 1 থেকে 8 এর মধ্যে হতে হবে।");
      return;
    }
    if (needsKg) {
      if (!Number.isFinite(kgNum) || kgNum <= 0) {
        setError("অনুগ্রহ করে সঠিক পরিমাণ (KG) দিন।");
        return;
      }
      if (kgNum < minKg) {
        setError(
          `${serviceType === "cylinder-ld" ? "LD" : "Foil"} প্যাকেটের ন্যূনতম ${minKg} KG অর্ডার করতে হবে।`,
        );
        return;
      }
    }

    // Calculate
    const { adjusted: adjustedW, multiplier: wMultiplier } = adjustWidth(w);
    const { adjusted: adjustedH, multiplier: hMultiplier } = adjustHeight(h);

    const perCylinderPrice =
      ((adjustedW * adjustedH) / 100) * rates.cylinderRatePer100cm2;
    const totalCylinderCost = perCylinderPrice * colors;

    let packetMinCost: number | undefined;
    let packetMaxCost: number | undefined;

    if (serviceType === "cylinder-ld") {
      packetMinCost = kgNum * rates.ldMin;
      packetMaxCost = kgNum * rates.ldMax;
    } else if (serviceType === "cylinder-foil") {
      packetMinCost = kgNum * rates.foilMin;
      packetMaxCost = kgNum * rates.foilMax;
    }

    const grandMinTotal = totalCylinderCost + (packetMinCost || 0);
    const grandMaxTotal = totalCylinderCost + (packetMaxCost || 0);

    if (!Number.isFinite(grandMaxTotal)) {
      setError("এই সাইজ বা পরিমাণের জন্য সরাসরি কোটেশন নিন।");
      return;
    }

    setResult({
      adjustedW,
      adjustedH,
      wMultiplier,
      hMultiplier,
      perCylinderPrice,
      totalCylinderCost,
      packetMinCost,
      packetMaxCost,
      grandMinTotal,
      grandMaxTotal,
    });

    // Scroll to result smoothly
    setTimeout(() => {
      document
        .getElementById("budget-result")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  const handleReset = () => {
    setServiceType("cylinder-only");
    setWidth("");
    setHeight("");
    setColors(4);
    setKg("");
    setResult(null);
    setError("");
  };

  const buildWhatsAppMessage = (): string => {
    if (!result) return "";

    let msg = `আসসালামু আলাইকুম। আমি আপনাদের বাজেট ক্যালকুলেটর ব্যবহার করেছি:\n\n`;
    msg += `🎯 সার্ভিস: ${
      serviceType === "cylinder-only"
        ? "শুধু সিলিন্ডার"
        : serviceType === "cylinder-ld"
          ? "সিলিন্ডার + LD প্যাকেট"
          : "সিলিন্ডার + Foil প্যাকেট"
    }\n`;
    msg += `📏 Width: ${width}mm (Adjusted: ${result.adjustedW}mm)\n`;
    msg += `📏 Height: ${height}mm (Adjusted: ${result.adjustedH}mm)\n`;
    msg += `🎨 রঙ: ${colors} কালার\n`;

    if (needsKg) {
      msg += `📦 পরিমাণ: ${kg} KG\n`;
    }

    msg += `\n💰 আনুমানিক হিসাব:\n`;
    msg += `• সিলিন্ডার: ৳${formatBDT(result.totalCylinderCost)}\n`;

    if (
      result.packetMinCost !== undefined &&
      result.packetMaxCost !== undefined
    ) {
      msg += `• প্যাকেট: ৳${formatBDT(result.packetMinCost)} - ৳${formatBDT(result.packetMaxCost)}\n`;
      msg += `• মোট: ৳${formatBDT(result.grandMinTotal)} - ৳${formatBDT(result.grandMaxTotal)}\n`;
    }

    msg += `\nচূড়ান্ত quotation-এর জন্য অনুরোধ করছি।`;
    return msg;
  };

  const isPacket = serviceType !== "cylinder-only";

  return (
    <section id="budget-tool" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            center
            eyebrow="Smart Calculator"
            title="দ্রুত বাজেট ক্যালকুলেটর"
            subtitle="আপনার প্যাকেটের সাইজ ও রঙের তথ্য দিয়ে তাৎক্ষণিক আনুমানিক বাজেট জানুন।"
          />
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-8">
          {/* LEFT: Guide */}
          <Reveal>
            <div className="sticky top-24 space-y-4">
              {/* Info Card */}
              <div className="rounded-2xl border border-gold-200 bg-linear-to-br from-gold-50 to-white p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-gold-600" />
                  <h3 className="text-[15px] font-bold text-ink">
                    কীভাবে মাপ দেবেন?
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="mt-3 text-[12px] font-semibold text-royal-700 underline"
                >
                  {showGuide ? "গাইড লুকান ▲" : "বিস্তারিত গাইড দেখুন ▼"}
                </button>

                {showGuide && (
                  <div className="mt-4 space-y-4 text-[13px] leading-relaxed">
                    {/* Width Guide */}
                    <div className="rounded-xl bg-white p-3.5 ring-1 ring-gold-100">
                      <p className="flex items-center gap-1.5 font-bold text-royal-800">
                        <Ruler className="h-4 w-4 text-gold-600" />
                        Width (W) কীভাবে মাপবেন?
                      </p>
                      <p className="mt-2 text-muted">
                        প্যাকেটটা যদি খুলে সমতল করেন, তাহলে{" "}
                        <strong>মোট চওড়া</strong> যত mm হবে সেটাই W।
                      </p>
                      <div className="mt-2 rounded-lg bg-mist p-2.5 text-[12px] text-royal-800">
                        <strong>
                          W = সামনের চওড়া + পিছনের চওড়া + সাইড সিলিং (দুই পাশ)
                        </strong>
                      </div>
                      <p className="mt-2 text-[12px] text-muted">
                        <strong>উদাহরণ:</strong> সামনে 100mm + পিছনে 100mm +
                        সাইড 20mm = <strong>W: 220mm</strong>
                      </p>
                    </div>

                    {/* Height Guide */}
                    <div className="rounded-xl bg-white p-3.5 ring-1 ring-gold-100">
                      <p className="flex items-center gap-1.5 font-bold text-royal-800">
                        <Ruler className="h-4 w-4 text-gold-600 rotate-90" />
                        Height (H) কীভাবে মাপবেন?
                      </p>
                      <p className="mt-2 text-muted">
                        প্যাকেটের <strong>মোট উচ্চতা</strong>, উপরের ও নিচের
                        সিলিং সহ।
                      </p>
                      <div className="mt-2 rounded-lg bg-mist p-2.5 text-[12px] text-royal-800">
                        <strong>
                          H = প্যাকেটের উচ্চতা + টপ সিলিং + বটম সিলিং
                        </strong>
                      </div>
                      <p className="mt-2 text-[12px] text-muted">
                        <strong>উদাহরণ:</strong> উচ্চতা 200mm + টপ 15mm + বটম
                        15mm = <strong>H: 230mm</strong>
                      </p>
                    </div>

                    {/* Colors Guide */}
                    <div className="rounded-xl bg-white p-3.5 ring-1 ring-gold-100">
                      <p className="flex items-center gap-1.5 font-bold text-royal-800">
                        <Palette className="h-4 w-4 text-gold-600" />
                        রঙের সংখ্যা কী?
                      </p>
                      <p className="mt-2 text-muted">
                        আপনার ডিজাইনে যত কালার আছে (1 থেকে 8)। প্রতি কালারের
                        জন্য 1টা সিলিন্ডার লাগে।
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp Help */}
              <div className="rounded-2xl border border-royal-100 bg-royal-50 p-4">
                <p className="text-[13px] font-semibold text-royal-800">
                  💬 বুঝতে অসুবিধা হচ্ছে?
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-royal-700">
                  আমাদের সাথে সরাসরি WhatsApp-এ কথা বলুন। আমরা সাহায্য করব।
                </p>
                <Button
                  href={waLink(
                    "আমি বাজেট ক্যালকুলেটর ব্যবহার করতে চাচ্ছি। সাইজ বুঝতে সাহায্য দরকার।",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="sm"
                  className="mt-3 w-full justify-center"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  সাহায্য নিন
                </Button>
              </div>
            </div>
          </Reveal>

          {/* RIGHT: Calculator */}
          <Reveal delay={120}>
            <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
              {/* Header */}
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-royal-700 to-royal-900 text-white shadow-sm">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-ink">
                    বাজেট ক্যালকুলেটর
                  </h3>
                  <p className="text-[12px] text-muted">
                    তথ্য দিন, সাথে সাথে হিসাব পান
                  </p>
                </div>
              </div>

              {/* Service Type Selection */}
              <div className="mb-5">
                <label className="text-[13px] font-bold text-ink">
                  🎯 আপনি কী চান?
                </label>
                <div className="mt-2 grid gap-2">
                  {[
                    {
                      value: "cylinder-only",
                      label: "শুধু সিলিন্ডারের দাম",
                      icon: "🎨",
                    },
                    {
                      value: "cylinder-ld",
                      label: "সিলিন্ডার + LD প্যাকেট (Total)",
                      icon: "📦",
                    },
                    {
                      value: "cylinder-foil",
                      label: "সিলিন্ডার + Foil প্যাকেট (Total)",
                      icon: "✨",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all",
                        serviceType === opt.value
                          ? "border-gold-400 bg-gold-50"
                          : "border-line bg-white hover:border-royal-200",
                      )}
                    >
                      <input
                        type="radio"
                        name="serviceType"
                        value={opt.value}
                        checked={serviceType === opt.value}
                        onChange={(e) => {
                          setServiceType(e.target.value as ServiceType);
                          setResult(null);
                        }}
                        className="h-4 w-4 accent-gold-600"
                      />
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-[13px] font-semibold text-ink">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cylinder Info */}
              <div className="mb-5 rounded-2xl bg-mist p-4">
                <p className="mb-3 flex items-center gap-1.5 text-[13px] font-bold text-royal-800">
                  <Ruler className="h-4 w-4 text-gold-600" />
                  সিলিন্ডারের তথ্য দিন
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Width */}
                  <label className="block">
                    <span className="text-[12px] font-semibold text-ink">
                      Width (mm) *
                    </span>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="যেমন: 220"
                      min="1"
                      className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                    />
                    <span className="mt-1 block text-[11px] text-muted">
                      💡 সামনে + পিছনে + সাইড সিলিং
                    </span>
                  </label>

                  {/* Height */}
                  <label className="block">
                    <span className="text-[12px] font-semibold text-ink">
                      Height (mm) *
                    </span>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="যেমন: 230"
                      min="1"
                      className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                    />
                    <span className="mt-1 block text-[11px] text-muted">
                      💡 উচ্চতা + টপ ও বটম সিলিং
                    </span>
                  </label>
                </div>

                {/* Colors */}
                <div className="mt-3">
                  <span className="text-[12px] font-semibold text-ink">
                    🎨 রঙের সংখ্যা *
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setColors(num)}
                        aria-pressed={colors === num}
                        className={cn(
                          "h-11 w-11 rounded-xl border-2 text-sm font-bold transition-all",
                          colors === num
                            ? "border-royal-800 bg-royal-800 text-white shadow-sm"
                            : "border-line bg-white text-ink hover:border-gold-300",
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <span className="mt-1.5 block text-[11px] text-muted">
                    💡 আপনার ডিজাইনে যত কালার আছে ({colors}টি সিলিন্ডার লাগবে)
                  </span>
                </div>
              </div>

              {/* Packet Info (only if not cylinder-only) */}
              {needsKg && (
                <div className="mb-5 rounded-2xl bg-linear-to-br from-royal-50 to-white p-4 ring-1 ring-royal-100">
                  <p className="mb-3 flex items-center gap-1.5 text-[13px] font-bold text-royal-800">
                    <Package className="h-4 w-4 text-gold-600" />
                    প্যাকেটের পরিমাণ
                  </p>

                  <label className="block">
                    <span className="text-[12px] font-semibold text-ink">
                      পরিমাণ (KG) *{" "}
                      <span className="text-red-500">— ন্যূনতম {minKg} KG</span>
                    </span>
                    <input
                      type="number"
                      value={kg}
                      onChange={(e) => setKg(e.target.value)}
                      placeholder={`যেমন: ${minKg}`}
                      min={minKg}
                      className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                    />
                    <span className="mt-1 block text-[11px] text-muted">
                      💡 {serviceType === "cylinder-ld" ? "LD" : "Foil"}{" "}
                      প্যাকেটের ন্যূনতম অর্ডার {minKg} KG
                    </span>
                  </label>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 ring-1 ring-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <p className="text-[13px] font-medium text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-royal-700 to-royal-900 px-5 py-3 text-[14px] font-bold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  <Calculator className="h-4 w-4" />
                  হিসাব করুন
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-4 py-3 text-[13px] font-semibold text-muted transition-colors hover:border-royal-200 hover:text-royal-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>

              {/* Result */}
              {result && (
                <div id="budget-result" className="mt-6 space-y-4">
                  {/* Formula Breakdown */}
                  <div className="rounded-2xl border-2 border-royal-100 bg-royal-50 p-4">
                    <p className="flex items-center gap-1.5 text-[13px] font-bold text-royal-800">
                      <Info className="h-4 w-4 text-royal-600" />
                      হিসাবের বিস্তারিত
                    </p>

                    <div className="mt-3 space-y-2 text-[12px]">
                      <div className="flex items-start gap-2 rounded-lg bg-white p-2.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                        <div className="flex-1">
                          <p className="text-muted">
                            <strong className="text-ink">
                              Adjusted Width:
                            </strong>{" "}
                            {result.adjustedW}mm
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted">
                            ({width} × {result.wMultiplier} + 80 ={" "}
                            {result.adjustedW}mm, ন্যূনতম 400mm)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 rounded-lg bg-white p-2.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                        <div className="flex-1">
                          <p className="text-muted">
                            <strong className="text-ink">
                              Adjusted Height:
                            </strong>{" "}
                            {result.adjustedH}mm
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted">
                            ({height} × {result.hMultiplier} ={" "}
                            {result.adjustedH}mm, ন্যূনতম 380mm)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 rounded-lg bg-white p-2.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                        <div className="flex-1">
                          <p className="text-muted">
                            <strong className="text-ink">Per Cylinder:</strong>{" "}
                            ৳{formatBDT(result.perCylinderPrice)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted">
                            ({result.adjustedW} × {result.adjustedH} ÷ 100) ×{" "}
                            {rates.cylinderRatePer100cm2}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="overflow-hidden rounded-2xl border-2 border-gold-300 bg-linear-to-br from-gold-50 to-white shadow-lg">
                    <div className="bg-linear-to-r from-gold-500 to-gold-600 p-3">
                      <p className="flex items-center gap-1.5 text-[14px] font-extrabold text-white">
                        <Sparkles className="h-4 w-4" />
                        আপনার আনুমানিক বাজেট
                      </p>
                    </div>

                    <div className="space-y-3 p-4">
                      {/* Cylinder Cost */}
                      <div className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-gold-200">
                        <div>
                          <p className="text-[12px] font-semibold text-muted">
                            সিলিন্ডার ({colors}টি)
                          </p>
                          <p className="text-[11px] text-muted">
                            ৳{formatBDT(result.perCylinderPrice)} × {colors}
                          </p>
                        </div>
                        <p className="text-[16px] font-extrabold text-royal-800">
                          ৳{formatBDT(result.totalCylinderCost)}
                        </p>
                      </div>

                      {/* Packet Cost */}
                      {isPacket &&
                        result.packetMinCost !== undefined &&
                        result.packetMaxCost !== undefined && (
                          <div className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-gold-200">
                            <div>
                              <p className="text-[12px] font-semibold text-muted">
                                {serviceType === "cylinder-ld" ? "LD" : "Foil"}{" "}
                                প্যাকেট ({kg} KG)
                              </p>
                              <p className="text-[11px] text-muted">
                                ৳
                                {serviceType === "cylinder-ld"
                                  ? `${rates.ldMin}-${rates.ldMax}`
                                  : `${rates.foilMin}-${rates.foilMax}`}
                                /KG
                              </p>
                            </div>
                            <p className="text-right text-[14px] font-extrabold text-royal-800">
                              ৳{formatBDT(result.packetMinCost)} -{" "}
                              <br className="sm:hidden" />৳
                              {formatBDT(result.packetMaxCost)}
                            </p>
                          </div>
                        )}

                      {/* Grand Total */}
                      <div className="rounded-xl bg-linear-to-r from-royal-800 to-royal-900 p-4 text-white shadow-lg">
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-gold-300">
                          💰 মোট আনুমানিক বাজেট
                        </p>
                        {isPacket ? (
                          <p className="mt-1 text-[20px] font-extrabold sm:text-[24px]">
                            ৳{formatBDT(result.grandMinTotal)} - ৳
                            {formatBDT(result.grandMaxTotal)}
                          </p>
                        ) : (
                          <p className="mt-1 text-[20px] font-extrabold sm:text-[24px]">
                            ৳{formatBDT(result.totalCylinderCost)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-2 rounded-xl bg-mist p-3 text-[12px]">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                    <p className="italic leading-relaxed text-muted">
                      এটি শুধুমাত্র আনুমানিক হিসাব। চূড়ান্ত মূল্য বাজারদর,
                      ম্যাটেরিয়াল, thickness, finishing ও অন্যান্য
                      specification অনুযায়ী কম-বেশি হতে পারে। সঠিক quotation-এর
                      জন্য আমাদের সাথে যোগাযোগ করুন।
                    </p>
                  </div>

                  {/* WhatsApp Send */}
                  <Button
                    href={
                      isPacket
                        ? waLinkPacket(buildWhatsAppMessage())
                        : waLink(buildWhatsAppMessage())
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    className="w-full justify-center"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    এই হিসাব WhatsApp-এ পাঠান
                  </Button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
