import { Dog } from "@/lib/api";
import { QuizOptionId } from "@/lib/quizQuestions";

export type SizeCategory = "toy" | "small" | "medium" | "large";

function getDogSizeCategory(dog: Dog): SizeCategory {
  const height = dog.max_height_male;
  if (height < 12) {
    return "toy";
  }
  if (height < 18) {
    return "small";
  }
  if (height < 30) {
    return "medium";
  }
  return "large";
}

export function getPreferredSizesForHome(answerId: QuizOptionId): SizeCategory[] {
  if (answerId === "home_studio") {
    return ["toy", "small", "medium"];
  }
  if (answerId === "home_apartment") {
    return ["toy", "small", "medium", "large"];
  }
  return ["toy", "small", "medium", "large"];
}

function getSizeIndex(size: SizeCategory): number {
  if (size === "toy") {
    return 1;
  }
  if (size === "small") {
    return 2;
  }
  if (size === "medium") {
    return 3;
  }
  return 4;
}

export function getHomeSizeSuitability(answerId: QuizOptionId, dog: Dog): number {
  const size = getDogSizeCategory(dog);
  const sizeIndex = getSizeIndex(size);
  const energy = dog.energy;

  if (answerId === "home_house") {
    return 5;
  }

  if (answerId === "home_apartment") {
    if (sizeIndex <= 3) {
      return 5;
    }
    if (energy <= 2) {
      return 4;
    }
    if (energy === 3) {
      return 3;
    }
    return 2;
  }

  if (sizeIndex <= 2 && energy <= 3) {
    return 5;
  }
  if (sizeIndex <= 2 && energy >= 4) {
    return 3;
  }
  if (sizeIndex === 3 && energy <= 2) {
    return 4;
  }
  if (sizeIndex === 3 && energy === 3) {
    return 3;
  }
  if (sizeIndex === 4 && energy <= 2) {
    return 3;
  }
  if (sizeIndex === 4 && energy === 3) {
    return 2;
  }
  return 1;
}

export function getSharedSpacesSizeAndSheddingSuitability(
  selectedIds: QuizOptionId[],
  dog: Dog
): number {
  const hasCloseContact =
    selectedIds.includes("shared_sofa") ||
    selectedIds.includes("shared_bed") ||
    selectedIds.includes("shared_car");

  const prefersOwnSpace = selectedIds.includes("shared_own_space");
  const isNotSureOnly =
    selectedIds.length === 1 && selectedIds.includes("shared_not_sure");

  if (!selectedIds.length || isNotSureOnly) {
    return 3;
  }

  const size = getDogSizeCategory(dog);
  const sizeIndex = getSizeIndex(size);
  const shedding = dog.shedding;

  if (hasCloseContact && !prefersOwnSpace) {
    if (sizeIndex <= 2 && shedding <= 3) {
      return 5;
    }
    if (sizeIndex <= 2 && shedding > 3) {
      return 4;
    }
    if (sizeIndex === 3 && shedding <= 3) {
      return 4;
    }
    if (sizeIndex === 3 && shedding > 3) {
      return 3;
    }
    if (sizeIndex === 4 && shedding <= 2) {
      return 3;
    }
    return 2;
  }

  if (prefersOwnSpace && !hasCloseContact) {
    if (sizeIndex === 4) {
      return shedding >= 3 ? 5 : 4;
    }
    if (sizeIndex === 3) {
      return 4;
    }
    if (sizeIndex === 2) {
      return 3;
    }
    return 2;
  }

  if (hasCloseContact && prefersOwnSpace) {
    if (sizeIndex === 3 && shedding <= 3) {
      return 5;
    }
    if (sizeIndex <= 2 && shedding <= 3) {
      return 4;
    }
    if (sizeIndex === 4 && shedding <= 2) {
      return 3;
    }
    return 3;
  }

  return 3;
}

export function getPhysicalHandlingSuitability(
  answerId: QuizOptionId,
  dog: Dog
): number {
  const size = getDogSizeCategory(dog);
  const sizeIndex = getSizeIndex(size);
  const trainability = dog.trainability;

  if (
    answerId === "handling_very_confident" ||
    answerId === "handling_somewhat_confident"
  ) {
    if (sizeIndex >= 3) {
      return 5;
    }
    return 4;
  }

  let baseScore = 3;

  if (sizeIndex === 1 || sizeIndex === 2) {
    baseScore = 5;
  } else if (sizeIndex === 3) {
    baseScore = 4;
  } else {
    baseScore = 2;
  }

  if (trainability >= 4) {
    baseScore += 1;
  } else if (trainability <= 2) {
    baseScore -= 1;
  }

  if (baseScore > 5) {
    return 5;
  }
  if (baseScore < 1) {
    return 1;
  }
  return baseScore;
}

export function getChildrenInHouseholdSuitability(
  selectedIds: QuizOptionId[],
  dog: Dog
): number {
  const hasBabiesOrToddlers = selectedIds.includes("children_babies_toddlers");
  const hasYoungChildren = selectedIds.includes("children_young");
  const hasOlderChildren = selectedIds.includes("children_older");
  const hasAnyChildren = hasBabiesOrToddlers || hasYoungChildren || hasOlderChildren;
  const hasNoneOnly =
    selectedIds.length === 1 && selectedIds.includes("children_none");

  const goodWithChildren = dog.good_with_children;

  if (!selectedIds.length || hasNoneOnly) {
    if (goodWithChildren >= 4) {
      return 4;
    }
    if (goodWithChildren === 3) {
      return 3;
    }
    return 2;
  }

  if (hasBabiesOrToddlers || hasYoungChildren) {
    if (goodWithChildren >= 5) {
      return 5;
    }
    if (goodWithChildren === 4) {
      return 4;
    }
    if (goodWithChildren === 3) {
      return 2;
    }
    return 1;
  }

  if (hasOlderChildren && !hasBabiesOrToddlers && !hasYoungChildren) {
    if (goodWithChildren >= 5) {
      return 5;
    }
    if (goodWithChildren === 4) {
      return 4;
    }
    if (goodWithChildren === 3) {
      return 3;
    }
    if (goodWithChildren === 2) {
      return 2;
    }
    return 1;
  }

  if (hasAnyChildren) {
    if (goodWithChildren >= 4) {
      return 4;
    }
    if (goodWithChildren === 3) {
      return 3;
    }
    return 2;
  }

  return 3;
}

export function getOtherPetsSuitability(
  selectedIds: QuizOptionId[],
  dog: Dog
): number {
  const hasDog = selectedIds.includes("pets_dog");
  const hasCat = selectedIds.includes("pets_cat");
  const hasSmallAnimals = selectedIds.includes("pets_small_animals");
  const hasNoneOnly = selectedIds.length === 1 && selectedIds.includes("pets_none");

  const goodWithOtherDogs = dog.good_with_other_dogs;
  const trainability = dog.trainability;
  const goodWithStrangers = dog.good_with_strangers;

  if (!selectedIds.length || hasNoneOnly) {
    if (goodWithOtherDogs >= 4) {
      return 4;
    }
    if (goodWithOtherDogs === 3) {
      return 3;
    }
    return 2;
  }

  if (hasDog || hasCat) {
    let base = 3;
    if (goodWithOtherDogs >= 5) {
      base = 5;
    } else if (goodWithOtherDogs === 4) {
      base = 4;
    } else if (goodWithOtherDogs === 3) {
      base = 2;
    } else {
      base = 1;
    }
    if (trainability >= 4) {
      base += 1;
    }
    if (goodWithStrangers >= 4) {
      base += 1;
    }
    if (base > 5) return 5;
    if (base < 1) return 1;
    return base;
  }

  if (hasSmallAnimals) {
    if (goodWithOtherDogs >= 4) {
      return 4;
    }
    if (goodWithOtherDogs === 3) {
      return 3;
    }
    return 2;
  }

  return 3;
}

export type VisitorsFilterPreferences = {
  goodWithStrangersMin: number;
  protectivenessMin?: number;
  protectivenessMax?: number;
};

export function getVisitorsFilterPreferences(
  answerId: QuizOptionId
): VisitorsFilterPreferences | null {
  if (answerId === "visitors_very_often") {
    return { goodWithStrangersMin: 5, protectivenessMax: 3 };
  }
  if (answerId === "visitors_regularly") {
    return { goodWithStrangersMin: 4, protectivenessMax: 4 };
  }
  if (answerId === "visitors_occasionally") {
    return { goodWithStrangersMin: 3, protectivenessMin: 3 };
  }
  if (answerId === "visitors_almost_never") {
    return { goodWithStrangersMin: 2, protectivenessMin: 3 };
  }
  return null;
}

export function getVisitorsSuitability(
  answerId: QuizOptionId,
  dog: Dog
): number {
  const goodWithStrangers = dog.good_with_strangers;
  const protectiveness = dog.protectiveness;

  if (answerId === "visitors_very_often") {
    if (goodWithStrangers >= 5 && protectiveness <= 3) {
      return 5;
    }
    if (goodWithStrangers >= 4 && protectiveness <= 3) {
      return 4;
    }
    if (goodWithStrangers >= 4 && protectiveness === 4) {
      return 3;
    }
    if (goodWithStrangers >= 3) {
      return 2;
    }
    return 1;
  }

  if (answerId === "visitors_regularly") {
    if (goodWithStrangers >= 4 && protectiveness <= 4) {
      return 5;
    }
    if (goodWithStrangers >= 3 && protectiveness <= 4) {
      return 4;
    }
    if (goodWithStrangers >= 3 && protectiveness === 5) {
      return 3;
    }
    if (goodWithStrangers >= 2) {
      return 2;
    }
    return 1;
  }

  if (answerId === "visitors_occasionally") {
    if (protectiveness >= 3 && protectiveness <= 4) {
      return goodWithStrangers >= 3 ? 5 : 4;
    }
    if (protectiveness === 5) {
      return 3;
    }
    if (protectiveness === 2) {
      return 3;
    }
    return 2;
  }

  if (answerId === "visitors_almost_never") {
    if (protectiveness >= 3 && protectiveness <= 4) {
      return goodWithStrangers >= 3 ? 5 : 4;
    }
    if (protectiveness === 5) {
      return 4;
    }
    if (protectiveness === 2) {
      return 3;
    }
    return 2;
  }

  return 3;
}
