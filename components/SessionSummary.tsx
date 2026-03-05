"use client";

interface SessionSummaryProps {
  results: {
    correct: number;
    incorrect: number;
    accuracy: number;
  };
  onRestart: () => void;
  onHome: () => void;
}

export default function SessionSummary({
  results,
  onRestart,
  onHome,
}: SessionSummaryProps) {
  const isGreat = results.accuracy >= 80;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-bg">
      <div className="bg-surface rounded-2xl border border-border p-8 w-full max-w-xs text-center shadow-sm">
        <div
          className={`text-6xl font-bold mb-2 ${
            isGreat ? "text-accent" : "text-t-secondary"
          }`}
        >
          {results.accuracy}%
        </div>
        <p className="text-t-secondary text-sm mb-8">
          {isGreat ? "Excellent work!" : "Keep practicing!"}
        </p>

        <div className="flex gap-8 justify-center mb-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-correct">
              {results.correct}
            </div>
            <div className="text-xs text-t-tertiary">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-incorrect">
              {results.incorrect}
            </div>
            <div className="text-xs text-t-tertiary">Incorrect</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="bg-accent text-white font-semibold rounded-2xl py-3 active:scale-95 transition-transform"
          >
            Study Again
          </button>
          <button
            onClick={onHome}
            className="bg-surface border border-border text-t-primary font-medium rounded-2xl py-3 active:scale-95 transition-transform"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
