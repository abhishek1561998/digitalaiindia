import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decryptApiKey, encryptApiKey, generateApiKey, maskApiKey } from "@/lib/server/api-keys";
import { getCurrentUser } from "@/lib/server/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id, isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      keyLastFour: true,
      encryptedKey: true,
      requests: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  return NextResponse.json({
    keys: keys.map((key: any) => {
      const fullKey = decryptApiKey(key.encryptedKey);
      return {
        id: key.id,
        name: key.name,
        prefix: key.keyPrefix,
        lastFour: key.keyLastFour,
        masked: maskApiKey(fullKey),
        fullKey,
        requests: key.requests,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
      };
    }),
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeKeys = await prisma.apiKey.count({
    where: {
      userId: user.id,
      isActive: true,
    },
  });

  if (user.plan === "FREE" && activeKeys >= 3) {
    return NextResponse.json({ error: "Free plan supports up to 3 API keys" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const name = String(body.name || `Key ${activeKeys + 1}`).slice(0, 40).trim() || `Key ${activeKeys + 1}`;

  const generated = generateApiKey();

  const created = await prisma.apiKey.create({
    data: {
      userId: user.id,
      name,
      keyPrefix: generated.prefix,
      keyLastFour: generated.lastFour,
      keyHash: generated.hash,
      encryptedKey: encryptApiKey(generated.raw),
    },
    select: {
      id: true,
      name: true,
      requests: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    {
      key: {
        ...created,
        fullKey: generated.raw,
        masked: maskApiKey(generated.raw),
      },
    },
    { status: 201 },
  );
}
