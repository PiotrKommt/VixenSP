"use client";

import { useCallback, useEffect, useState } from "react";

export type Review = {
  id: string;
  name: string;
  role: string;
  rating: number;
  feedback: string;
  createdAt: number;
};

export const REVIEWS_STORAGE_KEY = "nimbus.reviews";

/** Number of reviews shown on the home wall before the "show all" link appears. */
export const HOME_REVIEW_LIMIT = 3;

/**
 * crypto.randomUUID() is only defined in secure contexts (HTTPS or localhost),
 * so it's unavailable when the dev server is opened over a plain-HTTP LAN IP.
 * This id only needs to be unique within the local list, not cryptographic.
 */
function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function formatReviewDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function loadReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function saveReviews(list: Review[]) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage may be unavailable (private mode), keep the in memory copy */
  }
}

export function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

/**
 * Reviews live in localStorage (per-browser). This hook keeps a component in
 * sync, including across tabs/pages via the `storage` event.
 */
export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setReviews(loadReviews());
    const onStorage = (event: StorageEvent) => {
      if (event.key === REVIEWS_STORAGE_KEY) setReviews(loadReviews());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addReview = useCallback((input: Omit<Review, "id" | "createdAt">) => {
    const review: Review = { ...input, id: makeId(), createdAt: Date.now() };
    const next = [review, ...loadReviews()];
    saveReviews(next);
    setReviews(next);
    return review;
  }, []);

  const removeReview = useCallback((id: string) => {
    const next = loadReviews().filter((review) => review.id !== id);
    saveReviews(next);
    setReviews(next);
  }, []);

  return { reviews, addReview, removeReview };
}
