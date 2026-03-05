"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import prayersData from "@/data/prayers.json";
import { Prayer } from "@/lib/types";

const prayers = prayersData.prayers as Prayer[];

const categoryLabels: Record<string, string> = {
  essential: "Essential Prayers",
  creed: "Creeds",
  mass: "Holy Mass",
  marian: "Marian Prayers",
  devotion: "Devotional Prayers",
  lenten: "Lenten Prayers",
};

const categoryOrder = ["essential", "mass", "creed", "marian", "lenten", "devotion"];

function groupByCategory(prayers: Prayer[]) {
  const groups: Record<string, Prayer[]> = {};
  for (const prayer of prayers) {
    if (!groups[prayer.category]) {
      groups[prayer.category] = [];
    }
    groups[prayer.category].push(prayer);
  }
  return groups;
}

export default function PrayersPage() {
  const router = useRouter();
  const grouped = groupByCategory(prayers);

  return (
    <div className="flex flex-col h-full bg-bg">
      <header className="px-4 pt-[calc(var(--sat)+0.75rem)] pb-2 flex items-center">
        <button
          onClick={() => router.push("/")}
          className="text-accent text-sm font-medium mr-4"
        >
          ← Back
        </button>
        <h1 className="text-lg font-bold text-t-primary">Prayers</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {categoryOrder.map((cat) => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          return (
            <div key={cat} className="mt-5 first:mt-3">
              <h2 className="text-xs font-semibold text-t-tertiary uppercase tracking-wider mb-2 px-1">
                {categoryLabels[cat] || cat}
              </h2>
              <div className="bg-surface rounded-2xl border border-border overflow-hidden divide-y divide-border">
                {items.map((prayer) => (
                  <Link
                    key={prayer.id}
                    href={`/prayers/${prayer.id}`}
                    className="flex items-center justify-between px-4 py-3 active:bg-surface-hover transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-t-primary leading-snug truncate">
                        {prayer.titlePl}
                      </p>
                      <p className="text-[13px] text-t-secondary leading-snug mt-0.5 truncate">
                        {prayer.titleEn}
                      </p>
                    </div>
                    <span className="text-t-tertiary text-sm ml-3 shrink-0">›</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
