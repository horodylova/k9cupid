
const apiKey = 'lEb6VJJApgCioHD8Kc6eQ1OfAff6KgeWLjXKyoPL';

async function fetchAll() {
  const offsets = [];
  for (let i = 0; i < 400; i += 20) {
    offsets.push(i);
  }

  console.log(`Fetching ${offsets.length} pages...`);
  
  const promises = offsets.map(async (offset) => {
    try {
        const res = await fetch(`https://api.api-ninjas.com/v1/dogs?min_weight=1&offset=${offset}`, {
            headers: { 'X-Api-Key': apiKey }
        });
        if (!res.ok) {
            console.error(`Error ${res.status} for offset ${offset}`);
            return [];
        }
        const dogs = await res.json();
        process.stdout.write('.');
        return dogs;
    } catch (e) {
        console.error(e);
        return [];
    }
  });

  const results = await Promise.all(promises);
  const allDogs = results.flat();
  console.log(`\nTotal dogs: ${allDogs.length}`);
  
  const golden = allDogs.find(d => d.name === 'Golden Retriever');
  if (golden) console.log('Found Golden Retriever!');
  else console.log('Still no Golden Retriever...');
}

fetchAll();
