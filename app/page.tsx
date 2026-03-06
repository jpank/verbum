"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DeckCard from "@/components/DeckCard";
import StatsBar from "@/components/StatsBar";
import InstallPrompt from "@/components/InstallPrompt";
import ThemeToggle from "@/components/ThemeToggle";
import decksData from "@/data/decks.json";
import { Card, Deck, UserProgress } from "@/lib/types";
import { getProgress } from "@/lib/stats";
import { getAllCardStates } from "@/lib/storage";

import biblicalNouns from "@/data/cards/biblical-nouns.json";
import biblicalVerbs from "@/data/cards/biblical-verbs.json";
import liturgicalPhrases from "@/data/cards/liturgical-phrases.json";
import lentVocabulary from "@/data/cards/lent-vocabulary.json";
import massResponses from "@/data/cards/mass-responses.json";
import identityAndJourney from "@/data/cards/identity-and-journey.json";
import confessionAndMercy from "@/data/cards/confession-and-mercy.json";
import faithAndWitness from "@/data/cards/faith-and-witness.json";
import familyAndParenting from "@/data/cards/family-and-parenting.json";
import worshipAndAdoration from "@/data/cards/worship-and-adoration.json";
import generalReligious from "@/data/cards/general-religious.json";
import retreatPhrases from "@/data/cards/retreat-phrases.json";

const ALL_CARDS: Card[] = [
  ...(biblicalNouns.cards as Card[]),
  ...(biblicalVerbs.cards as Card[]),
  ...(liturgicalPhrases.cards as Card[]),
  ...(lentVocabulary.cards as Card[]),
  ...(massResponses.cards as Card[]),
  ...(identityAndJourney.cards as Card[]),
  ...(confessionAndMercy.cards as Card[]),
  ...(faithAndWitness.cards as Card[]),
  ...(familyAndParenting.cards as Card[]),
  ...(worshipAndAdoration.cards as Card[]),
  ...(generalReligious.cards as Card[]),
  ...(retreatPhrases.cards as Card[]),
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
    <div className="flex flex-col h-full bg-bg">
      <header className="px-4 pt-[calc(var(--sat)+1rem)] pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-accent">Verbum</h1>
          <p className="text-sm text-t-secondary mt-1">
            Biblical Vocabulary · Polish ↔ English
          </p>
        </div>
        <div className="mt-1">
          <ThemeToggle />
        </div>
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

        <div className="mt-6">
          <Link
            href="/prayers"
            className="flex items-center gap-4 bg-surface rounded-2xl border border-border p-4 active:scale-[0.98] active:bg-surface-hover transition-all"
          >
            <span className="text-2xl">🙏</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[15px] text-t-primary">
                Prayers
              </h3>
              <p className="text-t-secondary text-xs mt-0.5">
                Quick reference for translating — Polish & English
              </p>
            </div>
            <span className="text-t-tertiary text-sm">›</span>
          </Link>
        </div>
      </div>

      <InstallPrompt />
    </div>
  );
}
