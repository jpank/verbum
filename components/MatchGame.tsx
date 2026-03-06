"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, Grade } from "@/lib/types";
import { sm2, createInitialCardState } from "@/lib/sm2";
import { getCardState, saveCardState, saveSession } from "@/lib/storage";
import {
  getProgress,
  saveProgress,
  updateStreakAfterSession,
} from "@/lib/stats";

const PAIRS_PER_ROUND = 5;
const TOTAL_ROUNDS = 5;

interface MatchPair {
  card: Card;
  matched: boolean;
}

interface MatchGameProps {
  deckCards: Card[];
  deckId: string;
  onComplete: (results: { cardId: string; correct: boolean }[]) => void;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchGame({
  deckCards,
  deckId,
  onComplete,
  onBack,
}: MatchGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [leftColumn, setLeftColumn] = useState<Card[]>([]);
  const [rightColumn, setRightColumn] = useState<Card[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [matchedLeftId, setMatchedLeftId] = useState<string | null>(null);
  const [matchedRightId, setMatchedRightId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [allResults, setAllResults] = useState<
    { cardId: string; correct: boolean }[]
  >([]);
  const [roundComplete, setRoundComplete] = useState(false);

  const pairsPerRound = Math.min(PAIRS_PER_ROUND, deckCards.length);
  const totalRounds = Math.min(
    TOTAL_ROUNDS,
    deckCards.length < PAIRS_PER_ROUND ? 1 : TOTAL_ROUNDS
  );

  const setupRound = useCallback(
    (roundIndex: number) => {
      const shuffled = shuffle(deckCards);
      const roundCards = shuffled.slice(0, pairsPerRound);

      const newPairs: MatchPair[] = roundCards.map((card) => ({
        card,
        matched: false,
      }));

      setPairs(newPairs);
      setLeftColumn(shuffle(roundCards));
      setRightColumn(shuffle(roundCards));
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatchResult(null);
      setMatchedLeftId(null);
      setMatchedRightId(null);
      setIsTransitioning(false);
      setRoundComplete(false);
    },
    [deckCards, pairsPerRound]
  );

  useEffect(() => {
    setupRound(0);
  }, []);

  async function gradeCard(cardId: string, correct: boolean) {
    let state = await getCardState(cardId);
    if (!state) state = createInitialCardState(cardId);
    const grade: Grade = correct ? 4 : 1;
    const newState = sm2(state, grade);
    await saveCardState(newState);
  }

  async function finishGame(finalResults: { cardId: string; correct: boolean }[]) {
    const correctCount = finalResults.filter((r) => r.correct).length;
    const incorrectCount = finalResults.filter((r) => !r.correct).length;

    await saveSession({
      date: new Date().toISOString().split("T")[0],
      deckId,
      cardsReviewed: finalResults.length,
      correct: correctCount,
      incorrect: incorrectCount,
      mode: "match",
    });

    const progress = getProgress();
    const updated = updateStreakAfterSession(progress);
    updated.totalCardsLearned += correctCount;
    saveProgress(updated);

    onComplete(finalResults);
  }

  useEffect(() => {
    if (selectedLeft && selectedRight && !isTransitioning) {
      setIsTransitioning(true);

      const isCorrect = selectedLeft === selectedRight;
      setMatchResult(isCorrect ? "correct" : "incorrect");
      setMatchedLeftId(selectedLeft);
      setMatchedRightId(selectedRight);

      const newResult = { cardId: selectedLeft, correct: isCorrect };
      const updatedResults = [...allResults, newResult];

      gradeCard(selectedLeft, isCorrect);

      if (isCorrect) {
        setTimeout(() => {
          const updatedPairs = pairs.map((p) =>
            p.card.id === selectedLeft ? { ...p, matched: true } : p
          );
          setPairs(updatedPairs);
          setSelectedLeft(null);
          setSelectedRight(null);
          setMatchResult(null);
          setMatchedLeftId(null);
          setMatchedRightId(null);
          setAllResults(updatedResults);
          setIsTransitioning(false);

          const allMatched = updatedPairs.every((p) => p.matched);
          if (allMatched) {
            setRoundComplete(true);
          }
        }, 600);
      } else {
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setMatchResult(null);
          setMatchedLeftId(null);
          setMatchedRightId(null);
          setAllResults(updatedResults);
          setIsTransitioning(false);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight]);

  useEffect(() => {
    if (!roundComplete) return;

    const timer = setTimeout(() => {
      if (currentRound + 1 >= totalRounds) {
        finishGame(allResults);
      } else {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setupRound(nextRound);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [roundComplete]);

  function handleLeftSelect(cardId: string) {
    if (isTransitioning) return;
    const pair = pairs.find((p) => p.card.id === cardId);
    if (pair?.matched) return;
    setSelectedLeft(cardId === selectedLeft ? null : cardId);
  }

  function handleRightSelect(cardId: string) {
    if (isTransitioning) return;
    const pair = pairs.find((p) => p.card.id === cardId);
    if (pair?.matched) return;
    setSelectedRight(cardId === selectedRight ? null : cardId);
  }

  function getItemStyle(
    cardId: string,
    selectedId: string | null,
    matchedId: string | null
  ): string {
    const pair = pairs.find((p) => p.card.id === cardId);

    if (pair?.matched) {
      return "opacity-0 scale-95 pointer-events-none";
    }

    if (matchResult === "correct" && matchedId === cardId) {
      return "bg-correct-soft border-correct text-correct scale-[0.97]";
    }
    if (matchResult === "incorrect" && matchedId === cardId) {
      return "bg-incorrect-soft border-incorrect text-incorrect scale-[0.97] animate-shake";
    }
    if (selectedId === cardId) {
      return "bg-accent-soft border-accent text-accent scale-[0.97]";
    }

    return "bg-surface border-border active:bg-surface-hover active:scale-[0.97]";
  }

  const matchedCount = pairs.filter((p) => p.matched).length;

  return (
    <div className="flex flex-col h-full bg-bg">
      {/* Header */}
      <div className="flex items-center px-4 pt-[calc(var(--sat)+0.75rem)] pb-2">
        <button
          onClick={onBack}
          className="text-accent text-sm font-medium mr-4"
        >
          ← Back
        </button>
        <div className="flex-1 h-1.5 bg-surface-active rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{
              width: `${
                ((currentRound * pairsPerRound + matchedCount) /
                  (totalRounds * pairsPerRound)) *
                100
              }%`,
            }}
          />
        </div>
        <span className="text-t-tertiary text-xs ml-3 tabular-nums">
          {currentRound + 1}/{totalRounds}
        </span>
      </div>

      {/* Round label */}
      <div className="px-4 py-2">
        <p className="text-t-secondary text-sm text-center">
          Tap the matching pairs
        </p>
      </div>

      {/* Matching columns */}
      <div className="flex-1 flex gap-2 px-3 pb-[calc(var(--sab)+1rem)] overflow-y-auto">
        {/* Left column: Polish */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-[10px] text-t-tertiary uppercase tracking-wider text-center mb-0.5 font-semibold">
            Polski
          </div>
          {leftColumn.map((card) => (
            <button
              key={`left-${card.id}`}
              onClick={() => handleLeftSelect(card.id)}
              disabled={isTransitioning || pairs.find((p) => p.card.id === card.id)?.matched}
              className={`${getItemStyle(
                card.id,
                selectedLeft,
                matchedLeftId
              )} border rounded-2xl py-3 px-2 text-[13px] font-medium text-center transition-all duration-300 min-h-[3rem]`}
            >
              {!pairs.find((p) => p.card.id === card.id)?.matched && card.polish}
            </button>
          ))}
        </div>

        {/* Right column: English */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-[10px] text-t-tertiary uppercase tracking-wider text-center mb-0.5 font-semibold">
            English
          </div>
          {rightColumn.map((card) => (
            <button
              key={`right-${card.id}`}
              onClick={() => handleRightSelect(card.id)}
              disabled={isTransitioning || pairs.find((p) => p.card.id === card.id)?.matched}
              className={`${getItemStyle(
                card.id,
                selectedRight,
                matchedRightId
              )} border rounded-2xl py-3 px-2 text-[13px] font-medium text-center transition-all duration-300 min-h-[3rem]`}
            >
              {!pairs.find((p) => p.card.id === card.id)?.matched && card.english}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
