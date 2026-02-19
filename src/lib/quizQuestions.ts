export type QuizQuestionType = "single_choice" | "multi_choice" | "scale";

export type QuizOptionId =
  | "home_studio"
  | "home_apartment"
  | "home_house"
  | "shared_sofa"
  | "shared_bed"
  | "shared_car"
  | "shared_own_space"
  | "shared_not_sure"
  | "handling_very_confident"
  | "handling_somewhat_confident"
  | "handling_prefer_easy_control"
  | "handling_not_sure"
  | "children_none"
  | "children_babies_toddlers"
  | "children_young"
  | "children_older"
  | "pets_dog"
  | "pets_cat"
  | "pets_small_animals"
  | "pets_none"
  | "visitors_very_often"
  | "visitors_regularly"
  | "visitors_occasionally"
  | "visitors_almost_never";

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

export const physicalHandlingQuestion: QuizQuestion = {
  id: "physical_handling",
  type: "single_choice",
  title:
    "How confident do you feel about physically handling a strong dog on a leash (for example, 30+ kg / 65+ lbs)?",
  options: [
    {
      id: "handling_very_confident",
      label: "Very confident – I am used to strong dogs",
    },
    {
      id: "handling_somewhat_confident",
      label: "Somewhat confident – with training and the right equipment",
    },
    {
      id: "handling_prefer_easy_control",
      label: "I prefer a dog I can easily control on my own",
    },
    {
      id: "handling_not_sure",
      label: "I am not sure / I have never had a dog",
    },
  ],
};

export const childrenQuestion: QuizQuestion = {
  id: "children_in_household",
  type: "multi_choice",
  title: "Do you have children living with you or visiting regularly?",
  options: [
    {
      id: "children_none",
      label: "No children",
    },
    {
      id: "children_babies_toddlers",
      label: "Babies / toddlers (0–3 years)",
    },
    {
      id: "children_young",
      label: "Young children (4–6 years)",
    },
    {
      id: "children_older",
      label: "Older children (7+ years)",
    },
  ],
};

export const otherPetsQuestion: QuizQuestion = {
  id: "other_pets",
  type: "multi_choice",
  title: "Do you have other pets at home?",
  options: [
    {
      id: "pets_dog",
      label: "Another dog",
    },
    {
      id: "pets_cat",
      label: "A cat",
    },
    {
      id: "pets_small_animals",
      label: "Other small animals",
    },
    {
      id: "pets_none",
      label: "No other pets",
    },
  ],
};

export const visitorsQuestion: QuizQuestion = {
  id: "home_visitors",
  type: "single_choice",
  title: "How often do you usually have visitors at home (friends, family, guests)?",
  options: [
    {
      id: "visitors_very_often",
      label: "Very often – several times a week",
    },
    {
      id: "visitors_regularly",
      label: "Regularly – a few times a month",
    },
    {
      id: "visitors_occasionally",
      label: "Occasionally – a few times a year",
    },
    {
      id: "visitors_almost_never",
      label: "Almost never",
    },
  ],
};
