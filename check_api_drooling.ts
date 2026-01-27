async function test() {
  const apiKey = 'lEb6VJJApgCioHD8Kc6eQ1OfAff6KgeWLjXKyoPL';
  const url = 'https://api.api-ninjas.com/v1/dogs?drooling=1';
  console.log('Fetching:', url);
  const res = await fetch(url, { headers: { 'X-Api-Key': apiKey } });
  if (res.ok) {
    const data = await res.json();
    console.log('Success! Count:', data.length);
  } else {
    console.log('Error:', res.status, res.statusText);
    const text = await res.text();
    console.log('Body:', text);
  }
}

test();
