"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { loadWishlist, removeWishlistItem, subscribeWishlist, type WishlistBreed } from "@/lib/wishlistStorage";
import {
  loadShelterDogWishlist,
  removeShelterDogWishlistItem,
  subscribeShelterDogWishlist,
  type WishlistShelterDog,
} from "@/lib/shelterDogWishlistStorage";

export default function WishlistPage() {
  const [breedItems, setBreedItems] = useState<WishlistBreed[]>([]);
  const [shelterDogItems, setShelterDogItems] = useState<WishlistShelterDog[]>([]);

  useEffect(() => {
    setBreedItems(loadWishlist());
    setShelterDogItems(loadShelterDogWishlist());
    const unsubBreeds = subscribeWishlist(setBreedItems);
    const unsubDogs = subscribeShelterDogWishlist(setShelterDogItems);
    return () => {
      unsubBreeds();
      unsubDogs();
    };
  }, []);

  const breedRows = useMemo(() => breedItems, [breedItems]);
  const dogRows = useMemo(() => shelterDogItems, [shelterDogItems]);
  const isEmpty = breedRows.length === 0 && dogRows.length === 0;

  return (
    <>
      <section id="banner" className="py-3" style={{ background: "#F9F3EC" }}>
        <div className="container">
          <div className="hero-content py-5 my-3">
            <h2 className="display-1 mt-3 mb-0">Wishlist</h2>
            <nav className="breadcrumb">
              <Link className="breadcrumb-item nav-link" href="/">
                Home
              </Link>
              <span className="breadcrumb-item active" aria-current="page">
                Wishlist
              </span>
            </nav>
          </div>
        </div>
      </section>

      <section id="Wishlist" className="py-5 my-5">
        <div className="container">
          {isEmpty ? (
            <div className="py-4 text-center">
              <h4 className="my-4">Your wishlist is currently empty.</h4>
              <Link href="/breeds" className="btn btn-primary rounded-1">
                Explore Breeds
              </Link>
            </div>
          ) : (
            <>
              {dogRows.length > 0 && (
                <div className="mb-5">
                  <h3 className="mb-3">Shelter Dogs</h3>
                  <table className="table wishlist-table w-100">
                    <tbody>
                      {dogRows.map((item) => (
                        <tr key={item.href}>
                          <td className="py-4">
                            <div className="cart-info d-flex flex-wrap align-items-center">
                              <div className="col-4 col-sm-3 col-lg-3">
                                <div className="card-image">
                                  <Image
                                    src={item.imageSrc || "/No%20photo%20yet.jpg"}
                                    alt={item.name}
                                    className="img-fluid rounded-4"
                                    width={140}
                                    height={90}
                                    style={{ objectFit: "cover" }}
                                  />
                                </div>
                              </div>
                              <div className="col-8 col-sm-9 col-lg-9">
                                <div className="card-detail ps-2 ps-sm-3">
                                  <h5 className="card-title mb-0">
                                    <Link href={item.href} className="text-decoration-none text-dark">
                                      {item.name}
                                    </Link>
                                  </h5>
                                  {(item.orgName || item.citystate) && (
                                    <div className="text-muted mt-2" style={{ fontSize: 13 }}>
                                      {[item.orgName, item.citystate].filter(Boolean).join(" • ")}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 align-middle">
                            <div className="wishlist-actions">
                              <Link href={item.href} className="btn btn-primary p-3 text-uppercase fs-6 btn-rounded-none wishlist-action-link">
                                View Dog
                              </Link>
                              <button
                                type="button"
                                className="btn btn-link p-0 wishlist-remove-button"
                                onClick={() => removeShelterDogWishlistItem(item.href)}
                                aria-label={`Remove ${item.name} from wishlist`}
                              >
                                <iconify-icon icon="mdi:trash-can" className="wishlist-remove-icon"></iconify-icon>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {breedRows.length > 0 && (
                <div>
                  <h3 className="mb-3">Breeds</h3>
                  <table className="table wishlist-table w-100">
                    <tbody>
                      {breedRows.map((item) => (
                        <tr key={item.href}>
                          <td className="py-4">
                            <div className="cart-info d-flex flex-wrap align-items-center">
                              <div className="col-4 col-sm-3 col-lg-3">
                                <div className="card-image">
                                  <Image
                                    src={item.imageSrc || "/no-image-available.jpg"}
                                    alt={item.name}
                                    className="img-fluid rounded-4"
                                    width={140}
                                    height={90}
                                    style={{ objectFit: "cover" }}
                                  />
                                </div>
                              </div>
                              <div className="col-8 col-sm-9 col-lg-9">
                                <div className="card-detail ps-2 ps-sm-3">
                                  <h5 className="card-title mb-0">
                                    <Link href={item.href} className="text-decoration-none text-dark">
                                      {item.name}
                                    </Link>
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 align-middle">
                            <div className="wishlist-actions">
                              <Link href={item.href} className="btn btn-primary p-3 text-uppercase fs-6 btn-rounded-none wishlist-action-link">
                                View Breed
                              </Link>
                              <button
                                type="button"
                                className="btn btn-link p-0 wishlist-remove-button"
                                onClick={() => removeWishlistItem(item.href)}
                                aria-label={`Remove ${item.name} from wishlist`}
                              >
                                <iconify-icon icon="mdi:trash-can" className="wishlist-remove-icon"></iconify-icon>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
