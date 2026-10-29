/** JSON helpers and error handling for the Pages Functions API. */

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

export function json(
  data: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

/** Wrap a handler so thrown HttpErrors become clean JSON responses. */
export async function handle(
  run: () => Promise<Response> | Response,
): Promise<Response> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof HttpError) {
      return json({ error: error.message }, error.status);
    }
    console.error("API error", error);
    return json({ error: "সার্ভারে অপ্রত্যাশিত সমস্যা হয়েছে।" }, 500);
  }
}

export async function readJson<T>(request: Request): Promise<T> {
  const type = request.headers.get("content-type") || "";
  if (!type.includes("application/json")) {
    throw new HttpError(415, "JSON বডি প্রয়োজন।");
  }
  const text = await request.text();
  if (text.length > 2_000_000) {
    throw new HttpError(413, "রিকোয়েস্ট অনেক বড়।");
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, "বডি সঠিক JSON নয়।");
  }
}

export function requireMethod(request: Request, methods: string[]): void {
  if (!methods.includes(request.method)) {
    throw new HttpError(405, "এই মেথড সমর্থিত নয়।");
  }
}

/** Reject cross-site writes (belt and braces next to SameSite cookies). */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const host = request.headers.get("host");
  try {
    if (new URL(origin).host !== host) {
      throw new HttpError(403, "অনুমোদিত origin নয়।");
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(403, "অনুমোদিত origin নয়।");
  }
}
