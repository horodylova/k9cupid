"use client";

import { socialBehaviorQuestion, QuizOptionId } from "@/lib/quizQuestions";

type Props = {
  selected?: QuizOptionId;
  onChange: (value: QuizOptionId) => void;
};

export default function SocialBehaviorQuestion({ selected, onChange }: Props) {
  return (
    <>
      <div className="mb-3">
        <h1 className="h3 mb-0">{socialBehaviorQuestion.title}</h1>
      </div>
      <div className="d-flex flex-column gap-3 col-12 col-md-10 col-lg-8">
        {socialBehaviorQuestion.options.map((option: { id: string; label: string }) => (
          <button
            key={option.id}
            type="button"
            className={`btn w-100 text-start ${
              selected === option.id ? "btn-primary" : "btn-outline-secondary btn-quiz-option"
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
