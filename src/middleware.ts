// Paste the full middleware code from our previous steps
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { I18nMiddleware } from "../i18n";

export async function middleware(req: NextRequest) {
  const i18nResponse = I18nMiddleware(req);
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
