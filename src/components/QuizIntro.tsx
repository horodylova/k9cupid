 "use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { loadQuizSession, clearQuizSession } from "@/lib/quizStorage";

export default function QuizIntro() {
  const [hasSavedSession, setHasSavedSession] = useState(false);

  useEffect(() => {
    const session = loadQuizSession();
    if (session && session.answers.length > 0) {
      setHasSavedSession(true);
    }
  }, []);

  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">
              Quiz <span className="text-primary">Preview</span>
            </h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                Quiz
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section className="pt-5 pb-4 mt-5 mb-4">
        <div className="container">
          <div className="row align-items-center g-md-5">
            <div className="col-lg-7">
              <h2 className="display-5 mb-4">
                Find the dog that fits your life
              </h2>
              <p className="mb-3">
                This quiz is designed to help you find a dog that truly matches
                your lifestyle, expectations, and emotional needs. We look at
                your routine, energy level, experience with dogs, and what you
                dream about in your future companion.
              </p>
              <p className="mb-3">
                Based on your answers, we will suggest breeds that are more
                likely to feel comfortable with you, and with whom you will be
                comfortable too. The goal is a happy, long-term match where
                both sides feel understood and safe.
              </p>
              <p className="mb-3">
                The quiz will take around 10–15 minutes. Please answer
                thoughtfully and honestly. There are no right or wrong answers
                here, only what is right for you.
              </p>
              <p className="mb-4">
                As you go through the quiz, new questions will appear depending
                on your previous answers. This adaptive flow lets us go deeper
                into topics that matter most to you while skipping what is not
                relevant.
              </p>
              <div className="d-flex flex-column flex-md-row gap-3">
                <Link
                  href="/quiz/start"
                  onClick={() => clearQuizSession()}
                  className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 py-3 px-5"
                >
                  Start the Quiz
                </Link>
                {hasSavedSession && (
                  <Link
                    href="/quiz/start"
                    className="btn btn-primary btn-lg text-uppercase fs-6 rounded-1 py-3 px-5"
                  >
                    Continue your quiz
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="p-4 p-md-5 border rounded-4 bg-light">
                <h3 className="h4 mb-3" style={{ scrollMarginTop: 120 }}>
                  What you can expect
                </h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">Questions about your daily routine</li>
                  <li className="mb-2">Your preferences and boundaries</li>
                  <li className="mb-2">Adaptive follow-up questions</li>
                  <li className="mb-2">Suggestions of breeds to explore</li>
                  <li className="mb-2">Focus on comfort and long-term happiness</li>
                </ul>
              </div>

              <div
                className="mt-4 p-4 border rounded-4"
                style={{ background: "#F9F3EC", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Image
                    src="/logo%20CarCupid.png"
                    alt="CarCupid"
                    width={64}
                    height={64}
                    style={{ objectFit: "contain" }}
                  />
                  <div>
                    <div className="fw-semibold" style={{ fontSize: 18 }}>
                      CarCupid
                    </div>
                    <div className="text-muted" style={{ fontSize: 14 }}>
                      Find your top 10 cars from 10,000+ options
                    </div>
                  </div>
                </div>
                <div className="text-muted" style={{ fontSize: 15, lineHeight: 1.45 }}>
                  We know you are choosing a dog and we do not want to distract you. If you are curious, we also built a
                  car quiz that matches your lifestyle and preferences. The results are surprisingly accurate.
                </div>
                <ul className="mt-3 mb-3 ps-3" style={{ fontSize: 15, lineHeight: 1.45 }}>
                  <li>Lifestyle-based questions</li>
                  <li>Your top 10 picks, tailored to you</li>
                </ul>
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                  <a
                    href="https://carcupid.fit/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-dark btn-sm text-uppercase fs-6 rounded-1 px-4 py-2"
                  >
                    Try CarCupid
                  </a>
                  <div className="text-muted align-self-center" style={{ fontSize: 13 }}>
                    Come back anytime to continue your dog quiz
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
