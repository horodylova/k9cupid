import { getBreeds } from './src/lib/api';

async function test() {
  console.log('Fetching breeds with drooling=5...');
  const result = await getBreeds({ drooling: 5, limit: 5 });
  console.log('Breeds found:', result.breeds.length);
  result.breeds.forEach(b => {
    console.log(`${b.name}: drooling=${b.drooling}`);
  });
}

test();
