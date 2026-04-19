import { prisma } from "@/lib/prisma";
import { hashApiKey, readBearerToken } from "@/lib/server/api-keys";

export class ApiAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

function monthKey() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export async function validateApiKeyAndConsume(headers: Headers) {
  const bearer = readBearerToken(headers.get("authorization"));
  const xApiKey = headers.get("x-api-key");
  const apiKey = bearer || xApiKey;

  if (!apiKey) {
    throw new ApiAuthError("Missing API key", 401);
  }

  const keyHash = hashApiKey(apiKey);

  return prisma.$transaction(async (tx: any) => {
    const key = await tx.apiKey.findUnique({
      where: { keyHash },
      include: { user: true },
    });

    if (!key || !key.isActive) {
      throw new ApiAuthError("Invalid API key", 401);
    }

    const currentMonth = monthKey();
    const usage = await tx.usageRecord.upsert({
      where: { userId_month: { userId: key.userId, month: currentMonth } },
      update: {},
      create: { userId: key.userId, month: currentMonth, count: 0 },
    });

    if (usage.count >= key.user.monthlyLimit) {
      throw new ApiAuthError("Monthly free-tier limit reached", 429);
    }

    const updatedUsage = await tx.usageRecord.update({
      where: { userId_month: { userId: key.userId, month: currentMonth } },
      data: { count: { increment: 1 } },
      select: { count: true },
    });

    await tx.apiKey.update({
      where: { id: key.id },
      data: {
        requests: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    return {
      userId: key.userId,
      plan: key.user.plan,
      monthlyLimit: key.user.monthlyLimit,
      usageCount: updatedUsage.count,
      remaining: Math.max(key.user.monthlyLimit - updatedUsage.count, 0),
      keyName: key.name,
    };
  });
}

export async function getUserUsageSummary(userId: string) {
  const currentMonth = monthKey();

  const [user, usage, keys] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, monthlyLimit: true, createdAt: true },
    }),
    prisma.usageRecord.findUnique({
      where: { userId_month: { userId, month: currentMonth } },
      select: { count: true },
    }),
    prisma.apiKey.count({ where: { userId, isActive: true } }),
  ]);

  if (!user) {
    return null;
  }

  const used = usage?.count ?? 0;
  const limit = user.monthlyLimit;

  return {
    plan: user.plan,
    usage: used,
    limit,
    remaining: Math.max(limit - used, 0),
    activeKeys: keys,
    period: currentMonth,
  };
}
