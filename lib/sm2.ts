import { CardState, Grade } from "./types";

export function sm2(state: CardState, grade: Grade): CardState {
  let { interval, easeFactor, repetitions } = state;

  if (grade < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor =
    easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const now = new Date();
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + interval);
  const nextReview = nextDate.toISOString().split("T")[0];
  const lastReview = now.toISOString().split("T")[0];

  return {
    cardId: state.cardId,
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    repetitions,
    nextReview,
    lastReview,
  };
}

export function createInitialCardState(cardId: string): CardState {
  const today = new Date().toISOString().split("T")[0];
  return {
    cardId,
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReview: today,
  };
}
