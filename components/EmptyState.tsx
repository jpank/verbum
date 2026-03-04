"use client";

export default function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="text-4xl mb-4">✓</div>
      <h2 className="text-xl font-bold text-gold-400 mb-2">All caught up!</h2>
      <p className="text-verbum-400 text-sm text-center mb-8">
        No cards due for review. Come back later or try another deck.
      </p>
      <button
        onClick={onBack}
        className="bg-verbum-800 text-white font-medium rounded-xl py-3 px-8 active:scale-95 transition-transform"
      >
        Back to Decks
      </button>
    </div>
  );
}
