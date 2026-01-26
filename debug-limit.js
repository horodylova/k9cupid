
const apiKey = 'lEb6VJJApgCioHD8Kc6eQ1OfAff6KgeWLjXKyoPL';

async function checkLimit() {
  const res = await fetch(`https://api.api-ninjas.com/v1/dogs?min_weight=1&limit=50`, {
    headers: { 'X-Api-Key': apiKey }
  });
  const dogs = await res.json();
  console.log(`Requested 50, got ${dogs.length}`);
}

checkLimit();
