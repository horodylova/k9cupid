import Image from "next/image";
import { QuizOptionId } from "@/lib/quizQuestions";
import { QuizOption } from "@/lib/types";

type PhotoMultiChoiceQuestionProps = {
  title: string;
  subtitle?: string;
  options: QuizOption[];
  selected: QuizOptionId[];
  onChange: (next: QuizOptionId[]) => void;
  exclusiveOptionId?: QuizOptionId;
};

export default function PhotoMultiChoiceQuestion({
  title,
  subtitle,
  options,
  selected,
  onChange,
  exclusiveOptionId,
}: PhotoMultiChoiceQuestionProps) {
  const toggleOption = (id: QuizOptionId) => {
    const isExclusive = exclusiveOptionId && id === exclusiveOptionId;

    if (isExclusive) {
      onChange(selected.includes(id) ? [] : [id]);
      return;
    }

    const withoutExclusive = exclusiveOptionId
      ? selected.filter((value) => value !== exclusiveOptionId)
      : selected;

    if (withoutExclusive.includes(id)) {
      onChange(withoutExclusive.filter((value) => value !== id));
      return;
    }

    onChange([...withoutExclusive, id]);
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
          const isSelected = selected.includes(option.id as QuizOptionId);

          return (
            <div key={option.id} className="col-6 col-md-3">
              <button
                type="button"
                className="w-100 border-0 bg-transparent p-0"
                onClick={() => toggleOption(option.id as QuizOptionId)}
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
                        sizes="(max-width: 768px) 50vw, 25vw"
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
