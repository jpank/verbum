"use client";

import { UserProgress } from "@/lib/types";

export default function StatsBar({ progress }: { progress: UserProgress }) {
  return (
    <div className="mx-4 px-4 py-3 bg-verbum-900/60 rounded-xl flex items-center justify-around text-sm">
      <div className="flex items-center gap-1.5">
        <span className="text-orange-400">🔥</span>
        <span className="font-semibold">{progress.currentStreak}</span>
        <span className="text-verbum-400 text-xs">streak</span>
      </div>
      <div className="w-px h-4 bg-verbum-700" />
      <div className="flex items-center gap-1.5">
        <span className="text-gold-400">★</span>
        <span className="font-semibold">{progress.totalCardsLearned}</span>
        <span className="text-verbum-400 text-xs">learned</span>
      </div>
      <div className="w-px h-4 bg-verbum-700" />
      <div className="flex items-center gap-1.5">
        <span className="text-verbum-300">📚</span>
        <span className="font-semibold">{progress.totalSessions}</span>
        <span className="text-verbum-400 text-xs">sessions</span>
      </div>
    </div>
  );
}
