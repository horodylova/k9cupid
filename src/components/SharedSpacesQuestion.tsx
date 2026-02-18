import { sharedSpacesQuestion, QuizOptionId } from "@/lib/quizQuestions";
import PhotoMultiChoiceQuestion from "@/components/PhotoMultiChoiceQuestion";

type SharedSpacesQuestionProps = {
  selected: QuizOptionId[];
  onChange: (next: QuizOptionId[]) => void;
};

export default function SharedSpacesQuestion({
  selected,
  onChange,
}: SharedSpacesQuestionProps) {
  return (
    <PhotoMultiChoiceQuestion
      title={sharedSpacesQuestion.title}
      subtitle="Choose all options that feel natural for you."
      options={sharedSpacesQuestion.options}
      selected={selected}
      onChange={onChange}
    />
  );
}
