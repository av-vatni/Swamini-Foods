import { cacheLife, cacheTag } from "next/cache";
import { publicClient, supabaseConfigured } from "./supabase/public";
import { PRODUCTS as SEED_PRODUCTS, type Category, type Product, type Tag } from "./products";
import { DEFAULT_SETTINGS, type Settings } from "./settings";

export const TAGS = { products: "products", settings: "settings" } as const;

export type ProductRow = {
  id: string;
  slug: string;
  name_mr: string;
  name_en: string;
  description_mr: string;
  description_en: string;
  price: number;
  category: Category;
  tag: Tag | null;
  image_url: string | null;
  is_featured: boolean;
  is_available: boolean;
  sort_order: number;
  updated_at: string;
  updated_by: string | null;
};

export const rowToProduct = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  name: { mr: r.name_mr, en: r.name_en },
  description: { mr: r.description_mr, en: r.description_en },
  price: r.price,
  category: r.category,
  tag: r.tag ?? undefined,
  featured: r.is_featured,
  image: r.image_url ?? undefined,
});

/** Visible products for the public site (cached; refreshed when the admin saves). */
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  // Admin saves refresh immediately (updateTag); re-checking every minute is a safety net for
  // hosts where that refresh may not reach every server instance, and ends a fallback quickly.
  cacheLife("minutes");

  const { data, error } = supabaseConfigured
    ? await publicClient().from("products").select("*").eq("is_available", true).order("sort_order").order("name_en")
    : { data: null, error: { message: "Supabase env vars missing" } };

  if (error || !data) {
    console.error("[data] products fallback:", error?.message);
    return SEED_PRODUCTS;
  }
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("minutes");

  const { data, error } = supabaseConfigured
    ? await publicClient().from("site_settings").select("*").eq("id", 1).maybeSingle()
    : { data: null, error: { message: "Supabase env vars missing" } };

  if (error || !data) {
    console.error("[data] settings fallback:", error?.message ?? "no settings row");
    return DEFAULT_SETTINGS;
  }
  return {
    phone: data.phone,
    upi: data.upi,
    fssai: data.fssai,
    orderDeadline: data.order_deadline,
    ordersOpen: data.orders_open,
    yearsOfService: data.years_of_service,
    brochureUrl: data.brochure_url,
  };
}
