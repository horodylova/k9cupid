"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type AdoptableMatch = {
  id: string;
  name: string;
  breedString: string;
  age: string;
  sex: string;
  size: string;
  imageSrc: string;
  orgName: string;
  orgCitystate: string;
};

type BreedAdoptableMatchesProps = {
  breedName: string;
  matches: AdoptableMatch[];
};

export default function BreedAdoptableMatches({ breedName, matches }: BreedAdoptableMatchesProps) {
  const visibleMatches = useMemo(() => matches.slice(0, 6), [matches]);

  if (!visibleMatches.length) return null;

  return (
    <section className="py-5">
      <div className="container">
        <div className="breed-adoptable-panel">
          <div className="breed-adoptable-top">
            <div className="breed-adoptable-topLeft">
              <div className="breed-adoptable-iconWrap">
                <Image
                  src="/Cupid%20with%20beagle.png"
                  alt="Cupid"
                  width={64}
                  height={64}
                  className="breed-adoptable-icon"
                  unoptimized
                />
              </div>
              <div className="breed-adoptable-headline">
                <div className="breed-adoptable-pill">Adoptable now</div>
                <h2 className="breed-adoptable-title">A {breedName} is waiting for you</h2>
                <div className="breed-adoptable-subtitle">
                  We found dogs with this breed in their profile who are available right now. Tap a card to meet them.
                </div>
              </div>
            </div>
            <div className="breed-adoptable-actions">
              <Link
                href={`/shelters?breed=${encodeURIComponent(breedName)}`}
                className="btn btn-outline-dark btn-md text-uppercase fs-6 rounded-1"
              >
                See all matches
              </Link>
            </div>
          </div>

          <div className="row g-3 g-md-4">
            {visibleMatches.map((dog) => {
              const detailsHref = `/shelters/dogs/${encodeURIComponent(dog.id)}`;
              const isPlaceholder = !dog.imageSrc;
              const imgSrc = dog.imageSrc || "/No%20photo%20yet.jpg";
              const alt = isPlaceholder ? "No photo yet" : dog.name;
              const badges = [dog.age, dog.sex, dog.size].filter(Boolean);

              return (
                <div key={dog.id} className="col-12 col-sm-6 col-lg-4">
                  <Link href={detailsHref} className="text-decoration-none">
                    <div className="breed-adoptable-card">
                      <div
                        className={[
                          "breed-adoptable-imageFrame",
                          isPlaceholder ? "is-placeholder" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <Image
                          src={imgSrc}
                          alt={alt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="breed-adoptable-img"
                          unoptimized
                        />
                      </div>
                      <div className="breed-adoptable-body">
                        <div className="breed-adoptable-name" title={dog.name}>
                          {dog.name}
                        </div>
                        {badges.length > 0 && (
                          <div className="breed-adoptable-badges">
                            {badges.map((b) => (
                              <span key={b} className="breed-adoptable-badge">
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="breed-adoptable-org">
                          {dog.orgName ? dog.orgName : "Shelter"}
                          {dog.orgCitystate ? ` · ${dog.orgCitystate}` : ""}
                        </div>
                        <div className="breed-adoptable-breed">{dog.breedString}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}