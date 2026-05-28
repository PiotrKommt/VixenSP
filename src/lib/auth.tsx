"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AuthProvider = "password" | "google";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: AuthProvider;
};

type StoredUser = AuthUser & { salt: string; passwordHash: string };

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  /** Validates the details, emails a 6-digit code, and returns a verification token. */
  startSignUp: (input: { name: string; email: string; password: string }) => Promise<string>;
  /** Confirms the emailed code, then creates the account and signs in. */
  completeSignUp: (input: {
    name: string;
    email: string;
    password: string;
    token: string;
    code: string;
  }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signInWithGoogle: (input: { email: string; name?: string; picture?: string }) => void;
  signOut: () => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERS_KEY = "nimbus.auth.users";
const SESSION_KEY = "nimbus.auth.session";

const AuthContext = createContext<AuthContextValue | null>(null);

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Fast 53-bit string hash. Used to avoid storing raw passwords in localStorage.
 * This is a demo-grade obfuscation (no real server), NOT secure password storage.
 */
function cyrb53(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function hashPassword(password: string, salt: string) {
  let value = `${salt}::${password}`;
  for (let i = 0; i < 750; i++) {
    value = cyrb53(value, i).toString(16);
  }
  return value;
}

function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function publicUser(user: StoredUser | AuthUser): AuthUser {
  const { id, name, email, picture, provider } = user;
  return { id, name, email, picture, provider };
}

function loadSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProviderComponent({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const session = loadSession();
    setUser(session);
    setStatus(session ? "authenticated" : "unauthenticated");
  }, []);

  const establishSession = useCallback((next: AuthUser) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setUser(next);
    setStatus("authenticated");
  }, []);

  const startSignUp = useCallback<AuthContextValue["startSignUp"]>(
    async ({ name, email, password }) => {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanName) throw new Error("Please enter your name.");
      if (!EMAIL_RE.test(cleanEmail)) throw new Error("Please enter a valid email address.");
      if (password.length < 6) throw new Error("Password must be at least 6 characters.");

      const users = loadUsers();
      if (users.some((u) => u.email === cleanEmail))
        throw new Error("An account with this email already exists.");

      // Server-side check that the email domain is real and can receive mail.
      const check = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      if (!check.ok) {
        const data = (await check.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "We couldn't verify that email. Please try another.");
      }

      // Email a 6-digit code and get back a signed verification token.
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, name: cleanName }),
      });
      const data = (await res.json().catch(() => null)) as
        | { token?: string; error?: string }
        | null;
      if (!res.ok || !data?.token) {
        throw new Error(data?.error ?? "We couldn't send a verification code. Please try again.");
      }
      return data.token;
    },
    [],
  );

  const completeSignUp = useCallback<AuthContextValue["completeSignUp"]>(
    async ({ name, email, password, token, code }) => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = code.trim();
      if (!/^\d{6}$/.test(cleanCode))
        throw new Error("Enter the 6-digit code from your email.");

      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode, token }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "That code didn't work. Please try again.");
      }

      const users = loadUsers();
      const existing = users.find((u) => u.email === cleanEmail);
      if (existing) {
        establishSession(publicUser(existing));
        return;
      }

      const salt = genId();
      const stored: StoredUser = {
        id: genId(),
        name: name.trim(),
        email: cleanEmail,
        provider: "password",
        salt,
        passwordHash: hashPassword(password, salt),
      };
      saveUsers([...users, stored]);
      establishSession(publicUser(stored));
    },
    [establishSession],
  );

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async ({ email, password }) => {
      const cleanEmail = email.trim().toLowerCase();
      const users = loadUsers();
      const found = users.find((u) => u.email === cleanEmail);
      if (!found || found.provider !== "password")
        throw new Error("No account found with this email.");
      if (found.passwordHash !== hashPassword(password, found.salt))
        throw new Error("Incorrect password.");
      establishSession(publicUser(found));
    },
    [establishSession],
  );

  const signInWithGoogle = useCallback<AuthContextValue["signInWithGoogle"]>(
    ({ email, name, picture }) => {
      const cleanEmail = email.trim().toLowerCase();
      const users = loadUsers();
      const existing = users.find((u) => u.email === cleanEmail);

      if (existing) {
        const updated: StoredUser = {
          ...existing,
          name: name?.trim() || existing.name,
          picture: picture ?? existing.picture,
        };
        saveUsers(users.map((u) => (u.email === cleanEmail ? updated : u)));
        establishSession(publicUser(updated));
        return;
      }

      const stored: StoredUser = {
        id: genId(),
        name: name?.trim() || cleanEmail,
        email: cleanEmail,
        picture,
        provider: "google",
        salt: "",
        passwordHash: "",
      };
      saveUsers([...users, stored]);
      establishSession(publicUser(stored));
    },
    [establishSession],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, startSignUp, completeSignUp, signIn, signInWithGoogle, signOut }),
    [user, status, startSignUp, completeSignUp, signIn, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProviderComponent");
  return ctx;
}
