import Link from "next/link";
import Image from "next/image";
import styles from "./shelters.module.css";
import { isExcludedRescuegroupsAnimalId, isRescuegroupsInfoEntryName } from "@/lib/rescuegroupsExclusions";
import { normalizeHtmlText } from "@/lib/htmlText";
import { createWindowedDeduper, makeRescuegroupsDogDedupKey } from "@/utils/rescuegroupsDedup";
import ShelterDogWishlistHeartButton from "@/components/ShelterDogWishlistHeartButton";
import ShelterFilterSelect from "@/components/ShelterFilterSelect";

export const revalidate = 0;

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
  shelterId,
}: {
  page: number;
  limit: number;
  shelterId?: string;
}): Promise<{ meta: RescueMeta; dogs: RescueAnimal[]; included: RescueIncluded[] }> {
  const apiKey = (process.env.RESCUEGROUPS_API_KEY || "").trim();
  if (!apiKey) {
    return {
      meta: { count: 0, countReturned: 0, pageReturned: page, limit, pages: 1 },
      dogs: [],
      included: [],
    };
  }

  const upstream = shelterId
    ? new URL(`https://api.rescuegroups.org/v5/public/orgs/${encodeURIComponent(shelterId)}/animals/search/available/dogs`)
    : new URL("https://api.rescuegroups.org/v5/public/animals/search/available/dogs/");
  upstream.searchParams.set("limit", String(limit));
  upstream.searchParams.set("page", String(page));
  upstream.searchParams.set("include", "pictures,orgs,locations");
  upstream.searchParams.set(
    "fields[animals]",
    "name,breedString,sex,ageGroup,ageString,sizeGroup,url,pictureThumbnailUrl,descriptionText"
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
  const selectedShelterId = (selectedShelterIdRaw || "").trim();
  const selectedShelterName = (selectedShelterNameRaw || "").trim();
  const bannerTitle = selectedShelterName || "Shelters";
  const pageSize = 18;
  const maxScanPages = 8;

  const includedByKey = new Map<string, RescueIncluded>();
  const displayedDogs: RescueAnimal[] = [];
  let meta: RescueMeta = { count: 0, countReturned: 0, pageReturned: page, limit: pageSize, pages: 1 };
  const deduper = createWindowedDeduper(40);

  let scanPage = page;
  for (let scan = 0; scan < maxScanPages && displayedDogs.length < pageSize; scan += 1) {
    const res = await getDogs({ page: scanPage, limit: pageSize, shelterId: selectedShelterId || undefined });
    if (scan === 0) meta = res.meta;

    for (const inc of res.included) {
      includedByKey.set(`${inc.type}:${inc.id}`, inc);
    }

    for (const dog of res.dogs) {
      if (isExcludedRescuegroupsAnimalId(dog.id)) continue;
      if (isRescuegroupsInfoEntryName(dog.attributes?.name)) continue;
      const orgId = getFirstRelatedId(dog, "orgs");
      const org = orgId ? includedByKey.get(`orgs:${orgId}`) : null;
      const orgAttrs = (org?.attributes || {}) as Record<string, unknown>;
      const orgName = typeof orgAttrs.name === "string" ? orgAttrs.name : "";
      const dedupKey = makeRescuegroupsDogDedupKey({ name: dog.attributes?.name, orgName, orgId });
      if (deduper.isDuplicate(dedupKey)) continue;
      displayedDogs.push(dog);
      if (displayedDogs.length >= pageSize) break;
    }

    if (scanPage >= (res.meta.pages || 1)) break;
    scanPage += 1;
  }

  const included = Array.from(includedByKey.values());
  const shelterQuickOptions = included
    .filter((x) => x.type === "orgs")
    .map((o) => {
      const attrs = (o.attributes || {}) as Record<string, unknown>;
      const name = typeof attrs.name === "string" ? attrs.name : "";
      const city = typeof attrs.city === "string" ? attrs.city : "";
      const state = typeof attrs.state === "string" ? attrs.state : "";
      const citystate = [city, state].filter(Boolean).join(", ");
      return { id: o.id, name, citystate };
    })
    .filter((x) => x.name)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 40);

  if (selectedShelterId && selectedShelterName && !shelterQuickOptions.some((x) => x.id === selectedShelterId)) {
    shelterQuickOptions.unshift({ id: selectedShelterId, name: selectedShelterName, citystate: "" });
  }

  const total = meta.count || 0;
  const totalPages = Math.max(1, meta.pages || 1);
  const start = displayedDogs.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = (page - 1) * pageSize + displayedDogs.length;
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  const getPageLink = (p: number) => {
    const params = new URLSearchParams();
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

  const renderFilters = () => (
    <>
      <div className="widget-product-categories pt-0 pt-md-5">
        <h4 className="widget-title m-0 mb-3">Filters</h4>
        <div className="d-grid gap-3">
          <div>
            <label className="form-label mb-1">ZIP code</label>
            <input className="form-control" placeholder="Coming soon" disabled />
          </div>
          <div>
            <ShelterFilterSelect
              selectedId={selectedShelterId}
              selectedName={selectedShelterName}
              quickOptions={shelterQuickOptions}
            />
          </div>
          <div>
            <label className="form-label mb-1">Radius (miles)</label>
            <select className="form-select" disabled>
              <option>Coming soon</option>
            </select>
          </div>
          <div>
            <label className="form-label mb-1">Breed</label>
            <input className="form-control" placeholder="Coming soon" disabled />
          </div>
          <div>
            <label className="form-label mb-1">Age</label>
            <select className="form-select" disabled>
              <option>Coming soon</option>
            </select>
          </div>
          <div>
            <label className="form-label mb-1">Size</label>
            <select className="form-select" disabled>
              <option>Coming soon</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );

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
              <details className="d-md-none mb-4 border rounded-4" style={{ background: "#F9F3EC", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}>
                <summary
                  className="px-3 py-3 d-flex justify-content-between align-items-center fw-semibold text-uppercase"
                  style={{ cursor: "pointer", letterSpacing: 0.8 }}
                >
                  <span>Filters</span>
                  <iconify-icon icon="ri:arrow-down-s-line" className="fs-5"></iconify-icon>
                </summary>
                <div className="px-3 pb-3">{renderFilters()}</div>
              </details>

              <div className="filter-shop d-md-flex justify-content-between align-items-center">
                <div className="showing-product">
                  <p className="m-0">
                    Showing {start}–{end} of {total} dogs
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
                              <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1 ms-2">
                                <use xlinkHref="#arrow-right"></use>
                              </svg>
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
              <div className="sidebar">{renderFilters()}</div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
