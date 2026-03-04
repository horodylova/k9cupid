"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

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
  socialBehaviorQuestion,
  purposeQuestion,
  QuizOptionId,
} from "@/lib/quizQuestions";
import { useQuizSession } from "@/hooks/useQuizSession";

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
import SocialBehaviorQuestion from "@/components/SocialBehaviorQuestion";
import PurposeQuestion from "@/components/PurposeQuestion";
import { useNavigation } from "@/context/NavigationContext";
import { getQuizInterimBreeds } from "@/app/actions";
import { Dog } from "@/lib/api";
import { calculateFinalBreeds } from "@/lib/quizScoring";
import { getResultAnalysis } from "@/lib/quizAnalysis";
import QuizInterimView from "@/components/QuizInterimView";
import QuizFinalView from "@/components/QuizFinalView";
import { QuizStartOverModal, QuizLeaveModal } from "@/components/QuizModals";

export default function QuizRunner() {
  const { session, recordAnswer, isInitialized } = useQuizSession();

  const [showStartOverModal, setShowStartOverModal] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19>(1);
  const [pageReady, setPageReady] = useState(false);
  const [interimBreeds, setInterimBreeds] = useState<Dog[]>([]);
  const [finalBreeds, setFinalBreeds] = useState<Dog[]>([]);
  const [isLoadingInterim, setIsLoadingInterim] = useState(false);
  const [showShortlist, setShowShortlist] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const totalSteps = 19;

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

  const socialBehaviorValue = session?.answers.find(
    (answer) => answer.id === socialBehaviorQuestion.id
  )?.value as QuizOptionId | undefined;

  const selectedSocialBehavior = socialBehaviorValue;

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

  const selectedPurpose = session?.answers.find(
    (a) => a.id === purposeQuestion.id
  )?.value as QuizOptionId;

  const { setInterceptor, removeInterceptor } = useNavigation();

  useEffect(() => {
    if (step < 19) {
      setInterceptor((path) => {
        setPendingHref(path);
        setShowLeaveModal(true);
      });
    } else {
      removeInterceptor();
    }
    
    return () => removeInterceptor();
  }, [step, setInterceptor, removeInterceptor]);

  // Restore state on load
  useEffect(() => {
    if (!isInitialized) return;
    // Prevent auto-advance if we've already resumed/restored the session
    if (hasResumed) return;

    // Check if we already have answers
    const answers = session?.answers || [];
    const hasHome = answers.some((a) => a.id === homeTypeQuestion.id && !!a.value);
    const hasShared = answers.some(
      (a) => a.id === "shared_spaces" && (a.value as string[])?.length > 0
    );
    const hasHandling = answers.some(
      (a) => a.id === physicalHandlingQuestion.id && !!a.value
    );
    const hasChildren = answers.some(
      (a) => a.id === childrenQuestion.id && (a.value as string[])?.length > 0
    );
    const hasOtherPets = answers.some(
      (a) => a.id === otherPetsQuestion.id && (a.value as string[])?.length > 0
    );
    const hasVisitors = answers.some(
      (a) => a.id === visitorsQuestion.id && !!a.value
    );
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
    const hasSocialBehavior = answers.some(
      (a) => a.id === socialBehaviorQuestion.id && !!a.value
    );
    const hasPurpose = answers.some(
      (a) => a.id === purposeQuestion.id && !!a.value
    );

    let target: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 = 1;
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

      let afterActivityTarget: 14 | 15 | 16 | 17 | 18 | 19 = 18; // Default to Purpose question
      
      if (isActiveType) {
        if (!hasActiveImportance) {
          afterActivityTarget = 14;
        } else if (!hasActiveDays) {
          afterActivityTarget = 15;
        } else if (!hasWalksTime) {
          afterActivityTarget = 16;
        } else if (!hasSocialBehavior) {
          afterActivityTarget = 17;
        } else if (!hasPurpose) {
          afterActivityTarget = 18;
        } else {
          afterActivityTarget = 19;
        }
      } else {
        // Skip 14 & 15 if not active type
        if (!hasWalksTime) {
          afterActivityTarget = 16;
        } else if (!hasSocialBehavior) {
          afterActivityTarget = 17;
        } else if (!hasPurpose) {
          afterActivityTarget = 18;
        } else {
          afterActivityTarget = 19;
        }
      }
      target = afterActivityTarget;
    }

    setStep(target);
    setHasResumed(true);
  }, [isInitialized, hasResumed, session]);

  useEffect(() => {
    if ((step === 11 || step === 19) && session?.answers && !fetchingRef.current) {
      // Step 11: Initial fetch
      if (step === 11 && interimBreeds.length === 0) {
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
      // Step 19: Refine existing interim breeds (Final Results)
      else if (step === 19 && interimBreeds.length > 0) {
        const refined = calculateFinalBreeds(interimBreeds, session.answers);
        setFinalBreeds(refined);
      }
      // If we jumped to 19 without 11 (e.g. refresh), fetch first then refine
      else if (step === 19 && interimBreeds.length === 0) {
        fetchingRef.current = true;
        setIsLoadingInterim(true);
        getQuizInterimBreeds(session.answers)
          .then((result) => {
            setInterimBreeds(result.breeds);
            const refined = calculateFinalBreeds(result.breeds, session.answers);
            setFinalBreeds(refined);
          })
          .finally(() => {
            setIsLoadingInterim(false);
            fetchingRef.current = false;
          });
      }
    }
  }, [step, session?.answers, interimBreeds]);

  if (!isInitialized || !pageReady || !hasResumed) {
    return (
      <div className="preloader-wrapper">
        <div className="preloader"></div>
      </div>
    );
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
    (step === 17 && !!selectedSocialBehavior) ||
    (step === 18 && !!selectedPurpose) ||
    step === 19;

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
        | 18
        | 19
    );
  };

  const handleStartOver = () => {
    setShowStartOverModal(true);
  };

  // --- Render Final Results (Step 19) ---
  if (step === 19) {
    const analysis = getResultAnalysis(session?.answers || []);
    return (
      <QuizFinalView
        analysis={analysis}
        finalBreeds={finalBreeds}
        interimBreeds={interimBreeds}
      />
    );
  }

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
            <div className={(step === 11 || step === 17) ? "col-12" : "col-lg-9"}>
              <div
                className={`rounded-4 p-4 d-flex flex-column${
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

                {step === 11 && (
                  <QuizInterimView
                    showShortlist={showShortlist}
                    setShowShortlist={setShowShortlist}
                    interimBreeds={interimBreeds}
                    isLoadingInterim={isLoadingInterim}
                    onKeepRefining={() => setStep(12)}
                    onStartOver={handleStartOver}
                  />
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

                  {step === 17 && (
                    <SocialBehaviorQuestion
                      selected={selectedSocialBehavior}
                      onChange={(value) =>
                        recordAnswer({
                          id: socialBehaviorQuestion.id,
                          value: value,
                        })
                      }
                    />
                  )}

                  {step === 18 && (
                    <PurposeQuestion
                      selected={selectedPurpose}
                      onChange={(value) =>
                        recordAnswer({
                          id: purposeQuestion.id,
                          value: value,
                        })
                      }
                    />
                  )}
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg px-5 rounded-pill"
                    onClick={handleContinue}
                    disabled={!canContinue}
                  >
                    {step === 11 ? "Keep Refining" : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky footer for Interim results (Step 11) when list is shown */}
      {/* Moved to QuizInterimView */}

      {showLeaveModal && pendingHref && (
        <QuizLeaveModal
          pendingHref={pendingHref}
          onCancel={() => {
            setShowLeaveModal(false);
            setPendingHref(null);
          }}
          onConfirm={() => {
            setShowLeaveModal(false);
            setPendingHref(null);
          }}
        />
      )}

      {showStartOverModal && (
        <QuizStartOverModal
          onCancel={() => setShowStartOverModal(false)}
        />
      )}


      {/* Removed second sticky footer (moved to QuizInterimView) */}
    </>
  );
}


