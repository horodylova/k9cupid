"use server";

import { getBreeds, Dog } from "@/lib/api";
import { QuizOptionId } from "@/lib/quizQuestions";
import {
  getPreferredSizesForHome,
  getHomeSizeSuitability,
  getPhysicalHandlingSuitability,
  getChildrenInHouseholdSuitability,
  getOtherPetsSuitability,
  getSharedSpacesSizeSuitability,
  getHairToleranceLevel,
  getHairToleranceSuitability,
  getGroomingTimeSuitability,
  getVisitorsSuitability,
  getBarkingSuitability,
  getDroolingToleranceLevel,
  getDroolingSuitability,
  getWorkScheduleSuitability,
  getActivityLevelSuitability,
  getActiveImportanceSuitability,
  getActiveDaysSuitability,
  getWalksTimeSuitability,
  getSocialBehaviorSuitability,
  getDogSizeCategory,
} from "@/lib/quizSizeUtils";

export type InterimQuizResult = {
  breeds: Dog[];
};

export async function getQuizInterimBreeds(answers: { id: string; value: unknown }[]): Promise<InterimQuizResult> {
  const homeAnswer = answers.find((a) => a.id === "home_type")?.value as QuizOptionId;
  const handlingAnswer = answers.find((a) => a.id === "physical_handling")?.value as QuizOptionId;
  const childrenAnswer = answers.find((a) => a.id === "children_in_household")?.value as QuizOptionId[];
  const petsAnswer = answers.find((a) => a.id === "other_pets")?.value as QuizOptionId[];
  const sharedSpacesAnswer = answers.find((a) => a.id === "shared_spaces")?.value as QuizOptionId[];
  const hairToleranceAnswer = answers.find((a) => a.id === "hair_tolerance")?.value as QuizOptionId;
  const groomingTimeAnswer = answers.find((a) => a.id === "grooming_time")?.value as number;
  const visitorsAnswer = answers.find((a) => a.id === "home_visitors")?.value as QuizOptionId;
  const noiseToleranceAnswer = answers.find((a) => a.id === "noise_tolerance")?.value as number;
  const droolingToleranceAnswer = answers.find((a) => a.id === "drooling_tolerance")?.value as QuizOptionId;
  const workScheduleAnswer = answers.find((a) => a.id === "work_schedule")?.value as QuizOptionId;
  const activityLevelAnswer = answers.find((a) => a.id === "activity_level")?.value as QuizOptionId;
  const activeImportanceAnswer = answers.find((a) => a.id === "active_importance")?.value as QuizOptionId;
  const activeDaysAnswer = answers.find((a) => a.id === "active_days")?.value as QuizOptionId;
  const walksTimeAnswer = answers.find((a) => a.id === "walks_time")?.value as number;
  const socialBehaviorAnswer = answers.find((a) => a.id === "social_behavior")?.value as QuizOptionId;

  const allowedSizes = new Set<string>();

  if (homeAnswer) {
    const homeSizes = getPreferredSizesForHome(homeAnswer);
    homeSizes.forEach((s) => allowedSizes.add(s));
  } else {
    ["toy", "small", "medium", "large"].forEach((s) => allowedSizes.add(s));
  }

  // Fetch ALL breeds once (batched) to ensure we have the full dataset
  const { breeds: allBreeds } = await getBreeds({ fetchAll: true });

  // Filter by allowed sizes
  const filteredDogs = allBreeds.filter((dog) => {
    const size = getDogSizeCategory(dog);
    return allowedSizes.has(size);
  });

  const scoredDogs = filteredDogs
    .map((dog) => {
      let totalScore = 0;

      // 1. Size Suitability Score (Home + Handling + Shared Spaces)
      let sizeScoreSum = 0;
      let sizeFactors = 0;

      if (homeAnswer) {
        sizeScoreSum += getHomeSizeSuitability(homeAnswer, dog);
        sizeFactors++;
      }

      if (handlingAnswer) {
        sizeScoreSum += getPhysicalHandlingSuitability(handlingAnswer, dog);
        sizeFactors++;
      }

      if (sharedSpacesAnswer && sharedSpacesAnswer.length > 0) {
        sizeScoreSum += getSharedSpacesSizeSuitability(sharedSpacesAnswer, dog);
        sizeFactors++;
      }

      const avgSizeScore = sizeFactors > 0 ? sizeScoreSum / sizeFactors : 3;

      // REMOVED HARD FILTER: if (avgSizeScore < 2) return null;
      // We keep all dogs and let the low score push them to the bottom of the list.
      // This ensures we always show "best available" results even if not ideal.

      totalScore += avgSizeScore * 10;

      // 2. Children Suitability
      if (childrenAnswer && childrenAnswer.length > 0) {
        const childScore = getChildrenInHouseholdSuitability(childrenAnswer, dog);
        totalScore += childScore * 5;
      }

      // 3. Hair & Grooming Suitability (Combined)
      // We calculate an average score from both factors if they are present.
      let hairGroomingScoreSum = 0;
      let hairGroomingFactors = 0;

      if (hairToleranceAnswer) {
        const hairLevel = getHairToleranceLevel(hairToleranceAnswer);
        if (hairLevel) {
          hairGroomingScoreSum += getHairToleranceSuitability(hairLevel, dog);
          hairGroomingFactors++;
        }
      }

      if (groomingTimeAnswer) {
        // Only count if answer is valid (1-5)
        if (groomingTimeAnswer >= 1 && groomingTimeAnswer <= 5) {
          hairGroomingScoreSum += getGroomingTimeSuitability(groomingTimeAnswer, dog);
          hairGroomingFactors++;
        }
      }

      if (hairGroomingFactors > 0) {
        const avgHairGroomingScore = hairGroomingScoreSum / hairGroomingFactors;
        totalScore += avgHairGroomingScore * 4; // Weighted highly (4x)
      }

      // 4. Other Pets Suitability
      if (petsAnswer && petsAnswer.length > 0) {
        const petScore = getOtherPetsSuitability(petsAnswer, dog);
        totalScore += petScore * 3;
      }

      // 5. Trainability Bonus
      totalScore += (dog.trainability || 0);

      // 6. Visitors Suitability
      if (visitorsAnswer) {
        const score = getVisitorsSuitability(visitorsAnswer, dog);
        totalScore += score * 3;
      }

      // 7. Noise Suitability
      if (typeof noiseToleranceAnswer === "number") {
        const score = getBarkingSuitability(noiseToleranceAnswer, dog);
        totalScore += score * 3;
      }

      // 8. Drooling Suitability
      if (droolingToleranceAnswer) {
        const level = getDroolingToleranceLevel(droolingToleranceAnswer);
        if (level) {
          const score = getDroolingSuitability(level, dog);
          totalScore += score * 3;
        }
      }

      // 9. Work Schedule Suitability
      if (workScheduleAnswer) {
        const score = getWorkScheduleSuitability(workScheduleAnswer, dog);
        totalScore += score * 3; // Medium importance
      }

      // 10. Activity Level Suitability
      if (activityLevelAnswer) {
        const score = getActivityLevelSuitability(activityLevelAnswer, dog);
        totalScore += score * 3;
      }

      // 11. Active Importance (Conditional)
      if (activeImportanceAnswer) {
        const score = getActiveImportanceSuitability(activeImportanceAnswer, dog);
        totalScore += score * 2;
      }

      // 12. Active Days (Conditional)
      if (activeDaysAnswer) {
        const score = getActiveDaysSuitability(activeDaysAnswer, dog);
        totalScore += score * 3;
      }

      // 13. Walks Time
      if (typeof walksTimeAnswer === "number") {
        const score = getWalksTimeSuitability(walksTimeAnswer, dog);
        totalScore += score * 3;
      }

      // 14. Social Behavior
      if (socialBehaviorAnswer) {
        const score = getSocialBehaviorSuitability(socialBehaviorAnswer, dog);
        totalScore += score * 3;
      }

      return { dog, score: totalScore };
    })
    .filter((item): item is { dog: Dog; score: number } => item !== null);

  scoredDogs.sort((a, b) => b.score - a.score);

  // Return ALL dogs, not just top 32
  const topDogs = scoredDogs.map((item) => item.dog);

  return { breeds: topDogs };
}
