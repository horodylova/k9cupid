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
  | "visitors_almost_never"
  | "hair_not_bothered"
  | "hair_okay_clean"
  | "hair_prefer_less"
  | "hair_prefer_minimal"
  | "hair_allergies"
  | "drooling_fine"
  | "drooling_okay"
  | "drooling_prefer_less"
  | "drooling_uncomfortable";

export type QuizOption = {
  id: QuizOptionId;
  label: string;
  imageSrc?: string;
};

export type QuizScaleLabel = {
  value: number;
  label: string;
};

export type QuizQuestion = {
  id: string;
  type: QuizQuestionType;
  title: string;
  description?: string;
  options: QuizOption[];
};

export type QuizScaleQuestion = {
  id: string;
  type: "scale";
  title: string;
  description?: string;
  scaleLabels: QuizScaleLabel[];
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

export const noiseToleranceQuestion: QuizScaleQuestion = {
  id: "noise_tolerance",
  type: "scale",
  title: "How sensitive is your environment to barking and noise?",
  scaleLabels: [
    {
      value: 1,
      label: "Barking is not a problem at all",
    },
    {
      value: 2,
      label: "A bit of barking is fine",
    },
    {
      value: 3,
      label: "Some barking is okay, but not constant",
    },
    {
      value: 4,
      label: "I prefer a mostly quiet dog",
    },
    {
      value: 5,
      label: "Barking would be a serious problem (neighbours / building rules)",
    },
  ],
};

export const hairToleranceQuestion: QuizQuestion = {
  id: "hair_tolerance",
  type: "single_choice",
  title: "How do you feel about dog hair on clothes and furniture?",
  options: [
    {
      id: "hair_not_bothered",
      label: "It does not bother me at all",
    },
    {
      id: "hair_okay_clean",
      label: "It is okay, I will just clean more often",
    },
    {
      id: "hair_prefer_less",
      label: "I prefer less hair, but can accept some",
    },
    {
      id: "hair_prefer_minimal",
      label: "I really prefer minimal hair",
    },
    {
      id: "hair_allergies",
      label: "I have allergies / hair is a big problem for me",
    },
  ],
};

export const groomingTimeQuestion: QuizScaleQuestion = {
  id: "grooming_time",
  type: "scale",
  title:
    "How much time are you willing to spend on grooming (brushing, baths, trimming)?",
  scaleLabels: [
    {
      value: 1,
      label: "Almost no grooming – quick wipe and go",
    },
    {
      value: 2,
      label: "A bit of brushing from time to time",
    },
    {
      value: 3,
      label: "Regular brushing a few times a month",
    },
    {
      value: 4,
      label: "Weekly grooming sessions are fine",
    },
    {
      value: 5,
      label: "I enjoy grooming and can do it often",
    },
  ],
};

export const droolingToleranceQuestion: QuizQuestion = {
  id: "drooling_tolerance",
  type: "single_choice",
  title: "How do you feel about drooling (saliva on toys, floor, clothes)?",
  options: [
    {
      id: "drooling_fine",
      label: "Totally fine, that is part of the charm",
    },
    {
      id: "drooling_okay",
      label: "Okay in moderation",
    },
    {
      id: "drooling_prefer_less",
      label: "I would prefer less drooling",
    },
    {
      id: "drooling_uncomfortable",
      label: "Drooling would be very uncomfortable for me",
    },
  ],
};
