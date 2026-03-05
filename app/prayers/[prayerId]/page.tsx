"use client";

import { useParams, useRouter } from "next/navigation";
import prayersData from "@/data/prayers.json";
import { Prayer } from "@/lib/types";

const prayers = prayersData.prayers as Prayer[];

export default function PrayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const prayerId = params.prayerId as string;

  const prayer = prayers.find((p) => p.id === prayerId);

  if (!prayer) {
    return (
      <div className="flex items-center justify-center h-full bg-bg">
        <div className="text-center">
          <p className="text-t-secondary mb-4">Prayer not found.</p>
          <button
            onClick={() => router.push("/prayers")}
            className="text-accent font-medium"
          >
            ← Back to Prayers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-bg">
      <header className="px-4 pt-[calc(var(--sat)+0.75rem)] pb-2 flex items-center border-b border-border">
        <button
          onClick={() => router.push("/prayers")}
          className="text-accent text-sm font-medium mr-4"
        >
          ← Back
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-t-primary truncate">
            {prayer.titlePl}
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {/* English — shown first */}
        <div className="mt-5">
          <h2 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2 px-1">
            English
          </h2>
          <div className="bg-surface rounded-2xl border border-border p-5">
            <p className="text-[15px] text-t-primary leading-relaxed whitespace-pre-line">
              {prayer.english}
            </p>
          </div>
        </div>

        {/* Polish — shown second */}
        <div className="mt-5">
          <h2 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2 px-1">
            Polski
          </h2>
          <div className="bg-surface rounded-2xl border border-border p-5">
            <p className="text-[15px] text-t-primary leading-relaxed whitespace-pre-line">
              {prayer.polish}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
