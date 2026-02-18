'use client';

import { useEffect, useState } from "react";
import {
  QuizSession,
  QuizAnswer,
  QuizStatus,
  loadQuizSession,
  saveQuizSession,
  createNewQuizSession,
  upsertAnswer,
} from "@/lib/quizStorage";

export function useQuizSession() {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const existing = loadQuizSession();
    if (existing) {
      setSession(existing);
    }
    setIsInitialized(true);
  }, []);

  const startNew = () => {
    const next = createNewQuizSession();
    setSession(next);
    saveQuizSession(next);
  };

  const recordAnswer = (answer: QuizAnswer) => {
    setSession((prev) => {
      const base = prev ?? createNewQuizSession();
      const updated = upsertAnswer(base, answer);
      saveQuizSession(updated);
      return updated;
    });
  };

  const setStatus = (status: QuizStatus) => {
    setSession((prev) => {
      if (!prev) {
        const next = {
          ...createNewQuizSession(),
          status,
        };
        saveQuizSession(next);
        return next;
      }
      const updated: QuizSession = {
        ...prev,
        status,
        updatedAt: Date.now(),
      };
      saveQuizSession(updated);
      return updated;
    });
  };

  return {
    session,
    startNew,
    recordAnswer,
    setStatus,
    isInitialized,
  };
}
