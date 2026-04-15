import Link from "next/link";
import Image from "next/image";
import { isExcludedRescuegroupsAnimalId, isRescuegroupsInfoEntryName } from "@/lib/rescuegroupsExclusions";
import { normalizeHtmlText } from "@/lib/htmlText";
import ShelterDogWishlistHeartButton from "@/components/ShelterDogWishlistHeartButton";

export const revalidate = 0;

const PLACEHOLDER_SRC = "/No%20photo%20yet.jpg";

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
    breedString?: string;
    sex?: string;
    ageGroup?: string;
    ageString?: string;
    sizeGroup?: string;
    isHousetrained?: boolean;
    isKidsOk?: boolean;
    isDogsOk?: boolean;
    isCatsOk?: boolean;
    isSpecialNeeds?: boolean;
    energyLevel?: string;
    activityLevel?: string;
    url?: string;
    rescueId?: string;
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

function getIncluded(included: RescueIncluded[], type: string, id: string | null) {
  if (!id) return null;
  return included.find((x) => x.type === type && x.id === id) || null;
}

function getRelatedIds(item: RescueAnimal, relName: string): string[] {
  const rel = item.relationships?.[relName];
  if (!rel?.data) return [];
  if (Array.isArray(rel.data)) return rel.data.map((x) => x.id).filter(Boolean);
  return rel.data.id ? [rel.data.id] : [];
}

function getPictures(animal: RescueAnimal, included: RescueIncluded[]) {
  const ids = getRelatedIds(animal, "pictures");
  const pics = ids
    .map((id) => getIncluded(included, "pictures", id))
    .filter(Boolean)
    .map((pic) => {
      const attrs = (pic?.attributes || {}) as Record<string, unknown>;
      const order = typeof attrs.order === "number" ? attrs.order : 9999;
      const original = typeof attrs.original === "string" ? attrs.original : null;
      const large = typeof attrs.large === "string" ? attrs.large : null;
      const small = typeof attrs.small === "string" ? attrs.small : null;
      const src = large || original || small;
      const src2x = original || large || null;
      if (!src) return null;
      return { id: pic!.id, order, src, src2x };
    })
    .filter((x): x is { id: string; order: number; src: string; src2x: string | null } => Boolean(x));

  pics.sort((a, b) => a.order - b.order);
  return pics;
}

function getOrgInfo(animal: RescueAnimal, included: RescueIncluded[]) {
  const orgId = getRelatedIds(animal, "orgs")[0] || null;
  const org = getIncluded(included, "orgs", orgId);
  const attrs = (org?.attributes || {}) as Record<string, unknown>;
  const name = typeof attrs.name === "string" ? attrs.name : "";
  const citystate = typeof attrs.citystate === "string" ? attrs.citystate : "";
  const websiteUrl = typeof attrs.websiteUrl === "string" ? attrs.websiteUrl : "";
  const orgUrl = typeof attrs.url === "string" ? attrs.url : "";
  return { name, citystate, websiteUrl, orgUrl };
}

async function getDogById(id: string) {
  const apiKey = (process.env.RESCUEGROUPS_API_KEY || "").trim();
  if (!apiKey) return null;

  const upstream = new URL(`https://api.rescuegroups.org/v5/public/animals/${encodeURIComponent(id)}`);
  upstream.searchParams.set("include", "pictures,orgs,locations");
  upstream.searchParams.set(
    "fields[animals]",
    "name,breedString,sex,ageGroup,ageString,sizeGroup,isHousetrained,isKidsOk,isDogsOk,isCatsOk,isSpecialNeeds,energyLevel,activityLevel,url,rescueId,pictureThumbnailUrl,descriptionText"
  );
  upstream.searchParams.set("fields[pictures]", "small,large,original,order");
  upstream.searchParams.set("fields[orgs]", "name,url,citystate,websiteUrl");
  upstream.searchParams.set("fields[locations]", "citystate,postalcode,state,country,lat,lon,coordinates");

  const res = await fetch(upstream, {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
      Authorization: apiKey,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const json = (await res.json()) as RescueResponse;
  const dog = Array.isArray(json.data) ? json.data[0] : null;
  if (!dog) return null;
  const included = Array.isArray(json.included) ? json.included : [];
  return { dog, included };
}

function parseIntParam(value: unknown, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = typeof raw === "string" ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

function normalizeRescuegroupsListingUrl(url: string) {
  if (!url) return "";
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (host.endsWith(".rescuegroups.org") && host !== "rescuegroups.org" && host !== "www.rescuegroups.org") {
      u.hostname = "rescuegroups.org";
    }
    return u.toString();
  } catch {
    return url;
  }
}

export default async function ShelterDogPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const fromPage = parseIntParam(searchParams?.page, 1);
  const backHref = fromPage > 1 ? `/shelters?page=${fromPage}` : "/shelters";
  const result = await getDogById(params.id);

  if (!result) {
    return (
      <>
        <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
          <div className="container">
            <div className="hero-content py-5 my-3">
              <h2 className="display-1 mt-3 mb-0">Shelters</h2>
              <nav className="breadcrumb">
                <Link className="breadcrumb-item nav-link" href="/">
                  Home
                </Link>
                <Link className="breadcrumb-item nav-link" href={backHref}>
                  Shelters
                </Link>
                <span className="breadcrumb-item active" aria-current="page">
                  Dog
                </span>
              </nav>
            </div>
          </div>
        </section>

        <section className="py-5 my-5">
          <div className="container">
            <div className="bg-white border rounded-4 p-4">
              <h1 className="h4 mb-2">Dog not found</h1>
              <div className="text-muted">This listing may have been removed or is unavailable.</div>
              <div className="mt-4">
                <Link href={backHref} className="btn btn-outline-dark btn-md text-uppercase fs-6 rounded-1">
                  Back to Shelters
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const { dog, included } = result;
  const name = dog.attributes?.name || "Dog";
  const breed = dog.attributes?.breedString || "";
  const age = dog.attributes?.ageString || dog.attributes?.ageGroup || "";
  const sex = dog.attributes?.sex || "";
  const size = dog.attributes?.sizeGroup || "";
  const externalUrl = dog.attributes?.url || "";
  const listingUrl = normalizeRescuegroupsListingUrl(externalUrl);
  const rescueId = dog.attributes?.rescueId || "";
  const description = normalizeHtmlText(dog.attributes?.descriptionText || "");
  const orgInfo = getOrgInfo(dog, included);
  const pictures = getPictures(dog, included);
  const isBlocked = isExcludedRescuegroupsAnimalId(dog.id) || isRescuegroupsInfoEntryName(dog.attributes?.name);

  const hasRealHero = pictures.length > 0 || Boolean(dog.attributes?.pictureThumbnailUrl);
  const heroImage = pictures[0]?.src || dog.attributes?.pictureThumbnailUrl || PLACEHOLDER_SRC;
  const isPlaceholder = heroImage === PLACEHOLDER_SRC;
  const heroAlt = hasRealHero ? name : "No photo yet";
  const morePictures = pictures.slice(1);

  const infoBadges: string[] = [];
  if (dog.attributes?.energyLevel) infoBadges.push(`Energy: ${dog.attributes.energyLevel}`);
  if (dog.attributes?.activityLevel) infoBadges.push(`Activity: ${dog.attributes.activityLevel}`);
  if (dog.attributes?.isHousetrained === true) infoBadges.push("House trained");
  if (dog.attributes?.isSpecialNeeds === true) infoBadges.push("Special needs");
  if (dog.attributes?.isKidsOk === true) infoBadges.push("Kids OK");
  if (dog.attributes?.isDogsOk === true) infoBadges.push("Dogs OK");
  if (dog.attributes?.isCatsOk === true) infoBadges.push("Cats OK");

  if (isBlocked) {
    return (
      <>
        <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
          <div className="container">
            <div className="hero-content py-5 my-3">
              <h2 className="display-1 mt-3 mb-0">Shelters</h2>
              <nav className="breadcrumb">
                <Link className="breadcrumb-item nav-link" href="/">
                  Home
                </Link>
                <Link className="breadcrumb-item nav-link" href={backHref}>
                  Shelters
                </Link>
                <span className="breadcrumb-item active" aria-current="page">
                  Entry
                </span>
              </nav>
            </div>
          </div>
        </section>

        <section className="py-5 my-5">
          <div className="container">
            <div className="bg-white border rounded-4 p-4">
              <h1 className="h4 mb-2">Not a dog listing</h1>
              <div className="text-muted">
                This entry is informational (for example, pre-approval or application details) and is not an adoptable dog profile.
              </div>
              <div className="mt-4">
                <Link href={backHref} className="btn btn-outline-dark btn-md text-uppercase fs-6 rounded-1">
                  Back to Shelters
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">{name}</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <Link className="breadcrumb-item nav-link" href={backHref}>
                Shelters
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                {name}
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section className="py-5 my-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-12 col-lg-6">
              <div
                className="card border-0 shadow-sm rounded-4 overflow-hidden"
                style={{ background: isPlaceholder ? "transparent" : "#F9F3EC" }}
              >
                <div className="position-relative" style={{ width: "100%", aspectRatio: "4 / 3" }}>
                  <Image
                    src={heroImage.startsWith("http") ? upgradeRescuegroupsWidth(heroImage, 1400) : heroImage}
                    alt={heroAlt}
                    fill
                    priority
                    sizes="(max-width: 992px) 100vw, 50vw"
                    style={{ objectFit: isPlaceholder ? "cover" : "contain", padding: isPlaceholder ? 0 : 12 }}
                  />
                </div>
              </div>

              {morePictures.length > 0 && (
                <div className="row g-3 mt-3">
                  {morePictures.slice(0, 9).map((p) => (
                    <div key={p.id} className="col-4">
                      <a href={p.src2x || p.src} target="_blank" rel="noreferrer">
                        <div
                          className="position-relative rounded-3 overflow-hidden"
                          style={{ width: "100%", height: 120, background: "#F9F3EC" }}
                        >
                          <Image
                            src={upgradeRescuegroupsWidth(p.src, 600)}
                            alt={name}
                            fill
                            sizes="(max-width: 992px) 33vw, 180px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-12 col-lg-6">
              <div className="bg-white border rounded-4 p-4">
                <div className="text-muted" style={{ fontSize: 14 }}>
                  {[breed, age, sex, size].filter(Boolean).join(" • ")}
                </div>
                {(orgInfo.name || orgInfo.websiteUrl) && (
                  <div className="mt-2" style={{ fontSize: 14 }}>
                    <span className="text-muted">Shelter: </span>
                    {(() => {
                      const href = orgInfo.websiteUrl || normalizeRescuegroupsListingUrl(orgInfo.orgUrl);
                      if (href) {
                        return (
                          <a href={href} target="_blank" rel="noreferrer">
                            {orgInfo.name || href}
                          </a>
                        );
                      }
                      return <span>{orgInfo.name}</span>;
                    })()}
                  </div>
                )}
                {orgInfo.citystate && (
                  <div className="text-muted mt-1" style={{ fontSize: 14 }}>
                    {orgInfo.citystate}
                  </div>
                )}
                {rescueId && (
                  <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                    Rescue ID: {rescueId}
                  </div>
                )}
                {infoBadges.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {infoBadges.map((item) => (
                      <span key={item} className="badge text-bg-light border">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {description && (
                  <div className="mt-4" style={{ fontSize: 16, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                    {description}
                  </div>
                )}

                <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                  <Link href={backHref} className="btn btn-outline-dark btn-md text-uppercase fs-6 rounded-1">
                    Back
                  </Link>
                  <ShelterDogWishlistHeartButton
                    id={dog.id}
                    name={name}
                    href={`/shelters/dogs/${encodeURIComponent(dog.id)}`}
                    imageSrc={heroImage}
                    orgName={orgInfo.name}
                    citystate={orgInfo.citystate}
                    variant="inline"
                  />
                  {listingUrl && (
                    <a
                      href={listingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-dark btn-md text-uppercase fs-6 rounded-1"
                    >
                      Open listing
                    </a>
                  )}
                </div>

                {pictures.length > 0 && (
                  <div className="text-muted mt-3" style={{ fontSize: 12 }}>
                    Photos: {pictures.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
