import { getBreeds } from './src/lib/api';

async function test() {
  console.log('Fetching all breeds with grooming=5...');
  // Pass a large limit to fetch all
  const result = await getBreeds({ grooming: 5, limit: 100 });
  
  console.log('Total found:', result.total);
  console.log('Breeds returned:', result.breeds.length);
  
  result.breeds.forEach(b => {
    console.log(`${b.name}: grooming=${b.grooming}`);
  });
}

test();
