import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { I18nMiddleware } from "../i18n";

export async function middleware(req: NextRequest) {
  // Check if the request is for the root path without a locale
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url));
  }

  const i18nResponse = I18nMiddleware(req);
  
  // If i18n middleware returns a redirect, use it
  if (i18nResponse.status === 302 || i18nResponse.status === 307) {
    return i18nResponse;
  }
  
  const res = NextResponse.next({
    request: {
      headers: i18nResponse.headers,
    },
  });
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
