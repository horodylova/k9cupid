"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  activityLevelQuestion,
  activeDaysQuestion,
  activeImportanceQuestion,
  childrenQuestion,
  droolingToleranceQuestion,
  groomingTimeQuestion,
  hairToleranceQuestion,
  homeTypeQuestion,
  noiseToleranceQuestion,
  otherPetsQuestion,
  physicalHandlingQuestion,
  purposeQuestion,
  sharedSpacesQuestion,
  socialBehaviorQuestion,
  visitorsQuestion,
  walksTimeQuestion,
  workScheduleQuestion,
} from "@/lib/quizQuestions";
import type { QuizAnswer, QuizFinalResults, QuizSession } from "@/lib/quizStorage";
import {
  loadQuizFinalResults,
  loadQuizSession,
  saveQuizFinalResults,
} from "@/lib/quizStorage";
import { getResultAnalysis } from "@/lib/quizAnalysis";
import { getQuizInterimBreeds } from "@/app/actions";
import { calculateFinalBreeds } from "@/lib/quizScoring";
import QuizInterimGrid from "@/components/quiz/interim/QuizInterimGrid";

export default function AccountPage() {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [finalResults, setFinalResults] = useState<QuizFinalResults | null>(null);
  const [isLoadingFinal, setIsLoadingFinal] = useState(false);

  useEffect(() => {
    setSession(loadQuizSession());
    setFinalResults(loadQuizFinalResults());
  }, []);

  useEffect(() => {
    if (finalResults || isLoadingFinal || !session?.answers?.length) {
      return;
    }
    if (session.status !== "completed") {
      return;
    }

    setIsLoadingFinal(true);
    getQuizInterimBreeds(session.answers)
      .then((result) => {
        const refined = calculateFinalBreeds(result.breeds, session.answers);
        const analysis = getResultAnalysis(session.answers);
        saveQuizFinalResults({ analysis, finalBreeds: refined });
        setFinalResults({
          savedAt: Date.now(),
          analysis,
          finalBreeds: refined,
        });
      })
      .finally(() => setIsLoadingFinal(false));
  }, [finalResults, isLoadingFinal, session?.answers, session?.status]);

  const hasQuizAnswers = (session?.answers?.length ?? 0) > 0;
  const hasFinalResults = (finalResults?.finalBreeds?.length ?? 0) > 0;
  const isQuizCompleted = session?.status === "completed";
  const showFinalResults = isQuizCompleted && hasFinalResults;

  const story = useMemo(() => {
    if (!hasQuizAnswers) {
      return null;
    }

    const answers = session?.answers ?? [];
    const getAnswer = (id: string) => answers.find((a) => a.id === id)?.value;

    const getSingleLabel = (
      question: { options: { id: string; label: string }[] },
      value: unknown
    ) => {
      if (typeof value !== "string") {
        return null;
      }
      return question.options.find((o) => o.id === value)?.label ?? null;
    };

    const getMultiLabel = (
      question: { options: { id: string; label: string }[] },
      value: unknown
    ) => {
      if (!Array.isArray(value)) {
        return null;
      }
      const labels = value
        .filter((v) => typeof v === "string")
        .map((v) => question.options.find((o) => o.id === v)?.label)
        .filter((v): v is string => typeof v === "string");
      return labels.length > 0 ? labels.join(", ") : null;
    };

    const getScaleLabel = (
      question: { scaleLabels: { value: number; label: string }[] },
      value: unknown
    ) => {
      if (typeof value !== "number") {
        return null;
      }
      return question.scaleLabels.find((s) => s.value === value)?.label ?? `${value}`;
    };

    const pieces: { title: string; text: string }[] = [];

    const home = getSingleLabel(homeTypeQuestion, getAnswer(homeTypeQuestion.id));
    if (home) {
      pieces.push({ title: "Home", text: home });
    }

    const shared = getMultiLabel(sharedSpacesQuestion, getAnswer(sharedSpacesQuestion.id));
    if (shared) {
      pieces.push({ title: "Resting spaces", text: shared });
    }

    const handling = getSingleLabel(physicalHandlingQuestion, getAnswer(physicalHandlingQuestion.id));
    if (handling) {
      pieces.push({ title: "Handling", text: handling });
    }

    const household = getMultiLabel(childrenQuestion, getAnswer(childrenQuestion.id));
    if (household) {
      pieces.push({ title: "Household", text: household });
    }

    const pets = getMultiLabel(otherPetsQuestion, getAnswer(otherPetsQuestion.id));
    if (pets) {
      pieces.push({ title: "Other pets", text: pets });
    }

    const visitors = getSingleLabel(visitorsQuestion, getAnswer(visitorsQuestion.id));
    if (visitors) {
      pieces.push({ title: "Visitors", text: visitors });
    }

    const social = getSingleLabel(socialBehaviorQuestion, getAnswer(socialBehaviorQuestion.id));
    if (social) {
      pieces.push({ title: "Strangers & guests", text: social });
    }

    const noise = getScaleLabel(noiseToleranceQuestion, getAnswer(noiseToleranceQuestion.id));
    if (noise) {
      pieces.push({ title: "Barking tolerance", text: noise });
    }

    const hair = getSingleLabel(hairToleranceQuestion, getAnswer(hairToleranceQuestion.id));
    if (hair) {
      pieces.push({ title: "Shedding", text: hair });
    }

    const grooming = getScaleLabel(groomingTimeQuestion, getAnswer(groomingTimeQuestion.id));
    if (grooming) {
      pieces.push({ title: "Grooming time", text: grooming });
    }

    const drooling = getSingleLabel(droolingToleranceQuestion, getAnswer(droolingToleranceQuestion.id));
    if (drooling) {
      pieces.push({ title: "Drooling", text: drooling });
    }

    const work = getSingleLabel(workScheduleQuestion, getAnswer(workScheduleQuestion.id));
    if (work) {
      pieces.push({ title: "Work schedule", text: work });
    }

    const activity = getSingleLabel(activityLevelQuestion, getAnswer(activityLevelQuestion.id));
    if (activity) {
      pieces.push({ title: "Activity", text: activity });
    }

    const importance = getSingleLabel(activeImportanceQuestion, getAnswer(activeImportanceQuestion.id));
    if (importance) {
      pieces.push({ title: "What “active” means to you", text: importance });
    }

    const days = getSingleLabel(activeDaysQuestion, getAnswer(activeDaysQuestion.id));
    if (days) {
      pieces.push({ title: "Active days per week", text: days });
    }

    const walks = getScaleLabel(walksTimeQuestion, getAnswer(walksTimeQuestion.id));
    if (walks) {
      pieces.push({ title: "Daily walking time", text: walks });
    }

    const purpose = getSingleLabel(purposeQuestion, getAnswer(purposeQuestion.id));
    if (purpose) {
      pieces.push({ title: "Main goal", text: purpose });
    }

    const analysis = getResultAnalysis(answers as QuizAnswer[]);

    return {
      pieces,
      analysis,
    };
  }, [hasQuizAnswers, session?.answers]);

  const storyPieces = story?.pieces ?? [];
  const storyMid = Math.ceil(storyPieces.length / 2);
  const storyLeft = storyPieces.slice(0, storyMid);
  const storyRight = storyPieces.slice(storyMid);

  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Account</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                Account
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section className="my-5 py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 my-4 pe-5">
              <h2>Your Profile</h2>
              {!hasQuizAnswers ? (
                <>
                  <p>Hi! Right now, we do not know anything about your lifestyle yet.</p>
                  <p>
                    Take our quick quiz so we can learn what matters to you and suggest dog breeds that genuinely fit
                    your day-to-day life.
                  </p>
                  <Link
                    href="/quiz/start"
                    className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 py-2 px-4"
                  >
                    Take the Quiz
                    <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1 ms-2">
                      <use xlinkHref="#arrow-right"></use>
                    </svg>
                  </Link>
                </>
              ) : (
                <>
                  <p className="mb-2">
                    Here&apos;s what we learned from your quiz. We keep this information in temporary storage on this
                    device for 24 hours.
                  </p>
                  {story?.analysis && (
                    <div className="d-inline-block bg-white border rounded-pill px-3 py-2 mb-3 shadow-sm">
                      <span className="fw-bold text-primary">{story.analysis.title}:</span>{" "}
                      <span className="text-muted">{story.analysis.text}</span>
                    </div>
                  )}
                  <div className="d-flex flex-column gap-2 d-md-none">
                    {storyPieces.map((item) => (
                      <p key={item.title} className="m-0">
                        <span className="fw-semibold">{item.title}:</span> {item.text}
                      </p>
                    ))}
                  </div>
                  <div className="d-none d-md-flex flex-column gap-2">
                    {storyLeft.map((item) => (
                      <p key={item.title} className="m-0">
                        <span className="fw-semibold">{item.title}:</span> {item.text}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 d-flex flex-column flex-sm-row gap-2">
                    <Link href="/quiz/start" className="btn btn-outline-dark text-uppercase fs-6 rounded-1 py-2 px-4">
                      Retake the Quiz
                    </Link>
                    <Link href="/breeds" className="btn btn-primary text-uppercase fs-6 rounded-1 py-2 px-4">
                      Browse Breeds
                    </Link>
                  </div>
                </>
              )}
            </div>
            {!hasQuizAnswers ? (
              <div className="col-md-6 my-4">
                <h2>What We Will Learn</h2>
                <p className="m-0">
                  <span className="text-primary">✓</span> Your activity level and routine
                </p>
                <p className="m-0">
                  <span className="text-primary">✓</span> Your home and living situation
                </p>
                <p className="m-0">
                  <span className="text-primary">✓</span> Your experience and expectations
                </p>
                <p className="m-0">
                  <span className="text-primary">✓</span> Your preferences for size, temperament, and care
                </p>
                <p
                  className="mt-4 mb-0 secondary-font account-profile-note fw-medium"
                  style={{ fontSize: 13, lineHeight: "18px" }}
                >
                  After the quiz, this page will show a summary of what we learned and your top matches.
                </p>
              </div>
            ) : (
              <div className="col-md-6 my-4 d-none d-md-block">
                <h2>What We Know</h2>
                <p className="text-muted mb-3">Saved in temporary storage on this device for 24 hours.</p>
                <div className="d-flex flex-column gap-2">
                  {storyRight.map((item) => (
                    <p key={item.title} className="m-0">
                      <span className="fw-semibold">{item.title}:</span> {item.text}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {showFinalResults && (
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="mb-3">Your Final Quiz Results</h2>
                <p className="text-muted mb-4">
                  These are your final matches from the quiz. Saved on this device for 24 hours.
                </p>
                <QuizInterimGrid breeds={(finalResults?.finalBreeds ?? []).slice(0, 10)} />
              </div>
            </div>
          </div>
        </section>
      )}

      {isQuizCompleted && !showFinalResults && (
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="mb-3">Your Final Quiz Results</h2>
                <p className="text-muted mb-0">
                  {isLoadingFinal
                    ? "Calculating your final matches now..."
                    : "Your final matches will appear here shortly. Saved on this device for 24 hours."}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isQuizCompleted && hasQuizAnswers && (
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="mb-3">Your Final Quiz Results</h2>
                <p className="text-muted mb-4">
                  Finish the quiz to see your final matches. Your answers are saved on this device for 24 hours.
                </p>
                <Link href="/quiz/start" className="btn btn-primary text-uppercase rounded-1 px-4 py-2">
                  Continue the Quiz
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {!hasQuizAnswers && (
        <section
          id="register"
          style={{
            backgroundImage: "url(/images/background-img.WebP)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container">
            <div className="row py-5 my-5">
              <div className="col-lg-6 py-4 my-4 py-lg-5 my-lg-5 text-center text-lg-start">
                <h2 className="display-4 my-4 my-lg-5 text-dark">Ready to Meet Your Match?</h2>
              </div>
              <div className="col-lg-6 py-4 my-4 py-lg-5 my-lg-5 d-flex align-items-center justify-content-center justify-content-lg-end">
                <Link href="/quiz/start" className="btn btn-primary p-3 text-uppercase rounded-1">
                  Start the Quiz
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
