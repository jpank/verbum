import { Card, StudyMode } from "./types";
import { getCardState, getDueCards } from "./storage";

const NEW_CARDS_PER_SESSION = 10;
const MAX_CARDS_PER_SESSION = 20;

export async function buildStudyQueue(
  allCards: Card[],
  deckId: string
): Promise<string[]> {
  const deckCards = allCards.filter((c) => c.deckId === deckId);
  const today = new Date().toISOString().split("T")[0];

  const dueStates = await getDueCards(today);
  const dueCardIds = new Set(dueStates.map((s) => s.cardId));

  const dueCards: string[] = [];
  const newCards: string[] = [];

  for (const card of deckCards) {
    const state = await getCardState(card.id);
    if (!state) {
      newCards.push(card.id);
    } else if (dueCardIds.has(card.id)) {
      dueCards.push(card.id);
    }
  }

  const queue = [...dueCards, ...newCards.slice(0, NEW_CARDS_PER_SESSION)];

  // Shuffle
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  return queue.slice(0, MAX_CARDS_PER_SESSION);
}

export function generateChoices(
  correctCard: Card,
  allCards: Card[],
  mode: StudyMode
): string[] {
  const isReverse = mode === "reverse";
  const correctAnswer = isReverse ? correctCard.polish : correctCard.english;

  // Prefer same-deck distractors for more meaningful choices
  const sameDeck = allCards.filter(
    (c) => c.deckId === correctCard.deckId && c.id !== correctCard.id
  );
  const otherDeck = allCards.filter(
    (c) => c.deckId !== correctCard.deckId
  );

  const shuffledSame = [...sameDeck].sort(() => Math.random() - 0.5);
  const shuffledOther = [...otherDeck].sort(() => Math.random() - 0.5);
  const pool = [...shuffledSame, ...shuffledOther];

  const wrongAnswers = pool
    .slice(0, 3)
    .map((c) => (isReverse ? c.polish : c.english));

  const choices = [correctAnswer, ...wrongAnswers];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return choices;
}
