import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseConfig } from "./config";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/pelapor",
  "/satgas",
  "/ketua",
  "/pimpinan",
  "/admin",
];

const CACHE_HEADERS = ["cache-control", "expires", "pragma"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function withSessionCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });

  for (const header of CACHE_HEADERS) {
    const value = source.headers.get(header);
    if (value) {
      target.headers.set(header, value);
    }
  }

  return target;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key } = getSupabaseConfig();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([header, value]) => {
          response.headers.set(header, value);
        });
      },
    },
  });

  let isAuthenticated = false;

  try {
    const { data } = await supabase.auth.getClaims();
    isAuthenticated = Boolean(data?.claims?.sub);
  } catch {
    isAuthenticated = false;
  }

  const { pathname, searchParams } = request.nextUrl;

  if (!isAuthenticated && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return withSessionCookies(NextResponse.redirect(loginUrl), response);
  }

  if (isAuthenticated && pathname === "/login" && !searchParams.has("error")) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return withSessionCookies(NextResponse.redirect(dashboardUrl), response);
  }

  return response;
}
