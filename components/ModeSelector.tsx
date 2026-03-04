"use client";

import { StudyMode } from "@/lib/types";

const modes: { mode: StudyMode; icon: string; label: string; desc: string }[] = [
  {
    mode: "learn",
    icon: "🔄",
    label: "Learn",
    desc: "Flip cards and self-rate your knowledge",
  },
  {
    mode: "test",
    icon: "✅",
    label: "Test",
    desc: "Pick the correct English translation",
  },
  {
    mode: "reverse",
    icon: "↔️",
    label: "Reverse",
    desc: "English → Polish for active recall",
  },
];

interface ModeSelectorProps {
  deckName: string;
  onSelect: (mode: StudyMode) => void;
  onBack: () => void;
}

export default function ModeSelector({
  deckName,
  onSelect,
  onBack,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-[calc(var(--sat)+0.75rem)] pb-2">
        <button onClick={onBack} className="text-verbum-400 text-sm">
          ← Back
        </button>
      </div>

      <div className="px-4 mt-4">
        <h2 className="text-xl font-bold">{deckName}</h2>
        <p className="text-verbum-400 text-sm mt-1">Choose study mode</p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 gap-3 pb-16">
        {modes.map(({ mode, icon, label, desc }) => (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className="bg-verbum-900/80 border border-verbum-700 rounded-xl p-5 text-left active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <div className="font-semibold">{label}</div>
                <div className="text-verbum-400 text-xs mt-0.5">{desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
