import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ADMIN_LANG_COOKIE, getAdminDict, isAdminLang, type AdminLang } from "./admin-i18n";
import { serverClient } from "./supabase/server";

/** Admin UI language from the cookie (default Marathi). */
export async function getAdminLang(): Promise<AdminLang> {
  const value = (await cookies()).get(ADMIN_LANG_COOKIE)?.value;
  return isAdminLang(value) ? value : "mr";
}

/**
 * Ensures the visitor is a logged-in admin (listed in public.admin_emails).
 * Returns a Supabase client acting as that user — RLS still guards every write —
 * plus the admin's chosen UI language and its dictionary.
 */
export async function requireAdmin() {
  // Admin pages are always per-request; also lets the auth client read the clock (token expiry).
  await connection();
  const supabase = await serverClient();
  const { data } = await supabase.auth.getClaims();
  const email = (data?.claims?.email as string | undefined) ?? null;
  if (!email) redirect("/admin/login");

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    await supabase.auth.signOut();
    redirect(`/admin/login?e=${error ? "setup" : "denied"}`);
  }
  const lang = await getAdminLang();
  return { supabase, email, lang, t: getAdminDict(lang) };
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
