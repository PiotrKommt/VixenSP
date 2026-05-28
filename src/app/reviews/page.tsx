"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MessageSquarePlus, MessageSquareText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Footer } from "@/components/layout/Footer";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { averageRating, useReviews } from "@/lib/reviews";

export default function AllReviewsPage() {
  const { reviews, removeReview } = useReviews();
  const count = reviews.length;
  const average = averageRating(reviews);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between">
          <Logo />
          <Button href="/#reviews" variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Button>
        </Container>
      </header>

      <main className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start gap-4">
            <Badge>
              <MessageSquareText className="h-3.5 w-3.5 text-brand-300" />
              Reviews
            </Badge>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What people are saying
            </h1>
            {count > 0 && (
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-semibold text-white">
                  {average.toFixed(1)}
                </span>
                <StarRating value={Math.round(average)} readOnly starClassName="h-5 w-5" />
                <span className="text-sm text-ink-400">
                  {count} {count === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}
          </div>

          {count === 0 ? (
            <div className="card mt-10 flex flex-col items-center gap-4 p-12 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-500/15 text-brand-300">
                <MessageSquarePlus className="h-7 w-7" />
              </span>
              <p className="text-sm text-ink-400">No reviews yet. Be the first to leave one.</p>
              <Button href="/#reviews" size="sm">
                Leave a review
              </Button>
            </div>
          ) : (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {reviews.map((review) => (
                  <motion.li
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <ReviewCard review={review} onRemove={removeReview} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}
