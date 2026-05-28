"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { useAuth } from "@/lib/auth";
import { formatRemaining, useCooldown } from "@/lib/cooldown";

const perks = [
  { icon: Clock, label: "30 minute walkthrough made for your product" },
  { icon: CalendarCheck, label: "Pick a time that works and we'll confirm by email" },
  { icon: ShieldCheck, label: "No commitment, no credit card required" },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const letters = parts.slice(0, 2).map((p) => p[0] ?? "").join("");
  return (letters || name.slice(0, 2)).toUpperCase() || "U";
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-ink-500 outline-none transition-colors focus:border-brand-400/70 focus:ring-2 focus:ring-brand-400/30 disabled:opacity-60";

type Status = "idle" | "submitting" | "success" | "error";

export function Booking() {
  const { user } = useAuth();
  const cooldown = useCooldown("booking", user?.email);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      // Name + email come from the signed-in account, not the form.
      name: user.name,
      email: user.email,
      company: String(data.get("company") ?? "").trim(),
      date: String(data.get("date") ?? "").trim(),
      time: String(data.get("time") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      company_url: String(data.get("company_url") ?? ""), // honeypot
    };

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      form.reset();
      cooldown.mark();
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <section id="booking" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Book a call"
          title={<>Book a personalized onboarding demo</>}
          description="Tell us a little about your product and pick a time. We'll follow up by email to lock it in."
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Left: value props */}
          <Reveal className="flex flex-col gap-6">
            <ul className="flex flex-col gap-5">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-accent-500/10 text-brand-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="pt-1.5 text-sm leading-relaxed text-ink-300">{label}</p>
                </li>
              ))}
            </ul>
            <div className="card flex items-center gap-3 p-5">
              <Mail className="h-5 w-5 text-brand-300" />
              <p className="text-sm text-ink-300">
                Requests are emailed straight to our team and answered within 24 hours.
              </p>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.1}>
            <div className="ring-gradient card p-6 sm:p-8">
              {status === "success" ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-500/15 text-brand-300">
                    <CalendarCheck className="h-7 w-7" />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-white">
                    Request received!
                  </h3>
                  <p className="max-w-sm text-sm leading-relaxed text-ink-400">
                    Thanks for booking. We&apos;ve got your request and will reach out by
                    email within 24 hours to confirm a time.
                  </p>
                  {cooldown.active ? (
                    <p className="text-sm text-ink-500">
                      You can book again in {formatRemaining(cooldown.remainingMs)}.
                    </p>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => setStatus("idle")}>
                      Book another time
                    </Button>
                  )}
                </div>
              ) : cooldown.active ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-500/15 text-brand-300">
                    <Clock className="h-7 w-7" />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-white">
                    You&apos;re all set for now
                  </h3>
                  <p className="max-w-sm text-sm leading-relaxed text-ink-400">
                    You&apos;ve already sent a booking request from this account. You can book
                    again in {formatRemaining(cooldown.remainingMs)}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                  {/* Booking is tied to the signed in account, so no email field is needed. */}
                  {user && (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-sm font-semibold text-ink-950">
                        {initials(user.name)}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-xs text-ink-400">Booking as</span>
                        <span className="truncate text-sm font-medium text-white">
                          {user.name} · {user.email}
                        </span>
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company" className="text-xs font-medium text-ink-300">
                      Company <span className="text-ink-500">(optional)</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      disabled={submitting}
                      autoComplete="organization"
                      placeholder="Acme Inc."
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="date" className="text-xs font-medium text-ink-300">
                        Preferred date
                      </label>
                      <input
                        id="date"
                        name="date"
                        type="date"
                        disabled={submitting}
                        className={`${inputClass} [color-scheme:dark]`}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="time" className="text-xs font-medium text-ink-300">
                        Preferred time
                      </label>
                      <input
                        id="time"
                        name="time"
                        type="time"
                        disabled={submitting}
                        className={`${inputClass} [color-scheme:dark]`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-medium text-ink-300">
                      What would you like to cover?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      disabled={submitting}
                      placeholder="A few words about your product and onboarding goals…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Honeypot: hidden from users, catches bots */}
                  <input
                    type="text"
                    name="company_url"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  {status === "error" && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                      {errorMsg}
                    </p>
                  )}

                  <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Request booking
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-ink-500">
                    We&apos;ll only use your details to arrange this call.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
