const SALT_KEY = "njirlah_salt_v2";
const LEGACY_STORAGE_KEY = "njirlah_or_key";

async function getBrowserFingerprint(): Promise<string> {
  return [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");
}

async function deriveKey(passphrase: string): Promise<CryptoKey> {
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
    { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptValue(value: string, storageKey: string): Promise<void> {
  const passphrase = await getBrowserFingerprint();
  const key = await deriveKey(passphrase);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(value),
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  localStorage.setItem(storageKey, btoa(String.fromCharCode(...combined)));
}

export async function decryptValue(storageKey: string): Promise<string | null> {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return null;

  try {
    const passphrase = await getBrowserFingerprint();
    const key = await deriveKey(passphrase);
    const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}

export function clearStorageKey(storageKey: string): void {
  localStorage.removeItem(storageKey);
}

export function hasStoredValue(storageKey: string): boolean {
  return localStorage.getItem(storageKey) !== null;
}

export async function encryptApiKey(apiKey: string): Promise<void> {
  return encryptValue(apiKey, LEGACY_STORAGE_KEY);
}

export async function decryptApiKey(): Promise<string | null> {
  const fromLegacy = await decryptValue(LEGACY_STORAGE_KEY);
  if (fromLegacy) return fromLegacy;
  const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
  return raw ?? null;
}

export function clearApiKey(): void {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.removeItem("njirlah_salt");
}

export function hasStoredApiKey(): boolean {
  return localStorage.getItem(LEGACY_STORAGE_KEY) !== null;
}
