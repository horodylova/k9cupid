export type QuizQuestionType = "single_choice" | "multi_choice" | "scale";

export type QuizOptionId =
  | "home_studio"
  | "home_apartment"
  | "home_house"
  | "shared_sofa"
  | "shared_bed"
  | "shared_car"
  | "shared_own_space"
  | "shared_not_sure";

export type QuizOption = {
  id: QuizOptionId;
  label: string;
  imageSrc?: string;
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

export const sharedSpacesQuestion: QuizQuestion = {
  id: "shared_spaces",
  type: "multi_choice",
  title: "Where are you comfortable sharing space with your future dog?",
  options: [
    {
      id: "shared_sofa",
      label: "On the sofa",
      imageSrc: "/sharing-space-photo-question/sofa.jpg",
    },
    {
      id: "shared_bed",
      label: "On the bed",
      imageSrc: "/sharing-space-photo-question/bed.jpg",
    },
    {
      id: "shared_car",
      label: "In the car on trips",
      imageSrc: "/sharing-space-photo-question/car.jpg",
    },
    {
      id: "shared_own_space",
      label: "Only on their own space",
      imageSrc: "/sharing-space-photo-question/own-bed.jpg",
    },
    {
      id: "shared_not_sure",
      label: "I am not sure yet",
      imageSrc: "/sharing-space-photo-question/box.jpg",
    },
  ],
};
