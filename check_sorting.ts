import { getBreeds } from './src/lib/api';

async function test() {
  console.log('Fetching breeds sorted by life_span (top 5)...');
  // Pass a limit to simulate pagination of the sorted list
  const result = await getBreeds({ sort: 'life_span', limit: 5 });
  
  console.log('Total found:', result.total);
  console.log('Breeds returned:', result.breeds.length);
  
  result.breeds.forEach(b => {
    console.log(`${b.name}: ${b.max_life_expectancy} years`);
  });

  // Verify sorting
  let sorted = true;
  for (let i = 0; i < result.breeds.length - 1; i++) {
    if (result.breeds[i].max_life_expectancy < result.breeds[i+1].max_life_expectancy) {
      sorted = false;
      break;
    }
  }
  console.log('Sorted correctly?', sorted);
}

test();
