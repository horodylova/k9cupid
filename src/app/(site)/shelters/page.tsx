import Link from "next/link";
import Image from "next/image";
import styles from "./shelters.module.css";
import { isExcludedRescuegroupsAnimalId, isRescuegroupsInfoEntryName } from "@/lib/rescuegroupsExclusions";
import { normalizeHtmlText } from "@/lib/htmlText";
import { ArrowRightIcon } from "@/components/ui/icons";
import ShelterDogWishlistHeartButton from "@/components/shelters/ShelterDogWishlistHeartButton";
import SheltersDesktopFilters from "@/components/shelters/SheltersDesktopFilters";
import SheltersMobileFilters from "@/components/shelters/SheltersMobileFilters";
import sheltersData from "@/data/rescuegroupsShelters.json";

export const revalidate = 300;

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
    descriptionText?: string;
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

function parseIntParam(value: unknown, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = typeof raw === "string" ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

function truncateText(text: string, maxLen: number) {
  const normalized = (text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 1).trim()}…`;
}

function isLikelyDog(attrs: RescueAnimal["attributes"]) {
  const species = (attrs?.species || "").trim().toLowerCase();
  if (species) return species === "dog" || species === "canine";

  const breed = (attrs?.breedString || "").trim().toLowerCase();
  if (!breed) return false;

  const nonDogMarkers = [
    "cat",
    "cats",
    "kitten",
    "feline",
    "tabby",
    "domestic short hair",
    "domestic long hair",
    "mouse",
    "mice",
    "rat",
    "hamster",
    "guinea pig",
    "rabbit",
    "bunny",
    "turtle",
    "tortoise",
    "snake",
    "lizard",
    "gecko",
    "bird",
    "parrot",
    "fish",
    "ferret",
  ];
  if (nonDogMarkers.some((m) => breed.includes(m))) return false;

  return true;
}

function getOrgLocation(attrs: Record<string, unknown>): { city: string; state: string } {
  const cityRaw = typeof attrs.city === "string" ? attrs.city.trim() : "";
  const stateRaw = typeof attrs.state === "string" ? attrs.state.trim().toUpperCase() : "";
  if (cityRaw || stateRaw) return { city: cityRaw, state: stateRaw };

  const citystate = typeof attrs.citystate === "string" ? attrs.citystate.trim() : "";
  if (!citystate) return { city: "", state: "" };

  const parts = citystate.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const state = parts[parts.length - 1].toUpperCase();
    const city = parts.slice(0, parts.length - 1).join(", ").trim();
    return { city, state };
  }

  return { city: citystate, state: "" };
}

function getAnimalLocation(item: RescueAnimal, includedByKey: Map<string, RescueIncluded>) {
  const locId = getFirstRelatedId(item, "locations");
  const loc = locId ? includedByKey.get(`locations:${locId}`) : null;
  const attrs = (loc?.attributes || {}) as Record<string, unknown>;
  const locCity = typeof attrs.city === "string" ? attrs.city.trim() : "";
  const locState = typeof attrs.state === "string" ? attrs.state.trim().toUpperCase() : "";
  if (locCity || locState) return { city: locCity, state: locState };

  const citystate = typeof attrs.citystate === "string" ? attrs.citystate.trim() : "";
  if (citystate) return getOrgLocation({ citystate });

  const orgId = getFirstRelatedId(item, "orgs");
  const org = orgId ? includedByKey.get(`orgs:${orgId}`) : null;
  const orgAttrs = (org?.attributes || {}) as Record<string, unknown>;
  return getOrgLocation(orgAttrs);
}

function normalizeToken(v: string) {
  return (v || "").trim().toLowerCase();
}

function deriveAgeBucket(attrs: RescueAnimal["attributes"] | undefined): "baby" | "young" | "adult" | "senior" | "" {
  const raw = normalizeToken(String(attrs?.ageGroup || ""));
  if (raw) {
    if (raw.includes("baby")) return "baby";
    if (raw.includes("young")) return "young";
    if (raw.includes("adult")) return "adult";
    if (raw.includes("senior")) return "senior";
  }

  const ageStr = normalizeToken(String(attrs?.ageString || ""));
  if (!ageStr) return "";

  const yearsMatch = ageStr.match(/(\d+)\s*year/);
  const monthsMatch = ageStr.match(/(\d+)\s*month/);
  const weeksMatch = ageStr.match(/(\d+)\s*week/);

  const years = yearsMatch ? Number(yearsMatch[1]) : NaN;
  const months = monthsMatch ? Number(monthsMatch[1]) : NaN;
  const weeks = weeksMatch ? Number(weeksMatch[1]) : NaN;

  if (Number.isFinite(weeks) && weeks < 52) return "baby";
  if (Number.isFinite(months) && months < 12 && !Number.isFinite(years)) return "baby";

  if (!Number.isFinite(years)) return "";
  if (years < 1) return "baby";
  if (years < 3) return "young";
  if (years < 8) return "adult";
  return "senior";
}

function matchesBreedAgeSizeFilters(
  attrs: RescueAnimal["attributes"] | undefined,
  selectedBreed: string,
  selectedAge: string,
  selectedSize: string
) {
  const breed = normalizeToken(attrs?.breedString || "");
  const age = deriveAgeBucket(attrs);
  const size = normalizeToken(attrs?.sizeGroup || "");

  if (selectedBreed && !breed.includes(selectedBreed)) return false;
  if (selectedAge && age !== selectedAge) return false;
  if (selectedSize && !size.includes(selectedSize)) return false;
  return true;
}

function isRelArray(rel: RescueRelationship | undefined): rel is { data: Array<{ type: string; id: string }> } {
  return Array.isArray(rel?.data);
}

function getFirstRelatedId(item: RescueAnimal, relName: string): string | null {
  const rel = item.relationships?.[relName];
  if (!rel?.data) return null;
  if (Array.isArray(rel.data)) return rel.data[0]?.id || null;
  return rel.data.id || null;
}

function getIncluded(included: RescueIncluded[], type: string, id: string | null) {
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
      if (order === 1 && (large || original || small)) {
        return {
          src: large || original || small || "",
          src2x: original || large || null,
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
      if (large || original || small) {
        return {
          src: large || original || small || "",
          src2x: original || large || null,
        };
      }
    }
  }

  if (thumb) {
    const src = upgradeRescuegroupsWidth(thumb, 900);
    const src2x = upgradeRescuegroupsWidth(thumb, 1400);
    return { src, src2x };
  }

  return null;
}

async function getDogs({
  page,
  limit,
  ageGroup,
}: {
  page: number;
  limit: number;
  ageGroup?: "Senior";
}): Promise<{ meta: RescueMeta; dogs: RescueAnimal[]; included: RescueIncluded[] }> {
  const apiKey = (process.env.RESCUEGROUPS_API_KEY || "").trim();
  if (!apiKey) {
    return {
      meta: { count: 0, countReturned: 0, pageReturned: page, limit, pages: 1 },
      dogs: [],
      included: [],
    };
  }

  const runFetch = async (upstream: URL) =>
    fetch(upstream, {
      method: ageGroup ? "POST" : "GET",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        Authorization: apiKey,
      },
      body: ageGroup
        ? JSON.stringify({
            data: {
              filters: [{ fieldName: "animals.ageGroup", operation: "equal", criteria: ageGroup }],
            },
          })
        : undefined,
      next: { revalidate: 300 },
    });

  const upstream = new URL("https://api.rescuegroups.org/v5/public/animals/search/available/dogs/");
  upstream.searchParams.set("limit", String(limit));
  upstream.searchParams.set("page", String(page));
  upstream.searchParams.set("include", "pictures,orgs,locations");
  upstream.searchParams.set(
    "fields[animals]",
    "name,species,breedString,sex,ageGroup,ageString,sizeGroup,url,pictureThumbnailUrl,descriptionText"
  );
  upstream.searchParams.set("fields[pictures]", "small,large,original,order");
  upstream.searchParams.set("fields[orgs]", "name,url,citystate,city,state,websiteUrl");
  upstream.searchParams.set("fields[locations]", "citystate,postalcode,state,country,lat,lon,coordinates");

  const res = await runFetch(upstream);
  const json = (await res.json()) as RescueResponse;
  const meta = json.meta || { count: 0, countReturned: 0, pageReturned: page, limit, pages: 1 };
  const dogs = Array.isArray(json.data) ? json.data : [];
  const included = Array.isArray(json.included) ? json.included : [];
  return { meta, dogs, included };
}

export default async function SheltersPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = parseIntParam(searchParams?.page, 1);
  const selectedShelterIdRaw = Array.isArray(searchParams?.shelter) ? searchParams?.shelter[0] : searchParams?.shelter;
  const selectedShelterNameRaw = Array.isArray(searchParams?.shelterName) ? searchParams?.shelterName[0] : searchParams?.shelterName;
  const selectedStateRaw = Array.isArray(searchParams?.state) ? searchParams?.state[0] : searchParams?.state;
  const selectedCityRaw = Array.isArray(searchParams?.city) ? searchParams?.city[0] : searchParams?.city;
  const selectedBreedRaw = Array.isArray(searchParams?.breed) ? searchParams?.breed[0] : searchParams?.breed;
  const selectedAgeRaw = Array.isArray(searchParams?.age) ? searchParams?.age[0] : searchParams?.age;
  const selectedSizeRaw = Array.isArray(searchParams?.size) ? searchParams?.size[0] : searchParams?.size;
  let selectedShelterId = (selectedShelterIdRaw || "").trim();
  let selectedShelterName = (selectedShelterNameRaw || "").trim();
  const selectedState = (selectedStateRaw || "").trim().toUpperCase();
  const selectedCity = (selectedCityRaw || "").trim();
  const selectedBreed = normalizeToken((selectedBreedRaw || "").trim());
  const selectedAge = normalizeToken((selectedAgeRaw || "").trim());
  const selectedSize = normalizeToken((selectedSizeRaw || "").trim());

  if (selectedShelterName && (!selectedShelterId || !Array.isArray(sheltersData) || !sheltersData.some((s) => s.id === selectedShelterId))) {
    const normalized = selectedShelterName.toLowerCase().trim();
    const matched = Array.isArray(sheltersData)
      ? sheltersData.find((s) => (s.name || "").toLowerCase().trim() === normalized)
      : null;
    if (matched?.id) {
      selectedShelterId = matched.id;
      selectedShelterName = matched.name || selectedShelterName;
    }
  }
  const bannerTitle = selectedShelterName || "Shelters";
  const pageSize = 18;
  const maxScanPages = 8;
  const clientFiltersActive = Boolean(
    selectedShelterId || selectedState || selectedCity || selectedBreed || selectedAge || selectedSize
  );

  const includedByKey = new Map<string, RescueIncluded>();
  let displayedDogs: RescueAnimal[] = [];
  let meta: RescueMeta = { count: 0, countReturned: 0, pageReturned: page, limit: pageSize, pages: 1 };
  let totalKnown = true;
  const seenDogIds = new Set<string>();

  let hasNextPage = false;
  let hasPrevPage = page > 1;

  if (clientFiltersActive) {
    totalKnown = false;
    const offset = (page - 1) * pageSize;
    const probe = page * pageSize + 1;
    const matches: RescueAnimal[] = [];

    let scanPage = 1;
    let upstreamPages = 1;

    while (scanPage <= upstreamPages && matches.length < probe) {
      const res = await getDogs({ page: scanPage, limit: 250, ageGroup: selectedAge === "senior" ? "Senior" : undefined });
      if (scanPage === 1) upstreamPages = res.meta.pages || 1;

      for (const inc of res.included) {
        includedByKey.set(`${inc.type}:${inc.id}`, inc);
      }

      for (const dog of res.dogs) {
        if (isExcludedRescuegroupsAnimalId(dog.id)) continue;
        if (isRescuegroupsInfoEntryName(dog.attributes?.name)) continue;
        if (!isLikelyDog(dog.attributes)) continue;
        if (!matchesBreedAgeSizeFilters(dog.attributes, selectedBreed, selectedAge, selectedSize)) continue;

        const orgId = getFirstRelatedId(dog, "orgs");
        if (selectedShelterId && orgId !== selectedShelterId) continue;

        const { city, state } = getAnimalLocation(dog, includedByKey);
        if (!selectedShelterId) {
          if (selectedState && (!state || state !== selectedState)) continue;
          if (selectedCity && (!city || city.toLowerCase() !== selectedCity.toLowerCase())) continue;
        }

        if (seenDogIds.has(dog.id)) continue;
        seenDogIds.add(dog.id);
        matches.push(dog);
        if (matches.length >= probe) break;
      }

      scanPage += 1;
      if (scanPage > 500) break;
    }

    hasNextPage = matches.length > page * pageSize;
    displayedDogs = matches.slice(offset, offset + pageSize);
    meta = {
      count: 0,
      countReturned: displayedDogs.length,
      pageReturned: page,
      limit: pageSize,
      pages: hasNextPage ? page + 1 : page,
    };
  } else {
    let scanPage = page;
    for (let scan = 0; scan < maxScanPages && displayedDogs.length < pageSize; scan += 1) {
      const res = await getDogs({ page: scanPage, limit: pageSize, ageGroup: selectedAge === "senior" ? "Senior" : undefined });
      if (scan === 0) meta = res.meta;

      for (const inc of res.included) {
        includedByKey.set(`${inc.type}:${inc.id}`, inc);
      }

      for (const dog of res.dogs) {
        if (isExcludedRescuegroupsAnimalId(dog.id)) continue;
        if (isRescuegroupsInfoEntryName(dog.attributes?.name)) continue;
        if (!isLikelyDog(dog.attributes)) continue;
        if (!matchesBreedAgeSizeFilters(dog.attributes, selectedBreed, selectedAge, selectedSize)) continue;
        const orgId = getFirstRelatedId(dog, "orgs");
        if (selectedShelterId && orgId !== selectedShelterId) continue;
        const { city: orgCity, state: orgState } = getAnimalLocation(dog, includedByKey);
        if (!selectedShelterId) {
          if (selectedState && (!orgState || orgState !== selectedState)) continue;
          if (selectedCity && (!orgCity || orgCity.toLowerCase() !== selectedCity.toLowerCase())) continue;
        }
        if (seenDogIds.has(dog.id)) continue;
        seenDogIds.add(dog.id);
        displayedDogs.push(dog);
        if (displayedDogs.length >= pageSize) break;
      }

      if (scanPage >= (res.meta.pages || 1)) break;
      scanPage += 1;
    }

    const totalPages = Math.max(1, meta.pages || 1);
    hasNextPage = page < totalPages;
  }

  const included = Array.from(includedByKey.values());
  const shelterQuickOptions = included
    .filter((x) => x.type === "orgs")
    .map((o) => {
      const attrs = (o.attributes || {}) as Record<string, unknown>;
      const name = typeof attrs.name === "string" ? attrs.name : "";
      const city = typeof attrs.city === "string" ? attrs.city : "";
      const state = typeof attrs.state === "string" ? attrs.state : "";
      return { id: o.id, name, city, state };
    })
    .filter((x) => x.name)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 40);

  if (selectedShelterId && selectedShelterName && !shelterQuickOptions.some((x) => x.id === selectedShelterId)) {
    shelterQuickOptions.unshift({ id: selectedShelterId, name: selectedShelterName, city: "", state: "" });
  }

  const total = meta.count || 0;
  const totalPages = Math.max(1, meta.pages || 1);
  const start = displayedDogs.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = (page - 1) * pageSize + displayedDogs.length;
  hasPrevPage = page > 1;

  const getPageLink = (p: number) => {
    const params = new URLSearchParams();
    if (selectedShelterId) params.set("shelter", selectedShelterId);
    if (selectedShelterName) params.set("shelterName", selectedShelterName);
    if (selectedState) params.set("state", selectedState);
    if (selectedCity) params.set("city", selectedCity);
    if (selectedBreed) params.set("breed", selectedBreed);
    if (selectedAge) params.set("age", selectedAge);
    if (selectedSize) params.set("size", selectedSize);
    if (p > 1) params.set("page", String(p));
    return `/shelters${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const paginationRange = (() => {
    const range: Array<number | string> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) range.push(i);
      return range;
    }

    const candidates = new Set<number>();
    const add = (p: number) => {
      if (p < 1 || p > totalPages) return;
      candidates.add(p);
    };

    add(1);
    add(2);
    add(3);
    add(totalPages);
    add(totalPages - 1);
    add(totalPages - 2);

    add(page - 1);
    add(page);
    add(page + 1);

    // Keep desktop pagination compact while still allowing big jumps.
    add(page - 100);
    add(page + 100);

    const sorted = Array.from(candidates).sort((a, b) => a - b);
    let prev = 0;
    for (const p of sorted) {
      if (prev && p - prev > 1) range.push("...");
      range.push(p);
      prev = p;
    }
    return range;
  })();

  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">{bannerTitle}</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <Link className="breadcrumb-item nav-link" href="/shelters">
                Shelters
              </Link>
              {selectedShelterName ? (
                <span className="breadcrumb-item active" aria-current="page">
                  {selectedShelterName}
                </span>
              ) : (
                <span className="breadcrumb-item active" aria-current="page">
                  Shelters
                </span>
              )}
            </nav>
          </div>
        </div>
      </section>

      <div className="shopify-grid">
        <div className="container py-5 my-5">
          <div className="row flex-column flex-md-row-reverse g-md-5 mb-5">
            <main className="col-12 col-md-9">
              <SheltersMobileFilters
                quickOptions={shelterQuickOptions}
                initialSelectedState={selectedState}
                initialSelectedCity={selectedCity}
                initialSelectedShelterId={selectedShelterId}
                initialSelectedShelterName={selectedShelterName}
                initialSelectedBreed={selectedBreed}
                initialSelectedAge={selectedAge}
                initialSelectedSize={selectedSize}
              />

              <div className="filter-shop d-md-flex justify-content-between align-items-center">
                <div className="showing-product">
                  <p className="m-0">
                    {totalKnown ? (
                      <>Showing {start}–{end} of {total} dogs</>
                    ) : (
                      <>Showing {start}–{end} dogs</>
                    )}
                  </p>
                </div>
                <div className="sort-by">
                  <span className="text-muted">Sort: Coming soon</span>
                </div>
              </div>

              <div className="product-grid row g-4">
                {displayedDogs.map((dog) => {
                  const name = dog.attributes?.name || "Dog";
                  const breed = dog.attributes?.breedString || "";
                  const age = dog.attributes?.ageString || dog.attributes?.ageGroup || "";
                  const sex = dog.attributes?.sex || "";
                  const size = dog.attributes?.sizeGroup || "";
                  const detailsHref = page > 1 ? `/shelters/dogs/${encodeURIComponent(dog.id)}?page=${page}` : `/shelters/dogs/${encodeURIComponent(dog.id)}`;
                  const orgId = getFirstRelatedId(dog, "orgs");
                  const org = getIncluded(included, "orgs", orgId);
                  const orgAttrs = (org?.attributes || {}) as Record<string, unknown>;
                  const orgName = typeof orgAttrs.name === "string" ? orgAttrs.name : "";
                  const citystate = typeof orgAttrs.citystate === "string" ? orgAttrs.citystate : "";
                  const img = getImage(dog, included);
                  const description = dog.attributes?.descriptionText
                    ? truncateText(normalizeHtmlText(dog.attributes.descriptionText), 140)
                    : "";
                  const cardImgSrc = img?.src || "/No%20photo%20yet.jpg";
                  const cardImgAlt = img?.src ? name : "No photo yet";
                  const isPlaceholder = !img?.src;

                  return (
                    <div key={dog.id} className="col-12 col-sm-6 col-lg-4">
                      <div className="card position-relative h-100 overflow-hidden">
                        <ShelterDogWishlistHeartButton
                          id={dog.id}
                          name={name}
                          href={`/shelters/dogs/${encodeURIComponent(dog.id)}`}
                          imageSrc={cardImgSrc}
                          orgName={orgName}
                          citystate={citystate}
                        />
                        <Link href={detailsHref}>
                          <div
                            className={`position-relative ${styles.cardImage}`}
                            style={{
                              background: isPlaceholder ? "transparent" : "#F9F3EC",
                            }}
                          >
                            <Image
                              src={cardImgSrc}
                              alt={cardImgAlt}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: isPlaceholder ? "cover" : "contain", padding: isPlaceholder ? 0 : 10 }}
                            />
                          </div>
                        </Link>

                        <div className="card-body p-0 pt-4 d-flex flex-column">
                          <div className="px-3">
                            <Link href={detailsHref}>
                              <h3 className="card-title m-0">{name}</h3>
                            </Link>
                            <div className="text-muted mt-2" style={{ fontSize: 14, lineHeight: 1.4 }}>
                              {[breed, age, sex, size].filter(Boolean).join(" • ")}
                            </div>
                            {citystate && (
                              <div className="text-muted mt-1" style={{ fontSize: 13 }}>
                                {citystate}
                              </div>
                            )}
                            {description && (
                              <div className="text-muted mt-3" style={{ fontSize: 14, lineHeight: 1.5 }}>
                                {description}
                              </div>
                            )}
                          </div>

                          <div className="mt-auto px-3 pb-3 pt-3">
                            <Link href={detailsHref} className="btn btn-outline-dark btn-md text-uppercase fs-6 rounded-1 w-100">
                              Details
                              <ArrowRightIcon className="mb-1 ms-2" width="24" height="24" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {displayedDogs.length === 0 && (
                <div className="text-center py-5">
                  <p className="fs-4">No dogs found.</p>
                </div>
              )}

              {totalPages > 1 && (
                <nav className="navigation paging-navigation text-center mt-5" role="navigation">
                  <div className="pagination loop-pagination d-flex justify-content-center align-items-center">
                    {hasPrevPage && (
                      <Link href={getPageLink(page - 1)} className="pagination-arrow d-flex align-items-center mx-3">
                        <iconify-icon icon="ic:baseline-keyboard-arrow-left" className="pagination-arrow fs-1"></iconify-icon>
                      </Link>
                    )}

                    {paginationRange.map((p, idx) => {
                      if (p === "...") return <span key={`dots-${idx}`} className="page-numbers mt-2 fs-3 mx-3">...</span>;
                      const isCurrent = p === page;
                      if (isCurrent) return <span key={p} aria-current="page" className="page-numbers mt-2 fs-3 mx-3 current">{p}</span>;
                      return (
                        <Link key={p} className="page-numbers mt-2 fs-3 mx-3" href={getPageLink(p as number)}>
                          {p}
                        </Link>
                      );
                    })}

                    {hasNextPage && (
                      <Link href={getPageLink(page + 1)} className="pagination-arrow d-flex align-items-center mx-3">
                        <iconify-icon icon="ic:baseline-keyboard-arrow-right" className="pagination-arrow fs-1"></iconify-icon>
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </main>

            <aside className="d-none d-md-block col-md-3 mt-4 mt-md-5 mb-5 mb-md-0">
              <div className="sidebar">
                <SheltersDesktopFilters
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  selectedShelterId={selectedShelterId}
                  selectedShelterName={selectedShelterName}
                  selectedBreed={selectedBreed}
                  selectedAge={selectedAge}
                  selectedSize={selectedSize}
                  quickShelters={shelterQuickOptions}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
