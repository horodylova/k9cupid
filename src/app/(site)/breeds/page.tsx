import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getBreeds, Dog } from "@/lib/api";
import BreedSearchBar from "@/components/breeds/BreedSearchBar";
import BreedSorter from "@/components/breeds/BreedSorter";
import BreedImage from "@/components/breeds/BreedImage";
import WishlistHeartButton from "@/components/wishlist/WishlistHeartButton";
import { Suspense } from "react";

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

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export const revalidate = 60;

export default function BreedsPageWrapper(props: Props) {
  return (
    <Suspense fallback={<div>Loading breeds...</div>}>
      <BreedsPage {...props} />
    </Suspense>
  );
}

async function BreedsPage({ searchParams }: Props) {
  const name = typeof searchParams.name === 'string' ? searchParams.name : undefined;
  const energy = searchParams.energy ? Number(searchParams.energy) : undefined;
  const trainability = searchParams.trainability ? Number(searchParams.trainability) : undefined;
  const shedding = searchParams.shedding ? Number(searchParams.shedding) : undefined;
  const grooming = searchParams.grooming ? Number(searchParams.grooming) : undefined;
  const playfulness = searchParams.playfulness ? Number(searchParams.playfulness) : undefined;
  const drooling = searchParams.drooling ? Number(searchParams.drooling) : undefined;
  const coat_length = searchParams.coat_length ? Number(searchParams.coat_length) : undefined;
  const barking = searchParams.barking ? Number(searchParams.barking) : undefined;
  const protectiveness = searchParams.protectiveness ? Number(searchParams.protectiveness) : undefined;
  const max_life_expectancy = searchParams.max_life_expectancy ? Number(searchParams.max_life_expectancy) : undefined;
  const good_with_children = searchParams.good_with_children ? Number(searchParams.good_with_children) : undefined;
  const good_with_other_dogs = searchParams.good_with_other_dogs ? Number(searchParams.good_with_other_dogs) : undefined;
  const good_with_strangers = searchParams.good_with_strangers ? Number(searchParams.good_with_strangers) : undefined;
  const sizeParam = typeof searchParams.size === 'string' ? searchParams.size : undefined;
  const size = sizeParam === "toy" || sizeParam === "small" || sizeParam === "medium" || sizeParam === "large" ? sizeParam : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;

  const offset = searchParams.offset ? Number(searchParams.offset) : 0;
  const limit = 20;

  const result = await getBreeds({
    name,
    energy,
    trainability,
    shedding,
    grooming,
    playfulness,
    drooling,
    coat_length,
    barking,
    protectiveness,
    max_life_expectancy,
    good_with_children,
    good_with_other_dogs,
    good_with_strangers,
    size,
    sort,
    offset,
    limit
  });

  const breeds = result.breeds;
  const total = result.total;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const start = breeds.length > 0 ? offset + 1 : 0;
  const end = offset + breeds.length;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
 
  const getPageLink = (page: number) => {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (energy) params.append('energy', energy.toString());
    if (trainability) params.append('trainability', trainability.toString());
    if (shedding) params.append('shedding', shedding.toString());
    if (grooming) params.append('grooming', grooming.toString());
    if (playfulness) params.append('playfulness', playfulness.toString());
    if (drooling) params.append('drooling', drooling.toString());
    if (coat_length) params.append('coat_length', coat_length.toString());
    if (barking) params.append('barking', barking.toString());
    if (protectiveness) params.append('protectiveness', protectiveness.toString());
    if (max_life_expectancy) params.append('max_life_expectancy', max_life_expectancy.toString());
    if (good_with_children) params.append('good_with_children', good_with_children.toString());
    if (good_with_other_dogs) params.append('good_with_other_dogs', good_with_other_dogs.toString());
    if (good_with_strangers) params.append('good_with_strangers', good_with_strangers.toString());
    if (size) params.append('size', size);
    if (sort && sort !== 'name') params.append('sort', sort);
    
    const newOffset = (page - 1) * limit;
    if (newOffset > 0) params.append('offset', newOffset.toString());
    
    return `/breeds?${params.toString()}`;
  };

  const paginationRange: (number | string)[] = [];
  if (totalPages <= 7) {
     for(let i=1; i<=totalPages; i++) paginationRange.push(i);
  } else {
     paginationRange.push(1);
     if (currentPage > 3) paginationRange.push('...');
     const start = Math.max(2, currentPage - 1);
     const end = Math.min(totalPages - 1, currentPage + 1);
     for(let i=start; i<=end; i++) paginationRange.push(i);
     if (currentPage < totalPages - 2) paginationRange.push('...');
     paginationRange.push(totalPages);
  }

  const renderFilters = () => (
    <>
      <div className="widget-product-categories pt-0 pt-md-5">
        <div className="d-flex align-items-center mb-4">
          <Image
            src="/Cupid%20with%20Dogs-white-puppy.png"
            alt="Cupid Matchmaker"
            width={70}
            height={70}
            className="me-3"
            style={{ objectFit: "contain" }}
            unoptimized
          />
          <h4 className="widget-title m-0">Find Your Match</h4>
        </div>
        <ul className="product-categories sidebar-list list-unstyled row">
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?good_with_children=5" className="nav-link">Good with Children</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?good_with_other_dogs=5" className="nav-link">Good with Other Dogs</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?good_with_strangers=5" className="nav-link">Good with Strangers</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?energy=5" className="nav-link">High Energy</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?trainability=5" className="nav-link">Easy to Train</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?shedding=1" className="nav-link">Low Shedding</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?grooming=4" className="nav-link">High Grooming</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?playfulness=5" className="nav-link">Very Playful</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?drooling=1" className="nav-link">Low Drooling</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?barking=1" className="nav-link">Quiet</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?protectiveness=5" className="nav-link">Protective</Link>
          </li>
          <li className="cat-item col-6 col-md-12 mb-2">
            <Link href="/breeds?max_life_expectancy=17" className="nav-link">Long-Lived</Link>
          </li>
        </ul>
      </div>

      <div className="widget-product-categories pt-4">
        <h4 className="widget-title mb-3">Size</h4>
        <ul className="product-categories sidebar-list list-unstyled">
          <li className="cat-item mb-2">
            <Link href="/breeds?size=toy" className="nav-link">Toy Breeds</Link>
          </li>
          <li className="cat-item mb-2">
            <Link href="/breeds?size=small" className="nav-link">Small Breeds</Link>
          </li>
          <li className="cat-item mb-2">
            <Link href="/breeds?size=medium" className="nav-link">Medium Breeds</Link>
          </li>
          <li className="cat-item mb-2">
            <Link href="/breeds?size=large" className="nav-link">Large Breeds</Link>
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <>
      <section id="banner" className="py-3" style={{ background: '#F9F3EC' }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Dog Breeds</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">Home</Link>
              <span className="breadcrumb-item active" aria-current="page">Breeds</span>
            </nav>
            <Suspense fallback={<div>Loading search...</div>}>
              <div className="mt-4" style={{ maxWidth: '500px' }}>
                <BreedSearchBar />
              </div>
            </Suspense>
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
                <div className="px-3 pb-3">
                  {renderFilters()}
                </div>
              </details>
              <div className="filter-shop d-md-flex justify-content-between align-items-center">
                <div className="showing-product">
                  <p className="m-0">Showing {start}–{end} of {total} breeds</p>
                </div>
                <div className="sort-by">
                  <Suspense fallback={<div>Loading sort...</div>}>
                    <BreedSorter />
                  </Suspense>
                </div>
              </div>

              <div className="product-grid row">
                {breeds.flatMap((breed, index) => {
                  const elements: Array<JSX.Element> = [
                    <div key={breed.name} className="col-md-4 my-4">
                      <div className="card position-relative h-100">
                        <WishlistHeartButton
                          name={breed.name}
                          href={`/breeds/${encodeURIComponent(breed.name)}`}
                          imageSrc={breed.image_link}
                        />
                        <Link href={`/breeds/${encodeURIComponent(breed.name)}`}>
                          <BreedImage src={breed.image_link} alt={breed.name} />
                        </Link>
                        <div className="card-body p-0 pt-4 d-flex flex-column">
                          <Link href={`/breeds/${encodeURIComponent(breed.name)}`}>
                            <h3 className="card-title m-0">{breed.name}</h3>
                          </Link>

                          <div className="d-flex flex-wrap gap-2 mt-3 mt-auto">
                            {getTemperamentTags(breed).map((temp) => (
                              <span key={temp} className="badge rounded-pill text-bg-light text-dark border">
                                {temp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>,
                  ];

                  if (index === 5 && breeds.length > 6) {
                    elements.push(
                      <div key="carcupid-banner" className="col-12 my-4">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: "#F9F3EC" }}>
                          <div className="card-body p-4">
                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
                              <div className="d-flex align-items-center gap-3">
                                <Image
                                  src="/logo%20CarCupid.png"
                                  alt="CarCupid"
                                  width={56}
                                  height={56}
                                  style={{ objectFit: "contain" }}
                                  unoptimized
                                />
                                <div>
                                  <div
                                    className="text-uppercase text-muted fw-semibold"
                                    style={{ fontSize: 12, letterSpacing: 0.6 }}
                                  >
                                    Car Match Quiz
                                  </div>
                                  <div className="h4 mb-0">CarCupid</div>
                                </div>
                              </div>
                              <div className="flex-grow-1" style={{ fontSize: 16, lineHeight: 1.5 }}>
                                If you love a good match, we also built a car quiz. Answer a few unexpected questions and get a
                                shortlist of cars that fit your lifestyle and instincts.
                              </div>
                              <a
                                href="https://carcupid.fit/"
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1 px-4 w-100 w-md-auto"
                              >
                                Try CarCupid
                                <ArrowRightIcon className="mb-1 ms-2" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return elements;
                })}
              </div>

              {breeds.length === 0 && (
                <div className="text-center py-5">
                  <p className="fs-4">No breeds found matching your criteria.</p>
                </div>
              )}

              {totalPages > 1 && (
                <nav className="navigation paging-navigation text-center mt-5" role="navigation">
                  <div className="pagination loop-pagination d-flex justify-content-center align-items-center">
                    {hasPrevPage && (
                      <Link href={getPageLink(currentPage - 1)} className="pagination-arrow d-flex align-items-center mx-3">
                        <iconify-icon icon="ic:baseline-keyboard-arrow-left" className="pagination-arrow fs-1"></iconify-icon>
                      </Link>
                    )}

                    {paginationRange.map((page, index) => {
                      if (page === '...') {
                        return <span key={`dots-${index}`} className="page-numbers mt-2 fs-3 mx-3">...</span>;
                      }
                      
                      const isCurrent = page === currentPage;
                      if (isCurrent) {
                        return <span key={page} aria-current="page" className="page-numbers mt-2 fs-3 mx-3 current">{page}</span>;
                      }
                      
                      return (
                        <Link key={page} className="page-numbers mt-2 fs-3 mx-3" href={getPageLink(page as number)}>
                          {page}
                        </Link>
                      );
                    })}

                    {hasNextPage && (
                      <Link href={getPageLink(currentPage + 1)} className="pagination-arrow d-flex align-items-center mx-3">
                        <iconify-icon icon="ic:baseline-keyboard-arrow-right" className="pagination-arrow fs-1"></iconify-icon>
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </main>

            <aside className="d-none d-md-block col-md-3 mt-4 mt-md-5 mb-5 mb-md-0">
              <div className="sidebar">
                <div className="widget-menu">
                  <div className="widget-search-bar">
                    {/* <BreedSearchBar /> */}
                  </div>
                </div>
                {renderFilters()}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
