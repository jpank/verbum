"use client";

import { UserRating } from "@/lib/types";

const ratings: { rating: UserRating; label: string; color: string; hint: string }[] = [
  {
    rating: "again",
    label: "Again",
    color: "bg-incorrect/10 text-incorrect border border-incorrect/20",
    hint: "<1m",
  },
  {
    rating: "hard",
    label: "Hard",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
    hint: "~1d",
  },
  {
    rating: "good",
    label: "Good",
    color: "bg-correct/10 text-correct border border-correct/20",
    hint: "~6d",
  },
  {
    rating: "easy",
    label: "Easy",
    color: "bg-accent-soft text-accent border border-accent/20",
    hint: "~15d",
  },
];

export default function RatingButtons({
  onRate,
}: {
  onRate: (rating: UserRating) => void;
}) {
  return (
    <div className="px-4 pb-[calc(var(--sab)+1rem)] pt-3 bg-surface/90 backdrop-blur-xl border-t border-border">
      <p className="text-center text-t-tertiary text-xs mb-2">
        How well did you know this?
      </p>
      <div className="grid grid-cols-4 gap-2">
        {ratings.map(({ rating, label, color, hint }) => (
          <button
            key={rating}
            onClick={() => onRate(rating)}
            className={`${color} rounded-2xl py-3 px-1 font-medium text-sm transition-all active:scale-95`}
          >
            <div>{label}</div>
            <div className="text-[10px] opacity-70 mt-0.5">{hint}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
