export type QuizStatus = "in_progress" | "completed";

export type QuizAnswer = {
  id: string;
  value: unknown;
};

export type QuizSession = {
  id: string;
  startedAt: number;
  updatedAt: number;
  status: QuizStatus;
  answers: QuizAnswer[];
};

const STORAGE_KEY = "k9cupid_quiz_session";
const TTL_MS = 24 * 60 * 60 * 1000;

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadQuizSession(): QuizSession | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as QuizSession;
    if (!parsed || typeof parsed.startedAt !== "number") {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const now = Date.now();
    if (now - parsed.startedAt > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveQuizSession(session: QuizSession) {
  if (!isBrowser()) {
    return;
  }

  try {
    const payload: QuizSession = {
      ...session,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    return;
  }
}

export function clearQuizSession() {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}

export function createNewQuizSession(): QuizSession {
  const now = Date.now();
  return {
    id: `quiz-${now}`,
    startedAt: now,
    updatedAt: now,
    status: "in_progress",
    answers: [],
  };
}

export function upsertAnswer(
  session: QuizSession,
  answer: QuizAnswer
): QuizSession {
  const existingIndex = session.answers.findIndex(
    (item) => item.id === answer.id
  );

  if (existingIndex === -1) {
    return {
      ...session,
      updatedAt: Date.now(),
      answers: [...session.answers, answer],
    };
  }

  const updatedAnswers = [...session.answers];
  updatedAnswers[existingIndex] = answer;

  return {
    ...session,
    updatedAt: Date.now(),
    answers: updatedAnswers,
  };
}

