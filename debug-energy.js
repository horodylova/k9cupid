
const apiKey = 'lEb6VJJApgCioHD8Kc6eQ1OfAff6KgeWLjXKyoPL';

async function checkEnergy() {
  const res = await fetch(`https://api.api-ninjas.com/v1/dogs?energy=5&limit=100`, {
    headers: { 'X-Api-Key': apiKey }
  });
  const dogs = await res.json();
  console.log(`Energy=5 count: ${dogs.length}`);
}

checkEnergy();
