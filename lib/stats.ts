import { UserProgress } from "./types";

const PROGRESS_KEY = "verbum-progress";

export function getProgress(): UserProgress {
  if (typeof window === "undefined") {
    return defaultProgress();
  }
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return defaultProgress();
  return JSON.parse(raw);
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function defaultProgress(): UserProgress {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: "",
    totalCardsLearned: 0,
    totalSessions: 0,
  };
}

export function updateStreakAfterSession(
  progress: UserProgress
): UserProgress {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  let newStreak = progress.currentStreak;

  if (progress.lastStudyDate === today) {
    // Already studied today
  } else if (progress.lastStudyDate === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  return {
    ...progress,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, progress.longestStreak),
    lastStudyDate: today,
    totalSessions: progress.totalSessions + 1,
  };
}
