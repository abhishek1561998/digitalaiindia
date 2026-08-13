import { NextResponse } from "next/server";
import { SESSION_COOKIE, cookieDomainFor } from "@/lib/server/auth";

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    domain: cookieDomainFor(new URL(req.url).hostname),
  });
  return res;
}
