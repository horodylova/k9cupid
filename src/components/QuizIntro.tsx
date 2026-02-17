 "use client";

import { useState } from "react";
import Link from "next/link";
import { homeTypeQuestion, QuizOptionId } from "@/lib/quizQuestions";

export default function QuizIntro() {
  const [started, setStarted] = useState(false);
  const [selectedHomeOption, setSelectedHomeOption] = useState<QuizOptionId | null>(null);

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

      <section className="py-5 my-5">
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
              <button
                type="button"
                className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 py-3 px-5"
                onClick={() => setStarted(true)}
              >
                Start the Quiz
              </button>
              {started && (
                <div className="mt-5">
                  <h3 className="h4 mb-3">{homeTypeQuestion.title}</h3>
                  <div className="d-flex flex-column gap-2">
                    {homeTypeQuestion.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`btn w-100 text-start ${
                          selectedHomeOption === option.id
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setSelectedHomeOption(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="p-4 p-md-5 border rounded-4 bg-light">
                <h3 className="h4 mb-3">What you can expect</h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">Questions about your daily routine</li>
                  <li className="mb-2">Your preferences and boundaries</li>
                  <li className="mb-2">Adaptive follow-up questions</li>
                  <li className="mb-2">Suggestions of breeds to explore</li>
                  <li className="mb-2">Focus on comfort and long-term happiness</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
