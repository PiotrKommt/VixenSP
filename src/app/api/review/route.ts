import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

type ReviewPayload = {
  name?: string;
  role?: string;
  rating?: number;
  feedback?: string;
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
  let body: ReviewPayload;
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
  const role = (body.role ?? "").trim();
  const feedback = (body.feedback ?? "").trim();
  const rating = Number(body.rating);

  if (!name) {
    return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Please pick a rating from 1 to 5 stars." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set, cannot send review email.");
    return NextResponse.json(
      { error: "Review service is not configured. Please try again later." },
      { status: 503 },
    );
  }

  const from = process.env.BOOKING_FROM ?? "VexelSP Reviews <onboarding@resend.dev>";
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const author = role ? `${name} (${role})` : name;

  const text = [
    `Rating: ${stars} (${rating}/5)`,
    `From: ${author}`,
    "",
    "Feedback:",
    feedback || "(none)",
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0d0f18">
      <h2 style="margin:0 0 8px;font-size:18px">New review</h2>
      <div style="font-size:22px;letter-spacing:2px;color:#f59e0b">${stars}
        <span style="font-size:13px;color:#6b7299;letter-spacing:normal">&nbsp;${rating}/5</span>
      </div>
      <p style="margin:12px 0 4px;font-size:14px;color:#6b7299">From</p>
      <p style="margin:0 0 12px;font-size:14px">${escapeHtml(author)}</p>
      <div style="padding-top:12px;border-top:1px solid #e7e9f2">
        <div style="color:#6b7299;font-size:14px;margin-bottom:6px">Feedback</div>
        <div style="white-space:pre-wrap;font-size:14px">${
          feedback ? escapeHtml(feedback) : "<em>(none)</em>"
        }</div>
      </div>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: siteConfig.bookingEmail,
      subject: `New ${rating}-star review from ${name}`,
      text,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "We couldn't submit your review. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("Review send failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
