import { getBreeds, Dog } from './src/lib/api';

function getTemperamentTags(breed: Dog) {
  const tags = [];
  if (breed.good_with_children >= 3) tags.push("Good with Kids");
  if (breed.good_with_other_dogs >= 3) tags.push("Dog Friendly");
  if (breed.good_with_strangers >= 3) tags.push("Friendly Stranger");
  if (breed.trainability >= 3) tags.push("Easy to Train");
  if (breed.energy >= 4) tags.push("High Energy");
  else if (breed.energy === 3) tags.push("Medium Energy");
  if (breed.shedding <= 2) tags.push("Low Shedding");
  if (breed.grooming <= 2) tags.push("Easy Grooming");
  if (breed.grooming > 3) tags.push("High Grooming");
  if (breed.drooling <= 1) tags.push("Low Drooling");
  if (breed.barking <= 2) tags.push("Quiet");
  if (breed.playfulness >= 5) tags.push("Very Playful");
  if (breed.playfulness >= 3 && breed.playfulness < 5) tags.push("Playful");
  if (breed.protectiveness >= 3) tags.push("Protective");
  return tags.slice(0, 5);
}

async function test() {
  const result = await getBreeds({ limit: 1, name: 'Affenpinscher' });
  if (result.breeds.length > 0) {
    const breed = result.breeds[0];
    console.log('Breed:', breed.name);
    console.log('Tags (sliced):', getTemperamentTags(breed));
    
    // Check full tags
    const fullTags = [];
    if (breed.good_with_children >= 3) fullTags.push("Good with Kids");
    if (breed.good_with_other_dogs >= 3) fullTags.push("Dog Friendly");
    if (breed.good_with_strangers >= 3) fullTags.push("Friendly Stranger");
    if (breed.trainability >= 3) fullTags.push("Easy to Train");
    if (breed.energy >= 4) fullTags.push("High Energy");
    else if (breed.energy === 3) fullTags.push("Medium Energy");
    if (breed.shedding <= 2) fullTags.push("Low Shedding");
    if (breed.grooming <= 2) fullTags.push("Easy Grooming");
    if (breed.grooming > 3) fullTags.push("High Grooming");
    if (breed.drooling <= 1) fullTags.push("Low Drooling");
    console.log('Full Tags:', fullTags);
  }
}

test();
