import type {
  AdminData,
  AdminSession,
  Category,
  LandingPage,
  Product,
  ServiceOverride,
  SiteSettings,
} from "@shared/types";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (typeof init.body === "string" && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const response = await fetch(path, {
    credentials: "same-origin",
    ...init,
    headers,
  });
  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message =
      (data as { error?: string } | null)?.error ||
      (response.status === 401
        ? "লগইন করুন।"
        : `রিকোয়েস্ট ব্যর্থ (${response.status})`);
    throw new ApiError(response.status, message);
  }
  return data as T;
}

export type ProductDraft = Partial<Product> & { nameBn: string; slug: string };

export const api = {
  session: () =>
    request<{ session: AdminSession | null }>("/api/admin/session").catch(
      (error: unknown) => {
        if (error instanceof ApiError && error.status === 401) {
          return { session: null };
        }
        throw error;
      },
    ),

  login: (email: string, password: string) =>
    request<{ user: { email: string; name: string | null } }>(
      "/api/admin/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    ),

  logout: () => request<{ ok: boolean }>("/api/admin/session", { method: "DELETE" }),

  data: () => request<AdminData>("/api/admin/data"),

  createProduct: (product: ProductDraft) =>
    request<{ product: Product }>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  updateProduct: (id: string, product: ProductDraft) =>
    request<{ product: Product }>(`/api/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(product),
    }),

  deleteProduct: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/products/${id}`, { method: "DELETE" }),

  bulkPrice: (payload: {
    mode: "percent" | "amount";
    value: number;
    ids?: string[];
    categoryId?: number | null;
    scope?: "all";
  }) =>
    request<{ changed: number; total: number }>("/api/admin/products", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  createCategory: (category: Partial<Category> & { titleBn: string; slug: string }) =>
    request<{ category: Category }>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(category),
    }),

  updateCategory: (id: number, category: Partial<Category> & { titleBn: string; slug: string }) =>
    request<{ category: Category }>(`/api/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(category),
    }),

  deleteCategory: (id: number) =>
    request<{ ok: boolean }>(`/api/admin/categories/${id}`, { method: "DELETE" }),

  saveService: (serviceId: string, override: Partial<ServiceOverride>) =>
    request<{ service: ServiceOverride }>(`/api/admin/services/${serviceId}`, {
      method: "PUT",
      body: JSON.stringify(override),
    }),

  createLanding: (page: Partial<LandingPage>) =>
    request<{ landingPage: LandingPage }>("/api/admin/landing", {
      method: "POST",
      body: JSON.stringify(page),
    }),

  updateLanding: (id: string, page: Partial<LandingPage>) =>
    request<{ landingPage: LandingPage }>(`/api/admin/landing/${id}`, {
      method: "PATCH",
      body: JSON.stringify(page),
    }),

  deleteLanding: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/landing/${id}`, { method: "DELETE" }),

  saveSettings: (settings: SiteSettings) =>
    request<{ settings: SiteSettings }>("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ ok: boolean; message: string }>("/api/admin/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  publish: () =>
    request<{ ok: boolean; message: string }>("/api/admin/publish", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  upload: async (file: File, folder = "products") => {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    return request<{ url: string; key: string }>("/api/admin/upload", {
      method: "POST",
      body,
    });
  },
};
