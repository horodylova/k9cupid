import { QuizOption, QuizOptionId } from "@/lib/quizQuestions";

type TagMultiChoiceQuestionProps = {
  title: string;
  subtitle?: string;
  options: QuizOption[];
  selected: QuizOptionId[];
  onChange: (next: QuizOptionId[]) => void;
  exclusiveOptionId?: QuizOptionId;
};

export default function TagMultiChoiceQuestion({
  title,
  subtitle,
  options,
  selected,
  onChange,
  exclusiveOptionId,
}: TagMultiChoiceQuestionProps) {
  const handleToggle = (id: QuizOptionId) => {
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
    <div className="h-100 d-flex flex-column">
      <div className="mb-3 text-center text-md-start">
        <h1 className="h4 mb-1">{title}</h1>
        {subtitle && <p className="mb-0 text-muted">{subtitle}</p>}
      </div>
      <div className="d-flex flex-wrap gap-2 mt-1">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              className={`btn rounded-pill px-3 py-2 d-inline-flex align-items-center ${
                isSelected
                  ? "btn-primary"
                  : "btn-light border border-2 border-secondary text-body"
              }`}
              onClick={() => handleToggle(option.id)}
            >
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
