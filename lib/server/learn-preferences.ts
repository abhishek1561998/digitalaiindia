import { prisma } from "@/lib/prisma";
import { DEFAULT_PREFERENCES, type Preferences } from "@/lib/learn/preferences";

/** A learner's preferences, with defaults filled in for anything unset. */
export async function getPreferences(userId: string | null): Promise<Preferences> {
  if (!userId) return DEFAULT_PREFERENCES;
  const row = await prisma.learnPreferences.findUnique({ where: { userId } });
  if (!row) return DEFAULT_PREFERENCES;
  // Spreading the row over the defaults keeps a newly added preference
  // working before every existing row has been backfilled.
  const { id: _id, userId: _u, createdAt: _c, updatedAt: _up, ...prefs } = row;
  return { ...DEFAULT_PREFERENCES, ...prefs } as Preferences;
}
