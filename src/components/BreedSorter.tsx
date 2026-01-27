'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';

export default function BreedSorter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'name';

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'name') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    // Reset offset when sorting changes
    params.delete('offset');
    
    router.push(`/breeds?${params.toString()}`);
  };

  return (
    <div className="sort-by">
      <select 
        className="filter-categories border-0 m-0"
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value="name">Sort by name</option>
        <option value="life_span">Life span</option>
      </select>
    </div>
  );
}
