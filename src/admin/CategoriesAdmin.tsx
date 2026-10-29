import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { AdminData, Category } from "@shared/types";
import { api, ApiError } from "./api";
import {
  Alert,
  Badge,
  Button,
  Card,
  Field,
  Modal,
  SectionHeading,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "./ui";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

interface Draft {
  slug: string;
  titleBn: string;
  titleEn: string;
  description: string;
  group: "readymade" | "extra";
  sortOrder: number;
  isActive: boolean;
}

const empty: Draft = {
  slug: "",
  titleBn: "",
  titleEn: "",
  description: "",
  group: "extra",
  sortOrder: 100,
  isActive: true,
};

export function CategoriesAdmin({
  data,
  reload,
}: {
  data: AdminData;
  reload: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const categories = [...data.catalog.categories].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  function fail(cause: unknown) {
    setMessage("");
    setError(cause instanceof ApiError ? cause.message : "সমস্যা হয়েছে।");
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        slug: draft.slug || slugify(draft.titleEn) || `category-${Date.now().toString(36)}`,
        titleBn: draft.titleBn,
        titleEn: draft.titleEn,
        description: draft.description,
        group: draft.group,
        sortOrder: draft.sortOrder,
        isActive: draft.isActive,
      };
      if (editingId) await api.updateCategory(editingId, payload);
      else await api.createCategory(payload);
      setDraft(null);
      setEditingId(null);
      await reload();
      setMessage("ক্যাটাগরি সেভ হয়েছে।");
    } catch (cause) {
      fail(cause);
    } finally {
      setBusy(false);
    }
  }

  async function remove(category: Category) {
    if (
      !window.confirm(
        `"${category.titleBn}" ক্যাটাগরি মুছে ফেলবেন? এর প্রোডাক্টগুলো থাকবে, কিন্তু ক্যাটাগরি ছাড়া হয়ে যাবে।`,
      )
    )
      return;
    setBusy(true);
    try {
      await api.deleteCategory(category.id);
      await reload();
      setMessage("ক্যাটাগরি মুছে ফেলা হয়েছে।");
    } catch (cause) {
      fail(cause);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <SectionHeading
        title="ক্যাটাগরি"
        description="‘মূল গ্রিড’-এর ক্যাটাগরি রেডিমেড প্রোডাক্টের ভেতরে ট্যাব হিসেবে দেখাবে। ‘নিচের সেকশন’ রেডিমেড প্রোডাক্টের নিচে আলাদা সেকশন হিসেবে দেখাবে।"
        action={
          <Button
            onClick={() => {
              setDraft(empty);
              setEditingId(null);
            }}
          >
            <Plus className="h-4 w-4" /> নতুন ক্যাটাগরি
          </Button>
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

      <div className="space-y-2">
        {categories.map((category) => (
          <Card key={category.id} className="flex items-center gap-3 p-3 sm:p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-royal-900">
                {category.titleBn}
                {category.titleEn && (
                  <span className="ml-2 text-[11px] font-normal text-muted">
                    {category.titleEn}
                  </span>
                )}
              </p>
              <p className="truncate text-[11px] text-muted">
                /{category.slug} ·{" "}
                {category.group === "readymade" ? "মূল গ্রিড" : "নিচের সেকশন"} ·
                সিরিয়াল {category.sortOrder}
              </p>
              <div className="mt-1 flex gap-1">
                {!category.isActive && <Badge tone="danger">লুকানো</Badge>}
                <Badge>
                  {
                    data.catalog.products.filter(
                      (product) => product.categoryId === category.id,
                    ).length
                  }{" "}
                  প্রোডাক্ট
                </Badge>
              </div>
            </div>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDraft({
                    slug: category.slug,
                    titleBn: category.titleBn,
                    titleEn: category.titleEn ?? "",
                    description: category.description ?? "",
                    group: category.group,
                    sortOrder: category.sortOrder,
                    isActive: category.isActive,
                  });
                  setEditingId(category.id);
                }}
              >
                <Pencil className="h-3.5 w-3.5" /> সম্পাদনা
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => void remove(category)}
                disabled={busy}
                aria-label={`${category.titleBn} মুছে ফেলুন`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={Boolean(draft)}
        title={editingId ? "ক্যাটাগরি সম্পাদনা" : "নতুন ক্যাটাগরি"}
        onClose={() => {
          setDraft(null);
          setEditingId(null);
        }}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setDraft(null);
                setEditingId(null);
              }}
            >
              বাতিল
            </Button>
            <Button onClick={() => void save()} disabled={busy}>
              {busy ? "সেভ হচ্ছে…" : "সেভ করুন"}
            </Button>
          </>
        }
      >
        {draft && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="নাম (বাংলা) *">
              <TextInput
                value={draft.titleBn}
                onChange={(event) =>
                  setDraft({ ...draft, titleBn: event.target.value })
                }
                placeholder="যেমন: রেডিমেড ছাপালেভেল"
              />
            </Field>
            <Field label="নাম (ইংরেজি)">
              <TextInput
                value={draft.titleEn}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    titleEn: event.target.value,
                    slug: draft.slug || slugify(event.target.value),
                  })
                }
              />
            </Field>
            <Field label="URL slug">
              <TextInput
                value={draft.slug}
                onChange={(event) =>
                  setDraft({ ...draft, slug: slugify(event.target.value) })
                }
              />
            </Field>
            <Field label="কোথায় দেখাবে">
              <Select
                value={draft.group}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    group: event.target.value as "readymade" | "extra",
                  })
                }
              >
                <option value="readymade">মূল গ্রিডে (ট্যাব হিসেবে)</option>
                <option value="extra">রেডিমেড প্রোডাক্টের নিচে আলাদা সেকশন</option>
              </Select>
            </Field>
            <Field label="সিরিয়াল" hint="ছোট সংখ্যা আগে দেখাবে">
              <TextInput
                type="number"
                value={draft.sortOrder}
                onChange={(event) =>
                  setDraft({ ...draft, sortOrder: Number(event.target.value) })
                }
              />
            </Field>
            <div className="flex items-end">
              <Toggle
                label="সাইটে দেখান"
                checked={draft.isActive}
                onChange={(value) => setDraft({ ...draft, isActive: value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Field label="বিবরণ (ঐচ্ছিক)">
                <TextArea
                  value={draft.description}
                  onChange={(event) =>
                    setDraft({ ...draft, description: event.target.value })
                  }
                />
              </Field>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
