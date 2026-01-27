import { getBreeds } from './src/lib/api';

async function test() {
  console.log('Fetching breeds...');
  const result = await getBreeds({ limit: 5 });
  console.log('Breeds found:', result.breeds.length);
  if (result.breeds.length > 0) {
    console.log('First breed:', result.breeds[0].name);
    console.log('Drooling:', result.breeds[0].drooling);
  }
}

test();
