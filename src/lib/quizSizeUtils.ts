import { Dog } from "@/lib/api";
import { QuizOptionId } from "@/lib/quizQuestions";

export type SizeCategory = "toy" | "small" | "medium" | "large";

export function getDogSizeCategory(dog: Dog): SizeCategory {
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

  if (answerId === "home_house_large") {
    // Large houses are ideal for medium/large dogs that need space.
    // Small dogs are also fine, but we give a slight preference to larger breeds
    // to reflect the user's capacity to house them.
    if (sizeIndex >= 3) {
      return 5;
    }
    return 4;
  }

  if (answerId === "home_house_small") {
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

  return 3;
}

export function getSharedSpacesSizeAndSheddingSuitability(
  selectedIds: QuizOptionId[],
  dog: Dog
): number {
  const hasCloseContact =
    selectedIds.includes("shared_sofa") ||
    selectedIds.includes("shared_bed");

  const prefersOwnSpace = 
    selectedIds.includes("shared_own_bed") ||
    selectedIds.includes("shared_floor");
    
  if (!selectedIds.length) {
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
  const prefersOwnSpace = selectedIds.includes("shared_own_bed") || selectedIds.includes("shared_floor");

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
    answerId === "handling_experienced" ||
    answerId === "handling_comfortable"
  ) {
    // If user is comfortable with large dogs, prioritize larger breeds slightly
    // as they explicitly signaled this capability.
    if (sizeIndex >= 3) {
      return 5;
    }
    // Small dogs are still suitable, but may feel "small" for someone seeking a "large dog experience"
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
  const hasNone = selectedIds.includes("children_none");
  const hasBabies = selectedIds.includes("children_toddlers");
  const hasYoung = selectedIds.includes("children_school");
  const hasOlder = selectedIds.includes("children_teens");

  // If "No children" is selected, or no children options are selected at all,
  // we show all dogs regardless of their score (return max suitability).
  if (hasNone || (!hasBabies && !hasYoung && !hasOlder)) {
    return 5;
  }

  // Determine the minimum required score based on the most sensitive age group selected
  let minRequiredScore = 3; // Default for older children

  if (hasBabies) {
    minRequiredScore = 5; // Babies require 5 stars
  } else if (hasYoung) {
    minRequiredScore = 4; // Young children (4-6) require 4 stars
  } else if (hasOlder) {
    minRequiredScore = 3; // Older children (7+) require 3 stars
  }

  const dogScore = dog.good_with_children;

  // Classic family dogs (Golden, Lab, Beagle, etc) often have 5 here.
  // We want to make sure they get a FULL 5, maybe even bonus points elsewhere.
  if (dogScore >= minRequiredScore) {
    return 5;
  }

  // Flexible scoring: penalize based on how far off the dog is
  const diff = minRequiredScore - dogScore;
  
  if (diff === 1) {
    return 4; // Close match
  }
  if (diff === 2) {
    return 3; // Acceptable match
  }
  if (diff === 3) {
    return 2; // Poor match
  }

  return 1; // Very poor match
}

export function getOtherPetsSuitability(
  selectedIds: QuizOptionId[],
  dog: Dog
): number {
  const hasDog = selectedIds.includes("pets_dogs");
  const hasCat = selectedIds.includes("pets_cats");
  const hasSmallAnimals = selectedIds.includes("pets_small");
  const hasNoneOnly = selectedIds.length === 1 && selectedIds.includes("pets_none");

  const goodWithOtherDogs = dog.good_with_other_dogs;
  const trainability = dog.trainability;
  const goodWithStrangers = dog.good_with_strangers;

  if (!selectedIds.length || hasNoneOnly) {
    return 5;
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
  if (answerId === "visitors_daily") {
    return { goodWithStrangersMin: 5, protectivenessMax: 3 };
  }
  if (answerId === "visitors_weekly") {
    return { goodWithStrangersMin: 4, protectivenessMax: 4 };
  }
  if (answerId === "visitors_monthly") {
    return { goodWithStrangersMin: 3, protectivenessMin: 3 };
  }
  if (answerId === "visitors_rarely") {
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

  if (answerId === "visitors_daily") {
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

  if (answerId === "visitors_weekly") {
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

  if (answerId === "visitors_monthly") {
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

  if (answerId === "visitors_rarely") {
    return 5;
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

  // Tolerance 1: "Strictly quiet"
  if (tolerance <= 1) {
    if (barking <= 2) return 5;
    if (barking === 3) return 3;
    if (barking >= 4) return 1;
    return 3;
  }

  // Tolerance 2-3: "Average barking is okay"
  if (tolerance <= 3) {
    if (barking <= 3) return 5;
    if (barking === 4) return 3;
    if (barking >= 5) return 2;
    return 4;
  }

  // Tolerance 4-5: "I don't mind vocal dogs"
  if (tolerance >= 4) {
    // If user doesn't mind noise, all dogs are fine.
    // Maybe even prefer watchdogs (high barking)?
    return 5;
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
  // const coatLength = dog.coat_length; // Coat length might be less critical than shedding for allergies, but keeping it for strict checks if needed.

  // Level 1: "It does not bother me at all" -> Ignore factor (all dogs are perfect)
  if (level === 1) {
    return 5;
  }

  // Level 2: "It is okay, I will just clean more often" -> Tolerant of shedding
  if (level === 2) {
    // We don't penalize shedding, but maybe slight preference for non-extreme?
    // Actually, if they are okay with cleaning, high shedding is fine.
    // Low shedding is also fine.
    return 5;
  }

  // Level 3: "I prefer less hair, but can accept some"
  if (level === 3) {
    if (shedding <= 3) return 5; // Low to medium shedding is perfect
    if (shedding === 4) return 3; // High shedding is tolerable
    if (shedding >= 5) return 2; // Very high shedding is discouraged but not impossible
    return 3;
  }

  // Level 4: "I really prefer minimal hair"
  if (level === 4) {
    if (shedding <= 2) return 5; // Low shedding is perfect
    if (shedding === 3) return 4; // Medium is okay
    if (shedding === 4) return 2; // High shedding is bad
    return 1;
  }

  // Level 5: "I have allergies / hair is a big problem for me"
  if (level >= 5) {
    // Strict requirement for low shedding
    if (shedding <= 1) return 5; // Very low shedding
    if (shedding === 2) return 4; // Low shedding
    if (shedding === 3) return 2; // Medium is risky
    return 1; // High shedding is a no-go
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

  // Level 5: "I enjoy grooming and can do it often" -> Ignore factor (all dogs are perfect)
  if (time >= 5) {
    return 5;
  }

  // Level 4: "Weekly grooming sessions are fine" -> Ignore factor (all dogs are perfect)
  if (time === 4) {
    return 5;
  }

  // Level 3: "Regular brushing a few times a month" -> Medium maintenance
  if (time === 3) {
    if (grooming <= 3) return 5; // Low to medium is perfect
    if (grooming === 4) return 3; // High is risky
    if (grooming === 5) return 2; // Very high is too much
    return 2;
  }

  // Level 2: "A bit of brushing from time to time" -> Low maintenance
  if (time === 2) {
    if (grooming <= 2) return 5; // Low is perfect
    if (grooming === 3) return 3; // Medium is okay-ish
    return 1; // High is bad
  }

  // Level 1: "Almost no grooming - quick wipe and go" -> Very low maintenance
  if (time <= 1) {
    if (grooming === 1) return 5; // Very low is perfect
    if (grooming === 2) return 4; // Low is okay
    if (grooming >= 3) return 1; // Anything else is too much work
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
  if (answerId === "drooling_not_bothered") return 1;
  // if (answerId === "drooling_okay") return 2; // Removed as it maps to not bothered or prefer less
  if (answerId === "drooling_prefer_less") return 3;
  if (answerId === "drooling_avoid") return 4;
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
    return 5;
  }

  if (level === 1) {
    return 5;
  }

  return 3;
}

export function getWorkScheduleSuitability(
  answerId: QuizOptionId,
  dog: Dog
): number {
  const energy = dog.energy;
  const barking = dog.barking;
  const trainability = dog.trainability;

  // 1. Mostly at home (remote / hybrid)
  // Can handle dogs with separation anxiety issues (though we don't have that data directly),
  // but high energy/barking is fine as owner is there.
  if (answerId === "work_home") {
    // Almost any dog fits here, maybe slightly prefer dogs that enjoy company
    return 5;
  }

  // 2. Office or away 4-6 hours
  // Moderate time alone.
  if (answerId === "work_part_time") {
    let score = 5;
    
    // Very high energy dogs might get bored/destructive if left alone
    if (energy >= 5) score -= 1;
    
    // Excessive barking might be a sign of separation anxiety or boredom
    if (barking >= 4) score -= 1;

    // Hard to train dogs might have harder time adjusting to routine?
    if (trainability <= 2) score -= 0.5;

    return Math.max(1, Math.round(score));
  }

  // 3. Office or away 7+ hours
  // Long time alone. Needs independent, lower energy, calm dogs.
  if (answerId === "work_full_time") {
    let score = 5;

    // High energy dogs struggle with long isolation
    if (energy >= 4) score -= 2;
    if (energy === 3) score -= 0.5;

    // Barking is a concern for neighbours when away
    if (barking >= 4) score -= 1.5;
    if (barking === 3) score -= 0.5;

    // Independent dogs do better? (Trainability often correlates with need for engagement, so maybe lower trainability is actually okay here? 
    // Or high trainability means they learn routine better? Let's stick to Energy/Barking as main proxies for "calmness")

    return Math.max(1, Math.round(score));
  }

  return 3;
}

export function getActivityLevelSuitability(answerId: QuizOptionId, dog: Dog): number {
  const energy = dog.energy;
  const playfulness = dog.playfulness;

  // A: Sports partner (High Energy/Playfulness)
  if (answerId === "activity_sports") {
    if (energy >= 4 && playfulness >= 4) return 5;
    if (energy >= 3 && playfulness >= 3) return 4;
    return 2;
  }

  // B: Regular walks (Medium)
  if (answerId === "activity_regular") {
    if (energy >= 3 && energy <= 4) return 5;
    if (energy === 2 || energy === 5) return 3;
    return 2;
  }

  // C: Calm walks (Low-Medium)
  if (answerId === "activity_calm_walks") {
    if (energy <= 3) return 5;
    if (energy === 4) return 3;
    return 1;
  }

  // D: Couch potato (Low)
  if (answerId === "activity_couch") {
    if (energy <= 2 && playfulness <= 3) return 5;
    if (energy === 3) return 3;
    return 1;
  }

  return 3;
}

export function getActiveImportanceSuitability(answerId: QuizOptionId, dog: Dog): number {
  const energy = dog.energy;
  const playfulness = dog.playfulness;

  if (answerId === "importance_endurance") {
    if (energy >= 4) return 5;
    if (energy === 3) return 3;
    return 1;
  }

  if (answerId === "importance_play") {
    if (playfulness >= 4) return 5;
    if (playfulness === 3) return 3;
    return 1;
  }

  if (answerId === "importance_calm_home") {
    if (energy >= 3) {
      if (playfulness <= 3) return 5;
      return 4;
    }
    return 2;
  }

  return 3;
}

export function getActiveDaysSuitability(answerId: QuizOptionId, dog: Dog): number {
  const energy = dog.energy;

  if (answerId === "days_5_7") {
    if (energy === 5) return 5;
    if (energy === 4) return 4;
    return 3;
  }

  if (answerId === "days_2_4") {
    if (energy >= 3 && energy <= 4) return 5;
    if (energy === 2 || energy === 5) return 3;
    return 1;
  }

  if (answerId === "days_0_1") {
    if (energy <= 3) return 5;
    if (energy === 4) return 2;
    return 1;
  }

  return 3;
}

export function getWalksTimeSuitability(answerValue: number, dog: Dog): number {
  const energy = dog.energy;

  if (answerValue === 1) { // Up to 30 min
    if (energy <= 2) return 5;
    if (energy === 3) return 3;
    return 1;
  }
  if (answerValue === 2) { // 30-45 min
    if (energy <= 3) return 5;
    if (energy === 4) return 3;
    return 2;
  }
  if (answerValue === 3) { // 45-60 min
    if (energy <= 4) return 5;
    return 3;
  }
  if (answerValue === 4 || answerValue === 5) { // 60+ min
    return 5;
  }

  return 3;
}

export function getSocialBehaviorSuitability(answerId: QuizOptionId, dog: Dog): number {
  const protectiveness = dog.protectiveness || 3;
  const strangers = dog.good_with_strangers || 3;

  // Friendly to everyone
  if (answerId === "social_friendly") {
    // Wants high friendliness, low protectiveness
    if (strangers >= 4 && protectiveness <= 3) return 5;
    if (strangers >= 3 && protectiveness <= 4) return 3;
    return 1;
  }

  // Polite but watchful
  if (answerId === "social_polite") {
    // Wants balanced
    if (protectiveness >= 2 && protectiveness <= 4 && strangers >= 2 && strangers <= 4) return 5;
    return 3;
  }

  // Guardian / Protective
  if (answerId === "social_guardian") {
    // Wants high protectiveness
    if (protectiveness >= 4) return 5;
    if (protectiveness >= 3) return 3;
    return 1;
  }

  return 3;
}
