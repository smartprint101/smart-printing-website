import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";
import type {
  AdminData,
  LandingBlock,
  LandingBlockType,
  LandingPage,
} from "@shared/types";
import { api, ApiError } from "./api";
import { LandingPreview } from "./LandingPreview";
import { MediaInput } from "./MediaInput";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  SectionHeading,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "./ui";

const BLOCK_LABELS: Record<LandingBlockType, string> = {
  hero: "হিরো (উপরের বড় অংশ)",
  text: "লেখা / রিচ টেক্সট",
  products: "প্রোডাক্ট গ্রিড",
  features: "ফিচার / সুবিধা",
  image: "ছবি",
  cta: "CTA ব্যানার",
  faq: "প্রশ্ন-উত্তর",
  html: "HTML কোড",
};

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function newBlock(type: LandingBlockType): LandingBlock {
  const id = uid();
  switch (type) {
    case "hero":
      return {
        id,
        type,
        eyebrow: "SMART PRINTING PACKAGING",
        title: "আপনার ব্র্যান্ডের জন্য কাস্টম প্যাকেজিং",
        subtitle: "প্যাকেট, বক্স, লেবেল ও স্টিকার — ঢাকা থেকে সরাসরি।",
        imageUrl: "",
        ctaText: "WhatsApp-এ অর্ডার করুন",
        ctaUrl: "",
        theme: "light",
      };
    case "text":
      return { id, type, title: "বিস্তারিত", html: "<p>এখানে আপনার লেখা দিন…</p>" };
    case "products":
      return { id, type, title: "প্রোডাক্ট", subtitle: "", productIds: [] };
    case "features":
      return {
        id,
        type,
        title: "কেন আমাদের বেছে নেবেন",
        items: [
          { title: "কাস্টম ডিজাইন", text: "নিজের লোগো ও ডিজাইনে প্রিন্ট।" },
          { title: "দ্রুত ডেলিভারি", text: "সময়মতো পণ্য পৌঁছে দেওয়ার চেষ্টা।" },
        ],
      };
    case "image":
      return { id, type, imageUrl: "", alt: "", caption: "" };
    case "cta":
      return {
        id,
        type,
        title: "আজই অর্ডার করুন",
        text: "সাইজ ও পরিমাণ জানালে দ্রুত কোটেশন পাবেন।",
        buttonText: "WhatsApp করুন",
        buttonUrl: "",
      };
    case "faq":
      return {
        id,
        type,
        title: "সাধারণ প্রশ্ন",
        items: [{ q: "ন্যূনতম অর্ডার কত?", a: "প্রোডাক্ট অনুযায়ী ১ কেজি থেকে শুরু।" }],
      };
    case "html":
      return {
        id,
        type,
        html: '<div class="wrap"><h2>কাস্টম সেকশন</h2><p>এখানে HTML লিখুন।</p></div>',
        allowScripts: false,
      };
    default:
      return { id, type: "text", title: "", html: "" };
  }
}

function blankPage(): LandingPage {
  return {
    id: "",
    slug: "",
    title: "",
    seoTitle: "",
    seoDescription: "",
    ogImage: "",
    blocks: [newBlock("hero")],
    theme: { accent: "#142a5e", background: "#f6f4ee" },
    isPublished: false,
    indexable: true,
    showInNav: false,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function LandingAdmin({
  data,
  reload,
}: {
  data: AdminData;
  reload: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<LandingPage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tab, setTab] = useState<"content" | "preview">("content");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const products = data.catalog.products;

  function fail(cause: unknown) {
    setMessage("");
    setError(cause instanceof ApiError ? cause.message : "সমস্যা হয়েছে।");
  }

  function patchDraft(patch: Partial<LandingPage>) {
    setDraft((previous) => (previous ? { ...previous, ...patch } : previous));
  }

  function patchBlock(id: string, patch: Record<string, unknown>) {
    setDraft((previous) =>
      previous
        ? {
            ...previous,
            blocks: previous.blocks.map((block) =>
              block.id === id ? ({ ...block, ...patch } as LandingBlock) : block,
            ),
          }
        : previous,
    );
  }

  function moveBlock(id: string, direction: -1 | 1) {
    setDraft((previous) => {
      if (!previous) return previous;
      const index = previous.blocks.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= previous.blocks.length) {
        return previous;
      }
      const blocks = [...previous.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...previous, blocks };
    });
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload: LandingPage = {
        ...draft,
        slug:
          draft.slug ||
          slugify(draft.title) ||
          `landing-${Date.now().toString(36)}`,
        seoTitle: draft.seoTitle || draft.title,
      };
      if (isNew) {
        const created = await api.createLanding(payload);
        setDraft(created.landingPage);
        setIsNew(false);
      } else {
        await api.updateLanding(draft.id, payload);
      }
      await reload();
      setMessage(
        payload.isPublished
          ? "ল্যান্ডিং পেজ সেভ হয়েছে। লিংক শেয়ার করতে পারেন।"
          : "ড্রাফট সেভ হয়েছে। প্রকাশ করতে ‘প্রকাশিত’ সুইচ চালু করুন।",
      );
    } catch (cause) {
      fail(cause);
    } finally {
      setBusy(false);
    }
  }

  async function remove(page: LandingPage) {
    if (!window.confirm(`"${page.title}" ল্যান্ডিং পেজটি মুছে ফেলবেন?`)) return;
    setBusy(true);
    try {
      await api.deleteLanding(page.id);
      await reload();
      setMessage("ল্যান্ডিং পেজ মুছে ফেলা হয়েছে।");
    } catch (cause) {
      fail(cause);
    } finally {
      setBusy(false);
    }
  }

  if (draft) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="text-xs font-bold text-muted hover:text-royal-900"
            >
              ← ল্যান্ডিং পেজের তালিকায় ফিরুন
            </button>
            <h2 className="mt-1 text-lg font-extrabold text-royal-900">
              {isNew ? "নতুন ল্যান্ডিং পেজ" : draft.title || "ল্যান্ডিং পেজ"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isNew && draft.isPublished && (
              <a
                href={`/lp/${draft.slug}/`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-bold text-royal-900"
              >
                লাইভ দেখুন <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <Button onClick={() => void save()} disabled={busy}>
              {busy ? "সেভ হচ্ছে…" : "সেভ করুন"}
            </Button>
          </div>
        </div>

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

        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("content")}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold ${
              tab === "content"
                ? "bg-royal-900 text-white"
                : "border border-line bg-white text-muted"
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" /> কনটেন্ট
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold ${
              tab === "preview"
                ? "bg-royal-900 text-white"
                : "border border-line bg-white text-muted"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> প্রিভিউ
          </button>
        </div>

        {tab === "preview" ? (
          <LandingPreview
            title={draft.title}
            blocks={draft.blocks}
            theme={draft.theme}
            products={products}
          />
        ) : (
          <div className="space-y-4">
            <Card>
              <p className="text-sm font-extrabold text-royal-900">মূল সেটিংস</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="পেজের নাম *">
                  <TextInput
                    value={draft.title}
                    onChange={(event) =>
                      patchDraft({
                        title: event.target.value,
                        slug: draft.slug || slugify(event.target.value),
                      })
                    }
                    placeholder="যেমন: রেডিমেড প্যাকেট অফার"
                  />
                </Field>
                <Field
                  label="URL slug *"
                  hint={`লিংক হবে: /lp/${draft.slug || "your-slug"}/`}
                >
                  <TextInput
                    value={draft.slug}
                    onChange={(event) =>
                      patchDraft({ slug: slugify(event.target.value) })
                    }
                    placeholder="ready-made-offer"
                  />
                </Field>
                <Field label="SEO টাইটেল">
                  <TextInput
                    value={draft.seoTitle}
                    onChange={(event) => patchDraft({ seoTitle: event.target.value })}
                    placeholder="খালি রাখলে পেজের নাম ব্যবহার হবে"
                  />
                </Field>
                <Field label="SEO বর্ণনা">
                  <TextArea
                    value={draft.seoDescription}
                    onChange={(event) =>
                      patchDraft({ seoDescription: event.target.value })
                    }
                    className="min-h-16"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <MediaInput
                    label="শেয়ার ছবি (OG image)"
                    value={draft.ogImage}
                    onChange={(url) => patchDraft({ ogImage: url })}
                    folder="landing"
                  />
                </div>
                <Field label="অ্যাকসেন্ট রঙ">
                  <input
                    type="color"
                    value={draft.theme.accent}
                    onChange={(event) =>
                      patchDraft({
                        theme: { ...draft.theme, accent: event.target.value },
                      })
                    }
                    className="mt-1 h-11 w-full rounded-lg border border-line bg-white p-1"
                  />
                </Field>
                <Field label="ব্যাকগ্রাউন্ড রঙ">
                  <input
                    type="color"
                    value={draft.theme.background}
                    onChange={(event) =>
                      patchDraft({
                        theme: { ...draft.theme, background: event.target.value },
                      })
                    }
                    className="mt-1 h-11 w-full rounded-lg border border-line bg-white p-1"
                  />
                </Field>
                <Toggle
                  label="প্রকাশিত"
                  hint="বন্ধ থাকলে পেজটি ৪০৪ দেখাবে"
                  checked={draft.isPublished}
                  onChange={(value) => patchDraft({ isPublished: value })}
                />
                <Toggle
                  label="সার্চ ইঞ্জিনে ইনডেক্স হবে"
                  hint="বন্ধ করলে noindex দেওয়া হবে"
                  checked={draft.indexable}
                  onChange={(value) => patchDraft({ indexable: value })}
                />
              </div>
            </Card>

            <div className="space-y-3">
              {draft.blocks.map((block, index) => (
                <Card key={block.id}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-extrabold text-royal-900">
                      {index + 1}. {BLOCK_LABELS[block.type]}
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label="উপরে সরান"
                        onClick={() => moveBlock(block.id, -1)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-muted"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="নিচে সরান"
                        onClick={() => moveBlock(block.id, 1)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-muted"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="ব্লক মুছুন"
                        onClick={() =>
                          patchDraft({
                            blocks: draft.blocks.filter((item) => item.id !== block.id),
                          })
                        }
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {block.type === "hero" && (
                      <>
                        <Field label="ছোট উপরের লেখা">
                          <TextInput
                            value={block.eyebrow}
                            onChange={(event) =>
                              patchBlock(block.id, { eyebrow: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="থিম">
                          <Select
                            value={block.theme}
                            onChange={(event) =>
                              patchBlock(block.id, { theme: event.target.value })
                            }
                          >
                            <option value="light">হালকা</option>
                            <option value="dark">গাঢ়</option>
                          </Select>
                        </Field>
                        <Field label="শিরোনাম" className="sm:col-span-2">
                          <TextInput
                            value={block.title}
                            onChange={(event) =>
                              patchBlock(block.id, { title: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="বর্ণনা" className="sm:col-span-2">
                          <TextArea
                            value={block.subtitle}
                            onChange={(event) =>
                              patchBlock(block.id, { subtitle: event.target.value })
                            }
                            className="min-h-16"
                          />
                        </Field>
                        <Field label="বাটনের লেখা">
                          <TextInput
                            value={block.ctaText}
                            onChange={(event) =>
                              patchBlock(block.id, { ctaText: event.target.value })
                            }
                          />
                        </Field>
                        <Field
                          label="বাটনের লিংক"
                          hint="খালি রাখলে WhatsApp লিংক হবে"
                        >
                          <TextInput
                            value={block.ctaUrl}
                            onChange={(event) =>
                              patchBlock(block.id, { ctaUrl: event.target.value })
                            }
                          />
                        </Field>
                        <div className="sm:col-span-2">
                          <MediaInput
                            label="হিরো ছবি"
                            value={block.imageUrl}
                            onChange={(url) => patchBlock(block.id, { imageUrl: url })}
                            folder="landing"
                          />
                        </div>
                      </>
                    )}

                    {block.type === "text" && (
                      <>
                        <Field label="শিরোনাম" className="sm:col-span-2">
                          <TextInput
                            value={block.title}
                            onChange={(event) =>
                              patchBlock(block.id, { title: event.target.value })
                            }
                          />
                        </Field>
                        <Field
                          label="HTML / লেখা"
                          hint="p, h3, ul, img ট্যাগ ব্যবহার করতে পারেন"
                          className="sm:col-span-2"
                        >
                          <TextArea
                            value={block.html}
                            onChange={(event) =>
                              patchBlock(block.id, { html: event.target.value })
                            }
                            className="min-h-32 font-mono text-xs"
                          />
                        </Field>
                      </>
                    )}

                    {block.type === "products" && (
                      <>
                        <Field label="শিরোনাম">
                          <TextInput
                            value={block.title}
                            onChange={(event) =>
                              patchBlock(block.id, { title: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="উপ-শিরোনাম">
                          <TextInput
                            value={block.subtitle}
                            onChange={(event) =>
                              patchBlock(block.id, { subtitle: event.target.value })
                            }
                          />
                        </Field>
                        <div className="sm:col-span-2">
                          <p className="text-xs font-bold text-royal-900">
                            প্রোডাক্ট বাছাই করুন
                          </p>
                          <div className="mt-2 max-h-56 space-y-1 overflow-y-auto rounded-lg border border-line bg-white p-2">
                            {products.map((product) => (
                              <label
                                key={product.id}
                                className="flex items-center gap-2 rounded px-1 py-1 text-xs hover:bg-mist"
                              >
                                <input
                                  type="checkbox"
                                  className="h-3.5 w-3.5 accent-royal-800"
                                  checked={block.productIds.includes(product.id)}
                                  onChange={(event) => {
                                    const productIds = event.target.checked
                                      ? [...block.productIds, product.id]
                                      : block.productIds.filter(
                                          (id) => id !== product.id,
                                        );
                                    patchBlock(block.id, { productIds });
                                  }}
                                />
                                {product.nameBn}
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {block.type === "features" && (
                      <>
                        <Field label="শিরোনাম" className="sm:col-span-2">
                          <TextInput
                            value={block.title}
                            onChange={(event) =>
                              patchBlock(block.id, { title: event.target.value })
                            }
                          />
                        </Field>
                        <div className="space-y-2 sm:col-span-2">
                          {block.items.map((item, index) => (
                            <div key={index} className="flex gap-2">
                              <TextInput
                                value={item.title}
                                placeholder="শিরোনাম"
                                onChange={(event) => {
                                  const items = [...block.items];
                                  items[index] = { ...item, title: event.target.value };
                                  patchBlock(block.id, { items });
                                }}
                                className="mt-0"
                              />
                              <TextInput
                                value={item.text}
                                placeholder="বর্ণনা"
                                onChange={(event) => {
                                  const items = [...block.items];
                                  items[index] = { ...item, text: event.target.value };
                                  patchBlock(block.id, { items });
                                }}
                                className="mt-0"
                              />
                              <button
                                type="button"
                                aria-label="সরান"
                                onClick={() =>
                                  patchBlock(block.id, {
                                    items: block.items.filter((_, i) => i !== index),
                                  })
                                }
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-white text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              patchBlock(block.id, {
                                items: [...block.items, { title: "", text: "" }],
                              })
                            }
                          >
                            <Plus className="h-3.5 w-3.5" /> যোগ করুন
                          </Button>
                        </div>
                      </>
                    )}

                    {block.type === "image" && (
                      <>
                        <div className="sm:col-span-2">
                          <MediaInput
                            label="ছবি"
                            value={block.imageUrl}
                            onChange={(url) => patchBlock(block.id, { imageUrl: url })}
                            folder="landing"
                          />
                        </div>
                        <Field label="Alt টেক্সট" hint="অ্যাক্সেসিবিলিটি ও SEO-র জন্য">
                          <TextInput
                            value={block.alt}
                            onChange={(event) =>
                              patchBlock(block.id, { alt: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="ক্যাপশন">
                          <TextInput
                            value={block.caption}
                            onChange={(event) =>
                              patchBlock(block.id, { caption: event.target.value })
                            }
                          />
                        </Field>
                      </>
                    )}

                    {block.type === "cta" && (
                      <>
                        <Field label="শিরোনাম">
                          <TextInput
                            value={block.title}
                            onChange={(event) =>
                              patchBlock(block.id, { title: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="বাটনের লেখা">
                          <TextInput
                            value={block.buttonText}
                            onChange={(event) =>
                              patchBlock(block.id, { buttonText: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="বর্ণনা" className="sm:col-span-2">
                          <TextArea
                            value={block.text}
                            onChange={(event) =>
                              patchBlock(block.id, { text: event.target.value })
                            }
                            className="min-h-16"
                          />
                        </Field>
                        <Field
                          label="বাটনের লিংক"
                          hint="খালি রাখলে WhatsApp লিংক হবে"
                          className="sm:col-span-2"
                        >
                          <TextInput
                            value={block.buttonUrl}
                            onChange={(event) =>
                              patchBlock(block.id, { buttonUrl: event.target.value })
                            }
                          />
                        </Field>
                      </>
                    )}

                    {block.type === "faq" && (
                      <>
                        <Field label="শিরোনাম" className="sm:col-span-2">
                          <TextInput
                            value={block.title}
                            onChange={(event) =>
                              patchBlock(block.id, { title: event.target.value })
                            }
                          />
                        </Field>
                        <div className="space-y-2 sm:col-span-2">
                          {block.items.map((item, index) => (
                            <div key={index} className="flex gap-2">
                              <TextInput
                                value={item.q}
                                placeholder="প্রশ্ন"
                                onChange={(event) => {
                                  const items = [...block.items];
                                  items[index] = { ...item, q: event.target.value };
                                  patchBlock(block.id, { items });
                                }}
                                className="mt-0"
                              />
                              <TextInput
                                value={item.a}
                                placeholder="উত্তর"
                                onChange={(event) => {
                                  const items = [...block.items];
                                  items[index] = { ...item, a: event.target.value };
                                  patchBlock(block.id, { items });
                                }}
                                className="mt-0"
                              />
                              <button
                                type="button"
                                aria-label="সরান"
                                onClick={() =>
                                  patchBlock(block.id, {
                                    items: block.items.filter((_, i) => i !== index),
                                  })
                                }
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-white text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              patchBlock(block.id, {
                                items: [...block.items, { q: "", a: "" }],
                              })
                            }
                          >
                            <Plus className="h-3.5 w-3.5" /> প্রশ্ন যোগ করুন
                          </Button>
                        </div>
                      </>
                    )}

                    {block.type === "html" && (
                      <>
                        <Field
                          label="HTML কোড"
                          hint="পুরো ডিজাইন HTML/CSS দিয়ে করতে চাইলে এই ব্লকটি ব্যবহার করুন"
                          className="sm:col-span-2"
                        >
                          <TextArea
                            value={block.html}
                            onChange={(event) =>
                              patchBlock(block.id, { html: event.target.value })
                            }
                            className="min-h-56 font-mono text-xs"
                            spellCheck={false}
                          />
                        </Field>
                        <div className="sm:col-span-2">
                          <Toggle
                            label="script ট্যাগ চালু রাখুন"
                            hint="বিশ্বস্ত কোড হলেই কেবল চালু করুন"
                            checked={block.allowScripts}
                            onChange={(value) =>
                              patchBlock(block.id, { allowScripts: value })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Card>
              <p className="text-xs font-bold text-royal-900">নতুন ব্লক যোগ করুন</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(BLOCK_LABELS) as LandingBlockType[]).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      patchDraft({ blocks: [...draft.blocks, newBlock(type)] })
                    }
                  >
                    <Plus className="h-3.5 w-3.5" /> {BLOCK_LABELS[type]}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <SectionHeading
        title="ল্যান্ডিং পেজ"
        description="নির্দিষ্ট প্রোডাক্ট দিয়ে আলাদা ল্যান্ডিং পেজ সাজান, HTML কোড দিয়ে কাস্টম ডিজাইন করুন এবং লিংক শেয়ার করুন।"
        action={
          <Button
            onClick={() => {
              setDraft(blankPage());
              setIsNew(true);
              setTab("content");
              setMessage("");
              setError("");
            }}
          >
            <Plus className="h-4 w-4" /> নতুন ল্যান্ডিং পেজ
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

      {data.landingPages.length === 0 ? (
        <EmptyState
          title="এখনো কোনো ল্যান্ডিং পেজ নেই"
          description="বিশেষ অফার বা নির্দিষ্ট প্রোডাক্টের জন্য একটি পেজ তৈরি করুন।"
        />
      ) : (
        <div className="space-y-2">
          {data.landingPages.map((page) => (
            <Card key={page.id} className="flex flex-wrap items-center gap-3 p-3 sm:p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-royal-900">
                  {page.title}
                </p>
                <p className="truncate text-[11px] text-muted">
                  /lp/{page.slug}/ · {page.blocks.length}টি ব্লক
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge tone={page.isPublished ? "success" : "warning"}>
                    {page.isPublished ? "প্রকাশিত" : "ড্রাফট"}
                  </Badge>
                  {!page.indexable && <Badge tone="danger">noindex</Badge>}
                </div>
              </div>
              <div className="flex gap-1.5">
                {page.isPublished && (
                  <a
                    href={`/lp/${page.slug}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-bold text-royal-900"
                  >
                    দেখুন <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDraft(page);
                    setIsNew(false);
                    setTab("content");
                  }}
                >
                  সম্পাদনা
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => void remove(page)}
                  disabled={busy}
                  aria-label={`${page.title} মুছে ফেলুন`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
