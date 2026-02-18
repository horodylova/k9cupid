import { childrenQuestion, QuizOptionId } from "@/lib/quizQuestions";
import TagMultiChoiceQuestion from "@/components/TagMultiChoiceQuestion";

type ChildrenQuestionProps = {
  selected: QuizOptionId[];
  onChange: (next: QuizOptionId[]) => void;
};

export default function ChildrenQuestion({
  selected,
  onChange,
}: ChildrenQuestionProps) {
  return (
    <TagMultiChoiceQuestion
      title={childrenQuestion.title}
      subtitle="This helps us recommend breeds that match your family life."
      options={childrenQuestion.options}
      selected={selected}
      onChange={onChange}
      exclusiveOptionId="children_none"
    />
  );
}

