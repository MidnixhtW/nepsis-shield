export type EncryptedBlob = {
  v: 1;
  alg: "AES-GCM";
  kdf: "PBKDF2";
  iter: number;
  saltB64: string;
  ivB64: string;
  ctB64: string;
};

const ITERATIONS = 210_000;

function enc() {
  return new TextEncoder();
}

function dec() {
  return new TextDecoder();
}

function bytesToB64(bytes: Uint8Array) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function b64ToBytes(b64: string) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(passphrase: string, salt: Uint8Array) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptString(
  plaintext: string,
  passphrase: string,
): Promise<EncryptedBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc().encode(plaintext),
  );

  return {
    v: 1,
    alg: "AES-GCM",
    kdf: "PBKDF2",
    iter: ITERATIONS,
    saltB64: bytesToB64(salt),
    ivB64: bytesToB64(iv),
    ctB64: bytesToB64(new Uint8Array(ct)),
  };
}

export async function decryptString(
  blob: EncryptedBlob,
  passphrase: string,
): Promise<string> {
  const salt = b64ToBytes(blob.saltB64);
  const iv = b64ToBytes(blob.ivB64);
  const ct = b64ToBytes(blob.ctB64);
  const key = await deriveKey(passphrase, salt);

  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ct,
  );

  return dec().decode(pt);
}

export async function encryptJson(
  obj: unknown,
  passphrase: string,
): Promise<EncryptedBlob> {
  return encryptString(JSON.stringify(obj), passphrase);
}

export async function decryptJson<T>(
  blob: EncryptedBlob,
  passphrase: string,
): Promise<T> {
  const raw = await decryptString(blob, passphrase);
  return JSON.parse(raw) as T;
}
