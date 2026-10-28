"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminLang, requireAdmin, slugify } from "@/lib/admin";
import { ADMIN_LANG_COOKIE, getAdminDict, isAdminLang, type AdminDict } from "@/lib/admin-i18n";
import { TAGS } from "@/lib/data";
import { serverClient } from "@/lib/supabase/server";

export type ActionState = { ok: boolean; message: string } | null;

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const isHttpUrl = (v: string) => /^https:\/\/\S+$/.test(v);

/* ---------------- Language ---------------- */

export async function setAdminLang(fd: FormData) {
  const lang = text(fd, "lang");
  if (!isAdminLang(lang)) return;
  (await cookies()).set(ADMIN_LANG_COOKIE, lang, { path: "/admin", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}

/* ---------------- Auth ---------------- */

export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  const t = getAdminDict(await getAdminLang());
  const supabase = await serverClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: text(fd, "email").toLowerCase(),
    password: String(fd.get("password") ?? ""),
  });
  if (error) return { ok: false, message: t.m_wrongLogin };

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (rpcError) {
    await supabase.auth.signOut();
    return { ok: false, message: t.m_setup };
  }
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { ok: false, message: t.m_notAdmin };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------------- Products ---------------- */

export async function saveProduct(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, t } = await requireAdmin();
  const id = text(fd, "id");

  const price = Number(text(fd, "price"));
  const category = text(fd, "category");
  const tag = text(fd, "tag");
  const image = text(fd, "image_url");
  const row = {
    name_mr: text(fd, "name_mr"),
    name_en: text(fd, "name_en"),
    description_mr: text(fd, "description_mr"),
    description_en: text(fd, "description_en"),
    price,
    category,
    tag: tag === "ghee" || tag === "oil" ? tag : null,
    image_url: image || null,
    is_available: fd.get("is_available") === "on",
    is_featured: fd.get("is_featured") === "on",
    slug: slugify(text(fd, "slug") || text(fd, "name_en")),
  };

  if (!row.name_mr || !row.name_en) return { ok: false, message: t.m_names };
  if (!Number.isInteger(price) || price <= 0 || price >= 100000) return { ok: false, message: t.m_price };
  if (!["sweet", "namkeen", "flour"].includes(category)) return { ok: false, message: t.m_category };
  if (!row.slug) return { ok: false, message: t.m_slug };
  if (image && !isHttpUrl(image)) return { ok: false, message: t.m_imageHttps };

  if (id) {
    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) return { ok: false, message: friendly(error, t) };
    updateTag(TAGS.products);
    return { ok: true, message: t.m_saved };
  }

  // New product goes to the end of the list
  const { data: last } = await supabase.from("products").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const { error } = await supabase.from("products").insert({ ...row, sort_order: (last?.[0]?.sort_order ?? 0) + 10 });
  if (error) return { ok: false, message: friendly(error, t) };
  updateTag(TAGS.products);
  redirect("/admin?saved=1");
}

export async function deleteProduct(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("products").delete().eq("id", text(fd, "id"));
  updateTag(TAGS.products);
  redirect("/admin?deleted=1");
}

/** One-tap edits from the list: price, available, featured. */
export async function quickUpdate(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(fd, "id");
  const field = text(fd, "field");
  const value = text(fd, "value");

  let patch: Record<string, number | boolean> | null = null;
  if (field === "price") {
    const price = Number(value);
    if (Number.isInteger(price) && price > 0 && price < 100000) patch = { price };
  } else if (field === "is_available" || field === "is_featured") {
    patch = { [field]: value === "true" };
  }
  if (!patch) return;

  await supabase.from("products").update(patch).eq("id", id);
  updateTag(TAGS.products);
}

/** Move a product one place up/down; renumbers the whole list so gaps never matter. */
export async function moveProduct(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(fd, "id");
  const dir = text(fd, "dir") === "up" ? -1 : 1;

  const { data } = await supabase.from("products").select("id").order("sort_order").order("name_en");
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];

  await Promise.all(ids.map((pid, k) => supabase.from("products").update({ sort_order: (k + 1) * 10 }).eq("id", pid)));
  updateTag(TAGS.products);
}

/* ---------------- Settings ---------------- */

export async function saveSettings(_: ActionState, fd: FormData): Promise<ActionState> {
  const { supabase, t } = await requireAdmin();
  const brochure = text(fd, "brochure_url");
  const deadline = text(fd, "order_deadline");
  const row = {
    phone: text(fd, "phone").replace(/\D/g, ""),
    upi: text(fd, "upi").replace(/\D/g, ""),
    fssai: text(fd, "fssai").replace(/\s/g, ""),
    order_deadline: deadline || null,
    orders_open: fd.get("orders_open") === "on",
    years_of_service: Number(text(fd, "years_of_service")),
    brochure_url: brochure || null,
  };

  if (!/^\d{10}$/.test(row.phone) || !/^\d{10}$/.test(row.upi)) return { ok: false, message: t.m_phone };
  if (!Number.isInteger(row.years_of_service) || row.years_of_service < 1 || row.years_of_service > 200)
    return { ok: false, message: t.m_years };
  if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return { ok: false, message: t.m_date };
  if (brochure && !isHttpUrl(brochure)) return { ok: false, message: t.m_brochureHttps };

  const { error } = await supabase.from("site_settings").update(row).eq("id", 1);
  if (error) return { ok: false, message: friendly(error, t) };
  updateTag(TAGS.settings);
  return { ok: true, message: t.m_settingsSaved };
}

function friendly(error: { code?: string; message: string }, t: AdminDict) {
  if (error.code === "23505") return t.m_slugTaken;
  if (error.code === "23514") return t.m_invalid;
  if (error.code === "42501") return t.m_denied;
  return `${t.m_error}: ${error.message}`;
}
