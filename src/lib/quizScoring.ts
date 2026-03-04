import { Dog } from "@/lib/api";

export function calculateFinalBreeds(breeds: Dog[], answers: { id: string; value: unknown }[]): Dog[] {
  // Helper to get answer value
  const getAnswer = (id: string) => {
    const ans = answers.find((a) => a.id === id);
    return ans ? ans.value : undefined;
  };

  const scores = breeds.map((breed) => {
    let score = 100; // Base score

    // 1. Children
    const childrenVal = getAnswer("children") as string[] | undefined;
    const hasToddlers = childrenVal?.includes("children_toddlers");
    const hasSchool = childrenVal?.includes("children_school");
    
    if (hasToddlers) {
      if (breed.good_with_children >= 4) score += 10;
      else if (breed.good_with_children <= 3) score -= 15; // Penalty for toddlers if not great
    } else if (hasSchool) {
      if (breed.good_with_children >= 3) score += 5;
    }

    // 2. Other Pets
    const petsVal = getAnswer("other_pets") as string[] | undefined;
    const hasDogs = petsVal?.includes("pets_dogs");
    const hasCats = petsVal?.includes("pets_cats");
    const hasSmall = petsVal?.includes("pets_small");
    
    if (hasDogs) {
      if (breed.good_with_other_dogs >= 4) score += 10;
      else if (breed.good_with_other_dogs <= 2) score -= 10;
    }
    if (hasCats || hasSmall) {
      // High prey drive penalty (using good_with_other_dogs as proxy or if we had prey_drive field)
      // Assuming good_with_other_dogs correlates slightly with general social/prey
      if (breed.good_with_other_dogs >= 4) score += 5;
      else if (breed.good_with_other_dogs <= 2) score -= 5;
    }

    // 3. Visitors / Strangers
    const visitorsVal = getAnswer("visitors") as string | undefined;
    const socialVal = getAnswer("social_behavior") as string | undefined;
    
    if (visitorsVal === "visitors_daily" || visitorsVal === "visitors_weekly") {
      if (breed.good_with_strangers >= 4) score += 10;
      else if (breed.good_with_strangers <= 2) score -= 5;
    } else if (visitorsVal === "visitors_rarely") {
      // Maybe prefers guard dog?
      if (breed.protectiveness >= 4) score += 5;
    }

    if (socialVal === "social_friendly") {
      if (breed.good_with_strangers >= 4) score += 10;
    } else if (socialVal === "social_guardian") {
      if (breed.protectiveness >= 4) score += 10;
    }

    // 4. Activity Level & Energy
    // This is crucial. Match user energy to dog energy.
    const activityVal = getAnswer("activity_level") as string | undefined;
    const activeImportance = getAnswer("active_importance") as string | undefined;
    
    // Determine user's energy tier
    let userEnergy = 3; // Default medium
    if (activityVal === "activity_couch") userEnergy = 1;
    else if (activityVal === "activity_calm_walks") userEnergy = 2;
    else if (activityVal === "activity_regular") userEnergy = 4;
    else if (activityVal === "activity_sports") userEnergy = 5;

    // Dog energy: 1-5
    const diff = Math.abs(breed.energy - userEnergy);
    
    // Penalty for mismatch
    if (diff === 0) score += 20; // Perfect match
    else if (diff === 1) score += 10; // Close
    else if (diff === 2) score -= 10; // Mismatch
    else score -= 30; // Strong mismatch (e.g. Couch potato vs Husky)

    // Weight importance
    if (activeImportance === "importance_endurance" && userEnergy >= 4) {
      if (breed.energy >= 4) score += 10;
    } else if (activeImportance === "importance_calm_home") {
      if (breed.energy <= 3) score += 10;
    }

    // 5. Training / Purpose
    const purposeVal = getAnswer("purpose") as string | undefined;
    
    if (purposeVal === "purpose_guard") {
      // Guardian needs high protectiveness
      if (breed.protectiveness >= 4) score += 20;
      else if (breed.protectiveness <= 2) score -= 20; // A guardian must protect!

      // Guardian needs to be trainable and intelligent
      if (breed.trainability >= 4) score += 10;
      
      // Guardian implies physical capability (Size/Strength)
      // Small dogs can be watchdogs, but "Guardian" implies protection.
      if (breed.max_weight_male >= 50) score += 20; // Large/Giant bonus
      else if (breed.max_weight_male >= 30) score += 10; // Medium bonus
      else if (breed.max_weight_male < 20) score -= 30; // Toy/Small penalty (Unsuitable for protection)

    } else if (purposeVal === "purpose_active") {
      // Active partner needs energy and endurance
      if (breed.energy >= 4) score += 15;
      // Trainability helps for sports
      if (breed.trainability >= 4) score += 5;

    } else if (purposeVal === "purpose_service") {
      if (breed.trainability >= 4) score += 15;
      if (breed.good_with_strangers >= 4) score += 10; // Service dogs usually need to be social/neutral
    } else if (purposeVal === "purpose_companion") {
      if (breed.good_with_children >= 4 || breed.playfulness >= 4) score += 10;
    }

    // 6. Maintenance (Grooming/Shedding)
    const hairVal = getAnswer("hair_tolerance") as string | undefined;
    if (hairVal === "hair_allergies") {
      if (breed.shedding <= 1) score += 20;
      else score -= 50; // Deal breaker
    } else if (hairVal === "hair_prefer_minimal") {
      if (breed.shedding <= 2) score += 10;
      else if (breed.shedding >= 4) score -= 10;
    }

    const droolVal = getAnswer("drooling_tolerance") as string | undefined;
    if (droolVal === "drooling_avoid") {
      if (breed.drooling <= 1) score += 10;
      else if (breed.drooling >= 3) score -= 10;
    }

    // 7. Barking
    // (Implicit from noise tolerance if we had it mapped, assuming noise tolerance question exists)
    // const noiseVal = getAnswer(noiseToleranceQuestion.id);
    
    // 8. Experience / Handling
    const handlingVal = getAnswer("physical_handling") as string | undefined;
    if (handlingVal === "handling_novice") {
      // Novice needs easy trainability
      if (breed.trainability >= 4) score += 10;
      else if (breed.trainability <= 2) score -= 10;
      
      // Novice might struggle with very protective dogs
      if (breed.protectiveness >= 5) score -= 5; 
    } else if (handlingVal === "handling_experienced") {
      // Experienced can handle difficult dogs and train them well
      if (breed.trainability >= 4) score += 5; // They can unlock full potential
      if (breed.protectiveness >= 4) score += 5; // Can handle guard dogs
    }

    return { breed, score };
  });

  // Sort by score desc
  scores.sort((a, b) => b.score - a.score);

  // Return top 10 breeds
  return scores.slice(0, 10).map((s) => s.breed);
}
