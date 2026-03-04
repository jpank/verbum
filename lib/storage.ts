import { openDB, type IDBPDatabase } from "idb";
import { CardState, StudySession } from "./types";

const DB_NAME = "verbum-db";
const DB_VERSION = 1;

interface VerbumDB {
  cardStates: {
    key: string;
    value: CardState;
    indexes: { "by-next-review": string };
  };
  sessions: {
    key: number;
    value: StudySession;
    indexes: { "by-date": string };
  };
}

let dbPromise: Promise<IDBPDatabase<VerbumDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<VerbumDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const cardStore = db.createObjectStore("cardStates", {
          keyPath: "cardId",
        });
        cardStore.createIndex("by-next-review", "nextReview");

        const sessionStore = db.createObjectStore("sessions", {
          autoIncrement: true,
        });
        sessionStore.createIndex("by-date", "date");
      },
    });
  }
  return dbPromise;
}

export async function getCardState(
  cardId: string
): Promise<CardState | undefined> {
  const db = await getDB();
  return db.get("cardStates", cardId);
}

export async function getAllCardStates(): Promise<CardState[]> {
  const db = await getDB();
  return db.getAll("cardStates");
}

export async function saveCardState(state: CardState): Promise<void> {
  const db = await getDB();
  await db.put("cardStates", state);
}

export async function getDueCards(today: string): Promise<CardState[]> {
  const db = await getDB();
  const tx = db.transaction("cardStates", "readonly");
  const index = tx.store.index("by-next-review");
  const range = IDBKeyRange.upperBound(today);
  return index.getAll(range);
}

export async function saveSession(session: StudySession): Promise<void> {
  const db = await getDB();
  await db.add("sessions", session);
}

export async function getAllSessions(): Promise<StudySession[]> {
  const db = await getDB();
  return db.getAll("sessions");
}
