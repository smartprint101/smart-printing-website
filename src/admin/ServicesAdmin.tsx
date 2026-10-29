import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { SERVICES } from "@/data/services";
import type { AdminData, ServiceFact } from "@shared/types";
import { api, ApiError } from "./api";
import {
  Alert,
  Badge,
  Button,
  Card,
  Field,
  Modal,
  SectionHeading,
  TextArea,
  TextInput,
  Toggle,
} from "./ui";

interface Draft {
  title: string;
  shortSummary: string;
  approx: string;
  approxLabel: string;
  note: string;
  facts: ServiceFact[];
  isActive: boolean;
  sortOrder: number;
}

export function ServicesAdmin({
  data,
  reload,
}: {
  data: AdminData;
  reload: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function open(serviceId: string) {
    const base = SERVICES.find((service) => service.id === serviceId);
    if (!base) return;
    const override = data.catalog.services.find(
      (item) => item.serviceId === serviceId,
    );
    setDraft({
      title: override?.title ?? base.title,
      shortSummary: override?.shortSummary ?? base.shortSummary ?? "",
      approx: override?.approx ?? base.approx ?? "",
      approxLabel: override?.approxLabel ?? base.approxLabel ?? "আনুমানিক মূল্য",
      note: override?.note ?? base.note ?? "",
      facts:
        override?.facts ??
        base.facts?.map((fact) => ({ ...fact })) ?? [
          { label: "Minimum Order", value: "" },
        ],
      isActive: override?.isActive ?? true,
      sortOrder: override?.sortOrder ?? 0,
    });
    setEditingId(serviceId);
    setError("");
    setMessage("");
  }

  async function save() {
    if (!draft || !editingId) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api.saveService(editingId, {
        title: draft.title,
        shortSummary: draft.shortSummary,
        approx: draft.approx,
        approxLabel: draft.approxLabel,
        note: draft.note,
        facts: draft.facts.filter((fact) => fact.label.trim()),
        isActive: draft.isActive,
        sortOrder: draft.sortOrder,
      });
      setDraft(null);
      setEditingId(null);
      await reload();
      setMessage("সার্ভিসের তথ্য সেভ হয়েছে — সাইটে সাথে সাথে দেখা যাবে।");
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "সেভ করা যায়নি।");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <SectionHeading
        title="সার্ভিস পেজ"
        description="সার্ভিসের দাম, সংক্ষিপ্ত বিবরণ, অর্ডারের তথ্য ও নোট সম্পাদনা করুন। সার্ভিসের বিস্তারিত লেখা কোডে থাকে; এখানে বদলানো তথ্য সাইটে সাথে সাথে দেখাবে।"
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
        {SERVICES.map((service) => {
          const override = data.catalog.services.find(
            (item) => item.serviceId === service.id,
          );
          const approx = override?.approx ?? service.approx;
          return (
            <Card
              key={service.id}
              className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-royal-900">
                  {override?.title || service.title}
                </p>
                <p className="text-[11px] text-muted">
                  /services/{service.id}/ ·{" "}
                  {(override?.facts ?? service.facts)?.length ?? 0}টি তথ্য
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <Badge tone={override?.isActive === false ? "danger" : "success"}>
                    {override?.isActive === false ? "লুকানো" : "সক্রিয়"}
                  </Badge>
                  <Badge>{approx || "দাম নেই"}</Badge>
                  {override && <Badge tone="warning">এডিট করা</Badge>}
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => open(service.id)}>
                <Pencil className="h-3.5 w-3.5" /> সম্পাদনা
              </Button>
            </Card>
          );
        })}
      </div>

      <Modal
        open={Boolean(draft)}
        wide
        title="সার্ভিস সম্পাদনা"
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
            <Field label="টাইটেল" className="sm:col-span-2">
              <TextInput
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              />
            </Field>
            <Field label="আনুমানিক দাম" hint="যেমন: ৳৪২০–৪৬০ / কেজি">
              <TextInput
                value={draft.approx}
                onChange={(event) => setDraft({ ...draft, approx: event.target.value })}
              />
            </Field>
            <Field label="দামের লেবেল">
              <TextInput
                value={draft.approxLabel}
                onChange={(event) =>
                  setDraft({ ...draft, approxLabel: event.target.value })
                }
              />
            </Field>
            <Field label="সংক্ষিপ্ত বিবরণ" className="sm:col-span-2">
              <TextArea
                value={draft.shortSummary}
                onChange={(event) =>
                  setDraft({ ...draft, shortSummary: event.target.value })
                }
              />
            </Field>
            <Field label="নোট" className="sm:col-span-2">
              <TextArea
                value={draft.note}
                onChange={(event) => setDraft({ ...draft, note: event.target.value })}
              />
            </Field>

            <div className="sm:col-span-2">
              <p className="text-xs font-bold text-royal-900">অর্ডারের তথ্য</p>
              <div className="mt-2 space-y-2">
                {draft.facts.map((fact, index) => (
                  <div key={index} className="flex gap-2">
                    <TextInput
                      value={fact.label}
                      placeholder="লেবেল (Minimum Order)"
                      onChange={(event) => {
                        const facts = [...draft.facts];
                        facts[index] = { ...fact, label: event.target.value };
                        setDraft({ ...draft, facts });
                      }}
                      className="mt-0"
                    />
                    <TextInput
                      value={fact.value}
                      placeholder="মান (150 KG)"
                      onChange={(event) => {
                        const facts = [...draft.facts];
                        facts[index] = { ...fact, value: event.target.value };
                        setDraft({ ...draft, facts });
                      }}
                      className="mt-0"
                    />
                    <button
                      type="button"
                      aria-label="তথ্য সরান"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          facts: draft.facts.filter((_, i) => i !== index),
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
                    setDraft({
                      ...draft,
                      facts: [...draft.facts, { label: "", value: "" }],
                    })
                  }
                >
                  <Plus className="h-3.5 w-3.5" /> তথ্য যোগ করুন
                </Button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Toggle
                label="সাইটে দেখান"
                hint="বন্ধ করলে সার্ভিস কার্ড লুকিয়ে যাবে (পেজটি নিজে থাকবে)"
                checked={draft.isActive}
                onChange={(value) => setDraft({ ...draft, isActive: value })}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
