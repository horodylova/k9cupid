import { getBreeds } from './src/lib/api';

async function test() {
  console.log('Fetching breeds with drooling=1 and grooming=5...');
  const result = await getBreeds({ drooling: 1, grooming: 5, limit: 10 });
  console.log('Breeds found:', result.breeds.length);
  result.breeds.forEach(b => {
    console.log(`${b.name}: drooling=${b.drooling}, grooming=${b.grooming}`);
  });
}

test();
