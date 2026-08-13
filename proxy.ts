import { NextRequest, NextResponse } from "next/server";

// Paths that must resolve exactly as-is on learn.digitalaiindia.com instead
// of being prefixed with /learn — shared auth/session/api routes so login
// works identically whether someone arrives via the main domain or here.
const LEARN_PASSTHROUGH_PREFIXES = ["/auth", "/api", "/dashboard", "/_next"];

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;
  const isPlatform = host.startsWith("platform.");
  const isLearn = host.startsWith("learn.");
  const isMainDomain =
    host === "digitalaiindia.com" || host === "www.digitalaiindia.com";

  if (isPlatform && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isLearn) {
    const passthrough = LEARN_PASSTHROUGH_PREFIXES.some((p) => pathname.startsWith(p));
    if (!passthrough && !pathname.startsWith("/learn")) {
      const target = req.nextUrl.clone();
      target.pathname = `/learn${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(target);
    }
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
