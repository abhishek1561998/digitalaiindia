import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, hashPassword, signSessionToken } from "@/lib/server/auth";
import { encryptApiKey, generateApiKey } from "@/lib/server/api-keys";

const STATE_COOKIE = "dai_google_oauth_state";

type GoogleTokenResponse = {
  id_token?: string;
  access_token?: string;
  error?: string;
  error_description?: string;
};

type TokenInfoResponse = {
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string;
  name?: string;
};

async function exchangeGoogleCode(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
}) {
  let lastFailure: { reason: string; detail: string; redirectUri: string; status: number } | null = null;

  for (const redirectUri of params.redirectUris) {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: params.code,
        client_id: params.clientId,
        client_secret: params.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    if (tokenRes.ok && tokenData.id_token) {
      return { tokenData, redirectUri };
    }

    lastFailure = {
      reason: tokenData.error || "google_token_exchange_failed",
      detail: tokenData.error_description || "",
      redirectUri,
      status: tokenRes.status,
    };
  }

  return { tokenData: null, redirectUri: null, lastFailure };
}

function buildAuthRedirect(origin: string, error: string, reason?: string) {
  const params = new URLSearchParams({ error });
  if (reason) {
    params.set("reason", reason);
  }
  return `${origin}/auth?${params.toString()}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const configuredRedirectUri = process.env.GOOGLE_REDIRECT_URI || `${url.origin}/api/auth/google/callback`;
    const redirectUris = Array.from(
      new Set([
        configuredRedirectUri,
        `${url.origin}/api/auth/callback/google`,
        `${url.origin}/api/auth/google/callback`,
      ]),
    );
    const isLocalhost = ["localhost", "127.0.0.1"].includes(url.hostname);

    if (!code || !state || !clientId || !clientSecret) {
      return NextResponse.redirect(
        buildAuthRedirect(url.origin, "google_oauth_missing_config", "missing-code-state-or-google-config"),
      );
    }

    const cookieStore = await cookies();
    const stateCookie = cookieStore.get(STATE_COOKIE)?.value;

    if ((!stateCookie || stateCookie !== state) && !isLocalhost) {
      return NextResponse.redirect(
        buildAuthRedirect(url.origin, "google_oauth_state_invalid", "state-cookie-mismatch"),
      );
    }

    if ((!stateCookie || stateCookie !== state) && isLocalhost) {
      console.warn("google_oauth_state_cookie_bypassed_for_localhost", {
        state,
        stateCookiePresent: Boolean(stateCookie),
      });
    }

    const { tokenData, redirectUri, lastFailure } = await exchangeGoogleCode({
      code,
      clientId,
      clientSecret,
      redirectUris,
    });

    if (!tokenData || !redirectUri) {
      console.error("google_token_exchange_failed", lastFailure);
      return NextResponse.redirect(
        buildAuthRedirect(
          url.origin,
          "google_token_exchange_failed",
          lastFailure?.detail || lastFailure?.reason || "google-token-exchange-failed",
        ),
      );
    }

    const idToken = tokenData.id_token;
    if (!idToken) {
      return NextResponse.redirect(
        buildAuthRedirect(url.origin, "google_token_exchange_failed", "missing-id-token"),
      );
    }

    const infoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const info = (await infoRes.json()) as TokenInfoResponse;

    if (!infoRes.ok || info.aud !== clientId || !info.email || info.email_verified !== "true") {
      return NextResponse.redirect(
        buildAuthRedirect(url.origin, "google_identity_invalid", "email-not-verified-or-token-invalid"),
      );
    }

    const name = (info.name || info.email.split("@")[0] || "Google User").slice(0, 100);
    const email = info.email.toLowerCase();

    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        name,
        email,
        passwordHash: hashPassword(randomBytes(24).toString("hex")),
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        monthlyLimit: true,
      },
    });

    const activeKeys = await prisma.apiKey.count({ where: { userId: user.id, isActive: true } });
    if (activeKeys === 0) {
      const generated = generateApiKey();
      await prisma.apiKey.create({
        data: {
          userId: user.id,
          name: "Default Key",
          keyPrefix: generated.prefix,
          keyLastFour: generated.lastFour,
          keyHash: generated.hash,
          encryptedKey: encryptApiKey(generated.raw),
        },
      });
    }

    const token = signSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.redirect(`${url.origin}/dashboard`);
    res.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set({
      name: STATE_COOKIE,
      value: "",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (error) {
    console.error("google_oauth_callback_error", error);
    return NextResponse.redirect(
      buildAuthRedirect(url.origin, "google_oauth_internal_error", "unexpected-server-error"),
    );
  }
}
