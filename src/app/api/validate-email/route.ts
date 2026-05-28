import { NextResponse } from "next/server";
import { resolveMx } from "node:dns/promises";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common throwaway / disposable email domains we don't accept for sign up.
const DISPOSABLE = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "tempmail.com",
  "temp-mail.org",
  "trashmail.com",
  "getnada.com",
  "sharklasers.com",
  "throwawaymail.com",
  "maildrop.cc",
  "fakeinbox.com",
  "dispostable.com",
  "mailnesia.com",
  "discard.email",
]);

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ valid: false, error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { valid: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const domain = email.split("@")[1];

  if (DISPOSABLE.has(domain)) {
    return NextResponse.json(
      { valid: false, error: "Please use a permanent email address." },
      { status: 400 },
    );
  }

  // Confirm the domain actually exists and accepts mail (has MX records).
  try {
    const records = await resolveMx(domain);
    if (!records || records.length === 0) {
      return NextResponse.json(
        { valid: false, error: "That email domain can't receive mail. Please check for typos." },
        { status: 400 },
      );
    }
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOTFOUND" || code === "ENODATA" || code === "NXDOMAIN") {
      return NextResponse.json(
        { valid: false, error: "That email domain doesn't exist. Please check for typos." },
        { status: 400 },
      );
    }
    // DNS temporarily unavailable: fail open so real users aren't blocked.
  }

  return NextResponse.json({ valid: true });
}
