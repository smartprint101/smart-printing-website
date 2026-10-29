import { useCallback, useEffect, useState } from "react";
import {
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LayoutTemplate,
  Layers,
  LogOut,
  Package,
  Settings as SettingsIcon,
} from "lucide-react";
import type { AdminData, AdminSession } from "@shared/types";
import { api } from "./api";
import { Login } from "./Login";
import { CategoriesAdmin } from "./CategoriesAdmin";
import { LandingAdmin } from "./LandingAdmin";
import { Overview } from "./Overview";
import { ProductsAdmin } from "./ProductsAdmin";
import { ServicesAdmin } from "./ServicesAdmin";
import { SettingsAdmin } from "./SettingsAdmin";
import { Alert, Spinner } from "./ui";
import { cn } from "@/utils/cn";

type Tab = "overview" | "products" | "categories" | "services" | "landing" | "settings";

const TABS: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "overview", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { id: "products", label: "প্রোডাক্ট ও দাম", icon: Package },
  { id: "categories", label: "ক্যাটাগরি", icon: FolderTree },
  { id: "services", label: "সার্ভিস", icon: Layers },
  { id: "landing", label: "ল্যান্ডিং পেজ", icon: LayoutTemplate },
  { id: "settings", label: "সেটিংস", icon: SettingsIcon },
];

export default function AdminApp() {
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const next = await api.data();
      setData(next);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "ডেটা লোড করা যায়নি।",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api
      .session()
      .then((result) => {
        if (!active) return;
        setSession(result.session);
        if (result.session) void refresh();
      })
      .catch(() => active && setSession(null));
    return () => {
      active = false;
    };
  }, [refresh]);

  if (session === undefined) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return (
      <Login
        onSuccess={() => {
          api.session().then((result) => {
            setSession(result.session);
            void refresh();
          });
        }}
      />
    );
  }

  async function logout() {
    await api.logout().catch(() => undefined);
    setSession(null);
    setData(null);
  }

  return (
    <div className="min-h-screen bg-mist lg:flex">
      <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:bg-royal-950 lg:text-white">
        <div className="flex items-center justify-between gap-3 bg-royal-950 px-4 py-3 text-white lg:block lg:py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-300">
              Smart Printing
            </p>
            <p className="text-sm font-extrabold">অ্যাডমিন প্যানেল</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-2.5 py-1.5 text-[11px] font-bold lg:mt-3"
          >
            সাইট দেখুন <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <nav
          aria-label="অ্যাডমিন সেকশন"
          className="flex gap-1 overflow-x-auto border-b border-line bg-white px-2 py-2 lg:flex-col lg:border-0 lg:bg-transparent lg:px-2 lg:py-3"
        >
          {TABS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors",
                  tab === item.id
                    ? "bg-royal-900 text-white lg:bg-white lg:text-royal-900"
                    : "text-muted hover:bg-mist lg:text-royal-100 lg:hover:bg-white/10",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="hidden px-4 py-4 lg:block">
          <p className="text-[11px] text-royal-200">{session.email}</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> লগআউট
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <p className="truncate text-[11px] text-muted">{session.email}</p>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-royal-900"
            >
              <LogOut className="h-3.5 w-3.5" /> লগআউট
            </button>
          </div>

          {error && (
            <div className="mb-4">
              <Alert kind="error">{error}</Alert>
            </div>
          )}
          {loading && !data && (
            <div className="py-16">
              <Spinner label="ডেটা লোড হচ্ছে…" />
            </div>
          )}
          {data && (
            <>
              {tab === "overview" && (
                <Overview data={data} onNavigate={(next) => setTab(next)} />
              )}
              {tab === "products" && (
                <ProductsAdmin data={data} reload={refresh} />
              )}
              {tab === "categories" && (
                <CategoriesAdmin data={data} reload={refresh} />
              )}
              {tab === "services" && (
                <ServicesAdmin data={data} reload={refresh} />
              )}
              {tab === "landing" && (
                <LandingAdmin data={data} reload={refresh} />
              )}
              {tab === "settings" && (
                <SettingsAdmin
                  data={data}
                  reload={refresh}
                  onLoggedOut={() => {
                    setSession(null);
                    setData(null);
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
