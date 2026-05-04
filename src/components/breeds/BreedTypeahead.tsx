"use client";

import { useEffect, useRef, useState } from "react";

export default function BreedTypeahead({
  value,
  placeholder,
  onChange,
  onCommit,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onCommit?: (value: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = (value || "").trim();
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`/api/search-breeds?query=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = (await res.json()) as unknown;
          if (Array.isArray(data)) {
            setSuggestions(data.filter((x) => typeof x === "string") as string[]);
            setIsOpen(true);
          } else {
            setSuggestions([]);
          }
        }
      } catch {
        setSuggestions([]);
      }
    };

    const timeoutId = window.setTimeout(fetchSuggestions, 300);
    return () => window.clearTimeout(timeoutId);
  }, [value]);

  const commit = (term: string) => {
    const next = term || "";
    onChange(next);
    setIsOpen(false);
    if (onCommit) onCommit(next);
  };

  return (
    <div className="position-relative" ref={wrapperRef}>
      <input
        type="text"
        className="form-control border-0 bg-transparent"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(value);
          }
        }}
      />

      {isOpen && suggestions.length > 0 && (
        <div
          className="position-absolute start-0 end-0 top-100 mt-1 bg-white border rounded shadow-sm z-3"
          style={{ zIndex: 1070, maxHeight: 220, overflowY: "auto" }}
        >
          <ul className="list-unstyled m-0 text-start">
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  className="dropdown-item py-2 px-3 w-100 text-start"
                  onClick={() => commit(suggestion)}
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
