import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Save,
  Trash2,
  Wand2,
} from "lucide-react";
import type { AdminData, Product, PriceUnit } from "@shared/types";
import { api, ApiError, type ProductDraft } from "./api";
import { MediaInput } from "./MediaInput";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Modal,
  SectionHeading,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "./ui";

const UNITS: { value: PriceUnit; label: string }[] = [
  { value: "kg", label: "কেজি" },
  { value: "piece", label: "পিস" },
  { value: "packet", label: "প্যাকেট" },
  { value: "sqft", label: "স্কয়ার ফিট" },
  { value: "unit", label: "ইউনিট" },
];

const SERVICE_OPTIONS = [
  { value: "", label: "কোনো সার্ভিস পেজে দেখাবেন না" },
  { value: "ready-made", label: "রেডিমেড প্যাকেট (ready-made)" },
  { value: "ld-packet", label: "LD প্যাকেট" },
  { value: "foil-packet", label: "ফয়েল প্যাকেট" },
  { value: "custom-box", label: "কাস্টম বক্স" },
  { value: "sticker", label: "স্টিকার" },
  { value: "security-poly", label: "সিকিউরিটি পলি" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

interface Draft extends ProductDraft {
  gallery: string[];
}

function emptyDraft(categoryId: number | null): Draft {
  return {
    nameBn: "",
    slug: "",
    nameEn: "",
    categoryId,
    price: null,
    priceMax: null,
    priceUnit: "kg",
    priceNote: "",
    minOrder: "1 KG",
    sizeLabel: "All Size Available",
    imageUrl: "",
    gallery: [],
    description: "",
    badge: "READY-MADE",
    waMessage: "",
    serviceId: "ready-made",
    isActive: true,
    isFeatured: false,
    sortOrder: 100,
  };
}

function toDraft(product: Product): Draft {
  return {
    ...product,
    nameEn: product.nameEn ?? "",
    priceNote: product.priceNote ?? "",
    minOrder: product.minOrder ?? "",
    sizeLabel: product.sizeLabel ?? "",
    imageUrl: product.imageUrl ?? "",
    description: product.description ?? "",
    badge: product.badge ?? "",
    waMessage: product.waMessage ?? "",
    serviceId: product.serviceId ?? "",
    gallery: product.gallery ?? [],
  };
}

export function ProductsAdmin({
  data,
  reload,
}: {
  data: AdminData;
  reload: () => Promise<void>;
}) {
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulk, setBulk] = useState<{
    scope: string;
    mode: "percent" | "amount";
    value: string;
  }>({ scope: "all", mode: "amount", value: "10" });

  const categories = data.catalog.categories;
  const products = useMemo(
    () =>
      data.catalog.products
        .filter(
          (product) =>
            categoryFilter === "all" || product.categoryId === categoryFilter,
        )
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [data.catalog.products, categoryFilter],
  );

  function reportError(cause: unknown) {
    setMessage("");
    setError(
      cause instanceof ApiError ? cause.message : "কিছু একটা ভুল হয়েছে।",
    );
  }

  async function adjustPrice(product: Product, delta: number) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const price = Math.max(1, Math.round(Number(product.price ?? 0) + delta));
      const priceMax =
        product.priceMax === null || product.priceMax === undefined
          ? undefined
          : Math.max(price, Math.round(Number(product.priceMax) + delta));
      await api.updateProduct(product.id, {
        ...product,
        price,
        priceMax: priceMax ?? null,
      });
      await reload();
      setMessage(`${product.nameBn}: নতুন দাম ৳${price}`);
    } catch (cause) {
      reportError(cause);
    } finally {
      setBusy(false);
    }
  }

  async function saveDraft() {
    if (!editing) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload: ProductDraft = {
        ...editing,
        slug:
          editing.slug ||
          slugify(editing.nameEn || "") ||
          `product-${Date.now().toString(36)}`,
      };
      if (editingId) await api.updateProduct(editingId, payload);
      else await api.createProduct(payload);
      setEditing(null);
      setEditingId(null);
      await reload();
      setMessage("প্রোডাক্ট সেভ হয়েছে।");
    } catch (cause) {
      reportError(cause);
    } finally {
      setBusy(false);
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`"${product.nameBn}" প্রোডাক্টটি মুছে ফেলবেন?`)) return;
    setBusy(true);
    try {
      await api.deleteProduct(product.id);
      await reload();
      setMessage("প্রোডাক্ট মুছে ফেলা হয়েছে।");
    } catch (cause) {
      reportError(cause);
    } finally {
      setBusy(false);
    }
  }

  async function applyBulk() {
    const value = Number(bulk.value);
    if (!Number.isFinite(value) || value === 0) {
      setError("পরিবর্তনের পরিমাণ লিখুন (যেমন 10 বা -10)।");
      return;
    }
    const scopeLabel =
      bulk.scope === "all"
        ? "সব প্রোডাক্ট"
        : (categories.find((c) => String(c.id) === bulk.scope)?.titleBn ?? "");
    if (
      !window.confirm(
        `${scopeLabel}-এর দাম ${value > 0 ? "+" : ""}${value}${bulk.mode === "percent" ? "%" : " টাকা"} বদলাবেন?`,
      )
    ) {
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await api.bulkPrice({
        mode: bulk.mode,
        value,
        ...(bulk.scope === "all" ? { scope: "all" as const } : { categoryId: Number(bulk.scope) }),
      });
      await reload();
      setMessage(`${result.changed}টি প্রোডাক্টের দাম আপডেট হয়েছে।`);
    } catch (cause) {
      reportError(cause);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <SectionHeading
        title="প্রোডাক্ট ও দাম"
        description="নতুন প্রোডাক্ট যোগ করুন, ছবি আপলোড করুন এবং যেকোনো সময় দাম বাড়ান বা কমান।"
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setBulkOpen(!bulkOpen)}>
              <Wand2 className="h-4 w-4" /> একসাথে দাম বদলান
            </Button>
            <Button
              onClick={() => {
                setEditing(
                  emptyDraft(
                    typeof categoryFilter === "number" ? categoryFilter : (categories[0]?.id ?? null),
                  ),
                );
                setEditingId(null);
              }}
            >
              <Plus className="h-4 w-4" /> নতুন প্রোডাক্ট
            </Button>
          </div>
        }
      />

      {message && (
        <div className="mb-3">
          <Alert kind="success">{message}</Alert>
        </div>
      )}
      {error && (
        <div className="mb-3">
          <Alert kind="error">{error}</Alert>
        </div>
      )}

      {bulkOpen && (
        <Card className="mb-4">
          <p className="text-sm font-extrabold text-royal-900">
            একসাথে দাম বদলান (বাল্ক)
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <Field label="কোথায়">
              <Select
                value={bulk.scope}
                onChange={(event) =>
                  setBulk({ ...bulk, scope: event.target.value })
                }
              >
                <option value="all">সব প্রোডাক্ট</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.titleBn}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="ধরন">
              <Select
                value={bulk.mode}
                onChange={(event) =>
                  setBulk({ ...bulk, mode: event.target.value as "percent" | "amount" })
                }
              >
                <option value="amount">টাকা (৳)</option>
                <option value="percent">শতাংশ (%)</option>
              </Select>
            </Field>
            <Field label="পরিবর্তন" hint="কমানোর জন্য ঋণাত্মক সংখ্যা (যেমন -10)">
              <TextInput
                type="number"
                value={bulk.value}
                onChange={(event) => setBulk({ ...bulk, value: event.target.value })}
              />
            </Field>
            <div className="flex items-end">
              <Button onClick={() => void applyBulk()} disabled={busy} className="w-full">
                প্রয়োগ করুন
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter("all")}
          className={`min-h-9 rounded-full border px-3 text-xs font-bold ${
            categoryFilter === "all"
              ? "border-royal-900 bg-royal-900 text-white"
              : "border-line bg-white text-muted"
          }`}
        >
          সব ({data.catalog.products.length})
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setCategoryFilter(category.id)}
            className={`min-h-9 rounded-full border px-3 text-xs font-bold ${
              categoryFilter === category.id
                ? "border-royal-900 bg-royal-900 text-white"
                : "border-line bg-white text-muted"
            }`}
          >
            {category.titleBn}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="এই ক্যাটাগরিতে এখনো কোনো প্রোডাক্ট নেই"
          description="উপরের ‘নতুন প্রোডাক্ট’ বাটন দিয়ে প্রথম প্রোডাক্ট যোগ করুন।"
        />
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <Card key={product.id} className="p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-mist">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt=""
                        width={56}
                        height={56}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[9px] text-muted">ছবি নেই</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-royal-900">
                      {product.nameBn}
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      {product.categorySlug || "ক্যাটাগরি নেই"} · /{product.slug}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {!product.isActive && <Badge tone="danger">লুকানো</Badge>}
                      {product.isFeatured && <Badge tone="warning">ফিচার্ড</Badge>}
                      {product.price === null && <Badge>দাম নেই</Badge>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void adjustPrice(product, -10)}
                    aria-label={`${product.nameBn}-এর দাম ১০ টাকা কমান`}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-red-600 disabled:opacity-50"
                  >
                    <ArrowDownRight className="h-4 w-4" />
                  </button>
                  <div className="min-w-[92px] rounded-lg bg-mist px-2 py-1.5 text-center">
                    <p className="text-[9px] text-muted">দাম</p>
                    <p className="text-sm font-extrabold text-royal-900">
                      {product.price === null
                        ? "—"
                        : `৳${new Intl.NumberFormat("en-IN").format(Number(product.price))}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void adjustPrice(product, 10)}
                    aria-label={`${product.nameBn}-এর দাম ১০ টাকা বাড়ান`}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-emerald-600 disabled:opacity-50"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(toDraft(product));
                      setEditingId(product.id);
                      setError("");
                      setMessage("");
                    }}
                  >
                    <Save className="h-3.5 w-3.5" /> সম্পাদনা
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => void remove(product)}
                    aria-label={`${product.nameBn} মুছে ফেলুন`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        wide
        title={editingId ? "প্রোডাক্ট সম্পাদনা" : "নতুন প্রোডাক্ট"}
        onClose={() => {
          setEditing(null);
          setEditingId(null);
        }}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null);
                setEditingId(null);
              }}
            >
              বাতিল
            </Button>
            <Button onClick={() => void saveDraft()} disabled={busy}>
              {busy ? "সেভ হচ্ছে…" : "সেভ করুন"}
            </Button>
          </>
        }
      >
        {editing && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="প্রোডাক্টের নাম (বাংলা) *">
              <TextInput
                value={editing.nameBn}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    nameBn: event.target.value,
                    slug: editing.slug || slugify(editing.nameEn || ""),
                  })
                }
                placeholder="যেমন: ফয়েল প্যাকেট"
              />
            </Field>
            <Field label="ইংরেজি নাম">
              <TextInput
                value={editing.nameEn ?? ""}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    nameEn: event.target.value,
                    slug: editing.slug || slugify(event.target.value),
                  })
                }
                placeholder="Foil packet pouch"
              />
            </Field>
            <Field label="URL slug" hint="ছোট হাতের ইংরেজি, সংখ্যা ও হাইফেন">
              <TextInput
                value={editing.slug}
                onChange={(event) =>
                  setEditing({ ...editing, slug: slugify(event.target.value) })
                }
                placeholder="foil-packet"
              />
            </Field>
            <Field label="ক্যাটাগরি">
              <Select
                value={editing.categoryId ?? ""}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    categoryId: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
              >
                <option value="">ক্যাটাগরি নেই</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.titleBn}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="দাম (৳)">
              <TextInput
                type="number"
                min={0}
                step="1"
                value={editing.price ?? ""}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    price: event.target.value === "" ? null : Number(event.target.value),
                  })
                }
              />
            </Field>
            <Field label="সর্বোচ্চ দাম (ঐচ্ছিক)">
              <TextInput
                type="number"
                min={0}
                step="1"
                value={editing.priceMax ?? ""}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    priceMax: event.target.value === "" ? null : Number(event.target.value),
                  })
                }
              />
            </Field>
            <Field label="দামের একক">
              <Select
                value={editing.priceUnit}
                onChange={(event) =>
                  setEditing({ ...editing, priceUnit: event.target.value as PriceUnit })
                }
              >
                {UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="দামের নোট" hint="যেমন: স্টক অনুযায়ী পরিবর্তনযোগ্য">
              <TextInput
                value={editing.priceNote ?? ""}
                onChange={(event) =>
                  setEditing({ ...editing, priceNote: event.target.value })
                }
              />
            </Field>
            <Field label="ন্যূনতম অর্ডার">
              <TextInput
                value={editing.minOrder ?? ""}
                onChange={(event) =>
                  setEditing({ ...editing, minOrder: event.target.value })
                }
              />
            </Field>
            <Field label="সাইজ">
              <TextInput
                value={editing.sizeLabel ?? ""}
                onChange={(event) =>
                  setEditing({ ...editing, sizeLabel: event.target.value })
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <MediaInput
                label="প্রোডাক্টের ছবি"
                value={editing.imageUrl ?? ""}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
              />
            </div>
            <div className="sm:col-span-2">
              <Field label="বিবরণ (ঐচ্ছিক)">
                <TextArea
                  value={editing.description ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, description: event.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="ব্যাজ" hint="ছবির কোণে দেখানো ছোট লেখা">
              <TextInput
                value={editing.badge ?? ""}
                onChange={(event) =>
                  setEditing({ ...editing, badge: event.target.value })
                }
              />
            </Field>
            <Field label="সিরিয়াল (ছোট সংখ্যা আগে)">
              <TextInput
                type="number"
                value={editing.sortOrder ?? 0}
                onChange={(event) =>
                  setEditing({ ...editing, sortOrder: Number(event.target.value) })
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <Field
                label="WhatsApp মেসেজ"
                hint="অর্ডার বাটনে ক্লিক করলে এই মেসেজ প্রি-ফিল হবে"
              >
                <TextArea
                  value={editing.waMessage ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, waMessage: event.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="কোন সার্ভিস পেজে দেখাবে">
              <Select
                value={editing.serviceId ?? ""}
                onChange={(event) =>
                  setEditing({ ...editing, serviceId: event.target.value })
                }
              >
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
              <Toggle
                label="সাইটে দেখান"
                hint="বন্ধ রাখলে প্রোডাক্টটি সাইটে দেখা যাবে না"
                checked={Boolean(editing.isActive)}
                onChange={(value) => setEditing({ ...editing, isActive: value })}
              />
              <Toggle
                label="ফিচার্ড (বড় ছবি, আগে লোড)"
                checked={Boolean(editing.isFeatured)}
                onChange={(value) => setEditing({ ...editing, isFeatured: value })}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
