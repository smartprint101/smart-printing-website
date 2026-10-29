import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import { api, ApiError } from "./api";
import { Alert, Button, Field, TextInput } from "./ui";

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.login(email, password);
      onSuccess();
    } catch (loginError) {
      setError(
        loginError instanceof ApiError
          ? loginError.message
          : "লগইন করা যায়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-royal-950 px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft"
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-royal-900 text-white">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-lg font-extrabold text-royal-900">
          অ্যাডমিন প্যানেল
        </h1>
        <p className="mt-1 text-xs leading-5 text-muted">
          Smart Printing Packaging — প্রোডাক্ট, দাম, ছবি ও ল্যান্ডিং পেজ
          ম্যানেজ করুন।
        </p>
        <div className="mt-5 space-y-3">
          <Field label="ইমেইল">
            <TextInput
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              placeholder="admin@smartpackagingbd.com"
            />
          </Field>
          <Field label="পাসওয়ার্ড">
            <TextInput
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>
          {error && <Alert kind="error">{error}</Alert>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "লগইন হচ্ছে…" : "লগইন"}
          </Button>
        </div>
        <p className="mt-4 text-[11px] leading-5 text-muted">
          পাসওয়ার্ড ভুলে গেলে সার্ভারে{" "}
          <code className="rounded bg-mist px-1">npm run db:setup</code>{" "}
          চালিয়ে নতুন পাসওয়ার্ড সেট করুন।
        </p>
      </form>
    </div>
  );
}
