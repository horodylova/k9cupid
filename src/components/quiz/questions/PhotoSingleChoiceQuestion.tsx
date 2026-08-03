import Image from "next/image";
import { QuizOptionId } from "@/lib/quizQuestions";
import { QuizOption } from "@/lib/types";

type PhotoSingleChoiceQuestionProps = {
  title: string;
  subtitle?: string;
  options: QuizOption[];
  selected: QuizOptionId | undefined;
  onChange: (next: QuizOptionId) => void;
};

export default function PhotoSingleChoiceQuestion({
  title,
  subtitle,
  options,
  selected,
  onChange,
}: PhotoSingleChoiceQuestionProps) {
  // Use col-md-3 to ensure 4 items fit in one row on desktop/tablet
  const colClass = options.length === 4 ? "col-12 col-md-3" : "col-12 col-md-4";

  return (
    <div>
      <div className="mb-3 text-start">
        <h2 className="h4 mb-1">{title}</h2>
        {subtitle && <p className="mb-0 text-muted">{subtitle}</p>}
      </div>
      <div className="row g-3">
        {options.map((option) => {
          const isSelected = selected === option.id;

          return (
            <div key={option.id} className={colClass}>
              <button
                type="button"
                className="w-100 border-0 bg-transparent p-0"
                onClick={() => onChange(option.id as QuizOptionId)}
              >
                <div
                  className={`rounded-4 h-100 d-flex flex-column overflow-hidden ${
                    isSelected
                      ? "border border-2 border-primary bg-white"
                      : "border border-2 border-transparent bg-light"
                  }`}
                >
                  <div
                    className="w-100 position-relative"
                    style={{ height: "200px" }}
                  >
                    {option.imageSrc ? (
                      <Image
                        src={option.imageSrc}
                        alt={option.label}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-fit-cover w-100 h-100"
                      />
                    ) : (
                      <div
                        className="w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(135deg, #F9F3EC 0%, #FCE4C6 100%)",
                        }}
                      />
                    )}
                  </div>
                  <div className="px-3 py-4 text-center d-flex align-items-center justify-content-center flex-grow-1">
                    <span className="fw-medium">{option.label}</span>
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
