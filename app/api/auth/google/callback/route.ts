import { randomBytes } from "crypto";
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

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${url.origin}/api/auth/google/callback`;

    if (!code || !state || !clientId || !clientSecret) {
      return NextResponse.redirect(`${url.origin}/auth?error=google_oauth_missing_config`);
    }

    const cookieHeader = req.headers.get("cookie") || "";
    const stateCookie = cookieHeader
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${STATE_COOKIE}=`))
      ?.split("=")[1];

    if (!stateCookie || stateCookie !== state) {
      return NextResponse.redirect(`${url.origin}/auth?error=google_oauth_state_invalid`);
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    if (!tokenRes.ok || !tokenData.id_token) {
      const reason = tokenData.error || "google_token_exchange_failed";
      const detail = tokenData.error_description || "";
      console.error("google_token_exchange_failed", { status: tokenRes.status, reason, detail });
      return NextResponse.redirect(
        `${url.origin}/auth?error=google_token_exchange_failed&reason=${encodeURIComponent(reason)}`,
      );
    }

    const infoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenData.id_token)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const info = (await infoRes.json()) as TokenInfoResponse;

    if (!infoRes.ok || info.aud !== clientId || !info.email || info.email_verified !== "true") {
      return NextResponse.redirect(`${url.origin}/auth?error=google_identity_invalid`);
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
    return NextResponse.redirect(`${url.origin}/auth?error=google_oauth_internal_error`);
  }
}
