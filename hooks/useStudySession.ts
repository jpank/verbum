"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardState,
  StudyMode,
  UserRating,
  RATING_TO_GRADE,
} from "@/lib/types";
import { sm2, createInitialCardState } from "@/lib/sm2";
import { getCardState, saveCardState, saveSession } from "@/lib/storage";
import {
  getProgress,
  saveProgress,
  updateStreakAfterSession,
} from "@/lib/stats";
import { buildStudyQueue, generateChoices } from "@/lib/scheduler";

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

export function useStudySession(deckId: string) {
  const [phase, setPhase] = useState<
    "selecting-mode" | "studying" | "summary"
  >("selecting-mode");
  const [mode, setMode] = useState<StudyMode>("learn");
  const [queue, setQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<
    { cardId: string; correct: boolean }[]
  >([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const deckCards = ALL_CARDS.filter((c) => c.deckId === deckId);

  const currentCard =
    queue.length > 0
      ? ALL_CARDS.find((c) => c.id === queue[currentIndex])
      : undefined;

  useEffect(() => {
    if (deckCards.length === 0) {
      setIsEmpty(true);
    }
    setIsLoading(false);
  }, [deckId]);

  const startSession = useCallback(
    async (selectedMode: StudyMode) => {
      setIsLoading(true);
      const q = await buildStudyQueue(ALL_CARDS, deckId);
      if (q.length === 0) {
        setIsEmpty(true);
        setIsLoading(false);
        return;
      }
      setQueue(q);
      setCurrentIndex(0);
      setResults([]);
      setIsFlipped(false);
      setPhase("studying");
      setMode(selectedMode);

      if (selectedMode !== "learn") {
        const card = ALL_CARDS.find((c) => c.id === q[0])!;
        setChoices(generateChoices(card, ALL_CARDS, selectedMode));
      }

      setIsLoading(false);
    },
    [deckId]
  );

  const flip = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const advance = useCallback(
    async (correct: boolean, cardId: string) => {
      const newResults = [...results, { cardId, correct }];
      setResults(newResults);

      if (currentIndex + 1 >= queue.length) {
        const correctCount = newResults.filter((r) => r.correct).length;
        const incorrectCount = newResults.filter((r) => !r.correct).length;

        await saveSession({
          date: new Date().toISOString().split("T")[0],
          deckId,
          cardsReviewed: newResults.length,
          correct: correctCount,
          incorrect: incorrectCount,
          mode,
        });

        const progress = getProgress();
        const updated = updateStreakAfterSession(progress);
        updated.totalCardsLearned += correctCount;
        saveProgress(updated);

        setPhase("summary");
      } else {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setIsFlipped(false);

        if (mode !== "learn") {
          const nextCard = ALL_CARDS.find(
            (c) => c.id === queue[nextIndex]
          )!;
          setChoices(generateChoices(nextCard, ALL_CARDS, mode));
        }
      }
    },
    [currentIndex, queue, results, deckId, mode]
  );

  const rate = useCallback(
    async (rating: UserRating) => {
      const cardId = queue[currentIndex];
      const grade = RATING_TO_GRADE[rating];

      let state = await getCardState(cardId);
      if (!state) {
        state = createInitialCardState(cardId);
      }

      const newState = sm2(state, grade);
      await saveCardState(newState);

      const correct = grade >= 3;
      await advance(correct, cardId);
    },
    [currentIndex, queue, advance]
  );

  const selectChoice = useCallback(
    async (selected: string) => {
      if (!currentCard) return;
      const correctAnswer =
        mode === "reverse" ? currentCard.polish : currentCard.english;
      const correct = selected === correctAnswer;

      let state = await getCardState(currentCard.id);
      if (!state) state = createInitialCardState(currentCard.id);
      const grade = correct ? 4 : 1;
      const newState = sm2(state, grade as 1 | 4);
      await saveCardState(newState);

      setTimeout(() => advance(correct, currentCard.id), 800);
    },
    [currentCard, mode, advance]
  );

  return {
    phase,
    mode,
    setMode,
    currentCard: currentCard as Card,
    isFlipped,
    flip,
    rate,
    selectChoice,
    choices,
    progress: { current: currentIndex + 1, total: queue.length },
    results: {
      correct: results.filter((r) => r.correct).length,
      incorrect: results.filter((r) => !r.correct).length,
      accuracy:
        results.length > 0
          ? Math.round(
              (results.filter((r) => r.correct).length / results.length) * 100
            )
          : 0,
    },
    startSession,
    isLoading,
    isEmpty,
    deckName:
      deckCards.length > 0
        ? deckId
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : "",
  };
}
