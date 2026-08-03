'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BreedTypeahead from "@/components/breeds/BreedTypeahead";

export default function BreedSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('name') ?? '');

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (term) {
      params.set('name', term);
    } else {
      params.delete('name');
    }
    params.delete('offset');
    router.push(`/breeds?${params.toString()}`);
  };

  return (
    <div className="search-bar border rounded-2 border-dark-subtle position-relative">
      <BreedTypeahead
        value={query}
        placeholder="Search for breeds"
        onChange={setQuery}
        onCommit={handleSearch}
      />
    </div>
  );
}
