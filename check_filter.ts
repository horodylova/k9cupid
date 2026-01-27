import { getBreeds } from './src/lib/api';

async function test() {
  console.log('Fetching breeds with drooling=1...');
  // Since we modified api.ts to do manual filtering, passing drooling: 1 should work
  const result = await getBreeds({ drooling: 1, limit: 5 });
  console.log('Breeds found:', result.breeds.length);
  result.breeds.forEach(b => {
    console.log(`${b.name}: drooling=${b.drooling}`);
  });
}

test();
