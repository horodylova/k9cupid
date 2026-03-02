import { activityLevelQuestion, QuizOptionId } from "@/lib/quizQuestions";
import PhotoSingleChoiceQuestion from "@/components/PhotoSingleChoiceQuestion";

type ActivityLevelQuestionProps = {
  selected: QuizOptionId | undefined;
  onChange: (next: QuizOptionId) => void;
};

export default function ActivityLevelQuestion({
  selected,
  onChange,
}: ActivityLevelQuestionProps) {
  return (
    <PhotoSingleChoiceQuestion
      title={activityLevelQuestion.title}
      subtitle="This helps us understand the energy level you expect from your dog."
      options={activityLevelQuestion.options}
      selected={selected}
      onChange={onChange}
    />
  );
}
