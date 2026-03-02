import { workScheduleQuestion, QuizOptionId } from "@/lib/quizQuestions";
import PhotoSingleChoiceQuestion from "@/components/PhotoSingleChoiceQuestion";

type WorkScheduleQuestionProps = {
  selected: QuizOptionId | undefined;
  onChange: (next: QuizOptionId) => void;
};

export default function WorkScheduleQuestion({
  selected,
  onChange,
}: WorkScheduleQuestionProps) {
  return (
    <PhotoSingleChoiceQuestion
      title={workScheduleQuestion.title}
      subtitle="This helps us find dogs that match your daily rhythm."
      options={workScheduleQuestion.options}
      selected={selected}
      onChange={onChange}
    />
  );
}
