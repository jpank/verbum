"use client";

import { useState } from "react";

interface MultipleChoiceProps {
  choices: string[];
  onSelect: (choice: string) => void;
  correctAnswer: string;
}

export default function MultipleChoice({
  choices,
  onSelect,
  correctAnswer,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (choice: string) => {
    if (selected) return; // Already answered
    setSelected(choice);
    onSelect(choice);
  };

  const getButtonStyle = (choice: string) => {
    if (!selected) return "bg-verbum-800 border-verbum-700 active:bg-verbum-700";
    if (choice === correctAnswer) return "bg-correct/20 border-correct text-correct";
    if (choice === selected) return "bg-incorrect/20 border-incorrect text-incorrect";
    return "bg-verbum-800/50 border-verbum-700/50 opacity-50";
  };

  return (
    <div className="grid grid-cols-1 gap-2 mt-6">
      {choices.map((choice, i) => (
        <button
          key={i}
          onClick={() => handleSelect(choice)}
          disabled={!!selected}
          className={`${getButtonStyle(choice)} border rounded-xl py-3 px-4 text-left text-sm font-medium transition-all`}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
