import SecureLS from "secure-ls";
import { env } from "../config/env";

/**
 * secure-ls is obfuscation, not security. Any XSS on this origin can still
 * read these tokens. Treat VITE_STORAGE_SECRET as a namespace key, not a
 * secret, and plan to migrate tokens to httpOnly cookies when the backend
 * supports it.
 */
const ls = new SecureLS({
  encodingType: "aes",
  isCompression: false,
  encryptionSecret: env.storageSecret,
  encryptionNamespace: env.storageNamespace,
});

export const storage = {
  get<T>(key: string): T | null {
    try {
      const v = ls.get(key);
      return v === "" || v == null ? null : (v as T);
    } catch {
      ls.remove(key);
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    ls.set(key, value);
  },
  remove(key: string): void {
    ls.remove(key);
  },
  clear(): void {
    ls.removeAll();
  },
};

export const STORAGE_KEYS = {
  accessToken: "auth.access",
  refreshToken: "auth.refresh",
  user: "auth.user",
  activeRole: "auth.activeRole",
} as const;
