import { QuizQuestion, QuizScaleQuestion } from "@/lib/types";

export type QuizOptionId =
  | "home_apartment"
  | "home_house_small"
  | "home_house_large"
  | "handling_novice"
  | "handling_comfortable"
  | "handling_experienced"
  | "children_toddlers"
  | "children_school"
  | "children_teens"
  | "children_none"
  | "pets_dogs"
  | "pets_cats"
  | "pets_small"
  | "pets_none"
  | "shared_sofa"
  | "shared_bed"
  | "shared_own_bed"
  | "shared_floor"
  | "hair_not_bothered"
  | "hair_okay_clean"
  | "hair_prefer_less"
  | "hair_prefer_minimal"
  | "hair_allergies"
  | "visitors_daily"
  | "visitors_weekly"
  | "visitors_monthly"
  | "visitors_rarely"
  | "drooling_not_bothered"
  | "drooling_prefer_less"
  | "drooling_avoid"
  | "work_home"
  | "work_part_time"
  | "work_full_time"
  | "activity_sports"
  | "activity_regular"
  | "activity_calm_walks"
  | "activity_couch"
  | "importance_endurance"
  | "importance_play"
  | "importance_calm_home"
  | "days_5_7"
  | "days_2_4"
  | "days_0_1"
  | "social_friendly"
  | "social_polite"
  | "social_guardian";

export const socialBehaviorQuestion: QuizQuestion = {
  id: "social_behavior",
  type: "single_choice",
  title: "How should your dog react to strangers and guests?",
  options: [
    {
      id: "social_friendly",
      label: "Friendly to everyone (loves guests, happy to see strangers)",
    },
    {
      id: "social_polite",
      label: "Polite but watchful (calm, observes first, warms up slowly)",
    },
    {
      id: "social_guardian",
      label: "Guardian / Protective (barks at strangers, protects the home)",
    },
  ],
};

export const homeTypeQuestion: QuizQuestion = {
  id: "home_type",
  type: "single_choice",
  title: "Where do you live?",
  options: [
    {
      id: "home_apartment",
      label: "Apartment / Condo (No yard)",
    },
    {
      id: "home_house_small",
      label: "House with small yard / Patio",
    },
    {
      id: "home_house_large",
      label: "House with large yard / Acreage",
    },
  ],
};

export const physicalHandlingQuestion: QuizQuestion = {
  id: "physical_handling",
  type: "single_choice",
  title: "How much experience do you have with dogs?",
  options: [
    {
      id: "handling_novice",
      label: "I'm a first-time owner (or close to it)",
    },
    {
      id: "handling_comfortable",
      label: "I've had a dog before, I'm comfortable",
    },
    {
      id: "handling_experienced",
      label: "I'm very experienced / Professional",
    },
  ],
};

export const childrenQuestion: QuizQuestion = {
  id: "children_in_household",
  type: "multiple_choice",
  title: "Who lives in your home? (Select all that apply)",
  options: [
    {
      id: "children_toddlers",
      label: "Toddlers / Young children (0-5 yrs)",
    },
    {
      id: "children_school",
      label: "School-age children (6-12 yrs)",
    },
    {
      id: "children_teens",
      label: "Teenagers (13+)",
    },
    {
      id: "children_none",
      label: "Adults only",
    },
  ],
};

export const otherPetsQuestion: QuizQuestion = {
  id: "other_pets",
  type: "multiple_choice",
  title: "Do you have other pets?",
  options: [
    {
      id: "pets_dogs",
      label: "Yes, other dog(s)",
    },
    {
      id: "pets_cats",
      label: "Yes, cat(s)",
    },
    {
      id: "pets_small",
      label: "Yes, small animals (birds, hamsters, etc.)",
    },
    {
      id: "pets_none",
      label: "No other pets",
    },
  ],
};

export const sharedSpacesQuestion: QuizQuestion = {
  id: "shared_spaces",
  type: "multiple_choice",
  title: "Where will the dog be allowed to sleep/rest?",
  options: [
    {
      id: "shared_sofa",
      label: "On the sofa/furniture",
      imageSrc: "/sharing-space-photo-question/sofa.jpg",
    },
    {
      id: "shared_bed",
      label: "In my bed",
      imageSrc: "/sharing-space-photo-question/bed.jpg",
    },
    {
      id: "shared_own_bed",
      label: "In their own dog bed",
      imageSrc: "/sharing-space-photo-question/own-bed.jpg",
    },
    {
      id: "shared_floor",
      label: "Anywhere (Floor/Crate/etc.)",
      imageSrc: "/sharing-space-photo-question/box.jpg",
    },
  ],
};

export const visitorsQuestion: QuizQuestion = {
  id: "home_visitors",
  type: "single_choice",
  title: "How often do you have visitors?",
  options: [
    {
      id: "visitors_daily",
      label: "Almost every day",
    },
    {
      id: "visitors_weekly",
      label: "Once or twice a week",
    },
    {
      id: "visitors_monthly",
      label: "Once or twice a month",
    },
    {
      id: "visitors_rarely",
      label: "Almost never",
    },
  ],
};

export const noiseToleranceQuestion: QuizScaleQuestion = {
  id: "noise_tolerance",
  type: "scale",
  title: "How much barking can you tolerate?",
  description: "Some breeds are naturally more vocal than others.",
  scaleLabels: [
    {
      value: 1,
      label: "I prefer a very quiet dog (apartment friendly)",
    },
    {
      value: 3,
      label: "Average amount is okay",
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
      label: "Weekly brushing is fine",
    },
    {
      value: 4,
      label: "Daily brushing if needed",
    },
    {
      value: 5,
      label: "I love grooming / Professional grooming is fine",
    },
  ],
};

export const droolingToleranceQuestion: QuizQuestion = {
  id: "drooling_tolerance",
  type: "single_choice",
  title: "How do you feel about drooling?",
  options: [
    {
      id: "drooling_not_bothered",
      label: "It doesn't bother me",
    },
    {
      id: "drooling_prefer_less",
      label: "I prefer less, but can handle some",
    },
    {
      id: "drooling_avoid",
      label: "I want to avoid it completely",
    },
  ],
};

export const workScheduleQuestion: QuizQuestion = {
  id: "work_schedule",
  type: "single_choice",
  title: "What does your typical work schedule look like?",
  options: [
    {
      id: "work_home",
      label: "Mostly at home (remote / hybrid with many days at home)",
      imageSrc: "/work-home-office/work-home.jpg",
    },
    {
      id: "work_part_time",
      label: "Office or away from home for 4–6 hours a day",
      imageSrc: "/work-home-office/office.jpg",
    },
    {
      id: "work_full_time",
      label: "Office or away from home for 7+ hours a day",
      imageSrc: "/work-home-office/work-late.jpg",
    },
  ],
};

export const activityLevelQuestion: QuizQuestion = {
  id: "activity_level",
  type: "single_choice",
  title: "How do you envision your activity with the dog?",
  options: [
    {
      id: "activity_sports",
      label: "My sports partner: running, hiking, long active walks",
      imageSrc: "/walks/running with dog.jpg",
    },
    {
      id: "activity_regular",
      label: "Regular walks 1–2 times a day, occasional active weekends",
      imageSrc: "/walks/long walk.jpg",
    },
    {
      id: "activity_calm_walks",
      label: "Short but stable walks, more home time together",
      imageSrc: "/walks/walk with dog.jpg",
    },
    {
      id: "activity_couch",
      label: "I move little, the dog should be calm and not require much activity",
      imageSrc: "/walks/carry dog.jpg",
    },
  ],
};

export const activeImportanceQuestion: QuizQuestion = {
  id: "active_importance",
  type: "single_choice",
  title: "When you say 'active dog', what is most important to you?",
  options: [
    {
      id: "importance_endurance",
      label: "That it can run a lot and endure physical load",
    },
    {
      id: "importance_play",
      label: "That it loves to play and involve me in activities",
    },
    {
      id: "importance_calm_home",
      label: "That it is enduring in nature, but rests calmly at home",
    },
  ],
};

export const activeDaysQuestion: QuizQuestion = {
  id: "active_days",
  type: "single_choice",
  title: "How many days a week are you realistically ready to devote to active pursuits (running, sports, training)?",
  options: [
    {
      id: "days_5_7",
      label: "5–7 days",
    },
    {
      id: "days_2_4",
      label: "2–4 days",
    },
    {
      id: "days_0_1",
      label: "0–1 days",
    },
  ],
};

export const walksTimeQuestion: QuizScaleQuestion = {
  id: "walks_time",
  type: "scale",
  title: "On an average day, how much total time can you realistically spend walking your dog?",
  scaleLabels: [
    { value: 1, label: "Up to 30 minutes" },
    { value: 2, label: "30–45 minutes" },
    { value: 3, label: "45–60 minutes" },
    { value: 4, label: "60–90 minutes" },
    { value: 5, label: "More than 90 minutes" },
  ],
};

export const purposeQuestion: QuizQuestion = {
  id: "purpose",
  type: "single_choice",
  title: "What is your main goal for getting a dog?",
  options: [
    { id: "purpose_companion", label: "Family Companion (Play with kids, family time)" },
    { id: "purpose_guard", label: "Home Guardian (Watchdog, protection)" },
    { id: "purpose_active", label: "Active Partner (Sports, hiking, running)" },
    { id: "purpose_support", label: "Emotional Support (Comfort, anxiety relief)" },
    { id: "purpose_service", label: "Service/Work (Assistance, therapy, herding)" },
    { id: "purpose_friend", label: "Just a Best Friend (Happy tail-wagger)" },
  ],
};
