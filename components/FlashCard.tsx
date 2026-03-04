"use client";

import { Card, StudyMode } from "@/lib/types";

interface FlashCardProps {
  card: Card;
  isFlipped: boolean;
  mode: StudyMode;
  onFlip?: () => void;
}

export default function FlashCard({
  card,
  isFlipped,
  mode,
  onFlip,
}: FlashCardProps) {
  const front = mode === "reverse" ? card.english : card.polish;
  const back = mode === "reverse" ? card.polish : card.english;
  const frontLabel = mode === "reverse" ? "English" : "Polski";
  const backLabel = mode === "reverse" ? "Polski" : "English";

  return (
    <div
      className="card-flip w-full max-w-sm mx-auto cursor-pointer"
      onClick={onFlip}
      style={{ minHeight: "240px" }}
    >
      <div className={`card-flip-inner relative w-full h-60 ${isFlipped ? "flipped" : ""}`}>
        {/* Front */}
        <div className="card-face absolute inset-0 bg-verbum-800 rounded-2xl border border-verbum-700 flex flex-col items-center justify-center p-6">
          <span className="text-verbum-400 text-xs uppercase tracking-wider mb-3">
            {frontLabel}
          </span>
          <span className="text-2xl font-bold text-center leading-relaxed">
            {front}
          </span>
          {!isFlipped && mode === "learn" && (
            <span className="text-verbum-500 text-xs mt-4">Tap to reveal</span>
          )}
        </div>

        {/* Back */}
        <div className="card-face card-back absolute inset-0 bg-verbum-800 rounded-2xl border border-gold-500/30 flex flex-col items-center justify-center p-6">
          <span className="text-gold-400 text-xs uppercase tracking-wider mb-3">
            {backLabel}
          </span>
          <span className="text-2xl font-bold text-center text-gold-300 leading-relaxed">
            {back}
          </span>
          {card.hint && (
            <span className="text-verbum-400 text-xs mt-3 italic">
              {card.hint}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
