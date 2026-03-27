import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for Satu Teladan Support.
 *
 * NOTE: This project uses @supabase/supabase-js directly (not @supabase/ssr),
 * so sessions are stored in localStorage — they are NOT readable in middleware
 * cookies. Do NOT call supabase.auth.getUser() here; that would fire a network
 * request to /auth/v1/user on every single page navigation, causing the
 * "infinite requests" problem.
 *
 * Admin route protection is handled client-side in each admin page component.
 * If you later migrate to @supabase/ssr (cookie-based sessions), you can add
 * server-side auth checks here instead.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (Next.js build assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico, site.webmanifest
     * - public image/icon files
     *
     * Keeping the matcher narrow prevents middleware overhead on every
     * static asset request.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|site\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
