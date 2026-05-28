"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
  /** Tailwind size classes applied to each star, e.g. "h-7 w-7". */
  starClassName?: string;
};

/** Accessible 1–5 star rating. Interactive by default; pass readOnly to display. */
export function StarRating({
  value,
  onChange,
  readOnly = false,
  className,
  starClassName = "h-7 w-7",
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  if (readOnly) {
    return (
      <div
        className={cn("inline-flex items-center gap-0.5", className)}
        role="img"
        aria-label={`${value} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              starClassName,
              i < value ? "fill-amber-400 text-amber-400" : "fill-transparent text-ink-600",
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Star rating"
      className={cn("inline-flex items-center gap-1", className)}
      onMouseLeave={() => setHover(0)}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= display;
        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(starValue)}
            onFocus={() => setHover(starValue)}
            onBlur={() => setHover(0)}
            onClick={() => onChange?.(starValue)}
            className="rounded-md p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-400/70"
          >
            <Star
              className={cn(
                starClassName,
                "transition-colors",
                filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-ink-600",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
