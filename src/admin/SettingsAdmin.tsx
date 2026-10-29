import { useState } from "react";
import { KeyRound, Rocket, Save } from "lucide-react";
import type { AdminData, SiteSettings } from "@shared/types";
import { api, ApiError } from "./api";
import {
  Alert,
  Button,
  Card,
  Field,
  SectionHeading,
  TextInput,
} from "./ui";

export function SettingsAdmin({
  data,
  reload,
  onLoggedOut,
}: {
  data: AdminData;
  reload: () => Promise<void>;
  onLoggedOut: () => void;
}) {
  const [settings, setSettings] = useState<SiteSettings>(data.settings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordState, setPasswordState] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  function fail(cause: unknown) {
    setMessage("");
    setError(cause instanceof ApiError ? cause.message : "সমস্যা হয়েছে।");
  }

  async function saveSettings() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api.saveSettings(settings);
      await reload();
      setMessage("সেটিংস সেভ হয়েছে। সাইট রিফ্রেশ করলেই পরিবর্তন দেখা যাবে।");
    } catch (cause) {
      fail(cause);
    } finally {
      setBusy(false);
    }
  }

  async function changePassword() {
    setPasswordState(null);
    if (passwords.next !== passwords.confirm) {
      setPasswordState({ kind: "error", text: "নতুন পাসওয়ার্ড দুইবার একই দিন।" });
      return;
    }
    setBusy(true);
    try {
      await api.changePassword(passwords.current, passwords.next);
      setPasswordState({
        kind: "success",
        text: "পাসওয়ার্ড বদলানো হয়েছে। আবার লগইন করুন।",
      });
      setPasswords({ current: "", next: "", confirm: "" });
      window.setTimeout(onLoggedOut, 1500);
    } catch (cause) {
      setPasswordState({
        kind: "error",
        text: cause instanceof ApiError ? cause.message : "পাসওয়ার্ড বদলানো যায়নি।",
      });
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await api.publish();
      setMessage(result.message || "ডিপ্লয় শুরু হয়েছে।");
    } catch (cause) {
      fail(cause);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeading
        title="সেটিংস"
        description="WhatsApp নম্বর, ক্যালকুলেটরের রেট, পাসওয়ার্ড ও ডিপ্লয়।"
      />

      {message && <Alert kind="success">{message}</Alert>}
      {error && <Alert kind="error">{error}</Alert>}

      <Card>
        <p className="text-sm font-extrabold text-royal-900">যোগাযোগ</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="WhatsApp নম্বর (দেশের কোডসহ)" hint="যেমন: 8801660191039">
            <TextInput
              value={settings.contact.whatsappNumber}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  contact: {
                    ...settings.contact,
                    whatsappNumber: event.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="WhatsApp (দেখানোর নম্বর)">
            <TextInput
              value={settings.contact.whatsappDisplay}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  contact: {
                    ...settings.contact,
                    whatsappDisplay: event.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="অফিস ফোন (দেখানোর)">
            <TextInput
              value={settings.contact.phoneDisplay}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  contact: {
                    ...settings.contact,
                    phoneDisplay: event.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="অফিস ফোন (কল লিংক)">
            <TextInput
              value={settings.contact.phoneDial}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  contact: {
                    ...settings.contact,
                    phoneDial: event.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="ইমেইল" className="sm:col-span-2">
            <TextInput
              value={settings.contact.email}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  contact: { ...settings.contact, email: event.target.value },
                })
              }
            />
          </Field>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-extrabold text-royal-900">
          বাজেট ক্যালকুলেটরের রেট
        </p>
        <p className="mt-1 text-[11px] leading-5 text-muted">
          সিলিন্ডার ও প্যাকেটের হিসাব এই সংখ্যাগুলো থেকে হয়।
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="সিলিন্ডার রেট (প্রতি ১০০ cm²)">
            <TextInput
              type="number"
              step="0.01"
              value={settings.estimator.cylinderRatePer100cm2}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  estimator: {
                    ...settings.estimator,
                    cylinderRatePer100cm2: Number(event.target.value),
                  },
                })
              }
            />
          </Field>
          <Field label="LD সর্বনিম্ন ৳/কেজি">
            <TextInput
              type="number"
              value={settings.estimator.ldMin}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  estimator: {
                    ...settings.estimator,
                    ldMin: Number(event.target.value),
                  },
                })
              }
            />
          </Field>
          <Field label="LD সর্বোচ্চ ৳/কেজি">
            <TextInput
              type="number"
              value={settings.estimator.ldMax}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  estimator: {
                    ...settings.estimator,
                    ldMax: Number(event.target.value),
                  },
                })
              }
            />
          </Field>
          <Field label="Foil সর্বনিম্ন ৳/কেজি">
            <TextInput
              type="number"
              value={settings.estimator.foilMin}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  estimator: {
                    ...settings.estimator,
                    foilMin: Number(event.target.value),
                  },
                })
              }
            />
          </Field>
          <Field label="Foil সর্বোচ্চ ৳/কেজি">
            <TextInput
              type="number"
              value={settings.estimator.foilMax}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  estimator: {
                    ...settings.estimator,
                    foilMax: Number(event.target.value),
                  },
                })
              }
            />
          </Field>
          <Field label="LD ন্যূনতম KG">
            <TextInput
              type="number"
              value={settings.estimator.ldMinKg}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  estimator: {
                    ...settings.estimator,
                    ldMinKg: Number(event.target.value),
                  },
                })
              }
            />
          </Field>
          <Field label="Foil ন্যূনতম KG">
            <TextInput
              type="number"
              value={settings.estimator.foilMinKg}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  estimator: {
                    ...settings.estimator,
                    foilMinKg: Number(event.target.value),
                  },
                })
              }
            />
          </Field>
        </div>
        <div className="mt-4">
          <Button onClick={() => void saveSettings()} disabled={busy}>
            <Save className="h-4 w-4" /> সেটিংস সেভ করুন
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-extrabold text-royal-900">পাসওয়ার্ড বদলান</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="বর্তমান পাসওয়ার্ড">
            <TextInput
              type="password"
              autoComplete="current-password"
              value={passwords.current}
              onChange={(event) =>
                setPasswords({ ...passwords, current: event.target.value })
              }
            />
          </Field>
          <Field label="নতুন পাসওয়ার্ড" hint="কমপক্ষে ১০ অক্ষর, একটি সংখ্যা">
            <TextInput
              type="password"
              autoComplete="new-password"
              value={passwords.next}
              onChange={(event) =>
                setPasswords({ ...passwords, next: event.target.value })
              }
            />
          </Field>
          <Field label="নতুন পাসওয়ার্ড আবার">
            <TextInput
              type="password"
              autoComplete="new-password"
              value={passwords.confirm}
              onChange={(event) =>
                setPasswords({ ...passwords, confirm: event.target.value })
              }
            />
          </Field>
        </div>
        {passwordState && (
          <div className="mt-3">
            <Alert kind={passwordState.kind}>{passwordState.text}</Alert>
          </div>
        )}
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => void changePassword()}
            disabled={busy}
          >
            <KeyRound className="h-4 w-4" /> পাসওয়ার্ড আপডেট করুন
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-extrabold text-royal-900">সাইট ডিপ্লয়</p>
        <p className="mt-1 text-[11px] leading-5 text-muted">
          নতুন ল্যান্ডিং পেজ sitemap-এ যোগ করতে এবং স্ট্যাটিক কনটেন্ট
          রিফ্রেশ করতে ডিপ্লয় হুক ব্যবহার করুন।
        </p>
        <div className="mt-3">
          <Button variant="success" onClick={() => void publish()} disabled={busy}>
            <Rocket className="h-4 w-4" /> রিবিল্ড শুরু করুন
          </Button>
        </div>
      </Card>
    </div>
  );
}
