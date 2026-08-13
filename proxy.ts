import { NextRequest, NextResponse } from "next/server";

// Paths that must resolve exactly as-is on a content subdomain instead of
// being prefixed — shared auth/session/api routes so login works
// identically whether someone arrives via the main domain or a subdomain.
const PASSTHROUGH_PREFIXES = ["/auth", "/api", "/dashboard", "/_next", "/pricing"];

function subdomainRewrite(req: NextRequest, base: string) {
  const { pathname } = req.nextUrl;
  const passthrough = PASSTHROUGH_PREFIXES.some((p) => pathname.startsWith(p));
  if (passthrough || pathname.startsWith(base)) return null;
  const target = req.nextUrl.clone();
  target.pathname = `${base}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(target);
}

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;
  const isPlatform = host.startsWith("platform.");
  const isLearn = host.startsWith("learn.");
  const isBlog = host.startsWith("blog.");
  const isMainDomain =
    host === "digitalaiindia.com" || host === "www.digitalaiindia.com";

  if (isPlatform) {
    const rewritten = subdomainRewrite(req, "/platform");
    if (rewritten) return rewritten;
  }

  if (isLearn) {
    const rewritten = subdomainRewrite(req, "/learn");
    if (rewritten) return rewritten;
  }

  if (isBlog) {
    const rewritten = subdomainRewrite(req, "/blog");
    if (rewritten) return rewritten;
  }

  const isPlatformRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth");

  if (isMainDomain && isPlatformRoute) {
    const target = new URL(req.url);
    target.hostname = "platform.digitalaiindia.com";
    return NextResponse.redirect(target);
  }

  if (pathname.startsWith("/dashboard")) {
    const session = req.cookies.get("dai_session")?.value;
    if (!session) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
