import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/otp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: string; code?: string; token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const code = String(body.code ?? "").trim();
  const token = String(body.token ?? "");

  if (!email || !token) {
    return NextResponse.json({ error: "Missing verification details." }, { status: 400 });
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code from your email." }, { status: 400 });
  }

  const result = verifyToken(email, code, token);
  if (!result.ok) {
    const message =
      result.reason === "expired"
        ? "That code has expired. Please request a new one."
        : "That code is incorrect. Please check and try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
