"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Loader2, MessageSquareText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Reveal } from "@/components/motion/Reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { averageRating, HOME_REVIEW_LIMIT, useReviews } from "@/lib/reviews";
import { useAuth } from "@/lib/auth";
import { formatRemaining, useCooldown } from "@/lib/cooldown";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-ink-500 outline-none transition-colors focus:border-brand-400/70 focus:ring-2 focus:ring-brand-400/30 disabled:opacity-60";

export function Reviews() {
  const { reviews, addReview, removeReview } = useReviews();
  const { user } = useAuth();
  const cooldown = useCooldown("review", user?.email);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const role = String(data.get("role") ?? "").trim();
    const feedback = String(data.get("feedback") ?? "").trim();
    const honeypot = String(data.get("company_url") ?? "");

    if (!name) {
      setErrorMsg("Please add your name.");
      setStatus("error");
      return;
    }
    if (rating < 1) {
      setErrorMsg("Please pick a star rating.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, rating, feedback, company_url: honeypot }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      addReview({ name, role, rating, feedback });
      cooldown.mark();
      form.reset();
      setRating(0);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const submitting = status === "submitting";
  const count = reviews.length;
  const average = averageRating(reviews);
  const visible = reviews.slice(0, HOME_REVIEW_LIMIT);
  const hasMore = count > HOME_REVIEW_LIMIT;

  return (
    <section id="reviews" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Reviews"
          title={<>Rate your experience</>}
          description="Used VexelSP? We'd love your honest feedback. Leave a rating and tell us how it went."
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Review form */}
          <Reveal>
            <div className="ring-gradient card p-6 sm:p-8">
              {cooldown.active ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-500/15 text-brand-300">
                    <Clock className="h-7 w-7" />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-white">
                    Thanks for your feedback!
                  </h3>
                  <p className="max-w-sm text-sm leading-relaxed text-ink-400">
                    You can leave another review from this account in{" "}
                    {formatRemaining(cooldown.remainingMs)}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-ink-300">Your rating</span>
                  <div className="flex items-center gap-3">
                    <StarRating value={rating} onChange={setRating} starClassName="h-8 w-8" />
                    <span className="text-sm text-ink-400">
                      {rating ? `${rating}/5` : "Tap a star"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="r-name" className="text-xs font-medium text-ink-300">
                      Name
                    </label>
                    <input
                      id="r-name"
                      name="name"
                      type="text"
                      required
                      disabled={submitting}
                      autoComplete="name"
                      placeholder="Jane Doe"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="r-role" className="text-xs font-medium text-ink-300">
                      Role / company <span className="text-ink-500">(optional)</span>
                    </label>
                    <input
                      id="r-role"
                      name="role"
                      type="text"
                      disabled={submitting}
                      autoComplete="organization-title"
                      placeholder="PM at Acme"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="r-feedback" className="text-xs font-medium text-ink-300">
                    Your feedback
                  </label>
                  <textarea
                    id="r-feedback"
                    name="feedback"
                    rows={4}
                    disabled={submitting}
                    placeholder="What did you love? What could be better?"
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

                <AnimatePresence mode="wait">
                  {status === "error" && (
                    <motion.p
                      key="err"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="alert"
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                      {errorMsg}
                    </motion.p>
                  )}
                  {status === "success" && (
                    <motion.p
                      key="ok"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-200"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Thanks for the review. It&apos;s been sent!
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button type="submit" size="lg" disabled={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit review"
                  )}
                </Button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Live review wall (latest few) */}
          <Reveal delay={0.1} className="flex flex-col gap-5">
            <div className="card flex items-center justify-between p-5">
              {count > 0 ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl font-semibold text-white">
                      {average.toFixed(1)}
                    </span>
                    <div className="flex flex-col">
                      <StarRating value={Math.round(average)} readOnly starClassName="h-4 w-4" />
                      <span className="mt-0.5 text-xs text-ink-400">
                        {count} {count === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </div>
                  <MessageSquareText className="h-6 w-6 text-ink-500" />
                </>
              ) : (
                <div className="flex items-center gap-3 text-sm text-ink-400">
                  <MessageSquareText className="h-5 w-5 text-brand-300" />
                  No reviews yet. Be the first to leave one!
                </div>
              )}
            </div>

            <ul className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {visible.map((review) => (
                  <motion.li
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <ReviewCard review={review} onRemove={removeReview} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {hasMore && (
              <Button href="/reviews" variant="secondary" className="w-full">
                Show all {count} reviews
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
