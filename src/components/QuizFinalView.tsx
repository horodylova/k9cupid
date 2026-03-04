import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QuizInterimGrid from "@/components/quiz-interim/QuizInterimGrid";
import { Dog } from "@/lib/api";
import { QuizStartOverModal } from "@/components/QuizModals";

interface QuizFinalViewProps {
  analysis: { title: string; text: string };
  finalBreeds: Dog[];
  interimBreeds: Dog[];
}

export default function QuizFinalView({
  analysis,
  finalBreeds,
  interimBreeds,
}: QuizFinalViewProps) {
  const [showShortlist, setShowShortlist] = useState(false);
  // We can manage the modal state locally here since it's an isolated view
  const [showModal, setShowModal] = useState(false);

  const handleStartOver = () => {
    setShowModal(true);
  };

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
              <div className="d-inline-block bg-white border rounded-pill px-4 py-2 mb-4 shadow-sm">
                <span className="fw-bold text-primary">{analysis.title}:</span> <span className="text-muted">{analysis.text}</span>
              </div>

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

      {showModal && (
        <QuizStartOverModal onCancel={() => setShowModal(false)} />
      )}
    </section>
  );
}
