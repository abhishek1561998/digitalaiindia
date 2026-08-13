import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { cookieDomainFor } from "@/lib/server/auth";

const STATE_COOKIE = "dai_google_oauth_state";
const RETURN_COOKIE = "dai_google_oauth_return";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const redirectUri = (process.env.GOOGLE_REDIRECT_URI || `${url.origin}/api/auth/google/callback`).trim();

  // GOOGLE_REDIRECT_URI is one fixed URL registered with Google, so the
  // callback always lands on that domain regardless of which
  // subdomain started the flow. Remember where the user actually came
  // from (as a full origin+path) so the callback can send them back.
  const requestedRedirect = url.searchParams.get("redirect");
  const returnTo = `${url.origin}${requestedRedirect && requestedRedirect.startsWith("/") ? requestedRedirect : "/dashboard"}`;

  if (!clientId) {
    return NextResponse.json({ error: "Missing GOOGLE_CLIENT_ID" }, { status: 500 });
  }

  const state = randomBytes(24).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "offline",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const domain = cookieDomainFor(url.hostname);
  const res = NextResponse.redirect(authUrl);
  res.cookies.set({
    name: STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
    domain,
  });
  res.cookies.set({
    name: RETURN_COOKIE,
    value: returnTo,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
    domain,
  });

  return res;
}
