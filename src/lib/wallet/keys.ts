import { createWalletKeypair } from "@/lib/hedera/client";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const KEY_STORAGE_PREFIX = "gigpay.wallet.encrypted";
const KEY_VAULT_VERSION = 2; // Updated for multi-chain support
const PBKDF2_ITERATIONS = 250_000;
const VAULT_DB_NAME = "gigpay.wallet.db";
const VAULT_STORE_NAME = "vaults";

/**
 * Multi-chain encrypted key vault
 * Stores both Hedera and Solana keys encrypted with user passphrase
 */
export interface EncryptedKeyVault {
  version: number;
  algorithm: "AES-GCM";
  kdf: "PBKDF2-SHA256";
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
  // Hedera keys (legacy format for backwards compatibility)
  publicKey: string;
  // Multi-chain public keys (new format)
  hederaPublicKey?: string;
  solanaAddress?: string;
  solanaPublicKey?: string;
  createdAt: string;
}

/**
 * Multi-chain key material returned after generation
 */
export interface MultiChainKeyMaterial {
  hedera: {
    privateKey: string;
    publicKey: string;
  };
  solana: {
    privateKey: string; // Base58 encoded
    publicKey: string;  // Base58 encoded (same as address)
    address: string;    // Base58 encoded public key
  };
}

/**
 * Decrypted key material from vault
 */
export interface DecryptedKeyMaterial {
  hedera?: {
    privateKey: string;
    publicKey: string;
  };
  solana?: {
    privateKey: string;
    publicKey: string;
    address: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function assertEncryptedVaultShape(value: unknown): asserts value is EncryptedKeyVault {
  if (!isRecord(value)) {
    throw new Error("Recovery file is not a valid JSON object.");
  }
  if (value.algorithm !== "AES-GCM" || value.kdf !== "PBKDF2-SHA256") {
    throw new Error("Recovery file uses an unsupported encryption format.");
  }
  if (typeof value.version !== "number" || value.version < 1) {
    throw new Error("Recovery file version is invalid.");
  }
  if (typeof value.iterations !== "number" || value.iterations <= 0) {
    throw new Error("Recovery file key-derivation settings are invalid.");
  }
  if (!hasString(value.salt) || !hasString(value.iv) || !hasString(value.ciphertext)) {
    throw new Error("Recovery file is missing encrypted key fields.");
  }
  // publicKey is required for backwards compatibility (Hedera)
  if (!hasString(value.publicKey) || !hasString(value.createdAt)) {
    throw new Error("Recovery file is missing wallet metadata.");
  }
  // v2+ vaults may have solanaAddress but it's optional for migration
}

function toBase64(input: ArrayBuffer | Uint8Array) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

function fromBase64(input: string) {
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function deriveAesKey(passphrase: string, salt: Uint8Array) {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

function storageKey(userId: string) {
  return `${KEY_STORAGE_PREFIX}.${userId}`;
}

function hasIndexedDb() {
  return typeof indexedDB !== "undefined";
}

async function openVaultDb(): Promise<IDBDatabase> {
  if (!hasIndexedDb()) {
    throw new Error("IndexedDB unavailable");
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(VAULT_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(VAULT_STORE_NAME)) {
        db.createObjectStore(VAULT_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open wallet vault database."));
  });
}

async function idbPut(userId: string, vault: EncryptedKeyVault) {
  const db = await openVaultDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE_NAME, "readwrite");
    const store = tx.objectStore(VAULT_STORE_NAME);
    store.put(vault, userId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Failed to store wallet vault."));
    tx.onabort = () => reject(tx.error ?? new Error("Wallet vault store transaction aborted."));
  });
  db.close();
}

async function idbGet(userId: string): Promise<EncryptedKeyVault | null> {
  const db = await openVaultDb();
  const result = await new Promise<unknown>((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE_NAME, "readonly");
    const store = tx.objectStore(VAULT_STORE_NAME);
    const request = store.get(userId);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error ?? new Error("Failed to load wallet vault."));
  });
  db.close();
  if (!result) {
    return null;
  }
  assertEncryptedVaultShape(result);
  return result;
}

async function idbDelete(userId: string) {
  const db = await openVaultDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(VAULT_STORE_NAME, "readwrite");
    const store = tx.objectStore(VAULT_STORE_NAME);
    store.delete(userId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Failed to remove wallet vault."));
    tx.onabort = () => reject(tx.error ?? new Error("Wallet vault delete transaction aborted."));
  });
  db.close();
}

/**
 * Generate Solana keypair
 */
export function generateSolanaKeypair(): { privateKey: string; publicKey: string; address: string } {
  const keypair = Keypair.generate();
  const privateKey = bs58.encode(keypair.secretKey);
  const publicKey = keypair.publicKey.toBase58();
  
  return {
    privateKey,
    publicKey,
    address: publicKey, // On Solana, address = public key
  };
}

/**
 * Generate multi-chain wallet key material (Hedera + Solana)
 */
export async function generateWalletKeyMaterial(): Promise<MultiChainKeyMaterial> {
  // Generate Hedera keypair (ED25519)
  const hederaKeys = await createWalletKeypair();
  
  // Generate Solana keypair (ED25519)
  const solanaKeys = generateSolanaKeypair();
  
  return {
    hedera: {
      privateKey: hederaKeys.privateKey,
      publicKey: hederaKeys.publicKey,
    },
    solana: solanaKeys,
  };
}

/**
 * Legacy function for Hedera-only key generation (backwards compatibility)
 */
export async function generateHederaKeyMaterial() {
  return createWalletKeypair();
}

/**
 * Encrypt multi-chain private keys into a single vault
 */
export async function encryptPrivateKeys(
  keys: MultiChainKeyMaterial, 
  passphrase: string
): Promise<EncryptedKeyVault> {
  if (!passphrase.trim()) {
    throw new Error("Passphrase is required.");
  }

  // Combine keys into a JSON structure for encryption
  const keysJson = JSON.stringify({
    hedera: keys.hedera.privateKey,
    solana: keys.solana.privateKey,
  });

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const derivedKey = await deriveAesKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    new TextEncoder().encode(keysJson),
  );

  return {
    version: KEY_VAULT_VERSION,
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA256",
    iterations: PBKDF2_ITERATIONS,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
    // Legacy field for backwards compatibility
    publicKey: keys.hedera.publicKey,
    // New multi-chain fields
    hederaPublicKey: keys.hedera.publicKey,
    solanaAddress: keys.solana.address,
    solanaPublicKey: keys.solana.publicKey,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Legacy single-key encryption (backwards compatibility)
 */
export async function encryptPrivateKey(privateKey: string, publicKey: string, passphrase: string): Promise<EncryptedKeyVault> {
  if (!passphrase.trim()) {
    throw new Error("Passphrase is required.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const derivedKey = await deriveAesKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    new TextEncoder().encode(privateKey),
  );

  return {
    version: 1, // Legacy version
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA256",
    iterations: PBKDF2_ITERATIONS,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
    publicKey,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Decrypt multi-chain private keys from vault
 */
export async function decryptPrivateKeys(vault: EncryptedKeyVault, passphrase: string): Promise<DecryptedKeyMaterial> {
  const key = await deriveAesKey(passphrase, fromBase64(vault.salt));
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: fromBase64(vault.iv),
      },
      key,
      fromBase64(vault.ciphertext),
    );
    
    const decryptedText = new TextDecoder().decode(decrypted);
    
    // Check if this is a v2 multi-chain vault (JSON with hedera/solana keys)
    if (vault.version >= 2) {
      try {
        const keys = JSON.parse(decryptedText) as { hedera?: string; solana?: string };
        const result: DecryptedKeyMaterial = {};
        
        if (keys.hedera) {
          result.hedera = {
            privateKey: keys.hedera,
            publicKey: vault.hederaPublicKey || vault.publicKey,
          };
        }
        
        if (keys.solana && vault.solanaAddress) {
          result.solana = {
            privateKey: keys.solana,
            publicKey: vault.solanaPublicKey || vault.solanaAddress,
            address: vault.solanaAddress,
          };
        }
        
        return result;
      } catch {
        // If JSON parsing fails, treat as legacy single key
      }
    }
    
    // Legacy v1 vault - single Hedera key
    return {
      hedera: {
        privateKey: decryptedText,
        publicKey: vault.publicKey,
      },
    };
  } catch {
    throw new Error("Invalid passphrase or corrupted recovery file.");
  }
}

/**
 * Legacy single-key decryption (backwards compatibility)
 */
export async function decryptPrivateKey(vault: EncryptedKeyVault, passphrase: string): Promise<string> {
  const key = await deriveAesKey(passphrase, fromBase64(vault.salt));
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: fromBase64(vault.iv),
      },
      key,
      fromBase64(vault.ciphertext),
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error("Invalid passphrase or corrupted recovery file.");
  }
}

export async function storeEncryptedKeyVault(userId: string, vault: EncryptedKeyVault) {
  if (hasIndexedDb()) {
    await idbPut(userId, vault);
    return;
  }
  localStorage.setItem(storageKey(userId), JSON.stringify(vault));
}

export async function loadEncryptedKeyVault(userId: string): Promise<EncryptedKeyVault | null> {
  if (hasIndexedDb()) {
    try {
      const idbVault = await idbGet(userId);
      if (idbVault) {
        return idbVault;
      }
    } catch {
      // continue to localStorage fallback and migration
    }
  }
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    assertEncryptedVaultShape(parsed);
    if (hasIndexedDb()) {
      try {
        await idbPut(userId, parsed);
      } catch {
        // best-effort migration; keep local fallback available
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function clearEncryptedKeyVault(userId: string) {
  if (hasIndexedDb()) {
    try {
      await idbDelete(userId);
      return;
    } catch {
      // continue with fallback cleanup
    }
  }
  localStorage.removeItem(storageKey(userId));
}

export function exportRecoveryJson(vault: EncryptedKeyVault) {
  return JSON.stringify(vault, null, 2);
}

export function parseRecoveryJson(raw: string): EncryptedKeyVault {
  try {
    const parsed = JSON.parse(raw) as unknown;
    assertEncryptedVaultShape(parsed);
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Invalid recovery file format.");
  }
}

export async function importRecoveryJson(userId: string, raw: string): Promise<EncryptedKeyVault> {
  const vault = parseRecoveryJson(raw);
  await storeEncryptedKeyVault(userId, vault);
  return vault;
}

export function downloadRecoveryFile(userId: string, vault: EncryptedKeyVault) {
  const payload = exportRecoveryJson(vault);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `gigpay-wallet-recovery-${userId}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
