import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createCode, issueToken } from "@/lib/otp";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set, cannot send verification code.");
    return NextResponse.json(
      { error: "Email service is not configured. Please try again later." },
      { status: 503 },
    );
  }

  const code = createCode();
  const token = issueToken(email, code);
  const from = process.env.BOOKING_FROM ?? "VexelSP <onboarding@resend.dev>";
  const greeting = name ? `Hi ${name},` : "Hi,";

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:480px;margin:0 auto;color:#0d0f18">
      <h2 style="margin:0 0 12px;font-size:18px">Verify your email</h2>
      <p style="margin:0 0 16px;font-size:14px;color:#33384f">${greeting} use this code to finish creating your VexelSP account.</p>
      <div style="font-size:34px;font-weight:700;letter-spacing:10px;text-align:center;padding:18px;border:1px solid #e7e9f2;border-radius:14px;background:#f5f6fa">${code}</div>
      <p style="margin:16px 0 0;font-size:13px;color:#6b7299">This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
    </div>
  `;
  const text = `${greeting}\n\nYour VexelSP verification code is: ${code}\n\nIt expires in 10 minutes. If you didn't request it, ignore this email.`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: `Your VexelSP verification code: ${code}`,
      text,
      html,
    });

    if (error) {
      console.error("Resend error (send-code):", error);
      const message = String((error as { message?: string }).message ?? "");
      // Resend test mode can only deliver to the account owner's address.
      if (/testing emails|own email address|verify a domain/i.test(message)) {
        return NextResponse.json(
          {
            error:
              "Verification emails can only be sent to the project owner's address until a sending domain is verified in Resend.",
          },
          { status: 502 },
        );
      }
      return NextResponse.json(
        { error: "We couldn't send the code. Please check the address and try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, token });
  } catch (err) {
    console.error("send-code failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
