"use client";

import { UserRating } from "@/lib/types";

const ratings: { rating: UserRating; label: string; color: string; hint: string }[] = [
  { rating: "again", label: "Again", color: "bg-red-600 active:bg-red-700", hint: "<1m" },
  { rating: "hard", label: "Hard", color: "bg-orange-600 active:bg-orange-700", hint: "~1d" },
  { rating: "good", label: "Good", color: "bg-emerald-600 active:bg-emerald-700", hint: "~6d" },
  { rating: "easy", label: "Easy", color: "bg-blue-600 active:bg-blue-700", hint: "~15d" },
];

export default function RatingButtons({
  onRate,
}: {
  onRate: (rating: UserRating) => void;
}) {
  return (
    <div className="px-4 pb-[calc(var(--sab)+1rem)] pt-3 bg-verbum-950/90 backdrop-blur">
      <p className="text-center text-verbum-400 text-xs mb-2">
        How well did you know this?
      </p>
      <div className="grid grid-cols-4 gap-2">
        {ratings.map(({ rating, label, color, hint }) => (
          <button
            key={rating}
            onClick={() => onRate(rating)}
            className={`${color} rounded-xl py-3 px-1 text-white font-medium text-sm transition-transform active:scale-95`}
          >
            <div>{label}</div>
            <div className="text-[10px] opacity-70 mt-0.5">{hint}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
