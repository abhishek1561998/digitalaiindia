import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, hashPassword, signSessionToken } from "@/lib/server/auth";
import { encryptApiKey, generateApiKey } from "@/lib/server/api-keys";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const created = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashPassword(password),
        },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          monthlyLimit: true,
        },
      });

      const generated = generateApiKey();
      await tx.apiKey.create({
        data: {
          userId: user.id,
          name: "Default Key",
          keyPrefix: generated.prefix,
          keyLastFour: generated.lastFour,
          keyHash: generated.hash,
          encryptedKey: encryptApiKey(generated.raw),
        },
      });

      return { user, apiKey: generated.raw };
    });

    const token = signSessionToken({
      sub: created.user.id,
      email: created.user.email,
      name: created.user.name,
    });

    const res = NextResponse.json({
      user: created.user,
      apiKey: created.apiKey,
    });

    res.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("signup_error", error);
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}
