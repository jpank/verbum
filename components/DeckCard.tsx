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
      className="block bg-verbum-900/80 rounded-xl p-4 active:scale-95 transition-transform"
    >
      <div className="text-2xl mb-2">{deck.icon}</div>
      <h3 className="font-semibold text-sm leading-tight">{deck.name}</h3>
      <p className="text-verbum-400 text-xs mt-1">{deck.cardCount} cards</p>
      {total > 0 && (
        <div className="mt-2 inline-flex items-center gap-1 bg-gold-500/20 text-gold-400 text-xs font-medium px-2 py-0.5 rounded-full">
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
