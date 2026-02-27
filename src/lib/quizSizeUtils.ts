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

export function getSharedSpacesSizeSuitability(
  selectedIds: QuizOptionId[],
  dog: Dog
): number {
  const hasFurniture = selectedIds.includes("shared_sofa") || selectedIds.includes("shared_bed");
  const hasCar = selectedIds.includes("shared_car");
  const prefersOwnSpace = selectedIds.includes("shared_own_space");

  const size = getDogSizeCategory(dog);

  // If "Own space" is explicitly selected and NO furniture sharing is selected,
  // then the dog's size doesn't matter for furniture crowding.
  if (prefersOwnSpace && !hasFurniture) {
    return 5;
  }

  // If sharing furniture (Sofa or Bed)
  if (hasFurniture) {
    if (size === "toy" || size === "small") return 5;
    if (size === "medium") return 4;
    // Large dogs take up a lot of space on furniture
    return 3;
  }

  // If only sharing car (and not furniture)
  if (hasCar) {
    // Large dogs might be harder to fit in some cars, but generally okay
    if (size === "large") return 4;
    return 5;
  }

  // Default neutral if "not sure" or other combinations
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

export type BarkingFilterPreferences = {
  barkingMax?: number;
  barkingMin?: number;
  weight: "high" | "medium" | "low";
};

export function getBarkingFilterPreferences(
  tolerance: number
): BarkingFilterPreferences | null {
  if (!Number.isFinite(tolerance)) {
    return null;
  }

  if (tolerance >= 5) {
    return { barkingMax: 2, weight: "high" };
  }
  if (tolerance === 4) {
    return { barkingMax: 3, weight: "high" };
  }
  if (tolerance === 3) {
    return { barkingMax: 4, weight: "medium" };
  }
  if (tolerance === 2) {
    return { barkingMax: 4, weight: "low" };
  }
  if (tolerance === 1) {
    return { barkingMax: 5, weight: "low" };
  }

  return null;
}

export function getBarkingSuitability(tolerance: number, dog: Dog): number {
  const barking = dog.barking;

  if (tolerance >= 5) {
    if (barking <= 2) return 5;
    if (barking === 3) return 4;
    if (barking === 4) return 2;
    return 1;
  }

  if (tolerance === 4) {
    if (barking <= 3) return 5;
    if (barking === 4) return 3;
    return 1;
  }

  if (tolerance === 3) {
    if (barking <= 3) return 4;
    if (barking === 4) return 3;
    return 2;
  }

  if (tolerance === 2) {
    if (barking >= 3 && barking <= 4) return 5;
    if (barking === 2) return 4;
    if (barking === 5) return 3;
    return 2;
  }

  if (tolerance === 1) {
    if (barking >= 4) return 5;
    if (barking === 3) return 4;
    return 3;
  }

  return 3;
}

export type HairTolerancePreferences = {
  sheddingMax?: number;
  sheddingMin?: number;
  coatLengthMax?: number;
  weight: "high" | "medium" | "low";
};

export function getHairToleranceLevel(answerId: QuizOptionId): number | null {
  if (answerId === "hair_not_bothered") return 1;
  if (answerId === "hair_okay_clean") return 2;
  if (answerId === "hair_prefer_less") return 3;
  if (answerId === "hair_prefer_minimal") return 4;
  if (answerId === "hair_allergies") return 5;
  return null;
}

export function getHairTolerancePreferences(
  answerId: QuizOptionId
): HairTolerancePreferences | null {
  const level = getHairToleranceLevel(answerId);
  if (!level) {
    return null;
  }

  if (level >= 5) {
    return { sheddingMax: 2, coatLengthMax: 2, weight: "high" };
  }
  if (level === 4) {
    return { sheddingMax: 2, coatLengthMax: 2, weight: "high" };
  }
  if (level === 3) {
    return { sheddingMax: 3, weight: "medium" };
  }
  if (level === 2) {
    return { sheddingMin: 3, weight: "low" };
  }
  if (level === 1) {
    return { sheddingMin: 3, weight: "low" };
  }
  return null;
}

export function getHairToleranceSuitability(level: number, dog: Dog): number {
  const shedding = dog.shedding;
  const coatLength = dog.coat_length;

  if (level >= 5) {
    if (shedding <= 2 && coatLength <= 2) return 5;
    if (shedding <= 2) return 4;
    if (shedding === 3) return 3;
    if (shedding === 4) return 2;
    return 1;
  }

  if (level === 4) {
    if (shedding <= 2 && coatLength <= 3) return 5;
    if (shedding <= 2) return 4;
    if (shedding === 3) return 3;
    if (shedding === 4) return 2;
    return 1;
  }

  if (level === 3) {
    if (shedding <= 3) return 4;
    if (shedding === 4) return 3;
    return 2;
  }

  if (level === 2) {
    if (shedding >= 4) return 5;
    if (shedding === 3) return 4;
    return 3;
  }

  if (level === 1) {
    if (shedding >= 4) return 5;
    if (shedding === 3) return 4;
    return 3;
  }

  return 3;
}

export type GroomingTimePreferences = {
  groomingMax?: number;
  groomingMin?: number;
  weight: "high" | "medium" | "low";
};

export function getGroomingTimePreferences(
  time: number
): GroomingTimePreferences | null {
  if (!Number.isFinite(time)) {
    return null;
  }

  if (time >= 5) {
    return { groomingMin: 4, weight: "high" };
  }
  if (time === 4) {
    return { groomingMin: 4, weight: "medium" };
  }
  if (time === 3) {
    return { groomingMax: 3, weight: "medium" };
  }
  if (time === 2) {
    return { groomingMax: 2, weight: "high" };
  }
  if (time === 1) {
    return { groomingMax: 2, weight: "high" };
  }
  return null;
}

export function getGroomingTimeSuitability(time: number, dog: Dog): number {
  const grooming = dog.grooming;

  if (time >= 5) {
    if (grooming >= 4) return 5;
    if (grooming === 3) return 4;
    if (grooming === 2) return 3;
    return 2;
  }

  if (time === 4) {
    if (grooming >= 4) return 5;
    if (grooming === 3) return 4;
    if (grooming === 2) return 2;
    return 1;
  }

  if (time === 3) {
    if (grooming <= 3) return 4;
    if (grooming === 4) return 3;
    return 2;
  }

  if (time <= 2) {
    if (grooming <= 2) return 5;
    if (grooming === 3) return 3;
    if (grooming === 4) return 2;
    return 1;
  }

  return 3;
}

export type CoatCarePreferences = {
  sheddingMax?: number;
  groomingMax?: number;
  coatLengthMax?: number;
  weight: "high" | "medium" | "low";
};

export function getCoatCarePreferences(
  hairToleranceLevel: number,
  groomingTime: number
): CoatCarePreferences | null {
  if (!Number.isFinite(hairToleranceLevel) || !Number.isFinite(groomingTime)) {
    return null;
  }

  if (hairToleranceLevel >= 4 && groomingTime <= 2) {
    return { sheddingMax: 2, groomingMax: 2, coatLengthMax: 2, weight: "high" };
  }

  if (hairToleranceLevel >= 4) {
    return { sheddingMax: 2, coatLengthMax: 2, weight: "high" };
  }

  if (groomingTime <= 2) {
    return { groomingMax: 2, weight: "high" };
  }

  if (groomingTime >= 4) {
    return { weight: "medium" };
  }

  return null;
}

export type DroolingPreferences = {
  droolingMax?: number;
  weight: "high" | "medium" | "low";
};

export function getDroolingToleranceLevel(answerId: QuizOptionId): number | null {
  if (answerId === "drooling_fine") return 1;
  if (answerId === "drooling_okay") return 2;
  if (answerId === "drooling_prefer_less") return 3;
  if (answerId === "drooling_uncomfortable") return 4;
  return null;
}

export function getDroolingPreferences(
  answerId: QuizOptionId
): DroolingPreferences | null {
  const level = getDroolingToleranceLevel(answerId);
  if (!level) {
    return null;
  }

  if (level >= 4) {
    return { droolingMax: 1, weight: "high" };
  }
  if (level === 3) {
    return { droolingMax: 2, weight: "medium" };
  }
  if (level === 2) {
    return { droolingMax: 3, weight: "low" };
  }
  return { droolingMax: 4, weight: "low" };
}

export function getDroolingSuitability(level: number, dog: Dog): number {
  const drooling = dog.drooling;

  if (level >= 4) {
    if (drooling <= 1) return 5;
    if (drooling === 2) return 4;
    if (drooling === 3) return 2;
    return 1;
  }

  if (level === 3) {
    if (drooling <= 2) return 5;
    if (drooling === 3) return 3;
    return 1;
  }

  if (level === 2) {
    if (drooling <= 3) return 4;
    if (drooling === 4) return 3;
    return 2;
  }

  if (level === 1) {
    if (drooling >= 4) return 5;
    if (drooling === 3) return 4;
    return 3;
  }

  return 3;
}
