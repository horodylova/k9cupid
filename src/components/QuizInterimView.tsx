import React from "react";
import Image from "next/image";
import QuizInterimGrid from "@/components/quiz-interim/QuizInterimGrid";
import { Dog } from "@/lib/api";

interface QuizInterimViewProps {
  showShortlist: boolean;
  setShowShortlist: (show: boolean) => void;
  interimBreeds: Dog[];
  isLoadingInterim: boolean;
  onKeepRefining: () => void;
  onStartOver: () => void;
}

export default function QuizInterimView({
  showShortlist,
  setShowShortlist,
  interimBreeds,
  isLoadingInterim,
  onKeepRefining,
  onStartOver,
}: QuizInterimViewProps) {
  return (
    <>
      {!showShortlist && (
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
                    onClick={onKeepRefining}
                  >
                    Keep refining
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger text-uppercase fw-semibold"
                    onClick={onStartOver}
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShortlist && (
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
              onClick={onKeepRefining}
            >
              Keep refining
            </button>
          </div>
        </div>
      )}

      {showShortlist && (
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
              onClick={onKeepRefining}
            >
              Continue Quiz →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
