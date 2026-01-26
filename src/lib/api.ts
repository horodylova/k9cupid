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
  offset?: number;
}

export async function getBreeds(options: BreedSearchOptions = {}): Promise<Dog[]> {
  const apiKey = process.env.NEXT_PUBLIC_API_NINJAS_KEY;
  
  if (!apiKey) {
    console.error('API Ninjas Key is missing');
    return [];
  }

  try {
    const params = new URLSearchParams();
    
    if (options.name) params.append('name', options.name);
    if (options.shedding) params.append('shedding', options.shedding.toString());
    if (options.barking) params.append('barking', options.barking.toString());
    if (options.energy) params.append('energy', options.energy.toString());
    if (options.protectiveness) params.append('protectiveness', options.protectiveness.toString());
    if (options.trainability) params.append('trainability', options.trainability.toString());
    if (options.offset) params.append('offset', options.offset.toString());

    // API Ninjas requires at least one parameter.
    // If no parameters are provided, default to min_weight=1 to fetch a general list.
    if (Array.from(params.keys()).length === 0) {
      params.append('min_weight', '1');
    }

    const res = await fetch(`https://api.api-ninjas.com/v1/dogs?${params.toString()}`, {
      headers: {
        'X-Api-Key': apiKey,
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error('Failed to fetch breeds:', res.status, res.statusText);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching breeds:', error);
    return [];
  }
}
