"use client";

import { useState } from "react";
import { Dog } from "@/lib/api";
import QuizBreedCard from "./QuizBreedCard";

type QuizInterimGridProps = {
  breeds: Dog[];
};

export default function QuizInterimGrid({ breeds }: QuizInterimGridProps) {
  const [visibleCount, setVisibleCount] = useState(12);

  if (!breeds || breeds.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No perfect matches found yet, but keep refining!</p>
      </div>
    );
  }

  const visibleBreeds = breeds.slice(0, visibleCount);
  const hasMore = visibleCount < breeds.length;

  return (
    <>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 g-md-4 mt-4">
        {visibleBreeds.map((breed) => (
          <div key={breed.name} className="col">
            <QuizBreedCard breed={breed} />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center mt-4 mb-5">
          <button 
            className="btn btn-outline-primary px-4 py-2"
            onClick={() => setVisibleCount((prev) => prev + 12)}
          >
            Load More ({breeds.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </>
  );
}
