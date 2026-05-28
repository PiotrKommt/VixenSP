"use client";

import { useCallback, useEffect, useState } from "react";

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

function storageKey(action: string, email: string) {
  return `vexelsp.cooldown.${action}.${email.toLowerCase()}`;
}

export function formatRemaining(ms: number) {
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Per-account rate limit kept in localStorage. After `mark()`, `active` stays
 * true for 24h. Tied to the signed-in email so each account is independent.
 * Note: client-side only (clearing storage bypasses it); a real limit needs a server store.
 */
export function useCooldown(action: string, email: string | undefined) {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!email) {
      setEndsAt(null);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey(action, email));
      const last = raw ? Number(raw) : NaN;
      setEndsAt(Number.isFinite(last) ? last + COOLDOWN_MS : null);
    } catch {
      setEndsAt(null);
    }
  }, [action, email]);

  // Refresh the countdown periodically so it clears itself when it expires.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const mark = useCallback(() => {
    if (!email) return;
    const ts = Date.now();
    try {
      localStorage.setItem(storageKey(action, email), String(ts));
    } catch {
      /* storage unavailable */
    }
    setEndsAt(ts + COOLDOWN_MS);
    setNow(Date.now());
  }, [action, email]);

  const remainingMs = endsAt ? Math.max(0, endsAt - now) : 0;
  return { active: remainingMs > 0, remainingMs, mark };
}
