import { otherPetsQuestion, QuizOptionId } from "@/lib/quizQuestions";
import TagMultiChoiceQuestion from "@/components/TagMultiChoiceQuestion";

type PetsQuestionProps = {
  selected: QuizOptionId[];
  onChange: (next: QuizOptionId[]) => void;
};

export default function PetsQuestion({ selected, onChange }: PetsQuestionProps) {
  return (
    <TagMultiChoiceQuestion
      title={otherPetsQuestion.title}
      subtitle="Helps us account for compatibility with other animals at home."
      options={otherPetsQuestion.options}
      selected={selected}
      onChange={onChange}
      exclusiveOptionId="pets_none"
    />
  );
}

