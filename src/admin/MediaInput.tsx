import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, X } from "lucide-react";
import { api, ApiError } from "./api";
import { Field, TextInput } from "./ui";

/**
 * Image field: either upload straight to Cloudflare R2 or paste an existing URL.
 */
export function MediaInput({
  label = "ছবি",
  value,
  onChange,
  folder = "products",
  hint,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("শুধু ছবি ফাইল আপলোড করুন।");
      return;
    }
    setUploading(true);
    try {
      const result = await api.upload(file, folder);
      onChange(result.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof ApiError
          ? uploadError.message
          : "ছবি আপলোড করা যায়নি।",
      );
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="mt-1 flex items-start gap-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-white">
          {value ? (
            <img
              src={value}
              alt=""
              width={80}
              height={80}
              className="h-full w-full object-contain"
            />
          ) : (
            <ImagePlus className="h-6 w-6 text-muted" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <TextInput
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="https://media.example.com/products/…"
              className="mt-0"
              inputMode="url"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="ছবি সরান"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-white text-muted hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={input}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => input.current?.click()}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-royal-900 px-3 text-xs font-bold text-white disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {uploading ? "আপলোড হচ্ছে…" : "R2-তে আপলোড করুন"}
            </button>
            <span className="text-[11px] text-muted">
              JPG/PNG/WebP · সর্বোচ্চ ৮ MB
            </span>
          </div>
          {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </Field>
  );
}
