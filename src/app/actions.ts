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

  const allowedSizes = new Set<string>();

  if (homeAnswer) {
    const homeSizes = getPreferredSizesForHome(homeAnswer);
    homeSizes.forEach((s) => allowedSizes.add(s));
  } else {
    ["toy", "small", "medium", "large"].forEach((s) => allowedSizes.add(s));
  }

  const sizesToFetch = Array.from(allowedSizes);

  const promises = sizesToFetch.map((size) =>
    getBreeds({ size: size as "toy" | "small" | "medium" | "large", limit: 50 })
  );
  const results = await Promise.all(promises);

  let allDogs: Dog[] = [];
  results.forEach((r) => {
    allDogs = [...allDogs, ...r.breeds];
  });

  const uniqueDogs = Array.from(new Map(allDogs.map((d) => [d.name, d])).values());

  const scoredDogs = uniqueDogs
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

      if (avgSizeScore < 2) return null;

      totalScore += avgSizeScore * 10;

      // 2. Children Suitability
      if (childrenAnswer && childrenAnswer.length > 0) {
        const childScore = getChildrenInHouseholdSuitability(childrenAnswer, dog);
        totalScore += childScore * 5;
      }

      // 3. Other Pets Suitability
      if (petsAnswer && petsAnswer.length > 0) {
        const petScore = getOtherPetsSuitability(petsAnswer, dog);
        totalScore += petScore * 3;
      }

      // 4. Trainability Bonus
      totalScore += (dog.trainability || 0);

      return { dog, score: totalScore };
    })
    .filter((item): item is { dog: Dog; score: number } => item !== null);

  scoredDogs.sort((a, b) => b.score - a.score);

  const topDogs = scoredDogs.slice(0, 32).map((item) => item.dog);

  return { breeds: topDogs };
}
