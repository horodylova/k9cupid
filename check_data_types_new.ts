import { getBreeds } from './src/lib/api';

async function test() {
  console.log('Fetching breeds to check data types...');
  const result = await getBreeds({ limit: 20 });
  
  const breed = result.breeds[0];
  if (breed) {
    console.log('Sample breed:', breed.name);
    console.log('max_life_expectancy type:', typeof breed.max_life_expectancy);
    console.log('max_life_expectancy value:', breed.max_life_expectancy);
  }
}

test();
