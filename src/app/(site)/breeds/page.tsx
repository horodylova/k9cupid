import Image from "next/image";
import Link from "next/link";
import { getBreeds, Dog } from "@/lib/api";
import BreedSearchBar from "@/components/BreedSearchBar";
import { Suspense } from "react";

function getTemperamentTags(breed: Dog) {
  const tags = [];
  if (breed.good_with_children >= 4) tags.push("Good with Kids");
  if (breed.good_with_other_dogs >= 4) tags.push("Dog Friendly");
  if (breed.trainability >= 4) tags.push("Easy to Train");
  if (breed.energy >= 4) tags.push("High Energy");
  if (breed.shedding <= 2) tags.push("Low Shedding");
  if (breed.barking <= 2) tags.push("Quiet");
  if (breed.playfulness >= 4) tags.push("Playful");
  if (breed.protectiveness >= 4) tags.push("Protective");
  return tags.slice(0, 3);
}

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BreedsPage({ searchParams }: Props) {
  const name = typeof searchParams.name === 'string' ? searchParams.name : undefined;
  const energy = searchParams.energy ? Number(searchParams.energy) : undefined;
  const trainability = searchParams.trainability ? Number(searchParams.trainability) : undefined;
  const shedding = searchParams.shedding ? Number(searchParams.shedding) : undefined;
  const barking = searchParams.barking ? Number(searchParams.barking) : undefined;
  const protectiveness = searchParams.protectiveness ? Number(searchParams.protectiveness) : undefined;

  const offset = searchParams.offset ? Number(searchParams.offset) : 0;
  const limit = 20;

  const breeds = await getBreeds({
    name,
    energy,
    trainability,
    shedding,
    barking,
    protectiveness,
    offset
  });

  const currentPage = Math.floor(offset / limit) + 1;
  const start = offset + 1;
  const end = offset + breeds.length;

  // Helper function to generate pagination links
  const getPageLink = (page: number) => {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (energy) params.append('energy', energy.toString());
    if (trainability) params.append('trainability', trainability.toString());
    if (shedding) params.append('shedding', shedding.toString());
    if (barking) params.append('barking', barking.toString());
    if (protectiveness) params.append('protectiveness', protectiveness.toString());
    
    const newOffset = (page - 1) * limit;
    if (newOffset > 0) params.append('offset', newOffset.toString());
    
    return `/breeds?${params.toString()}`;
  };

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
          <div className="row flex-md-row-reverse g-md-5 mb-5">

            <main className="col-md-9">
                      <div className="filter-shop d-md-flex justify-content-between align-items-center">
                        <div className="showing-product">
                          <p className="m-0">Showing {start}–{end} breeds</p>
                        </div>
                        <div className="sort-by">
                  <select className="filter-categories border-0 m-0">
                    <option value="">Sort by name</option>
                    <option value="">Life span</option>
                  </select>
                </div>
              </div>

              <div className="product-grid row">
                {breeds.map((breed) => (
                  <div key={breed.name} className="col-md-4 my-4">
                    <div className="card position-relative h-100">
                      <Link href="/404">
                        <Image
                          src={breed.image_link}
                          className="img-fluid rounded-4"
                          alt={breed.name}
                          width={600}
                          height={600}
                          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        />
                      </Link>
                      <div className="card-body p-0 pt-4 d-flex flex-column">
                        <Link href="/404">
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
                  </div>
                ))}
              </div>

              <nav className="navigation paging-navigation text-center mt-5" role="navigation">
                <div className="pagination loop-pagination d-flex justify-content-center align-items-center">
                  {currentPage > 1 && (
                    <Link href={getPageLink(currentPage - 1)} className="pagination-arrow d-flex align-items-center mx-3">
                      <iconify-icon icon="ic:baseline-keyboard-arrow-left" className="pagination-arrow fs-1"></iconify-icon>
                    </Link>
                  )}
                  
                  {currentPage > 1 && (
                    <Link className="page-numbers mt-2 fs-3 mx-3" href={getPageLink(currentPage - 1)}>{currentPage - 1}</Link>
                  )}
                  
                  <span aria-current="page" className="page-numbers mt-2 fs-3 mx-3 current">{currentPage}</span>
                  
                  {breeds.length === limit && (
                    <Link className="page-numbers mt-2 fs-3 mx-3" href={getPageLink(currentPage + 1)}>{currentPage + 1}</Link>
                  )}

                  {breeds.length === limit && (
                    <Link href={getPageLink(currentPage + 1)} className="pagination-arrow d-flex align-items-center mx-3">
                      <iconify-icon icon="ic:baseline-keyboard-arrow-right" className="pagination-arrow fs-1"></iconify-icon>
                    </Link>
                  )}
                </div>
              </nav>
            </main>

            <aside className="col-md-3 mt-5">
              <div className="sidebar">
                <div className="widget-menu">
                  <div className="widget-search-bar">
                    {/* <BreedSearchBar /> */}
                  </div>
                </div>

                <div className="widget-product-categories pt-5">
                  <h4 className="widget-title">Filters</h4>
                  <ul className="product-categories sidebar-list list-unstyled">
                    <li className="cat-item">
                      <Link href="/breeds?good_with_children=5" className="nav-link">Good with Children</Link>
                    </li>
                    <li className="cat-item">
                      <Link href="/breeds?good_with_other_dogs=5" className="nav-link">Good with Other Dogs</Link>
                    </li>
                    <li className="cat-item">
                      <Link href="/breeds?good_with_strangers=5" className="nav-link">Good with Strangers</Link>
                    </li>
                    <li className="cat-item">
                      <Link href="/breeds?energy=5" className="nav-link">High Energy</Link>
                    </li>
                    <li className="cat-item">
                      <Link href="/breeds?trainability=5" className="nav-link">Easy to Train</Link>
                    </li>
                     <li className="cat-item">
                      <Link href="/breeds?shedding=1" className="nav-link">Low Shedding</Link>
                    </li>
                    <li className="cat-item">
                      <Link href="/breeds?barking=1" className="nav-link">Low Barking</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
