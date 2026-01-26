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
  barking?: number;
  energy?: number;
  protectiveness?: number;
  trainability?: number;
  good_with_children?: number;
  good_with_other_dogs?: number;
  good_with_strangers?: number;
  offset?: number;
  limit?: number;
}

export interface BreedsResult {
  breeds: Dog[];
  total: number;
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
    if (options.barking) params.append('barking', options.barking.toString());
    if (options.energy) params.append('energy', options.energy.toString());
    if (options.protectiveness) params.append('protectiveness', options.protectiveness.toString());
    if (options.trainability) params.append('trainability', options.trainability.toString());

    const manualFiltersActive = 
      options.good_with_children !== undefined || 
      options.good_with_other_dogs !== undefined || 
      options.good_with_strangers !== undefined ||
      options.energy !== undefined ||
      options.trainability !== undefined ||
      options.shedding !== undefined ||
      options.barking !== undefined ||
      options.protectiveness !== undefined;

    // API Ninjas requires at least one filtering parameter.
    if (Array.from(params.keys()).length === 0) {
      params.append('min_weight', '1');
    }

    if (manualFiltersActive) {
      // Fetch ALL breeds in parallel
      const offsets = Array.from({ length: 20 }, (_, i) => i * 20);
      
      const fetchPromises = offsets.map(async (fetchOffset) => {
        const p = new URLSearchParams(params);
        p.append('limit', '20');
        p.append('offset', fetchOffset.toString());
        
        try {
          const res = await fetch(`https://api.api-ninjas.com/v1/dogs?${p.toString()}`, {
            headers: { 'X-Api-Key': apiKey },
            next: { revalidate: 3600 }
          });
          if (!res.ok) return [];
          return await res.json();
        } catch (e) {
          console.error(`Error fetching offset ${fetchOffset}:`, e);
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      const allDogs = results.flat();
      
      // Remove duplicates
      const uniqueDogsMap = new Map();
      allDogs.forEach(dog => {
        if (!uniqueDogsMap.has(dog.name)) {
          uniqueDogsMap.set(dog.name, dog);
        }
      });
      let dogs: Dog[] = Array.from(uniqueDogsMap.values());

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
      if (options.barking) {
        dogs = dogs.filter(dog => dog.barking <= options.barking!);
      }
      if (options.protectiveness) {
        dogs = dogs.filter(dog => dog.protectiveness >= options.protectiveness!);
      }
      
      const total = dogs.length;
      
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
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error('Failed to fetch breeds:', res.status, res.statusText);
      return { breeds: [], total: 0 };
    }

    const dogs: Dog[] = await res.json();

    // For non-filtered requests, we can't know the total, so we estimate
    // If we got fewer than limit, we're on the last page
    const total = dogs.length < limit ? offset + dogs.length : offset + dogs.length + 1;

    return { breeds: dogs, total };
  } catch (error) {
    console.error('Error fetching breeds:', error);
    return { breeds: [], total: 0 };
  }
}
