export interface Card {
  id: string;
  deckId: string;
  polish: string;
  english: string;
  hint?: string;
}

export interface CardState {
  cardId: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: string;
  lastReview?: string;
}

export interface Deck {
  id: string;
  name: string;
  namePl: string;
  category: "vocabulary" | "prayer" | "mass";
  icon: string;
  description: string;
  cardCount: number;
}

export interface StudySession {
  date: string;
  deckId: string;
  cardsReviewed: number;
  correct: number;
  incorrect: number;
  mode: StudyMode;
}

export type StudyMode = "learn" | "test" | "reverse";

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  totalCardsLearned: number;
  totalSessions: number;
}

export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

export type UserRating = "again" | "hard" | "good" | "easy";

export const RATING_TO_GRADE: Record<UserRating, Grade> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

export interface Prayer {
  id: string;
  titlePl: string;
  titleEn: string;
  category: string;
  english: string;
  polish: string;
}
