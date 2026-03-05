"use client";

export default function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-bg">
      <div className="bg-surface rounded-2xl border border-border p-8 text-center shadow-sm">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-xl font-bold text-accent mb-2">All caught up!</h2>
        <p className="text-t-secondary text-sm text-center mb-8">
          No cards due for review. Come back later or try another deck.
        </p>
        <button
          onClick={onBack}
          className="bg-accent text-white font-medium rounded-2xl py-3 px-8 active:scale-95 transition-transform"
        >
          Back to Decks
        </button>
      </div>
    </div>
  );
}
