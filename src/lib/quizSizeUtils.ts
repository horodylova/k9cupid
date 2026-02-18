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

