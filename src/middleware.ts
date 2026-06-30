import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Subdomain routing:
 *   admin.<your-domain>      → serves the /admin section
 *   <your-domain> (public)   → serves the public marketing site
 *
 * One app, one repo, one deployment. Point both the apex domain and the
 * "admin." subdomain at this same deployment (see deploy notes).
 */
export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const url = req.nextUrl;

  const isAdminHost = host.startsWith("admin.");
  // Exempt local dev so you can still open http://localhost:3000/admin while building.
  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  // ── On the admin subdomain: rewrite everything into the /admin tree ──
  if (isAdminHost) {
    if (!url.pathname.startsWith("/admin")) {
      // admin.example.com/        → /admin
      // admin.example.com/login   → /admin/login
      url.pathname = `/admin${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // ── On the public domain: keep /admin off it (production only) ──
  // Remove this block if you also want admin reachable at <domain>/admin.
  if (!isLocalhost && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on pages only — skip API routes, Next internals, and static files (anything with a dot).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
