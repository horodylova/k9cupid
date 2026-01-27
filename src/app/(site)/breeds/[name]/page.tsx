import Link from "next/link";
import { getBreeds, Dog } from "@/lib/api";
import BreedGallery from "@/components/BreedGallery";
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

export default async function BreedPage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name);
  
  const result = await getBreeds({ name: decodedName });
  const breed = result.breeds.find(b => b.name === decodedName) || result.breeds[0];

  if (!breed) {
    notFound();
  }

  const tags = getTemperamentTags(breed);

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
                  <div className="rating-container d-flex gap-0 align-items-center">
                    {/* Placeholder rating since we don't have it */}
                    <span className="rating secondary-font">
                       <iconify-icon icon="clarity:star-solid" className="text-primary"></iconify-icon>
                       <iconify-icon icon="clarity:star-solid" className="text-primary"></iconify-icon>
                       <iconify-icon icon="clarity:star-solid" className="text-primary"></iconify-icon>
                       <iconify-icon icon="clarity:star-solid" className="text-primary"></iconify-icon>
                       <iconify-icon icon="clarity:star-solid" className="text-primary"></iconify-icon>
                       5.0
                    </span>
                  </div>
                </div>
                <div className="product-price pt-3 pb-3">
                  <strong className="text-primary display-6 fw-bold">
                    {breed.min_life_expectancy} - {breed.max_life_expectancy} years
                  </strong>
                  <span className="ms-2 text-muted">Life Expectancy</span>
                </div>
                
                <p>
                  The {breed.name} is a {breed.coat_length ? 'long-coated' : 'short-coated'} breed. 
                  It is known for being {tags.join(', ').toLowerCase()}.
                </p>

                <div className="cart-wrap">
                  <div className="product-quantity pt-2">
                    <div className="stock-button-wrap">
                      <div className="d-flex flex-wrap pt-4">
                        <Link href="#" className="btn btn-primary me-3 px-4 pt-3 pb-3">
                          <h5 className="text-uppercase m-0">Find a Puppy</h5>
                        </Link>
                        <button className="btn btn-outline-secondary px-4 pt-3 pb-3">
                          <iconify-icon icon="fluent:heart-28-filled" className="fs-5"></iconify-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="meta-product pt-4">
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
              </div>
              <div className="tab-content w-100" id="v-pills-tabContent">
                <div className="tab-pane fade show active" id="v-pills-stats" role="tabpanel" aria-labelledby="v-pills-stats-tab">
                  <h2>Breed Statistics</h2>
                  <div className="row">
                     <div className="col-md-6">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Energy Level
                            <span className="badge bg-primary rounded-pill">{breed.energy}/5</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Trainability
                            <span className="badge bg-primary rounded-pill">{breed.trainability}/5</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Playfulness
                            <span className="badge bg-primary rounded-pill">{breed.playfulness}/5</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Protectiveness
                            <span className="badge bg-primary rounded-pill">{breed.protectiveness}/5</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Barking
                            <span className="badge bg-primary rounded-pill">{breed.barking}/5</span>
                          </li>
                        </ul>
                     </div>
                     <div className="col-md-6">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Good with Children
                            <span className="badge bg-primary rounded-pill">{breed.good_with_children}/5</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Good with Other Dogs
                            <span className="badge bg-primary rounded-pill">{breed.good_with_other_dogs}/5</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Good with Strangers
                            <span className="badge bg-primary rounded-pill">{breed.good_with_strangers}/5</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Shedding
                            <span className="badge bg-primary rounded-pill">{breed.shedding}/5</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            Grooming
                            <span className="badge bg-primary rounded-pill">{breed.grooming}/5</span>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
