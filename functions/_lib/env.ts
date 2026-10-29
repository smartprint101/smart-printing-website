/** Cloudflare Pages Functions environment and handler types. */

export interface R2BucketLike {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string,
    options?: { httpMetadata?: { contentType?: string; cacheControl?: string } },
  ): Promise<unknown>;
  delete(key: string): Promise<void>;
}

export interface Env {
  /** Neon pooled connection string. */
  DATABASE_URL?: string;
  /** Public base URL of the R2 bucket, e.g. https://media.smartpackagingbd.com */
  R2_PUBLIC_BASE_URL?: string;
  /** R2 bucket binding, configured in Cloudflare Pages → Settings → Functions. */
  MEDIA?: R2BucketLike;
  /** Optional Cloudflare Pages Deploy Hook used by the "publish" button. */
  DEPLOY_HOOK_URL?: string;
  /** Optional override for upload size limit (megabytes, default 8). */
  R2_UPLOAD_MAX_MB?: string;
  /** Site origin used for canonical links on landing pages. */
  SITE_URL?: string;
}

export interface RequestContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  next?: () => Promise<Response>;
}

export type Handler = (context: RequestContext) => Promise<Response> | Response;
