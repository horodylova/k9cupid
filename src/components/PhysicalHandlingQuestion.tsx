"use client";

import { physicalHandlingQuestion, QuizOptionId } from "@/lib/quizQuestions";

type Props = {
  selected?: QuizOptionId;
  onChange: (value: QuizOptionId) => void;
};

export default function PhysicalHandlingQuestion({ selected, onChange }: Props) {
  return (
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
          const isSelected = selected === option.id;
          const isPrimaryChoice = index <= 1;

          return (
            <div key={option.id} className="col-md-4">
              <button
                type="button"
                className="w-100 border-0 bg-transparent p-0 text-start h-100"
                onClick={() => onChange(option.id as QuizOptionId)}
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
  );
}
