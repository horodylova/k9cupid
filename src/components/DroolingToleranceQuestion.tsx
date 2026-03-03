"use client";

import { droolingToleranceQuestion, QuizOptionId } from "@/lib/quizQuestions";

type Props = {
  selected?: QuizOptionId;
  onChange: (value: QuizOptionId) => void;
};

export default function DroolingToleranceQuestion({ selected, onChange }: Props) {
  return (
    <>
      <div className="mb-3">
        <h1 className="h4 mb-1">{droolingToleranceQuestion.title}</h1>
      </div>
      <div className="d-flex flex-column gap-3 col-12 col-md-10 col-lg-8">
        {droolingToleranceQuestion.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`btn w-100 text-start ${
              selected === option.id
                ? "btn-primary"
                : "btn-outline-secondary btn-quiz-option"
            }`}
            onClick={() => onChange(option.id as QuizOptionId)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}
