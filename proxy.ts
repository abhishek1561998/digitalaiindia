import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;
  const isPlatform = host.startsWith("platform.");
  const isMainDomain =
    host === "digitalaiindia.com" || host === "www.digitalaiindia.com";

  if (isPlatform && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
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
