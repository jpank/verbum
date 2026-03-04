"use client";

import { useEffect, useState } from "react";
import DeckCard from "@/components/DeckCard";
import StatsBar from "@/components/StatsBar";
import InstallPrompt from "@/components/InstallPrompt";
import decksData from "@/data/decks.json";
import { Card, Deck, UserProgress } from "@/lib/types";
import { getProgress } from "@/lib/stats";
import { getAllCardStates } from "@/lib/storage";

import biblicalNouns from "@/data/cards/biblical-nouns.json";
import biblicalVerbs from "@/data/cards/biblical-verbs.json";
import liturgicalPhrases from "@/data/cards/liturgical-phrases.json";
import lentVocabulary from "@/data/cards/lent-vocabulary.json";
import massResponses from "@/data/cards/mass-responses.json";

const ALL_CARDS: Card[] = [
  ...(biblicalNouns.cards as Card[]),
  ...(biblicalVerbs.cards as Card[]),
  ...(liturgicalPhrases.cards as Card[]),
  ...(lentVocabulary.cards as Card[]),
  ...(massResponses.cards as Card[]),
];

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress>({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: "",
    totalCardsLearned: 0,
    totalSessions: 0,
  });
  const [dueCounts, setDueCounts] = useState<Record<string, number>>({});
  const [newCounts, setNewCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setProgress(getProgress());

    async function loadCounts() {
      const allStates = await getAllCardStates();
      const reviewedIds = new Set(allStates.map((s) => s.cardId));
      const today = new Date().toISOString().split("T")[0];

      const due: Record<string, number> = {};
      const fresh: Record<string, number> = {};

      for (const card of ALL_CARDS) {
        const state = allStates.find((s) => s.cardId === card.id);
        if (!state) {
          fresh[card.deckId] = (fresh[card.deckId] || 0) + 1;
        } else if (state.nextReview <= today) {
          due[card.deckId] = (due[card.deckId] || 0) + 1;
        }
      }

      setDueCounts(due);
      setNewCounts(fresh);
    }

    loadCounts();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 pt-[calc(var(--sat)+1rem)] pb-4">
        <h1 className="text-2xl font-bold text-gold-400">Verbum</h1>
        <p className="text-sm text-verbum-300 mt-1">
          Biblical Vocabulary · Polish ↔ English
        </p>
      </header>

      <StatsBar progress={progress} />

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="grid grid-cols-2 gap-3 mt-4">
          {(decksData.decks as Deck[]).map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              dueCount={dueCounts[deck.id] || 0}
              newCount={newCounts[deck.id] || 0}
            />
          ))}
        </div>
      </div>

      <InstallPrompt />
    </div>
  );
}
