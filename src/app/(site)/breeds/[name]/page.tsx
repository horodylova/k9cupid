import Link from "next/link";
import Image from "next/image";
import { getBreeds, Dog, getAdditionalBreedDetails } from "@/lib/api";
import BreedGallery from "@/components/breeds/BreedGallery";
import BreedAdoptableMatches from "@/components/breeds/BreedAdoptableMatches";
import WishlistHeartButton from "@/components/wishlist/WishlistHeartButton";
import { notFound } from "next/navigation";

function getTemperamentTags(breed: Dog) {
  const tags = [];
  if (breed.good_with_children >= 3) tags.push("Good with Kids");
  if (breed.good_with_other_dogs >= 3) tags.push("Dog Friendly");
  if (breed.good_with_strangers >= 3) tags.push("Friendly Stranger");
  if (breed.trainability >= 3) tags.push("Easy to Train");
  if (breed.energy >= 4) tags.push("High Energy");
  else if (breed.energy === 3) tags.push("Medium Energy");
  if (breed.shedding <= 2) tags.push("Low Shedding");
  if (breed.drooling <= 1) tags.push("Low Drooling");
  if (breed.grooming <= 2) tags.push("Easy Grooming");
  if (breed.grooming > 3) tags.push("High Grooming");
  if (breed.barking <= 2) tags.push("Quiet");
  if (breed.playfulness >= 5) tags.push("Very Playful");
  if (breed.playfulness >= 3 && breed.playfulness < 5) tags.push("Playful");
  if (breed.protectiveness >= 3) tags.push("Protective");
  if (breed.max_life_expectancy >= 17) tags.push("Long-Lived");
  return tags.slice(0, 10);
}

type RescueMeta = {
  count: number;
  countReturned: number;
  pageReturned: number;
  limit: number;
  pages: number;
  transactionId?: string;
};

type RescueRelationship = { data: Array<{ type: string; id: string }> | { type: string; id: string } | null };

type RescueAnimal = {
  type: "animals";
  id: string;
  attributes?: {
    name?: string;
    species?: string;
    breedString?: string;
    sex?: string;
    ageGroup?: string;
    ageString?: string;
    sizeGroup?: string;
    url?: string;
    pictureThumbnailUrl?: string;
  };
  relationships?: Record<string, RescueRelationship>;
};

type RescueIncluded = {
  type: string;
  id: string;
  attributes?: Record<string, unknown>;
};

type RescueResponse = {
  meta?: RescueMeta;
  data?: RescueAnimal[];
  included?: RescueIncluded[];
};

function normalizeTextToken(v: string) {
  return (v || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isLikelyDog(attrs: RescueAnimal["attributes"]) {
  const species = (attrs?.species || "").trim().toLowerCase();
  if (species) return species === "dog" || species === "canine";
  return true;
}

function isRelArray(rel: RescueRelationship | undefined): rel is { data: Array<{ type: string; id: string }> } {
  return Array.isArray(rel?.data);
}

function getFirstRelatedId(animal: RescueAnimal, relName: string) {
  const rel = animal.relationships?.[relName]?.data || null;
  if (!rel) return "";
  if (Array.isArray(rel)) return rel[0]?.id || "";
  return rel.id || "";
}

function getIncluded(included: RescueIncluded[], type: string, id: string) {
  if (!id) return null;
  return included.find((x) => x.type === type && x.id === id) || null;
}

function upgradeRescuegroupsWidth(url: string, width: number) {
  try {
    const u = new URL(url);
    if (u.hostname !== "cdn.rescuegroups.org") return url;
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

function getImage(animal: RescueAnimal, included: RescueIncluded[]) {
  const thumb = animal.attributes?.pictureThumbnailUrl || null;

  const rel = animal.relationships?.pictures;
  if (isRelArray(rel)) {
    for (const ref of rel.data) {
      const pic = getIncluded(included, "pictures", ref.id);
      const attrs = (pic?.attributes || {}) as Record<string, unknown>;
      const order = typeof attrs.order === "number" ? attrs.order : null;
      const original = typeof attrs.original === "string" ? attrs.original : null;
      const large = typeof attrs.large === "string" ? attrs.large : null;
      const small = typeof attrs.small === "string" ? attrs.small : null;
      if (order === 1 && (original || large || small)) {
        return {
          src: original || large || small || "",
        };
      }
    }

    const firstRef = rel.data[0];
    if (firstRef) {
      const pic = getIncluded(included, "pictures", firstRef.id);
      const attrs = (pic?.attributes || {}) as Record<string, unknown>;
      const original = typeof attrs.original === "string" ? attrs.original : null;
      const large = typeof attrs.large === "string" ? attrs.large : null;
      const small = typeof attrs.small === "string" ? attrs.small : null;
      if (original || large || small) {
        return {
          src: original || large || small || "",
        };
      }
    }
  }

  if (thumb) {
    const src = upgradeRescuegroupsWidth(thumb, 1200);
    return { src };
  }

  return null;
}

function matchesBreed(breedName: string, breedString: string) {
  const target = normalizeTextToken(breedName);
  const haystack = normalizeTextToken(breedString);
  if (!target || !haystack) return false;
  return haystack.includes(target);
}

async function findAdoptableDogsForBreed(breedName: string) {
  const apiKey = (process.env.RESCUEGROUPS_API_KEY || "").trim();
  if (!apiKey) return [];

  const limit = 250;
  const maxPagesToScan = 8;
  const desired = 6;

  const matches: Array<{
    id: string;
    name: string;
    breedString: string;
    age: string;
    sex: string;
    size: string;
    imageSrc: string;
    orgName: string;
    orgCitystate: string;
  }> = [];

  let page = 1;
  let pages = 1;

  while (page <= pages && page <= maxPagesToScan && matches.length < desired) {
    const upstream = new URL("https://api.rescuegroups.org/v5/public/animals/search/available/dogs/");
    upstream.searchParams.set("limit", String(limit));
    upstream.searchParams.set("page", String(page));
    upstream.searchParams.set("include", "pictures,orgs");
    upstream.searchParams.set("fields[animals]", "name,species,breedString,sex,ageGroup,ageString,sizeGroup,pictureThumbnailUrl");
    upstream.searchParams.set("fields[pictures]", "small,large,original,order");
    upstream.searchParams.set("fields[orgs]", "name,citystate");

    const res = await fetch(upstream, {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        Authorization: apiKey,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) break;
    const json = (await res.json()) as RescueResponse;
    pages = Math.max(1, json.meta?.pages || 1);

    const dogs = Array.isArray(json.data) ? json.data : [];
    const included = Array.isArray(json.included) ? json.included : [];

    for (const dog of dogs) {
      if (!isLikelyDog(dog.attributes)) continue;
      const breedString = dog.attributes?.breedString || "";
      if (!matchesBreed(breedName, breedString)) continue;

      const image = getImage(dog, included);
      const orgId = getFirstRelatedId(dog, "orgs");
      const org = getIncluded(included, "orgs", orgId);
      const orgAttrs = (org?.attributes || {}) as Record<string, unknown>;
      const orgName = typeof orgAttrs.name === "string" ? orgAttrs.name : "";
      const orgCitystate = typeof orgAttrs.citystate === "string" ? orgAttrs.citystate : "";

      matches.push({
        id: dog.id,
        name: dog.attributes?.name || "Dog",
        breedString,
        age: dog.attributes?.ageString || dog.attributes?.ageGroup || "",
        sex: dog.attributes?.sex || "",
        size: dog.attributes?.sizeGroup || "",
        imageSrc: image?.src || "",
        orgName,
        orgCitystate,
      });

      if (matches.length >= desired) break;
    }

    page += 1;
  }

  return matches;
}

export default async function BreedPage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name);
  
  const [result, additionalDetails] = await Promise.all([
    getBreeds({ name: decodedName }),
    getAdditionalBreedDetails(decodedName)
  ]);

  const breed = result.breeds.find(b => b.name === decodedName) || result.breeds[0];

  if (!breed) {
    notFound();
  }

  const adoptableMatches = await findAdoptableDogsForBreed(breed.name);
  const sheltersHref = adoptableMatches.length > 0 ? `/shelters?breed=${encodeURIComponent(breed.name)}` : "/shelters";
  const tags = getTemperamentTags(breed);
  const formatScore = (score: number) => (score >= 1 ? `${score}/5` : 'N/A');
  const getCoatLengthDisplay = (coatLength: number) => {
    if (coatLength < 0 || coatLength > 5) {
      return 'N/A';
    }
    return `${coatLength}/5`;
  };
  const href = `/breeds/${encodeURIComponent(breed.name)}`;

  return (
    <>
      <section id="banner" className="py-3" style={{ background: '#F9F3EC' }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Breed <span className="text-primary">Details</span></h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">Home</Link>
              <Link className="breadcrumb-item nav-link" href="/breeds">Breeds</Link>
              <span className="breadcrumb-item active" aria-current="page">{breed.name}</span>
            </nav>
          </div>
        </div>
      </section>

      <section id="selling-product">
        <div className="container my-md-5 py-5">
          <div className="row g-md-5">
            <div className="col-lg-6">
              <BreedGallery image={breed.image_link} name={breed.name} />
            </div>
            <div className="col-lg-6 mt-5 ">
              <div className="product-info">
                <div className="element-header">
                  <h2 className="display-6">{breed.name}</h2>
                </div>
                <div className="product-price pt-3 pb-3">
                  <strong className="text-primary display-6 fw-bold">
                    {breed.min_life_expectancy} - {breed.max_life_expectancy} years
                  </strong>
                  <span className="ms-2 text-muted">Life Expectancy</span>
                </div>
                
                {additionalDetails?.description && (
                  <p>{additionalDetails.description}</p>
                )}

                <div className="cart-wrap">
                  <div className="product-quantity pt-2">
                    <div className="stock-button-wrap">
                      <div className="d-flex flex-wrap pt-4">
                        <Link href={sheltersHref} className="btn btn-primary me-3 px-4 pt-3 pb-3">
                          <h5 className="text-uppercase m-0">Find a Puppy</h5>
                        </Link>
                        <WishlistHeartButton name={breed.name} href={href} imageSrc={breed.image_link || undefined} variant="inline" />
                      </div>
                      {adoptableMatches.length > 0 && (
                        <div className="mt-3 p-3 border rounded-4 bg-white d-flex align-items-center gap-3">
                          <Image
                            src="/Cupid%20with%20beagle.png"
                            alt="k9cupid"
                            width={72}
                            height={72}
                            style={{ objectFit: "contain" }}
                            unoptimized
                          />
                          <div>
                            <div className="fw-semibold">See adoptable {breed.name} dogs below</div>
                            <div className="text-muted" style={{ fontSize: 14 }}>
                              For now, scroll down to meet adoptable {breed.name} dogs from shelters and rescues.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="meta-product pt-4">
                  {additionalDetails?.bred_for && (
                     <div className="meta-item d-flex align-items-baseline mb-2">
                       <h6 className="item-title fw-bold no-margin pe-2">Bred For:</h6>
                       <span className="text-muted">{additionalDetails.bred_for}</span>
                     </div>
                  )}
                  {additionalDetails?.perfect_for && (
                     <div className="meta-item d-flex align-items-baseline mb-2">
                       <h6 className="item-title fw-bold no-margin pe-2">Perfect For:</h6>
                       <span className="text-muted">{additionalDetails.perfect_for}</span>
                     </div>
                  )}
                  <div className="meta-item d-flex align-items-baseline">
                    <h6 className="item-title fw-bold no-margin pe-2">Traits:</h6>
                    <ul className="select-list list-unstyled d-flex flex-wrap gap-1">
                      {tags.map((tag, index) => (
                         <li key={index} className="select-item">
                           <span className="badge bg-light text-dark border">{tag}</span>
                         </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-info-tabs py-md-5">
        <div className="container">
          <div className="row">
            <div className="d-flex flex-column flex-md-row align-items-start gap-5">
              <div className="nav flex-row flex-wrap flex-md-column nav-pills me-3 col-lg-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <button className="nav-link fs-5 mb-2 text-start active" id="v-pills-stats-tab" data-bs-toggle="pill" data-bs-target="#v-pills-stats" type="button" role="tab" aria-controls="v-pills-stats" aria-selected="true">Statistics</button>
                <button className="nav-link fs-5 mb-2 text-start" id="v-pills-additional-tab" data-bs-toggle="pill" data-bs-target="#v-pills-additional" type="button" role="tab" aria-controls="v-pills-additional" aria-selected="false">Physical Attributes</button>
                {additionalDetails?.history && (
                  <button className="nav-link fs-5 mb-2 text-start" id="v-pills-history-tab" data-bs-toggle="pill" data-bs-target="#v-pills-history" type="button" role="tab" aria-controls="v-pills-history" aria-selected="false">History</button>
                )}
              </div>
              <div className="tab-content w-100" id="v-pills-tabContent">
                <div className="tab-pane fade show active" id="v-pills-stats" role="tabpanel" aria-labelledby="v-pills-stats-tab">
                  <h2>Breed Statistics</h2>
                  <div className="row">
                     <div className="col-md-6">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Energy Level
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.energy)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Trainability
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.trainability)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Playfulness
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.playfulness)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Protectiveness
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.protectiveness)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Barking
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.barking)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Drooling
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.drooling)}</span>
                          </li>
                        </ul>
                     </div>
                     <div className="col-md-6">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Good with Children
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.good_with_children)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Good with Other Dogs
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.good_with_other_dogs)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Good with Strangers
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.good_with_strangers)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Shedding
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.shedding)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Coat Length
                            <span className="badge bg-primary rounded-pill">{getCoatLengthDisplay(breed.coat_length)}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Grooming
                            <span className="badge bg-primary rounded-pill">{formatScore(breed.grooming)}</span>
                          </li>
                        </ul>
                     </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="v-pills-additional" role="tabpanel" aria-labelledby="v-pills-additional-tab">
                  <h2>Physical Attributes</h2>
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <th scope="row">Height (Male)</th>
                        <td>{breed.min_height_male} - {breed.max_height_male} inches</td>
                      </tr>
                      <tr>
                        <th scope="row">Height (Female)</th>
                        <td>{breed.min_height_female} - {breed.max_height_female} inches</td>
                      </tr>
                      <tr>
                        <th scope="row">Weight (Male)</th>
                        <td>{breed.min_weight_male} - {breed.max_weight_male} lbs</td>
                      </tr>
                      <tr>
                        <th scope="row">Weight (Female)</th>
                        <td>{breed.min_weight_female} - {breed.max_weight_female} lbs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {additionalDetails?.history && (
                  <div className="tab-pane fade" id="v-pills-history" role="tabpanel" aria-labelledby="v-pills-history-tab">
                    <h2>Breed History</h2>
                    <p className="lead">{additionalDetails.history}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <BreedAdoptableMatches breedName={breed.name} matches={adoptableMatches} />
    </>
  );
}
