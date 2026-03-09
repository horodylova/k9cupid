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
    
    // Visitor Frequency Impact
    if (visitorsVal === "visitors_daily" || visitorsVal === "visitors_weekly") {
       // Frequent visitors: need a dog that isn't aggressive.
       if (breed.good_with_strangers >= 4) score += 5; 
       if (breed.protectiveness >= 5) score -= 5; // Too protective might be an issue with constant guests
    }

    // Social Behavior Preference Impact
    if (socialVal === "social_friendly") {
      // User explicitly wants friendly
      if (breed.good_with_strangers >= 4) score += 15; // Stronger bonus
      if (breed.protectiveness >= 4) score -= 5; // Guarding traits might conflict with "loves everyone"
      
    } else if (socialVal === "social_polite") {
       // Balanced: Good with strangers 3 or higher, Protectiveness balanced
       if (breed.good_with_strangers >= 3) score += 5;
       if (breed.protectiveness >= 3) score += 5;
       
    } else if (socialVal === "social_guardian") {
      // User wants protection
      if (breed.protectiveness >= 4) score += 20; // Strong bonus for guard dogs
      if (breed.good_with_strangers >= 5) score -= 10; // Too friendly to be a serious guard?
      
      // If frequent visitors + guardian, trainability is key to manage the dog
      if ((visitorsVal === "visitors_daily" || visitorsVal === "visitors_weekly") && breed.trainability < 3) {
          score -= 10; // Hard to manage a guard dog with guests if not trainable
      }
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
    const purposeRaw = getAnswer("purpose");
    const purposes = Array.isArray(purposeRaw) 
      ? purposeRaw as string[]
      : (typeof purposeRaw === 'string' ? [purposeRaw] : []);
    
    purposes.forEach((purposeVal, index) => {
      // Weight: 1st priority = 1.0, 2nd = 0.7, 3rd = 0.5
      const weight = index === 0 ? 1.0 : (index === 1 ? 0.7 : 0.5);

      if (purposeVal === "purpose_guard") {
        // Guardian needs high protectiveness
        if (breed.protectiveness >= 4) score += (20 * weight);
        else if (breed.protectiveness <= 2) score -= (20 * weight);

        // Guardian needs to be trainable and intelligent
        if (breed.trainability >= 4) score += (10 * weight);
        
        // Guardian implies physical capability (Size/Strength)
        if (breed.max_weight_male >= 50) score += (20 * weight); 
        else if (breed.max_weight_male >= 30) score += (10 * weight); 
        else if (breed.max_weight_male < 20) score -= (30 * weight);

      } else if (purposeVal === "purpose_active") {
        // Active partner needs energy and endurance
        if (breed.energy >= 4) score += (15 * weight);
        // Trainability helps for sports
        if (breed.trainability >= 4) score += (5 * weight);

      } else if (purposeVal === "purpose_service") {
        if (breed.trainability >= 4) score += (15 * weight);
        if (breed.good_with_strangers >= 4) score += (10 * weight);
      } else if (purposeVal === "purpose_companion") {
        if (breed.good_with_children >= 4 || breed.playfulness >= 4) score += (10 * weight);
      } else if (purposeVal === "purpose_support") {
        // Emotional support: needs to be affectionate (proxy: good with kids/strangers) and calm
        if (breed.good_with_children >= 4) score += (10 * weight);
        if (breed.good_with_strangers >= 4) score += (5 * weight);
        if (breed.energy <= 3) score += (5 * weight);
      } else if (purposeVal === "purpose_friend") {
        // Just a friend: balanced traits
        if (breed.playfulness >= 3) score += (10 * weight);
        if (breed.good_with_other_dogs >= 3) score += (5 * weight);
      }
    });

    // 6. Maintenance (Grooming/Shedding)
    const hairVal = getAnswer("hair_tolerance") as string | undefined;
    if (hairVal === "hair_allergies") {
      if (breed.shedding <= 1) score += 20;
      else score -= 50; // Deal breaker
    } else if (hairVal === "hair_prefer_minimal") {
      if (breed.shedding <= 2) score += 10;
      else if (breed.shedding >= 4) score -= 30;
      else if (breed.shedding === 3) score -= 10;
    }

    // Explicit Grooming Check (from grooming_time question if available, or implied preference)
    // Assuming "hair_prefer_minimal" also implies low grooming effort preference
    if (hairVal === "hair_prefer_minimal") {
       if (breed.coat_length >= 4) score -= 15; // Penalty for long coat if user wants minimal maintenance
       if (breed.grooming >= 4) score -= 15; // Penalty for high grooming needs
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
      // Prefers smaller/easier dogs
      if (breed.trainability >= 4) score += 10;
      else if (breed.trainability <= 2) score -= 10;
      
      // Avoid very protective dogs
      if (breed.protectiveness >= 4) score -= 10;

      // Prefer smaller size (Penalize large dogs > 60lbs)
      if (breed.max_weight_male > 60) score -= 20; 
      else if (breed.max_weight_male < 25) score += 10; 

    } else if (handlingVal === "handling_comfortable") {
      // Can handle medium, but not too powerful
      // Sweet spot: 20-60lbs
      if (breed.max_weight_male >= 20 && breed.max_weight_male <= 60) score += 10; 
      // Penalize very large dogs > 80lbs
      else if (breed.max_weight_male > 80) score -= 10; 

    } else if (handlingVal === "handling_experienced") {
      // Confident with large/powerful dogs
      if (breed.trainability >= 4) score += 5; 
      if (breed.protectiveness >= 4) score += 5; 
      
      // Bonus for larger breeds (> 60lbs)
      if (breed.max_weight_male > 60) score += 10;
    }

    return { breed, score };
  });

  // Sort by score desc
  scores.sort((a, b) => b.score - a.score);

  // Return top 20 breeds (expanded for categorized results)
  return scores.slice(0, 20).map((s) => s.breed);
}
