"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dog } from "@/lib/api";

type QuizBreedCardProps = {
  breed: Dog;
};

export default function QuizBreedCard({ breed }: QuizBreedCardProps) {
  const [imgSrc, setImgSrc] = useState(breed.image_link || "/no-image-available.jpg");

  return (
    <Link href={`/breeds/${encodeURIComponent(breed.name)}`} target="_blank" className="text-decoration-none">
      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="position-relative" style={{ paddingTop: "100%" }}>
          <Image
            src={imgSrc}
            alt={breed.name}
            fill
            className="object-fit-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={() => setImgSrc("/no-image-available.jpg")}
          />
        </div>
        <div className="card-body p-3 text-center">
          <h5 className="card-title fs-6 fw-bold mb-0 text-dark text-truncate" title={breed.name}>
            {breed.name}
          </h5>
        </div>
      </div>
    </Link>
  );
}
