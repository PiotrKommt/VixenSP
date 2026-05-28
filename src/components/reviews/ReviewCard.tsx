"use client";

import { Trash2 } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { formatReviewDate, type Review } from "@/lib/reviews";

type ReviewCardProps = {
  review: Review;
  onRemove?: (id: string) => void;
};

export function ReviewCard({ review, onRemove }: ReviewCardProps) {
  return (
    <div className="card h-full p-5">
      <div className="flex items-center justify-between gap-3">
        <StarRating value={review.rating} readOnly starClassName="h-4 w-4" />
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(review.id)}
            aria-label={`Remove review from ${review.name}`}
            className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-ink-500 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {review.feedback && (
        <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-200">
          {review.feedback}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 pt-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-xs font-semibold text-ink-950">
          {review.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium text-white">{review.name}</span>
          {review.role && <span className="text-xs text-ink-400">{review.role}</span>}
        </span>
        <time className="ml-auto text-xs text-ink-500" dateTime={new Date(review.createdAt).toISOString()}>
          {formatReviewDate(review.createdAt)}
        </time>
      </div>
    </div>
  );
}
