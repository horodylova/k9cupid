"use client";

import { hairToleranceQuestion, QuizOptionId } from "@/lib/quizQuestions";

type Props = {
  selected?: QuizOptionId;
  onChange: (value: QuizOptionId) => void;
};

export default function HairToleranceQuestion({ selected, onChange }: Props) {
  return (
    <>
      <div className="mb-3">
        <h1 className="h4 mb-1">{hairToleranceQuestion.title}</h1>
      </div>
      <div className="d-flex flex-column gap-3">
        {hairToleranceQuestion.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`btn w-100 text-start ${
              selected === option.id
                ? "btn-primary"
                : "btn-outline-secondary"
            }`}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}
