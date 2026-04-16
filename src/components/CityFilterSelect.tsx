"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  options: string[];
  disabled?: boolean;
  placeholder: string;
  allLabel: string;
  onChange: (city: string) => void;
};

function normalize(input: string) {
  return (input || "").trim();
}

export default function CityFilterSelect({ value, options, disabled = false, placeholder, allLabel, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const normalizedValue = normalize(value);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((c) => c.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="position-relative" ref={wrapperRef}>
      <button
        type="button"
        className="form-control d-flex justify-content-between align-items-center"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setIsOpen((open) => !open);
        }}
        title={normalizedValue || placeholder}
      >
        <span className="text-truncate" style={{ maxWidth: "85%", minWidth: 0 }}>
          {normalizedValue || placeholder}
        </span>
        <iconify-icon icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} className="fs-5"></iconify-icon>
      </button>

      {isOpen && !disabled && (
        <div
          className="position-absolute start-0 end-0 mt-1 bg-white border rounded-4 shadow-sm"
          style={{ zIndex: 1070, maxHeight: 320, overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
          <div className="p-2 border-bottom">
            <input
              className="form-control form-control-sm"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div style={{ overflowY: "auto", flex: "1 1 auto" }}>
            <button
              type="button"
              className={`w-100 text-start px-3 py-2 border-0 bg-transparent ${!normalizedValue ? "fw-semibold" : ""}`}
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              {allLabel}
            </button>
            <hr className="my-1" />
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-muted">No cities found.</div>
            ) : (
              filteredOptions.map((c) => {
                const isActive = c === normalizedValue;
                return (
                  <button
                    key={c}
                    type="button"
                    className={`w-100 text-start px-3 py-2 border-0 bg-transparent ${isActive ? "fw-semibold" : ""}`}
                    onClick={() => {
                      onChange(c);
                      setIsOpen(false);
                    }}
                  >
                    {c}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

