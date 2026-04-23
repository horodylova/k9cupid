"use client";

import { useEffect, useRef, useState } from "react";

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
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const normalizedValue = normalize(value);

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
        title={normalizedValue || placeholder}
      >
        <span className="filter-select-value text-truncate" style={{ maxWidth: "85%", minWidth: 0 }}>
          {normalizedValue || placeholder}
        </span>
        <iconify-icon icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} className="filter-select-chevron"></iconify-icon>
      </button>

      {isOpen && !disabled && (
        <div
          className="position-absolute start-0 end-0 mt-1 bg-white border rounded-4 shadow-sm"
          style={{ zIndex: 1070, maxHeight: 320, overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
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
            {options.map((c) => {
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}
