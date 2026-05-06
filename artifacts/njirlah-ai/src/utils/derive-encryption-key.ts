/**
 * Derives a CryptoKey from browser-unique characteristics using PBKDF2 + AES-GCM.
 * The resulting key is used client-side only for encrypting the OpenRouter API key.
 */

const SALT_KEY = "njirlah_salt";

export async function getBrowserFingerprint(): Promise<string> {
  return [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");
}

export async function deriveEncryptionKey(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  let salt = localStorage.getItem(SALT_KEY);
  if (!salt) {
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    salt = btoa(String.fromCharCode(...saltBytes));
    localStorage.setItem(SALT_KEY, salt);
  }

  const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltBytes, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
