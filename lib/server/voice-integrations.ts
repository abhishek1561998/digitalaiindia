/**
 * voice-integrations.ts — server helpers for per-user "bring your own key"
 * TTS provider connections (Sarvam / ElevenLabs) configured from the
 * dashboard Voice tab.
 *
 * The decrypted provider key never leaves the server; the public TTS endpoint
 * asks getActiveIntegration() for the calling user's chosen provider+key and
 * hands it to synthesize().
 */

import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/server/api-keys";
import type { ResolvedProvider, TtsProviderName } from "@/lib/server/tts-providers";

/**
 * Resolve the user's currently-active integration into a usable provider+key.
 * Returns null when the user hasn't connected one (caller falls back to env)
 * or when the stored key can't be decrypted (e.g. encryption secret rotated).
 */
export async function getActiveIntegration(
  userId: string
): Promise<ResolvedProvider | null> {
  const row = await prisma.voiceIntegration.findFirst({
    where: { userId, isActive: true },
  });
  if (!row) return null;

  try {
    const apiKey = decryptApiKey(row.encryptedKey);
    return {
      provider: row.provider as TtsProviderName,
      apiKey,
      settings: (row.settings as Record<string, any> | null) || null,
    };
  } catch {
    return null;
  }
}
