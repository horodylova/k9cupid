import { QuizOptionId, purposeQuestion } from "@/lib/quizQuestions";

type PurposeQuestionProps = {
  selected: QuizOptionId | undefined;
  onChange: (next: QuizOptionId) => void;
};

const ICONS: Record<string, string> = {
  purpose_companion: "👨‍👩‍👧‍👦",
  purpose_guard: "🏠",
  purpose_active: "🏃",
  purpose_support: "❤️",
  purpose_service: "🦮",
  purpose_friend: "🐕",
};

export default function PurposeQuestion({
  selected,
  onChange,
}: PurposeQuestionProps) {
  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="h3 mb-2">{purposeQuestion.title}</h2>
        <p className="text-muted">Select the primary reason you are looking for a furry friend.</p>
      </div>
      
      <div className="row g-3 justify-content-center">
        {purposeQuestion.options.map((option) => {
          const isSelected = selected === option.id;
          const icon = ICONS[option.id] || "🐾";
          
          return (
            <div key={option.id} className="col-12 col-md-6 col-lg-4">
              <button
                type="button"
                className={`w-100 border-0 p-0 text-start h-100`}
                onClick={() => onChange(option.id as QuizOptionId)}
              >
                <div 
                  className={`rounded-4 p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center transition-all ${
                    isSelected 
                      ? "bg-white border border-2 border-primary shadow-sm" 
                      : "bg-white border border-1 border-light shadow-sm hover-shadow"
                  }`}
                  style={{ minHeight: "160px" }}
                >
                  <div className="display-4 mb-3">{icon}</div>
                  <span className="fw-semibold fs-5">{option.label}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
