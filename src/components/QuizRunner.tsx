"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  homeTypeQuestion,
  physicalHandlingQuestion,
  childrenQuestion,
  otherPetsQuestion,
  QuizOptionId,
} from "@/lib/quizQuestions";
import { useQuizSession } from "@/hooks/useQuizSession";
import { clearQuizSession } from "@/lib/quizStorage";
import SharedSpacesQuestion from "@/components/SharedSpacesQuestion";
import ChildrenQuestion from "@/components/ChildrenQuestion";
import PetsQuestion from "@/components/PetsQuestion";

export default function QuizRunner() {
  const { session, recordAnswer, isInitialized } = useQuizSession();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const totalSteps = 5;

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

    let target: 1 | 2 | 3 | 4 | 5 = 1;
    if (!hasHome) {
      target = 1;
    } else if (!hasShared) {
      target = 2;
    } else if (!hasHandling) {
      target = 3;
    } else if (!hasChildren) {
      target = 4;
    } else {
      target = 5;
    }

    setStep(target);
    setHasResumed(true);
  }, [isInitialized, hasResumed, session]);

  if (!isInitialized) {
    return null;
  }

  const canContinue =
    (step === 1 && !!selectedHome) ||
    (step === 2 && selectedSharedSpaces.length > 0) ||
    (step === 3 && !!selectedPhysicalHandling) ||
    (step === 4 && selectedChildren.length > 0) ||
    (step === 5 && selectedOtherPets.length > 0);

  const handleContinue = () => {
    if (step >= totalSteps) {
      return;
    }
    setStep((current) =>
      current < totalSteps ? ((current + 1) as 1 | 2 | 3 | 4 | 5) : current
    );
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

      <section className="py-4 my-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="border rounded-4 p-4 p-md-5 d-flex flex-column">
                <div className="mb-4">
                  <div className="secondary-font text-uppercase text-muted mb-2">
                    Step {step} of {totalSteps}
                  </div>
                </div>

                <div
                  className="flex-grow-1"
                  style={{ minHeight: "260px" }}
                >
                  {step === 1 && (
                    <>
                      <div className="mb-3">
                        <h1 className="h3 mb-0">{homeTypeQuestion.title}</h1>
                      </div>
                      <div className="d-flex flex-column gap-3">
                        {homeTypeQuestion.options.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className={`btn w-100 text-start ${
                              selectedHome === option.id
                                ? "btn-primary"
                                : "btn-outline-secondary"
                            }`}
                            onClick={() =>
                              recordAnswer({
                                id: homeTypeQuestion.id,
                                value: option.id,
                              })
                            }
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
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
                    <div className="h-100 d-flex flex-column">
                      <div className="mb-3 text-center text-md-start">
                        <h1 className="h4 mb-1">
                          How confident do you feel handling a strong dog?
                        </h1>
                        <p className="mb-0 text-muted">
                          Think about real-life walks, busy streets, and sudden pulls on the leash.
                        </p>
                      </div>
                      <div className="row g-3 mt-2">
                        {physicalHandlingQuestion.options.map((option, index) => {
                          const isSelected = selectedPhysicalHandling === option.id;
                          const isPrimaryChoice = index <= 1;

                          return (
                            <div key={option.id} className="col-md-6">
                              <button
                                type="button"
                                className="w-100 border-0 bg-transparent p-0 text-start h-100"
                                onClick={() =>
                                  recordAnswer({
                                    id: physicalHandlingQuestion.id,
                                    value: option.id,
                                  })
                                }
                              >
                                <div
                                  className={`rounded-4 h-100 d-flex flex-column justify-content-between p-3 p-md-4 ${
                                    isSelected
                                      ? "border border-2 border-primary bg-white"
                                      : "border border-2 border-transparent bg-light"
                                  }`}
                                >
                                  <div className="d-flex align-items-center mb-2">
                                    <div
                                      className={`rounded-circle d-inline-flex align-items-center justify-content-center me-3 ${
                                        isPrimaryChoice
                                          ? "bg-primary text-white"
                                          : "bg-white text-primary"
                                      }`}
                                      style={{ width: 32, height: 32 }}
                                    >
                                      {index + 1}
                                    </div>
                                    <div className="fw-semibold">
                                      {option.label.split("–")[0].trim()}
                                    </div>
                                  </div>
                                  <div className="mt-2 text-muted fs-6 lh-lg">
                                    {option.label.includes("–")
                                      ? option.label.split("–").slice(1).join("–").trim()
                                      : "This choice helps us understand how much strength you are comfortable managing on the leash."}
                                  </div>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
                </div>

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
    </>
  );
}
