'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BreedSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('name') || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`/api/search-breeds?query=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (term: string) => {
    setQuery(term);
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('name', term);
    } else {
      params.delete('name');
    }
    // Reset page when searching
    params.delete('offset');
    router.push(`/breeds?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="search-bar border rounded-2 border-dark-subtle pe-3 position-relative" ref={wrapperRef}>
      <form id="search-form" className="text-center d-flex align-items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control border-0 bg-transparent"
          placeholder="Search for breeds"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
        />
        <button type="submit" className="btn p-0 border-0 bg-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"
            />
          </svg>
        </button>
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="position-absolute start-0 end-0 top-100 mt-1 bg-white border rounded shadow-sm z-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <ul className="list-unstyled m-0 text-start">
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  className="dropdown-item py-2 px-3 w-100 text-start"
                  onClick={() => handleSearch(suggestion)}
                  type="button"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
