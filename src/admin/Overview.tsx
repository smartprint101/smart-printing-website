import { useState } from "react";
import { ArrowRight, Package, Rocket, Sparkles } from "lucide-react";
import type { AdminData } from "@shared/types";
import { api, ApiError } from "./api";
import { Alert, Badge, Button, Card } from "./ui";

type Tab = "overview" | "products" | "categories" | "services" | "landing" | "settings";

export function Overview({
  data,
  onNavigate,
}: {
  data: AdminData;
  onNavigate: (tab: Tab) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const stats = [
    { label: "প্রোডাক্ট", value: data.stats.products, tab: "products" as Tab },
    { label: "ক্যাটাগরি", value: data.stats.categories, tab: "categories" as Tab },
    { label: "ল্যান্ডিং পেজ", value: data.stats.landingPages, tab: "landing" as Tab },
  ];

  async function publish() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await api.publish();
      setMessage(result.message || "ডিপ্লয় শুরু হয়েছে।");
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "ডিপ্লয় শুরু করা যায়নি।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gold-600">
          SMART PRINTING PACKAGING
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-royal-900 sm:text-2xl">
          স্বাগতম! এখান থেকেই সাইটের সব কিছু বদলাতে পারবেন।
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          দাম বদল, নতুন প্রোডাক্ট, ছবি আপলোড (Cloudflare R2) আর ল্যান্ডিং পেজ
          — সব এক জায়গা থেকে।
        </p>
      </div>

      {message && <Alert kind="success">{message}</Alert>}
      {error && <Alert kind="error">{error}</Alert>}

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => onNavigate(stat.tab)}
            className="rounded-2xl border border-line bg-white p-4 text-left shadow-card transition-colors hover:border-royal-300"
          >
            <p className="text-[11px] font-bold text-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-royal-900">
              {stat.value}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-royal-800" />
            <p className="text-sm font-extrabold text-royal-900">
              দ্রুত কাজ শুরু করুন
            </p>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { label: "প্রোডাক্ট যোগ করুন বা দাম বদলান", tab: "products" as Tab },
              { label: "নতুন ক্যাটাগরি (যেমন রেডিমেড লেবেল)", tab: "categories" as Tab },
              { label: "সার্ভিসের দাম ও তথ্য এডিট করুন", tab: "services" as Tab },
              { label: "ল্যান্ডিং পেজ সাজান", tab: "landing" as Tab },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.tab)}
                className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg bg-mist px-3 py-2 text-left text-xs font-bold text-royal-900 hover:bg-royal-50"
              >
                {item.label}
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-600" />
            <p className="text-sm font-extrabold text-royal-900">কীভাবে কাজ করে</p>
          </div>
          <ul className="mt-2 space-y-2 text-[11px] leading-5 text-muted">
            <li>
              • দাম বা প্রোডাক্ট বদলালে সাথে সাথে সাইটে (রিফ্রেশ করলে) দেখা
              যাবে — রিবিল্ড লাগবে না।
            </li>
            <li>
              • ছবি Cloudflare R2-তে যায়, তাই সাইটের স্পিড কমে না।
            </li>
            <li>
              • ল্যান্ডিং পেজ{" "}
              <code className="rounded bg-mist px-1">/lp/নাম/</code> লিংকে
              সাথে সাথে লাইভ হয়।
            </li>
            <li>
              • sitemap ও স্ট্যাটিক পেজ আপডেট করতে নিচের ‘রিবিল্ড’ বাটন চাপুন।
            </li>
          </ul>
          <div className="mt-3">
            <Button variant="outline" onClick={() => void publish()} disabled={busy}>
              <Rocket className="h-4 w-4" /> রিবিল্ড শুরু করুন
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-sm font-extrabold text-royal-900">সাইটের অবস্থা</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <Badge tone="success">ডেটাবেজ সংযুক্ত</Badge>
          <span>
            সর্বশেষ আপডেট:{" "}
            {data.stats.lastUpdated
              ? new Date(data.stats.lastUpdated).toLocaleString("bn-BD")
              : "—"}
          </span>
          <span>· সংস্করণ: {data.catalog.version}</span>
        </div>
      </Card>
    </div>
  );
}
