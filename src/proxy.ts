import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigured } from "@/lib/supabase/public";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin: no language prefix; keep the Supabase login session fresh.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return refreshAdminSession(request);
  }

  // Public site: / -> /mr, /products -> /en/products (remembers last choice)
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return;

  const saved = request.cookies.get(LOCALE_COOKIE)?.value ?? "";
  const locale = isLocale(saved) ? saved : defaultLocale;

  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

async function refreshAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!supabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet, headers) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });
  // Validates the JWT and refreshes it if needed (writes new cookies via setAll).
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  // Skip Next internals, API routes and files with an extension (images, brochure, favicon…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
