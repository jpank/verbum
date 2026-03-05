"use client";

import { useParams, useRouter } from "next/navigation";
import { useStudySession } from "@/hooks/useStudySession";
import ModeSelector from "@/components/ModeSelector";
import FlashCard from "@/components/FlashCard";
import RatingButtons from "@/components/RatingButtons";
import MultipleChoice from "@/components/MultipleChoice";
import ProgressBar from "@/components/ProgressBar";
import SessionSummary from "@/components/SessionSummary";
import EmptyState from "@/components/EmptyState";
import { StudyMode } from "@/lib/types";

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const {
    phase,
    mode,
    currentCard,
    isFlipped,
    flip,
    rate,
    selectChoice,
    choices,
    progress,
    results,
    startSession,
    isLoading,
    isEmpty,
    deckName,
  } = useStudySession(deckId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-bg">
        <div className="text-t-secondary">Loading...</div>
      </div>
    );
  }

  if (isEmpty) {
    return <EmptyState onBack={() => router.push("/")} />;
  }

  if (phase === "selecting-mode") {
    return (
      <ModeSelector
        deckName={deckName}
        onSelect={(m: StudyMode) => startSession(m)}
        onBack={() => router.push("/")}
      />
    );
  }

  if (phase === "summary") {
    return (
      <SessionSummary
        results={results}
        onRestart={() => startSession(mode)}
        onHome={() => router.push("/")}
      />
    );
  }

  if (!currentCard) {
    return <EmptyState onBack={() => router.push("/")} />;
  }

  return (
    <div className="flex flex-col h-full bg-bg">
      <div className="flex items-center px-4 pt-[calc(var(--sat)+0.75rem)] pb-2">
        <button
          onClick={() => router.push("/")}
          className="text-accent text-sm font-medium mr-4"
        >
          ← Back
        </button>
        <ProgressBar current={progress.current} total={progress.total} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        {mode === "learn" ? (
          <FlashCard
            card={currentCard}
            isFlipped={isFlipped}
            mode={mode}
            onFlip={flip}
          />
        ) : (
          <div className="w-full max-w-sm">
            <FlashCard
              card={currentCard}
              isFlipped={false}
              mode={mode}
            />
            <MultipleChoice
              key={currentCard.id}
              choices={choices}
              onSelect={selectChoice}
              correctAnswer={
                mode === "reverse"
                  ? currentCard.polish
                  : currentCard.english
              }
            />
          </div>
        )}
      </div>

      {mode === "learn" && isFlipped && <RatingButtons onRate={rate} />}
    </div>
  );
}
