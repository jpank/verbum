"use client";

import { UserProgress } from "@/lib/types";

export default function StatsBar({ progress }: { progress: UserProgress }) {
  return (
    <div className="mx-4 px-4 py-3 bg-surface rounded-2xl border border-border flex items-center justify-around text-sm">
      <div className="flex items-center gap-1.5">
        <span className="text-base">🔥</span>
        <span className="font-semibold text-t-primary">{progress.currentStreak}</span>
        <span className="text-t-tertiary text-xs">streak</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-1.5">
        <span className="text-base">⭐</span>
        <span className="font-semibold text-t-primary">{progress.totalCardsLearned}</span>
        <span className="text-t-tertiary text-xs">learned</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-1.5">
        <span className="text-base">📚</span>
        <span className="font-semibold text-t-primary">{progress.totalSessions}</span>
        <span className="text-t-tertiary text-xs">sessions</span>
      </div>
    </div>
  );
}
