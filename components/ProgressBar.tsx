"use client";

export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex-1 flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-verbum-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-verbum-400 tabular-nums">
        {current}/{total}
      </span>
    </div>
  );
}
