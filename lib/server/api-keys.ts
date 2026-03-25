import crypto from "crypto";

const API_KEY_PREFIX = "dai_";

function getEncryptionSecret() {
  const base = process.env.API_KEY_ENCRYPTION_SECRET || process.env.JWT_SECRET;
  if (!base) {
    throw new Error("Missing API_KEY_ENCRYPTION_SECRET or JWT_SECRET");
  }
  return crypto.createHash("sha256").update(base).digest();
}

export function hashApiKey(rawKey: string) {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}

export function generateApiKey() {
  const raw = `${API_KEY_PREFIX}${crypto.randomBytes(24).toString("hex")}`;
  return {
    raw,
    prefix: raw.slice(0, 8),
    lastFour: raw.slice(-4),
    hash: hashApiKey(raw),
  };
}

export function maskApiKey(rawKey: string) {
  if (rawKey.length <= 16) {
    return `${rawKey.slice(0, 4)}...`;
  }
  return `${rawKey.slice(0, 10)}${"•".repeat(Math.max(rawKey.length - 14, 6))}${rawKey.slice(-4)}`;
}

export function encryptApiKey(rawKey: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionSecret(), iv);
  const encrypted = Buffer.concat([cipher.update(rawKey, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptApiKey(payload: string) {
  const [ivHex, authTagHex, encryptedHex] = payload.split(":");
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted API key payload");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionSecret(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

export function readBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader) {
    return null;
  }

  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.slice(7).trim();
  }

  return null;
}
