/**
 * Module de Sécurité & Hachage de Mots de Passe (Standard OWASP PBKDF2-HMAC-SHA256)
 * Gère le hachage sécurisé avec Salt individuel par utilisateur et comparaison timing-safe.
 */

// OWASP Recommended Parameters: 100,000 iterations PBKDF2-SHA256
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 256; // 32 bytes key

/**
 * Génère un Salt aléatoire cryptographiquement fort (16 octets)
 */
export function generateSaltHex(): string {
  const array = new Uint8Array(16);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Node.js fallback using crypto module
    const crypto = require("crypto");
    return crypto.randomBytes(16).toString("hex");
  }
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Hache un mot de passe en clair avec un salt hexadécimal via PBKDF2 SHA-256
 * Format de sortie : `pbkdf2:sha256:100000$SALT$HASH_HEX`
 */
export async function hashPassword(password: string, existingSaltHex?: string): Promise<string> {
  const saltHex = existingSaltHex || generateSaltHex();
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Convert hex salt to Uint8Array
  const saltBuffer = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  let derivedKeyHex = "";

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    // Browser Web Crypto API
    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: PBKDF2_ITERATIONS,
        hash: "SHA-256",
      },
      baseKey,
      KEY_LENGTH
    );

    derivedKeyHex = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } else {
    // Node.js fallback
    const crypto = require("crypto");
    const derivedBuffer = crypto.pbkdf2Sync(
      password,
      saltBuffer,
      PBKDF2_ITERATIONS,
      KEY_LENGTH / 8,
      "sha256"
    );
    derivedKeyHex = derivedBuffer.toString("hex");
  }

  return `pbkdf2:sha256:${PBKDF2_ITERATIONS}$${saltHex}$${derivedKeyHex}`;
}

/**
 * Vérifie un mot de passe saisi en clair par rapport au hash PBKDF2 stocké
 */
export async function verifyPassword(password: string, storedHashFormat: string): Promise<boolean> {
  try {
    if (!storedHashFormat || !storedHashFormat.startsWith("pbkdf2:sha256:")) {
      return false;
    }

    const parts = storedHashFormat.split("$");
    if (parts.length !== 3) return false;

    const saltHex = parts[1];
    const computedHashFormat = await hashPassword(password, saltHex);

    // Timing-safe constant-time string comparison to prevent side-channel timing attacks
    return timingSafeCompare(computedHashFormat, storedHashFormat);
  } catch (e) {
    console.error("[Crypto Security] Error verifying password hash:", e);
    return false;
  }
}

/**
 * Comparaison à temps constant (Timing-Safe) pour éviter les attaques par canal auxiliaire
 */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
