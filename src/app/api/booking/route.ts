import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type BookingPayload = {
  name?: string;
  email?: string;
  company?: string;
  date?: string;
  time?: string;
  message?: string;
  /** Honeypot. Real users never fill this. */
  company_url?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: BookingPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Silently accept honeypot hits so bots think they succeeded.
  if (body.company_url) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const company = (body.company ?? "").trim();
  const date = (body.date ?? "").trim();
  const time = (body.time ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set, cannot send booking email.");
    return NextResponse.json(
      { error: "Email service is not configured. Please try again later." },
      { status: 503 },
    );
  }

  const from = process.env.BOOKING_FROM ?? "VexelSP Bookings <onboarding@resend.dev>";

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ...(company ? ([["Company", company]] as [string, string][]) : []),
    ...(date ? ([["Preferred date", date]] as [string, string][]) : []),
    ...(time ? ([["Preferred time", time]] as [string, string][]) : []),
  ];

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    message || "(none)",
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0d0f18">
      <h2 style="margin:0 0 16px;font-size:18px">New booking request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 0;color:#6b7299;width:140px">${escapeHtml(
                k,
              )}</td><td style="padding:6px 0;color:#0d0f18">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e7e9f2">
        <div style="color:#6b7299;font-size:14px;margin-bottom:6px">Message</div>
        <div style="white-space:pre-wrap;font-size:14px">${
          message ? escapeHtml(message) : "<em>(none)</em>"
        }</div>
      </div>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: siteConfig.bookingEmail,
      replyTo: email,
      subject: `Booking request from ${name}`,
      text,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "We couldn't send your request. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("Booking send failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
