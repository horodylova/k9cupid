
const apiKey = 'lEb6VJJApgCioHD8Kc6eQ1OfAff6KgeWLjXKyoPL';

async function checkBreeds() {
  const offsets = [0, 100, 200, 300, 400, 500];
  let allDogs = [];

  for (const offset of offsets) {
    console.log(`Fetching offset ${offset}...`);
    const res = await fetch(`https://api.api-ninjas.com/v1/dogs?min_weight=1&limit=100&offset=${offset}`, {
      headers: { 'X-Api-Key': apiKey }
    });
    const dogs = await res.json();
    console.log(`Got ${dogs.length} dogs`);
    if (dogs.length === 0) break;
    allDogs.push(...dogs);
  }

  console.log(`Total dogs fetched: ${allDogs.length}`);
  
  const golden = allDogs.find(d => d.name === 'Golden Retriever');
  if (golden) {
    console.log('FOUND Golden Retriever!');
    console.log(JSON.stringify(golden, null, 2));
  } else {
    console.log('Golden Retriever NOT FOUND in the first ' + allDogs.length + ' breeds');
  }
}

checkBreeds();
