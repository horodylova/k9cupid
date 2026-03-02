"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  homeTypeQuestion,
  physicalHandlingQuestion,
  childrenQuestion,
  otherPetsQuestion,
  visitorsQuestion,
  noiseToleranceQuestion,
  hairToleranceQuestion,
  groomingTimeQuestion,
  droolingToleranceQuestion,
  workScheduleQuestion,
  activityLevelQuestion,
  activeImportanceQuestion,
  activeDaysQuestion,
  walksTimeQuestion,
  QuizOptionId,
} from "@/lib/quizQuestions";
import { useQuizSession } from "@/hooks/useQuizSession";
import { clearQuizSession } from "@/lib/quizStorage";
import SharedSpacesQuestion from "@/components/SharedSpacesQuestion";
import ChildrenQuestion from "@/components/ChildrenQuestion";
import PetsQuestion from "@/components/PetsQuestion";
import ScaleQuestion from "@/components/ScaleQuestion";
import HomeTypeQuestion from "@/components/HomeTypeQuestion";
import PhysicalHandlingQuestion from "@/components/PhysicalHandlingQuestion";
import VisitorsQuestion from "@/components/VisitorsQuestion";
import HairToleranceQuestion from "@/components/HairToleranceQuestion";
import DroolingToleranceQuestion from "@/components/DroolingToleranceQuestion";
import WorkScheduleQuestion from "@/components/WorkScheduleQuestion";
import ActivityLevelQuestion from "@/components/ActivityLevelQuestion";
import ActiveImportanceQuestion from "@/components/ActiveImportanceQuestion";
import ActiveDaysQuestion from "@/components/ActiveDaysQuestion";
import { getQuizInterimBreeds } from "@/app/actions";
import QuizInterimGrid from "@/components/quiz-interim/QuizInterimGrid";
import { Dog } from "@/lib/api";

export default function QuizRunner() {
  const { session, recordAnswer, isInitialized } = useQuizSession();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showStartOverModal, setShowStartOverModal] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17>(1);
  const [pageReady, setPageReady] = useState(false);
  const [interimBreeds, setInterimBreeds] = useState<Dog[]>([]);
  const [isLoadingInterim, setIsLoadingInterim] = useState(false);
  const [showShortlist, setShowShortlist] = useState(false);
  const fetchingRef = useRef(false);

  const totalSteps = 17;

  const selectedHome = session?.answers.find(
    (answer) => answer.id === homeTypeQuestion.id
  )?.value as QuizOptionId | undefined;

  const sharedSpacesValue = session?.answers.find(
    (answer) => answer.id === "shared_spaces"
  )?.value as QuizOptionId[] | undefined;

  const selectedSharedSpaces = sharedSpacesValue ?? [];

  const physicalHandlingValue = session?.answers.find(
    (answer) => answer.id === physicalHandlingQuestion.id
  )?.value as QuizOptionId | undefined;

  const selectedPhysicalHandling = physicalHandlingValue;

  const childrenValue = session?.answers.find(
    (answer) => answer.id === childrenQuestion.id
  )?.value as QuizOptionId[] | undefined;

  const selectedChildren = childrenValue ?? [];

  const otherPetsValue = session?.answers.find(
    (answer) => answer.id === otherPetsQuestion.id
  )?.value as QuizOptionId[] | undefined;

  const selectedOtherPets = otherPetsValue ?? [];

  const visitorsValue = session?.answers.find(
    (answer) => answer.id === visitorsQuestion.id
  )?.value as QuizOptionId | undefined;

  const selectedVisitors = visitorsValue;

  const noiseToleranceValue = session?.answers.find(
    (answer) => answer.id === noiseToleranceQuestion.id
  )?.value as number | undefined;

  const selectedNoiseTolerance =
    typeof noiseToleranceValue === "number" ? noiseToleranceValue : undefined;

  const hairToleranceValue = session?.answers.find(
    (answer) => answer.id === hairToleranceQuestion.id
  )?.value as QuizOptionId | undefined;

  const selectedHairTolerance = hairToleranceValue;

  const groomingTimeValue = session?.answers.find(
    (answer) => answer.id === groomingTimeQuestion.id
  )?.value as number | undefined;

  const selectedGroomingTime =
    typeof groomingTimeValue === "number" ? groomingTimeValue : undefined;

  const droolingToleranceValue = session?.answers.find(
    (answer) => answer.id === droolingToleranceQuestion.id
  )?.value as QuizOptionId | undefined;

  const selectedDroolingTolerance = droolingToleranceValue;

  const workScheduleValue = session?.answers.find(
    (answer) => answer.id === workScheduleQuestion.id
  )?.value as QuizOptionId | undefined;

  const selectedWorkSchedule = workScheduleValue;

  const activityLevelValue = session?.answers.find(
    (answer) => answer.id === activityLevelQuestion.id
  )?.value as QuizOptionId | undefined;

  const selectedActivityLevel = activityLevelValue;

  const activeImportanceValue = session?.answers.find(
    (answer) => answer.id === activeImportanceQuestion.id
  )?.value as QuizOptionId | undefined;

  const selectedActiveImportance = activeImportanceValue;

  const activeDaysValue = session?.answers.find(
    (answer) => answer.id === activeDaysQuestion.id
  )?.value as QuizOptionId | undefined;

  const selectedActiveDays = activeDaysValue;

  const walksTimeValue = session?.answers.find(
    (answer) => answer.id === walksTimeQuestion.id
  )?.value as number | undefined;

  const selectedWalksTime =
    typeof walksTimeValue === "number" ? walksTimeValue : undefined;

  const hasProgress = !!session && session.answers.length > 0;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!hasProgress) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const anchor = target.closest("a");
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) {
        return;
      }

      if (href.startsWith("#")) {
        return;
      }

      if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      if (href === "/quiz/start") {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setPendingHref(href);
      setShowLeaveModal(true);
    };

    window.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("click", handleClick, true);
    };
  }, [hasProgress]);

  const [hasResumed, setHasResumed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (document.readyState === "complete") {
      setPageReady(true);
      return;
    }
    const onLoad = () => setPageReady(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized || hasResumed) {
      return;
    }

    const answers = session?.answers ?? [];
    const hasHome = answers.some((a) => a.id === homeTypeQuestion.id);
    const shared = answers.find((a) => a.id === "shared_spaces")?.value as QuizOptionId[] | undefined;
    const hasShared = Array.isArray(shared) && shared.length > 0;
    const hasHandling = answers.some((a) => a.id === physicalHandlingQuestion.id && !!a.value);
    const children = answers.find((a) => a.id === childrenQuestion.id)?.value as QuizOptionId[] | undefined;
    const hasChildren = Array.isArray(children) && children.length > 0;
    const hasOtherPets = answers.some((a) => a.id === otherPetsQuestion.id && Array.isArray(a.value) && a.value.length > 0);
    const hasVisitors = answers.some((a) => a.id === visitorsQuestion.id && !!a.value);
    const hasNoiseTolerance = answers.some(
      (a) => a.id === noiseToleranceQuestion.id && typeof a.value === "number"
    );
    const hasHairTolerance = answers.some(
      (a) => a.id === hairToleranceQuestion.id && !!a.value
    );
    const hasGroomingTime = answers.some(
      (a) => a.id === groomingTimeQuestion.id && typeof a.value === "number"
    );
    const hasDroolingTolerance = answers.some(
      (a) => a.id === droolingToleranceQuestion.id && !!a.value
    );
    const hasWorkSchedule = answers.some(
      (a) => a.id === workScheduleQuestion.id && !!a.value
    );
    const hasActivityLevel = answers.some(
      (a) => a.id === activityLevelQuestion.id && !!a.value
    );
    const hasActiveImportance = answers.some(
      (a) => a.id === activeImportanceQuestion.id && !!a.value
    );
    const hasActiveDays = answers.some(
      (a) => a.id === activeDaysQuestion.id && !!a.value
    );
    const hasWalksTime = answers.some(
      (a) => a.id === walksTimeQuestion.id && typeof a.value === "number"
    );

    let target: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 = 1;
    if (!hasHome) {
      target = 1;
    } else if (!hasShared) {
      target = 2;
    } else if (!hasHandling) {
      target = 3;
    } else if (!hasChildren) {
      target = 4;
    } else if (!hasOtherPets) {
      target = 5;
    } else if (!hasVisitors) {
      target = 6;
    } else if (!hasNoiseTolerance) {
      target = 7;
    } else if (!hasHairTolerance) {
      target = 8;
    } else if (!hasGroomingTime) {
      target = 9;
    } else if (!hasDroolingTolerance) {
      target = 10;
    } else if (!hasWorkSchedule) {
      // Step 11 is Interim Results.
      // Step 12 is Work Schedule.
      // If user hasn't answered Work Schedule, we default to 11 (Interim Results)
      // because that's where they land after question 10.
      // They must click "Refine" to go to 12.
      target = 11;
    } else if (!hasActivityLevel) {
      target = 13;
    } else {
      // Work Schedule answered. Check Activity Level answer for branching.
      const activityVal = answers.find(
        (a) => a.id === activityLevelQuestion.id
      )?.value as QuizOptionId;
      const isActiveType =
        activityVal === "activity_sports" || activityVal === "activity_regular";

      if (isActiveType) {
        if (!hasActiveImportance) {
          target = 14;
        } else if (!hasActiveDays) {
          target = 15;
        } else if (!hasWalksTime) {
          target = 16;
        } else {
          target = 17;
        }
      } else {
        // Skip 14 & 15 if not active type
        if (!hasWalksTime) {
          target = 16;
        } else {
          target = 17;
        }
      }
    }

    setStep(target);
    setHasResumed(true);
  }, [isInitialized, hasResumed, session]);

  useEffect(() => {
    if ((step === 11 || step === 17) && session?.answers && !fetchingRef.current) {
      fetchingRef.current = true;
      setIsLoadingInterim(true);
      getQuizInterimBreeds(session.answers)
        .then((result) => {
          setInterimBreeds(result.breeds);
        })
        .finally(() => {
          setIsLoadingInterim(false);
          fetchingRef.current = false;
        });
    }
  }, [step, session?.answers]);

  if (!isInitialized || !pageReady) {
    return null;
  }

  const canContinue =
    (step === 1 && !!selectedHome) ||
    (step === 2 && selectedSharedSpaces.length > 0) ||
    (step === 3 && !!selectedPhysicalHandling) ||
    (step === 4 && selectedChildren.length > 0) ||
    (step === 5 && selectedOtherPets.length > 0) ||
    (step === 6 && !!selectedVisitors) ||
    (step === 7 && typeof selectedNoiseTolerance === "number") ||
    (step === 8 && !!selectedHairTolerance) ||
    (step === 9 && typeof selectedGroomingTime === "number") ||
    (step === 10 && !!selectedDroolingTolerance) ||
    step === 11 ||
    (step === 12 && !!selectedWorkSchedule) ||
    (step === 13 && !!selectedActivityLevel) ||
    (step === 14 && !!selectedActiveImportance) ||
    (step === 15 && !!selectedActiveDays) ||
    (step === 16 && typeof selectedWalksTime === "number") ||
    step === 17;

  const handleContinue = () => {
    if (step >= totalSteps) {
      return;
    }

    let nextStep = step + 1;
    if (step === 13) {
      const isLowActivity =
        selectedActivityLevel === "activity_calm_walks" ||
        selectedActivityLevel === "activity_couch";
      if (isLowActivity) {
        nextStep = 16;
      }
    }

    setStep(
      nextStep as
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11
        | 12
        | 13
        | 14
        | 15
        | 16
        | 17
    );
  };

  const handleStartOver = () => {
    setShowStartOverModal(true);
  };

  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">
              Compatibility <span className="text-primary">Quiz</span>
            </h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <Link className="breadcrumb-item nav-link" href="/quiz">
                Quiz
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                Step {step}
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section className={(step === 11 || step === 17) ? "py-3 my-2" : "py-4 my-4"}>
        <div className="container">
          <div className="row justify-content-center">
            <div className={(step === 11 || step === 17) ? "col-12" : "col-lg-8"}>
              <div
                className={`rounded-4 p-4 p-md-5 d-flex flex-column${
                  (step === 11 || step === 17) ? "" : " border"
                }`}
              >
                {step !== 11 && step !== 17 && (
                  <div className="mb-4">
                    <div className="secondary-font text-uppercase text-muted mb-2">
                      Step {step} of {totalSteps}
                    </div>
                  </div>
                )}

                <div
                  className="flex-grow-1"
                  style={{ minHeight: "260px" }}
                >
                  {step === 1 && (
                    <HomeTypeQuestion
                      selected={selectedHome}
                      onChange={(value) =>
                        recordAnswer({
                          id: homeTypeQuestion.id,
                          value: value,
                        })
                      }
                    />
                  )}

                  {step === 2 && (
                    <SharedSpacesQuestion
                      selected={selectedSharedSpaces}
                      onChange={(next) =>
                        recordAnswer({
                          id: "shared_spaces",
                          value: next,
                        })
                      }
                    />
                  )}

                  {step === 3 && (
                    <PhysicalHandlingQuestion
                      selected={selectedPhysicalHandling}
                      onChange={(value) =>
                        recordAnswer({
                          id: physicalHandlingQuestion.id,
                          value: value,
                        })
                      }
                    />
                  )}

                  {step === 4 && (
                    <ChildrenQuestion
                      selected={selectedChildren}
                      onChange={(next) =>
                        recordAnswer({
                          id: childrenQuestion.id,
                          value: next,
                        })
                      }
                    />
                  )}

                  {step === 5 && (
                    <PetsQuestion
                      selected={selectedOtherPets}
                      onChange={(next) =>
                        recordAnswer({
                          id: otherPetsQuestion.id,
                          value: next,
                        })
                      }
                    />
                  )}

                  {step === 6 && (
                    <VisitorsQuestion
                      selected={selectedVisitors}
                      onChange={(value) =>
                        recordAnswer({
                          id: visitorsQuestion.id,
                          value: value,
                        })
                      }
                    />
                  )}

                  {step === 7 && (
                    <ScaleQuestion
                      title={noiseToleranceQuestion.title}
                      subtitle={noiseToleranceQuestion.description}
                      labels={noiseToleranceQuestion.scaleLabels}
                      value={selectedNoiseTolerance}
                      onChange={(next) =>
                        recordAnswer({
                          id: noiseToleranceQuestion.id,
                          value: next,
                        })
                      }
                    />
                  )}

                  {step === 8 && (
                    <HairToleranceQuestion
                      selected={selectedHairTolerance}
                      onChange={(value) =>
                        recordAnswer({
                          id: hairToleranceQuestion.id,
                          value: value,
                        })
                      }
                    />
                  )}

                  {step === 9 && (
                    <ScaleQuestion
                      title={groomingTimeQuestion.title}
                      subtitle={groomingTimeQuestion.description}
                      labels={groomingTimeQuestion.scaleLabels}
                      value={selectedGroomingTime}
                      onChange={(next) =>
                        recordAnswer({
                          id: groomingTimeQuestion.id,
                          value: next,
                        })
                      }
                    />
                  )}

                  {step === 10 && (
                  <DroolingToleranceQuestion
                    selected={selectedDroolingTolerance}
                    onChange={(value) =>
                      recordAnswer({
                        id: droolingToleranceQuestion.id,
                        value: value,
                      })
                    }
                  />
                )}

                {step === 12 && (
                  <WorkScheduleQuestion
                    selected={selectedWorkSchedule}
                    onChange={(value) =>
                      recordAnswer({
                        id: workScheduleQuestion.id,
                        value: value,
                      })
                    }
                  />
                )}

                {step === 11 && !showShortlist && (
                    <div className="rounded-4 p-3 p-md-4 quiz-interim-card position-relative">
                      <div className="quiz-interim-content rounded-4 p-3 p-md-4">
                        <div className="mb-3">
                          <div className="text-uppercase fw-semibold" style={{ letterSpacing: "0.12em" }}>
                            You did the work
                          </div>
                        </div>

                        <div className="quiz-interim-hero d-flex align-items-start gap-3">
                          <div className="d-none d-md-block flex-shrink-0">
                            <Image
                            src="/Cupid and Dogs-Picsart-BackgroundRemover.png"
                            alt="Cupid and dogs"
                            width={320}
                            height={320}
                            className="quiz-interim-logo-static img-fluid"
                          />
                          </div>
                          <div className="flex-grow-1 quiz-interim-text">
                            <h1 className="display-6 fw-normal mb-2 quiz-interim-title">A promising pack is ready.</h1>
                            <p className="fs-5 mb-3 quiz-interim-copy">
                              We narrowed the list to breeds that can truly fit your life. Want to meet them now, or keep tuning things like
                              friendliness, dog social skills, and vibe?
                            </p>
                            <div className="d-flex flex-column flex-md-row gap-2 quiz-interim-actions">
                            <button
                              type="button"
                              className="btn btn-light text-uppercase fw-semibold"
                              onClick={() => setShowShortlist(true)}
                              disabled={isLoadingInterim}
                            >
                              {isLoadingInterim ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Loading...
                                </>
                              ) : (
                                "Show the shortlist"
                              )}
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-outline-dark text-uppercase fw-semibold"
                              onClick={() => setStep(12)}
                            >
                              Keep refining
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger text-uppercase fw-semibold"
                              onClick={handleStartOver}
                            >
                              Start Over
                            </button>
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 11 && showShortlist && (
                    <div className="rounded-4 p-3 p-md-4" style={{ backgroundColor: "#FFF7EC" }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h4 mb-0">Your Interim Matches</h2>
                        <button
                          type="button"
                          className="btn btn-outline-dark px-4 fw-semibold"
                          onClick={() => setShowShortlist(false)}
                        >
                          ← Back
                        </button>
                      </div>
                      <QuizInterimGrid breeds={interimBreeds} />
                      <div className="mt-4 text-center">
                        <button type="button" className="btn btn-outline-dark text-uppercase fw-semibold">
                          Keep refining
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 13 && (
                    <ActivityLevelQuestion
                      selected={selectedActivityLevel}
                      onChange={(value) =>
                        recordAnswer({
                          id: activityLevelQuestion.id,
                          value: value,
                        })
                      }
                    />
                  )}

                  {step === 14 && (
                    <ActiveImportanceQuestion
                      selected={selectedActiveImportance}
                      onChange={(value) =>
                        recordAnswer({
                          id: activeImportanceQuestion.id,
                          value: value,
                        })
                      }
                    />
                  )}

                  {step === 15 && (
                    <ActiveDaysQuestion
                      selected={selectedActiveDays}
                      onChange={(value) =>
                        recordAnswer({
                          id: activeDaysQuestion.id,
                          value: value,
                        })
                      }
                    />
                  )}

                  {step === 16 && (
                    <ScaleQuestion
                      title={walksTimeQuestion.title}
                      labels={walksTimeQuestion.scaleLabels}
                      value={selectedWalksTime}
                      onChange={(next) =>
                        recordAnswer({
                          id: walksTimeQuestion.id,
                          value: next,
                        })
                      }
                    />
                  )}

                  {step === 17 && !showShortlist && (
                    <div className="rounded-4 p-3 p-md-4 quiz-interim-card position-relative">
                      <div className="quiz-interim-content rounded-4 p-3 p-md-4">
                        <div className="mb-3">
                          <div className="text-uppercase fw-semibold" style={{ letterSpacing: "0.12em" }}>
                            Refined Results
                          </div>
                        </div>

                        <div className="quiz-interim-hero d-flex align-items-start gap-3">
                          <div className="d-none d-md-block flex-shrink-0">
                            <Image
                            src="/Cupid and Dogs-Picsart-BackgroundRemover.png"
                            alt="Cupid and dogs"
                            width={320}
                            height={320}
                            className="quiz-interim-logo-static img-fluid"
                          />
                          </div>
                          <div className="flex-grow-1 quiz-interim-text">
                            <h1 className="display-6 fw-normal mb-2 quiz-interim-title">Updated Matches</h1>
                            <p className="fs-5 mb-3 quiz-interim-copy">
                              We&apos;ve refined your matches based on your lifestyle and activity preferences. 
                              More questions coming soon!
                            </p>
                            <div className="d-flex flex-column flex-md-row gap-2 quiz-interim-actions">
                              <button
                                type="button"
                                className="btn btn-light text-uppercase fw-semibold"
                                onClick={() => setShowShortlist(true)}
                                disabled={isLoadingInterim}
                              >
                                {isLoadingInterim ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Loading...
                                  </>
                                ) : (
                                  "Show the shortlist"
                                )}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger text-uppercase fw-semibold"
                                onClick={handleStartOver}
                              >
                                Start Over
                              </button>
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 17 && showShortlist && (
                    <div className="rounded-4 p-3 p-md-4" style={{ backgroundColor: "#FFF7EC" }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h4 mb-0">Your Refined Matches</h2>
                        <button
                          type="button"
                          className="btn btn-outline-dark px-4 fw-semibold"
                          onClick={() => setShowShortlist(false)}
                        >
                          ← Back
                        </button>
                      </div>
                      <QuizInterimGrid breeds={interimBreeds} />
                    </div>
                  )}
                </div>

                {step !== 11 && step !== 17 && (
                  <div className="mt-4 d-flex justify-content-end">
                    <button
                      type="button"
                      className={`btn px-4 ${
                        canContinue
                          ? "btn-primary"
                          : "btn-light opacity-100 text-body border border-2"
                      }`}
                      disabled={!canContinue}
                      onClick={handleContinue}
                    >
                      Continue to next step
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showLeaveModal && pendingHref && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
        >
          <div
            className="rounded-4 p-4 p-md-5 shadow-lg"
            style={{ maxWidth: 720, width: "100%", background: "#FFF7EC" }}
          >
            <div className="row g-4 align-items-center mb-4">
              <div className="col-md-4 text-center text-md-start">
                <Image
                  src="/Cupid with Dogs-white-puppy.png"
                  alt="Cupid with dog illustration"
                  width={120}
                  height={120}
                  className="img-fluid"
                />
                <h2 className="h5 mb-0 mt-3">Need a little break?</h2>
              </div>
              <div className="col-md-8">
                <p className="mb-0">
                  We will keep your quiz answers safe on this device for 24 hours,
                  so you and your future dog can return and continue together.
                </p>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
              <button
                type="button"
                className="btn btn-primary flex-fill"
                onClick={() => {
                  setShowLeaveModal(false);
                  setPendingHref(null);
                }}
              >
                Keep going
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary flex-fill"
                onClick={() => {
                  clearQuizSession();
                  setShowLeaveModal(false);
                  const target = pendingHref;
                  setPendingHref(null);
                  if (target) {
                    router.push(target);
                  }
                }}
              >
                Leave without saving
              </button>
              <button
                type="button"
                className="btn btn-link text-decoration-none flex-fill"
                onClick={() => {
                  setShowLeaveModal(false);
                  const target = pendingHref;
                  setPendingHref(null);
                  if (target) {
                    router.push(target);
                  }
                }}
              >
                Save and come back later
              </button>
            </div>
          </div>
        </div>
      )}

      {showStartOverModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
        >
          <div
            className="rounded-4 p-4 p-md-5 shadow-lg"
            style={{ maxWidth: 720, width: "100%", background: "#FFF7EC" }}
          >
            <div className="row g-4 align-items-center mb-4">
              <div className="col-md-4 text-center text-md-start">
                <Image
                  src="/Cupid with Dogs-white-puppy.png"
                  alt="Cupid with dog illustration"
                  width={120}
                  height={120}
                  className="img-fluid"
                />
                <h2 className="h5 mb-0 mt-3">Start from scratch?</h2>
              </div>
              <div className="col-md-8">
                <p className="mb-0">
                  Are you sure you want to start over? All your progress will be lost.
                </p>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
              <button
                type="button"
                className="btn btn-outline-secondary flex-fill"
                onClick={() => setShowStartOverModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger flex-fill"
                onClick={() => {
                  clearQuizSession();
                  window.location.reload();
                }}
              >
                Yes, start over
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 11 && showShortlist && (
        <div
          className="position-fixed bottom-0 start-0 w-100 p-3 p-md-4 text-center border-top shadow-lg"
          style={{
            background: "rgba(255, 247, 236, 0.95)",
            backdropFilter: "blur(10px)",
            zIndex: 1040,
          }}
        >
          <div className="container" style={{ maxWidth: 720 }}>
            <h3 className="h5 mb-2">We are not done yet!</h3>
            <p className="mb-3 text-muted small">
              This is just a preliminary list based on size & lifestyle. We want to find dogs that match your <strong>character & activity</strong> too.
            </p>
            <button
              type="button"
              className="btn btn-primary px-5 py-2 fw-semibold rounded-pill"
              onClick={() => setShowShortlist(false)}
            >
              Continue to Character Questions
            </button>
          </div>
        </div>
      )}
    </>
  );
}
