export interface Dog {
  image_link: string;
  good_with_children: number;
  good_with_other_dogs: number;
  shedding: number;
  grooming: number;
  drooling: number;
  coat_length: number;
  good_with_strangers: number;
  playfulness: number;
  protectiveness: number;
  trainability: number;
  energy: number;
  barking: number;
  min_life_expectancy: number;
  max_life_expectancy: number;
  max_height_male: number;
  max_height_female: number;
  max_weight_male: number;
  max_weight_female: number;
  min_height_male: number;
  min_height_female: number;
  min_weight_male: number;
  min_weight_female: number;
  name: string;
}

export interface BreedSearchOptions {
  name?: string;
  shedding?: number;
  grooming?: number;
  playfulness?: number;
  drooling?: number;
  coat_length?: number;
  barking?: number;
  energy?: number;
  protectiveness?: number;
  trainability?: number;
  good_with_children?: number;
  good_with_other_dogs?: number;
  good_with_strangers?: number;
  max_life_expectancy?: number;
  size?: "toy" | "small" | "medium" | "large";
  sort?: string;
  offset?: number;
  limit?: number;
  fetchAll?: boolean;
}

export interface BreedsResult {
  breeds: Dog[];
  total: number;
}

function sanitizeDog(dog: Dog): Dog {
  // Fix life expectancy issues (e.g., 1214 -> 12-14)
  if (dog.min_life_expectancy > 30) {
    const str = dog.min_life_expectancy.toString();
    if (str.length === 4) {
      const p1 = parseInt(str.substring(0, 2));
      const p2 = parseInt(str.substring(2));
      if (!isNaN(p1) && !isNaN(p2) && p1 < 30 && p2 < 30) {
        dog.min_life_expectancy = p1;
        if (dog.max_life_expectancy > 30) {
          dog.max_life_expectancy = p2;
        }
      }
    } else if (str.length === 3) {
      // e.g. 810 -> 8-10
      const p1 = parseInt(str.substring(0, 1));
      const p2 = parseInt(str.substring(1));
      if (!isNaN(p1) && !isNaN(p2) && p1 < 30 && p2 < 30) {
        dog.min_life_expectancy = p1;
        if (dog.max_life_expectancy > 30) {
          dog.max_life_expectancy = p2;
        }
      }
    }
  }

  // Double check max if it wasn't fixed above
  if (dog.max_life_expectancy > 30) {
    const str = dog.max_life_expectancy.toString();
    if (str.length === 4) {
      const p2 = parseInt(str.substring(2));
      if (!isNaN(p2) && p2 < 30) {
        dog.max_life_expectancy = p2;
      }
    } else if (str.length === 3) {
      const p2 = parseInt(str.substring(1));
      if (!isNaN(p2) && p2 < 30) {
        dog.max_life_expectancy = p2;
      }
    }
  }

  if (dog.coat_length < 0) {
    dog.coat_length = 0;
  } else if (dog.coat_length > 5) {
    dog.coat_length = 5;
  }

  const coatOverrides: Record<string, number> = {
    "Afghan Hound": 5,
    "American Hairless Terrier": 0,
    "Barbet": 4,
    "Bearded Collie": 5,
    "Bichon Frise": 4,
    "Black Russian Terrier": 4,
    "Bouvier des Flandres": 4,
    "Briard": 5,
    "Cocker Spaniel": 4,
    "Coton de Tulear": 4,
    "German Longhaired Pointer": 4,
    "Giant Schnauzer": 4,
    "Golden Retriever": 4,
    "Komondor": 5,
    "Leonberger": 4,
    "Maltese": 5,
    "Miniature Schnauzer": 4,
    "Old English Sheepdog": 5,
    "Polish Lowland Sheepdog": 4,
    "Poodle (Miniature)": 4,
    "Poodle (Standard)": 4,
    "Poodle (Toy)": 4,
    "Portuguese Water Dog": 4,
    "Puli": 5,
    "Schapendoes": 4,
    "Shih Tzu": 5,
    "Slovakian Wirehaired Pointer": 4,
    "Soft Coated Wheaten Terrier": 4,
    "Spanish Water Dog": 4,
    "Yorkshire Terrier": 5,
    "Cesky Terrier": 4,
    "Irish Setter": 5,
    "Bohemian Shepherd": 5,
    "Wirehaired Pointing Griffon": 4,
    "American Eskimo Dog": 5,
    "Volpino Italiano": 5,
    "Havanese": 5
  };

  const override = coatOverrides[dog.name];
  if (override !== undefined) {
    dog.coat_length = override;
  }

  // Manual overrides for specific breeds (fixes for API data)
  const breedOverrides: Record<string, Partial<Dog>> = {
    "Bergamasco Sheepdog": { protectiveness: 5 },
    "Bohemian Shepherd": { protectiveness: 4 },
    "Belgian Sheepdog": { protectiveness: 4 },
    "Australian Shepherd": { protectiveness: 4, shedding: 4, coat_length: 4 },
    "Nova Scotia Duck Tolling Retriever": { shedding: 4, coat_length: 4 },
    "Affenpinscher": { shedding: 3 },
    "Nederlandse Kooikerhondje": { shedding: 4, coat_length: 4 },
    "Japanese Chin": { shedding: 4, coat_length: 5 },
    "English Toy Spaniel": { shedding: 4, coat_length: 5 },
    "Irish Red and White Setter": { coat_length: 4 },
    "Australian Terrier": { coat_length: 3 },
  };

  const breedOverride = breedOverrides[dog.name];
  if (breedOverride) {
    Object.assign(dog, breedOverride);
  }

  return dog;
}

export async function getBreeds(options: BreedSearchOptions = {}): Promise<BreedsResult> {
  const apiKey = process.env.NEXT_PUBLIC_API_NINJAS_KEY;
  
  if (!apiKey) {
    console.error('API Ninjas Key is missing');
    return { breeds: [], total: 0 };
  }

  const limit = options.limit || 20;
  const offset = options.offset || 0;

  try {
    const params = new URLSearchParams();
    
    if (options.name) params.append('name', options.name);
    if (options.shedding) params.append('shedding', options.shedding.toString());
    // if (options.grooming) params.append('grooming', options.grooming.toString());
    // if (options.playfulness) params.append('playfulness', options.playfulness.toString());
    // if (options.drooling) params.append('drooling', options.drooling.toString());
    if (options.barking) params.append('barking', options.barking.toString());
    if (options.energy) params.append('energy', options.energy.toString());
    if (options.protectiveness) params.append('protectiveness', options.protectiveness.toString());
    if (options.trainability) params.append('trainability', options.trainability.toString());

    const manualFiltersActive = 
      options.fetchAll ||
      options.good_with_children !== undefined || 
      options.good_with_other_dogs !== undefined || 
      options.good_with_strangers !== undefined ||
      options.energy !== undefined ||
      options.trainability !== undefined ||
      options.shedding !== undefined ||
      options.grooming !== undefined ||
      options.playfulness !== undefined ||
      options.drooling !== undefined ||
      options.coat_length !== undefined ||
      options.barking !== undefined ||
      options.protectiveness !== undefined ||
      options.max_life_expectancy !== undefined ||
      options.size !== undefined ||
      (options.sort !== undefined && options.sort !== 'name');

    // API Ninjas requires at least one filtering parameter.
    if (Array.from(params.keys()).length === 0) {
      params.append('min_weight', '1');
    }

    if (manualFiltersActive) {
      // Fetch ALL breeds with controlled concurrency (batched) to avoid rate limits
      const allDogs: Dog[] = [];
      const offsets = Array.from({ length: 20 }, (_, i) => i * 20); // Check up to 400 items
      const batchSize = 5; // 5 parallel requests at a time

      for (let i = 0; i < offsets.length; i += batchSize) {
        const batchOffsets = offsets.slice(i, i + batchSize);
        
        const batchPromises = batchOffsets.map(async (offset) => {
          const p = new URLSearchParams(params);
          p.append('limit', '20');
          p.append('offset', offset.toString());

          try {
            const res = await fetch(`https://api.api-ninjas.com/v1/dogs?${p.toString()}`, {
              headers: { 'X-Api-Key': apiKey },
              next: { revalidate: 0 }
            });

            if (res.ok) {
              const data = await res.json();
              return data;
            } else {
              console.warn(`API Error ${res.status} for offset ${offset}`);
              return [];
            }
          } catch (err) {
            console.error(`Error fetching offset ${offset}:`, err);
            return [];
          }
        });

        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach((dogs) => {
          if (dogs && dogs.length > 0) {
            allDogs.push(...dogs);
          }
        });

        // If an entire batch returns empty arrays, we likely reached the end of the list
        // However, with concurrency, we might have gaps if one fails, so we don't break immediately unless truly done.
        // But for this API, if offset X returns empty, offset X+20 will too.
        // Let's check if the LAST item in the batch was empty.
        const lastResult = batchResults[batchResults.length - 1];
        if (lastResult && lastResult.length === 0) {
          break; 
        }

        // Small delay between batches to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Remove duplicates
      const uniqueDogsMap = new Map();
      allDogs.forEach(dog => {
        if (!uniqueDogsMap.has(dog.name)) {
          uniqueDogsMap.set(dog.name, dog);
        }
      });
      let dogs: Dog[] = Array.from(uniqueDogsMap.values()).map(sanitizeDog);

      // Apply manual filters
      if (options.good_with_children) {
        dogs = dogs.filter(dog => dog.good_with_children >= options.good_with_children!);
      }
      if (options.good_with_other_dogs) {
        dogs = dogs.filter(dog => dog.good_with_other_dogs >= options.good_with_other_dogs!);
      }
      if (options.good_with_strangers) {
        dogs = dogs.filter(dog => dog.good_with_strangers >= options.good_with_strangers!);
      }
      if (options.energy) {
        dogs = dogs.filter(dog => dog.energy >= options.energy!);
      }
      if (options.trainability) {
        dogs = dogs.filter(dog => dog.trainability >= options.trainability!);
      }
      if (options.shedding) {
        dogs = dogs.filter(dog => dog.shedding <= options.shedding!);
      }
      if (options.grooming) {
        dogs = dogs.filter(dog => dog.grooming >= options.grooming!);
      }
      if (options.playfulness) {
        dogs = dogs.filter(dog => dog.playfulness >= options.playfulness!);
      }
      if (options.drooling) {
        dogs = dogs.filter(dog => dog.drooling <= options.drooling!);
      }
      if (options.coat_length !== undefined) {
        dogs = dogs.filter(dog => dog.coat_length <= options.coat_length!);
      }
      if (options.barking) {
        dogs = dogs.filter(dog => dog.barking <= options.barking!);
      }
      if (options.protectiveness) {
        dogs = dogs.filter(dog => dog.protectiveness >= options.protectiveness!);
      }
      if (options.max_life_expectancy) {
        dogs = dogs.filter(dog => dog.max_life_expectancy >= options.max_life_expectancy!);
      }

      if (options.size) {
        dogs = dogs.filter(dog => {
          const height = dog.max_height_male;
          let category: "toy" | "small" | "medium" | "large";
          if (height < 12) {
            category = "toy";
          } else if (height < 18) {
            category = "small";
          } else if (height < 30) {
            category = "medium";
          } else {
            category = "large";
          }
          return category === options.size;
        });
      }

      // Apply sorting
      if (options.sort === 'life_span') {
        dogs.sort((a, b) => (b.max_life_expectancy || 0) - (a.max_life_expectancy || 0));
      } else if (options.sort === 'name') {
        dogs.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      const total = dogs.length;
      
      // If fetchAll is requested, return everything without pagination
      if (options.fetchAll) {
        return { breeds: dogs, total };
      }

      // Apply pagination AFTER filtering
      const paginatedDogs = dogs.slice(offset, offset + limit);
      
      return { breeds: paginatedDogs, total };
    }

    // Standard behavior (no manual filters) - use API pagination
    if (offset) params.append('offset', offset.toString());
    params.append('limit', limit.toString());

    const res = await fetch(`https://api.api-ninjas.com/v1/dogs?${params.toString()}`, {
      headers: {
        'X-Api-Key': apiKey,
      },
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error('Failed to fetch breeds:', res.status, res.statusText);
      return { breeds: [], total: 0 };
    }

    const rawDogs: Dog[] = await res.json();
    const dogs = rawDogs.map(sanitizeDog);

    // For non-filtered requests, we can't know the total, so we estimate
    // If we got fewer than limit, we're on the last page
    const total = dogs.length < limit ? offset + dogs.length : offset + dogs.length + 1;

    return { breeds: dogs, total };
  } catch (error) {
    console.error('Error fetching breeds:', error);
    return { breeds: [], total: 0 };
  }
}

export interface TheDogApiBreed {
  id: number;
  name: string;
  description?: string;
  history?: string;
  bred_for?: string;
  perfect_for?: string;
  breed_group?: string;
  life_span?: string;
  temperament?: string;
  origin?: string;
}

export async function getAdditionalBreedDetails(name: string): Promise<TheDogApiBreed | null> {
  const apiKey = process.env.NEXT_PUBLIC_DOG_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(name)}`, {
      headers: { 'x-api-key': apiKey },
      next: { revalidate: 0 }
    });

    if (!res.ok) return null;

    const breeds: TheDogApiBreed[] = await res.json();
    // Find exact match or return first result
    const match = breeds.find(b => b.name.toLowerCase() === name.toLowerCase()) || breeds[0];
    return match || null;
  } catch (error) {
    console.error('Error fetching additional breed details:', error);
    return null;
  }
}
