import { getBreeds } from './src/lib/api';

async function test() {
  console.log('Fetching all breeds with grooming >= 4...');
  const result = await getBreeds({ grooming: 4, limit: 100 });
  console.log('Total found:', result.total);
  console.log('Breeds returned:', result.breeds.length);
  
  const levels = new Set(result.breeds.map(b => b.grooming));
  console.log('Grooming levels found:', Array.from(levels).sort());
  
  const fours = result.breeds.filter(b => b.grooming === 4).length;
  const fives = result.breeds.filter(b => b.grooming === 5).length;
  console.log(`Count of level 4: ${fours}`);
  console.log(`Count of level 5: ${fives}`);
}

test();
