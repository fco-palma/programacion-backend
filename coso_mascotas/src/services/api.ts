import type { Announcement, Category, Product, SeasonKey, Species } from "../app/data/shopData";
import type { StoreSettings } from "../app/data/storeSettings";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
const API_ORIGIN = new URL(API_URL).origin;

function resolveMediaUrl(value: string) {
  if (!value) return value;
  try {
    const url = new URL(value, API_ORIGIN);
    const pointsToLocalApi = ["localhost", "127.0.0.1"].includes(url.hostname) && url.port === "3000";
    if (pointsToLocalApi || value.startsWith("/uploads/")) {
      return `${API_ORIGIN}${url.pathname}${url.search}${url.hash}`;
    }
    return value;
  } catch {
    return value;
  }
}

export type User = {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
};

type CartItem = { productId: number; qty: number };

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.error || "No fue posible completar la operación.", response.status, body.code);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const currency = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

function displayPrice(value: number | string | null): string | null {
  if (value === null || value === "") return null;
  return currency.format(Number(value));
}

function numericPrice(value: string | number | null): number | null {
  if (value === null || value === "") return null;
  if (typeof value === "number") return value;
  const digits = value.replace(/[^0-9-]/g, "");
  return digits ? Number(digits) : null;
}

function fromApiProduct(product: Omit<Product, "price" | "original"> & { price: number; original: number | null }): Product {
  return {
    ...product,
    id: Number(product.id),
    categoryId: Number(product.categoryId),
    inventory: Number(product.inventory),
    rating: Number(product.rating),
    reviews: Number(product.reviews),
    price: displayPrice(product.price) || "$0",
    original: displayPrice(product.original),
    image: resolveMediaUrl(product.image),
  };
}

function fromApiCategory(category: Category): Category {
  return { ...category, image: resolveMediaUrl(category.image) };
}

function fromApiAnnouncement(announcement: Announcement): Announcement {
  return { ...announcement, image: resolveMediaUrl(announcement.image) };
}

function toApiProduct(product: Product) {
  return {
    ...product,
    price: numericPrice(product.price),
    original: numericPrice(product.original),
  };
}

export const api = {
  auth: {
    async me() {
      return request<{ user: User }>("/auth/me");
    },
    async login(email: string, password: string) {
      return request<{ user: User }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    },
    async register(email: string, password: string) {
      return request<{ user: User }>("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });
    },
    async logout() {
      return request<void>("/auth/logout", { method: "POST" });
    },
  },
  products: {
    async list() {
      const products = await request<Array<Omit<Product, "price" | "original"> & { price: number; original: number | null }>>("/products");
      return products.map(fromApiProduct);
    },
    async create(product: Product) {
      const created = await request<Omit<Product, "price" | "original"> & { price: number; original: number | null }>("/products", {
        method: "POST",
        body: JSON.stringify(toApiProduct(product)),
      });
      return fromApiProduct(created);
    },
    async update(product: Product) {
      const updated = await request<Omit<Product, "price" | "original"> & { price: number; original: number | null }>(`/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify(toApiProduct(product)),
      });
      return fromApiProduct(updated);
    },
    async remove(id: number) {
      return request<void>(`/products/${id}`, { method: "DELETE" });
    },
  },
  categories: {
    async list() {
      return (await request<Category[]>("/categories")).map(fromApiCategory);
    },
    async create(category: Pick<Category, "label" | "species" | "image">) {
      return fromApiCategory(await request<Category>("/categories", { method: "POST", body: JSON.stringify(category) }));
    },
    async update(category: Category) {
      return fromApiCategory(await request<Category>(`/categories/${category.id}`, { method: "PATCH", body: JSON.stringify(category) }));
    },
    remove: (id: number) => request<void>(`/categories/${id}`, { method: "DELETE" }),
  },
  favorites: {
    list: () => request<number[]>("/favorites"),
    add: (productId: number) => request<{ productId: number }>(`/favorites/${productId}`, { method: "POST" }),
    remove: (productId: number) => request<void>(`/favorites/${productId}`, { method: "DELETE" }),
  },
  cart: {
    list: () => request<CartItem[]>("/cart"),
    set: (productId: number, qty: number) =>
      request<CartItem[]>(`/cart/${productId}`, { method: "PUT", body: JSON.stringify({ quantity: qty }) }),
    remove: (productId: number) => request<void>(`/cart/${productId}`, { method: "DELETE" }),
    sync: (items: CartItem[]) => request<CartItem[]>("/cart/sync", { method: "POST", body: JSON.stringify({ items }) }),
  },
  orders: {
    create: () => request<{ id: number; total: number; shippingCost: number }>("/orders", { method: "POST" }),
  },
  uploads: {
    async image(file: File) {
      const response = await fetch(`${API_URL}/uploads/images`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": file.type,
          "X-File-Name": encodeURIComponent(file.name),
        },
        body: file,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new ApiError(body.error || "No fue posible subir la imagen.", response.status, body.code);
      }
      const result = await response.json() as { url: string; filename: string };
      return { ...result, url: resolveMediaUrl(result.url) };
    },
  },
  settings: {
    async get() {
      const settings = await request<{ theme: SeasonKey; heroImages: Record<Species, string>; global: StoreSettings }>("/settings");
      return {
        ...settings,
        heroImages: {
          perros: resolveMediaUrl(settings.heroImages.perros),
          gatos: resolveMediaUrl(settings.heroImages.gatos),
        },
      };
    },
    updateTheme: (theme: SeasonKey) =>
      request<{ theme: SeasonKey }>("/settings/theme", { method: "PATCH", body: JSON.stringify({ theme }) }),
    updateHeroImage: (species: Species, image: string) =>
      request<{ species: Species; image: string }>("/settings/hero", { method: "PATCH", body: JSON.stringify({ species, image }) }),
    updateGlobal: (settings: StoreSettings) =>
      request<StoreSettings>("/settings/global", { method: "PATCH", body: JSON.stringify(settings) }),
  },
  announcements: {
    async list() {
      return (await request<Announcement[]>("/announcements")).map(fromApiAnnouncement);
    },
    async create(announcement: Omit<Announcement, "id">) {
      return fromApiAnnouncement(await request<Announcement>("/announcements", { method: "POST", body: JSON.stringify(announcement) }));
    },
    async update(announcement: Announcement) {
      return fromApiAnnouncement(await request<Announcement>(`/announcements/${announcement.id}`, { method: "PATCH", body: JSON.stringify(announcement) }));
    },
    remove: (id: number) => request<void>(`/announcements/${id}`, { method: "DELETE" }),
  },
};
