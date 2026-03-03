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
  socialBehaviorQuestion,
  purposeQuestion,
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
import SocialBehaviorQuestion from "@/components/SocialBehaviorQuestion";
import PurposeQuestion from "@/components/PurposeQuestion";
import { useNavigation } from "@/context/NavigationContext";
import { getQuizInterimBreeds } from "@/app/actions";
import QuizInterimGrid from "@/components/quiz-interim/QuizInterimGrid";
import { Dog } from "@/lib/api";

function calculateFinalBreeds(breeds: Dog[], answers: { id: string; value: unknown }[]): Dog[] {
  // Helper to get answer value
  const getAnswer = (id: string) => {
    const ans = answers.find((a) => a.id === id);
    return ans ? ans.value : undefined;
  };

  const scores = breeds.map((breed) => {
    let score = 100; // Base score

    // 1. Children
    const childrenVal = getAnswer("children") as string[] | undefined;
    const hasToddlers = childrenVal?.includes("children_toddlers");
    const hasSchool = childrenVal?.includes("children_school");
    
    if (hasToddlers) {
      if (breed.good_with_children >= 4) score += 10;
      else if (breed.good_with_children <= 3) score -= 15; // Penalty for toddlers if not great
    } else if (hasSchool) {
      if (breed.good_with_children >= 3) score += 5;
    }

    // 2. Other Pets
    const petsVal = getAnswer("other_pets") as string[] | undefined;
    const hasDogs = petsVal?.includes("pets_dogs");
    const hasCats = petsVal?.includes("pets_cats");
    const hasSmall = petsVal?.includes("pets_small");
    
    if (hasDogs) {
      if (breed.good_with_other_dogs >= 4) score += 10;
      else if (breed.good_with_other_dogs <= 2) score -= 10;
    }
    if (hasCats || hasSmall) {
      // High prey drive penalty (using good_with_other_dogs as proxy or if we had prey_drive field)
      // Assuming good_with_other_dogs correlates slightly with general social/prey
      if (breed.good_with_other_dogs >= 4) score += 5;
      else if (breed.good_with_other_dogs <= 2) score -= 5;
    }

    // 3. Visitors / Strangers
    const visitorsVal = getAnswer("visitors") as string | undefined;
    const socialVal = getAnswer("social_behavior") as string | undefined;
    
    if (visitorsVal === "visitors_daily" || visitorsVal === "visitors_weekly") {
      if (breed.good_with_strangers >= 4) score += 10;
      else if (breed.good_with_strangers <= 2) score -= 5;
    } else if (visitorsVal === "visitors_rarely") {
      // Maybe prefers guard dog?
      if (breed.protectiveness >= 4) score += 5;
    }

    if (socialVal === "social_friendly") {
      if (breed.good_with_strangers >= 4) score += 10;
    } else if (socialVal === "social_guardian") {
      if (breed.protectiveness >= 4) score += 10;
    }

    // 4. Activity Level & Energy
    // This is crucial. Match user energy to dog energy.
    const activityVal = getAnswer("activity_level") as string | undefined;
    const activeImportance = getAnswer("active_importance") as string | undefined;
    
    // Determine user's energy tier
    let userEnergy = 3; // Default medium
    if (activityVal === "activity_couch") userEnergy = 1;
    else if (activityVal === "activity_calm_walks") userEnergy = 2;
    else if (activityVal === "activity_regular") userEnergy = 4;
    else if (activityVal === "activity_sports") userEnergy = 5;

    // Dog energy: 1-5
    const diff = Math.abs(breed.energy - userEnergy);
    
    // Penalty for mismatch
    if (diff === 0) score += 20; // Perfect match
    else if (diff === 1) score += 10; // Close
    else if (diff === 2) score -= 10; // Mismatch
    else score -= 30; // Strong mismatch (e.g. Couch potato vs Husky)

    // Weight importance
    if (activeImportance === "importance_endurance" && userEnergy >= 4) {
      if (breed.energy >= 4) score += 10;
    } else if (activeImportance === "importance_calm_home") {
      if (breed.energy <= 3) score += 10;
    }

    // 5. Training / Purpose
    const purposeVal = getAnswer("purpose") as string | undefined;
    if (purposeVal === "purpose_guard") {
      if (breed.protectiveness >= 4) score += 15;
    } else if (purposeVal === "purpose_active") {
      if (breed.energy >= 4) score += 10;
    } else if (purposeVal === "purpose_service") {
      if (breed.trainability >= 4) score += 15;
    } else if (purposeVal === "purpose_companion") {
      if (breed.good_with_children >= 4 || breed.playfulness >= 4) score += 10;
    }

    // 6. Maintenance (Grooming/Shedding)
    const hairVal = getAnswer("hair_tolerance") as string | undefined;
    if (hairVal === "hair_allergies") {
      if (breed.shedding <= 1) score += 20;
      else score -= 50; // Deal breaker
    } else if (hairVal === "hair_prefer_minimal") {
      if (breed.shedding <= 2) score += 10;
      else if (breed.shedding >= 4) score -= 10;
    }

    const droolVal = getAnswer("drooling_tolerance") as string | undefined;
    if (droolVal === "drooling_avoid") {
      if (breed.drooling <= 1) score += 10;
      else if (breed.drooling >= 3) score -= 10;
    }

    // 7. Barking
    // (Implicit from noise tolerance if we had it mapped, assuming noise tolerance question exists)
    // const noiseVal = getAnswer(noiseToleranceQuestion.id);
    
    return { breed, score };
  });

  // Sort by score desc
  scores.sort((a, b) => b.score - a.score);

  // Return top 10 breeds
  return scores.slice(0, 10).map((s) => s.breed);
}

function getActivityAnalysis(answers: { id: string; value: unknown }[]) {
  const getAnswer = (id: string) => {
    const ans = answers.find((a) => a.id === id);
    return ans ? ans.value : undefined;
  };

  const activityVal = getAnswer("activity_level") as string | undefined;
  
  if (activityVal === "activity_sports" || activityVal === "activity_regular") {
    return {
      title: "Active Adventurer",
      text: "You lead an active lifestyle and are looking for a partner who can keep up! We prioritized breeds with high energy and endurance."
    };
  } else if (activityVal === "activity_calm_walks") {
    return {
      title: "Casual Walker",
      text: "You enjoy moderate activity but appreciate downtime. We prioritized balanced breeds that are playful but not hyperactive."
    };
  } else {
    return {
      title: "Relaxed Homebody",
      text: "You prefer a laid-back lifestyle. We prioritized calm, lower-energy breeds that are happy to lounge with you."
    };
  }
}

export default function QuizRunner() {
  const { session, recordAnswer, isInitialized } = useQuizSession();
  const router = useRouter();
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
    return (
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="text-center mb-5">
                <Image
                  src="/images/k9cupid-logo-final.png"
                  alt="K9 Cupid Final Result"
                  width={180}
                  height={180}
                  className="mb-4 img-fluid"
                  style={{ objectFit: "contain" }}
                />
                <h1 className="display-5 fw-bold mb-3 secondary-font">Your Perfect Matches</h1>
                
                {/* Activity Analysis Badge */}
                {(() => {
                  const analysis = getActivityAnalysis(session?.answers || []);
                  return (
                    <div className="d-inline-block bg-white border rounded-pill px-4 py-2 mb-4 shadow-sm">
                      <span className="fw-bold text-primary">{analysis.title}:</span> <span className="text-muted">{analysis.text}</span>
                    </div>
                  );
                })()}

                <p className="lead text-muted mx-auto" style={{ maxWidth: "600px" }}>
                  Based on your lifestyle, activity level, and preferences, we&apos;ve found the top breeds that are most likely to steal your heart.
                </p>
              </div>

              {/* Toggle View Buttons */}
              <div className="d-flex justify-content-center gap-3 mb-5">
                <button
                  className={`btn ${!showShortlist ? "btn-dark" : "btn-outline-dark"} rounded-pill px-4 fw-semibold`}
                  onClick={() => setShowShortlist(false)}
                >
                  Top 10 Recommendations
                </button>
                <button
                  className={`btn ${showShortlist ? "btn-dark" : "btn-outline-dark"} rounded-pill px-4 fw-semibold`}
                  onClick={() => setShowShortlist(true)}
                >
                  View All Candidates
                </button>
              </div>

              {/* Results Grid */}
              <div className="mb-5">
                {!showShortlist ? (
                  <QuizInterimGrid breeds={finalBreeds} />
                ) : (
                  <div className="bg-light rounded-4 p-4">
                    <h3 className="h5 mb-4 text-center">All Potential Candidates</h3>
                    <QuizInterimGrid breeds={interimBreeds} />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="text-center d-flex flex-column flex-md-row justify-content-center gap-3">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-lg px-5 rounded-pill text-uppercase fw-semibold"
                  onClick={handleStartOver}
                >
                  Start Over
                </button>
                <Link href="/breeds" className="btn btn-primary btn-lg px-5 rounded-pill text-uppercase fw-semibold">
                  Read Breed Guides
                </Link>
              </div>
            </div>
          </div>
        </div>

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
      </section>
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
                        <button 
                          type="button" 
                          className="btn btn-outline-dark text-uppercase fw-semibold"
                          onClick={() => setStep(12)}
                        >
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
      {step === 11 && showShortlist && (
        <div className="fixed-bottom bg-white border-top py-3 shadow-lg" style={{ zIndex: 1000 }}>
          <div className="container d-flex justify-content-between align-items-center">
            <div className="d-none d-md-block">
              <span className="fw-semibold">Want more precise matches?</span>
              <span className="text-muted ms-2">Continue to refine by activity & lifestyle.</span>
            </div>
            <div className="d-md-none">
              <span className="fw-semibold">Want more precise matches?</span>
            </div>
            <button 
              className="btn btn-primary px-4 rounded-pill fw-semibold"
              onClick={() => setStep(12)}
            >
              Continue Quiz →
            </button>
          </div>
        </div>
      )}

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


