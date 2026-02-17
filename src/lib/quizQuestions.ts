export type QuizQuestionType = "single_choice" | "multi_choice" | "scale";

export type QuizOptionId =
  | "home_studio"
  | "home_apartment"
  | "home_house";

export type QuizOption = {
  id: QuizOptionId;
  label: string;
};

export type QuizQuestion = {
  id: string;
  type: QuizQuestionType;
  title: string;
  description?: string;
  options: QuizOption[];
};

export const homeTypeQuestion: QuizQuestion = {
  id: "home_type",
  type: "single_choice",
  title: "Which of these best describes your current home?",
  options: [
    {
      id: "home_studio",
      label: "A small studio or one-room apartment",
    },
    {
      id: "home_apartment",
      label: "A regular apartment with separate rooms",
    },
    {
      id: "home_house",
      label: "A house or townhouse with a yard",
    },
  ],
};

