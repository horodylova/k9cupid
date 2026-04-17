"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Option = { value: string; label: string };

export default function OptionFilterSelect({
  value,
  options,
  placeholder,
  disabled = false,
  searchable = false,
  searchPlaceholder = "Search...",
  onChange,
}: {
  value: string;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => options.find((o) => o.value === value) || null, [options, value]);

  const visibleOptions = useMemo(() => {
    if (!searchable) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

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
        className="form-control filter-select-button text-start d-flex align-items-center"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setIsOpen((open) => !open);
        }}
        title={selected?.label || placeholder}
      >
        <span className="filter-select-value text-truncate" style={{ maxWidth: "85%", minWidth: 0 }}>
          {selected?.label || placeholder}
        </span>
        <iconify-icon icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} className="filter-select-chevron"></iconify-icon>
      </button>

      {isOpen && !disabled && (
        <div
          className="position-absolute start-0 end-0 mt-1 bg-white border rounded-4 shadow-sm"
          style={{ zIndex: 1070, maxHeight: 320, overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
          {searchable && (
            <div className="p-2 border-bottom">
              <input
                className="form-control form-control-sm"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
          <div style={{ overflowY: "auto", flex: "1 1 auto" }}>
            {visibleOptions.length === 0 ? (
              <div className="px-3 py-2 text-muted">No options found.</div>
            ) : (
              visibleOptions.map((o) => {
                const isActive = o.value === value;
                return (
                  <button
                    key={o.value || "__empty"}
                    type="button"
                    className={`w-100 text-start px-3 py-2 border-0 bg-transparent ${isActive ? "fw-semibold" : ""}`}
                    onClick={() => {
                      onChange(o.value);
                      setIsOpen(false);
                    }}
                  >
                    {o.label}
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

