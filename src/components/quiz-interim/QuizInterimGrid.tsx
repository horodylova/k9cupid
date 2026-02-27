"use client";

import { Dog } from "@/lib/api";
import QuizBreedCard from "./QuizBreedCard";

type QuizInterimGridProps = {
  breeds: Dog[];
};

export default function QuizInterimGrid({ breeds }: QuizInterimGridProps) {
  if (!breeds || breeds.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No perfect matches found yet, but keep refining!</p>
      </div>
    );
  }

  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4 mt-4">
      {breeds.map((breed) => (
        <div key={breed.name} className="col">
          <QuizBreedCard breed={breed} />
        </div>
      ))}
    </div>
  );
}
