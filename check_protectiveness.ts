import { getBreeds } from './src/lib/api';

async function test() {
  console.log('Fetching all breeds with protectiveness >= 5...');
  const result = await getBreeds({ protectiveness: 5, limit: 100 });
  console.log('Total found:', result.total);
  console.log('Breeds returned:', result.breeds.length);
  
  const levels = new Set(result.breeds.map(b => b.protectiveness));
  console.log('Protectiveness levels found:', Array.from(levels).sort());
  
  result.breeds.slice(0, 5).forEach(b => {
    console.log(`${b.name}: protectiveness=${b.protectiveness}`);
  });
}

test();
