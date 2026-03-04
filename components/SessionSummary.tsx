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
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div
        className={`text-6xl font-bold mb-2 ${
          isGreat ? "text-gold-400" : "text-verbum-300"
        }`}
      >
        {results.accuracy}%
      </div>
      <p className="text-verbum-400 text-sm mb-8">
        {isGreat ? "Excellent work!" : "Keep practicing!"}
      </p>

      <div className="flex gap-8 mb-10">
        <div className="text-center">
          <div className="text-2xl font-bold text-correct">
            {results.correct}
          </div>
          <div className="text-xs text-verbum-400">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-incorrect">
            {results.incorrect}
          </div>
          <div className="text-xs text-verbum-400">Incorrect</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onRestart}
          className="bg-gold-500 text-verbum-950 font-semibold rounded-xl py-3 active:scale-95 transition-transform"
        >
          Study Again
        </button>
        <button
          onClick={onHome}
          className="bg-verbum-800 text-white font-medium rounded-xl py-3 active:scale-95 transition-transform"
        >
          Home
        </button>
      </div>
    </div>
  );
}
