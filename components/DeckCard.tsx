"use client";

import Link from "next/link";
import { Deck } from "@/lib/types";

interface DeckCardProps {
  deck: Deck;
  dueCount: number;
  newCount: number;
}

export default function DeckCard({ deck, dueCount, newCount }: DeckCardProps) {
  const total = dueCount + newCount;

  return (
    <Link
      href={`/study/${deck.id}`}
      className="block bg-surface rounded-2xl border border-border p-4 active:scale-95 active:bg-surface-hover transition-all"
    >
      <div className="text-2xl mb-2">{deck.icon}</div>
      <h3 className="font-semibold text-sm text-t-primary leading-tight">
        {deck.name}
      </h3>
      <p className="text-t-tertiary text-xs mt-1">{deck.cardCount} cards</p>
      {total > 0 && (
        <div className="mt-2 inline-flex items-center gap-1 bg-accent-soft text-accent text-xs font-medium px-2 py-0.5 rounded-full">
          {total} to study
        </div>
      )}
      {total === 0 && dueCount === 0 && (
        <div className="mt-2 inline-flex items-center gap-1 text-correct text-xs font-medium">
          ✓ Up to date
        </div>
      )}
    </Link>
  );
}
