import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url  = req.nextUrl.clone();
  const { pathname } = url;

  const isPlatform =
    host.startsWith("platform.") ||
    host === "platform.digitalaiindia.com";

  const isMainDomain =
    host === "digitalaiindia.com" ||
    host === "www.digitalaiindia.com";

  /* ── platform.digitalaiindia.com ── */
  if (isPlatform) {
    // Root → dashboard
    if (pathname === "/") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    // API routes and /dashboard paths pass through
    return NextResponse.next();
  }

  /* ── digitalaiindia.com ── */
  if (isMainDomain) {
    // Block /dashboard on main domain → send to platform subdomain
    if (pathname.startsWith("/dashboard")) {
      const platformUrl = new URL(req.url);
      platformUrl.hostname = "platform.digitalaiindia.com";
      return NextResponse.redirect(platformUrl);
    }
    return NextResponse.next();
  }

  // localhost / dev — no redirect, everything works normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
