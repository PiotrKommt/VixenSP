import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

/**
 * Stateless one-time code verification.
 *
 * The server emails a 6-digit code and hands the client an opaque token that is
 * an HMAC of (email + expiry + code) signed with AUTH_SECRET. Nothing is stored
 * server-side: to verify, the client sends the code back with the token and we
 * recompute the HMAC. The code itself can't be derived from the token without
 * the secret, so it can't be brute-forced offline.
 */

const SECRET = process.env.AUTH_SECRET ?? "vexelsp-dev-secret-change-me";
const TTL_MS = 10 * 60 * 1000; // 10 minutes

export function createCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function sign(email: string, exp: number, code: string) {
  return createHmac("sha256", SECRET)
    .update(`${email.toLowerCase()}.${exp}.${code}`)
    .digest("hex");
}

export function issueToken(email: string, code: string) {
  const exp = Date.now() + TTL_MS;
  return `${exp}.${sign(email, exp, code)}`;
}

type VerifyResult = { ok: true } | { ok: false; reason: "invalid" | "expired" | "mismatch" };

export function verifyToken(email: string, code: string, token: string): VerifyResult {
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!expStr || !sig || !Number.isFinite(exp)) return { ok: false, reason: "invalid" };
  if (Date.now() > exp) return { ok: false, reason: "expired" };

  const expected = sign(email, exp, code);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "mismatch" };
  }
  return { ok: true };
}
