import { requireAdmin } from "../../_lib/auth";
import { randomToken } from "../../_lib/password";
import type { RequestContext } from "../../_lib/env";
import {
  HttpError,
  assertSameOrigin,
  handle,
  json,
  requireMethod,
} from "../../_lib/http";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

/**
 * POST /api/admin/upload (multipart/form-data, field `file`)
 * Stores the image in the R2 bucket bound as MEDIA and returns its public URL.
 */
export const onRequestPost = (context: RequestContext) =>
  handle(async () => {
    requireMethod(context.request, ["POST"]);
    assertSameOrigin(context.request);
    await requireAdmin(context.env, context.request);

    if (!context.env.MEDIA) {
      throw new HttpError(
        500,
        "R2 বাকেট বাঁধা নেই। Cloudflare Pages → Settings → Functions → R2 bucket bindings-এ MEDIA যোগ করুন।",
      );
    }
    const baseUrl = (context.env.R2_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
    if (!baseUrl) {
      throw new HttpError(
        500,
        "R2_PUBLIC_BASE_URL সেট করা নেই। R2 বাকেটের পাবলিক ডোমেইন Environment variables-এ যোগ করুন।",
      );
    }

    const type = context.request.headers.get("content-type") || "";
    if (!type.includes("multipart/form-data")) {
      throw new HttpError(415, "multipart/form-data ফরম্যাটে ছবি পাঠান।");
    }
    const form = await context.request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      throw new HttpError(400, "ফাইল পাওয়া যায়নি।");
    }
    const extension = ALLOWED[file.type];
    if (!extension) {
      throw new HttpError(
        400,
        "শুধু JPG, PNG, WebP, AVIF বা GIF ছবি আপলোড করা যাবে।",
      );
    }
    const maxMb = Number(context.env.R2_UPLOAD_MAX_MB || 8);
    if (file.size > maxMb * 1024 * 1024) {
      throw new HttpError(413, `ছবির সাইজ সর্বোচ্চ ${maxMb} MB হতে পারবে।`);
    }

    const now = new Date();
    const prefix = String((form.get("folder") as string) || "products")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 24) || "products";
    const key = `${prefix}/${now.getUTCFullYear()}/${now
      .getUTCMonth()
      .toString()
      .padStart(2, "0")}/${randomToken(8)}.${extension}`;

    await context.env.MEDIA.put(key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    return json({ key, url: `${baseUrl}/${key}` }, 201);
  });
