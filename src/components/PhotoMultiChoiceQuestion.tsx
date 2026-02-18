import Image from "next/image";
import { QuizOptionId, QuizOption } from "@/lib/quizQuestions";

type PhotoMultiChoiceQuestionProps = {
  title: string;
  subtitle?: string;
  options: QuizOption[];
  selected: QuizOptionId[];
  onChange: (next: QuizOptionId[]) => void;
};

export default function PhotoMultiChoiceQuestion({
  title,
  subtitle,
  options,
  selected,
  onChange,
}: PhotoMultiChoiceQuestionProps) {
  const toggleOption = (id: QuizOptionId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((value) => value !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <div className="mb-3 text-start">
        <h2 className="h4 mb-1">{title}</h2>
        {subtitle && (
          <p className="mb-0 text-muted">{subtitle}</p>
        )}
      </div>
      <div className="row g-3">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);

          return (
            <div key={option.id} className="col-6 col-md-4">
              <button
                type="button"
                className="w-100 border-0 bg-transparent p-0"
                onClick={() => toggleOption(option.id)}
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
                    style={{ height: "160px" }}
                  >
                    {option.imageSrc ? (
                      <Image
                        src={option.imageSrc}
                        alt={option.label}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
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
                  <div className="px-3 py-3 text-center">
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

