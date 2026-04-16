"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import usStates from "@/data/usStates.json";

type StateRow = {
  code: string;
  name: string;
};

type Props = {
  value: string;
  onChange: (code: string) => void;
};

function normalizeState(code: string) {
  return (code || "").trim().toUpperCase();
}

export default function StateFilterSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const normalizedValue = normalizeState(value);

  const allStates = usStates as StateRow[];

  const filteredStates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allStates;
    return allStates.filter((s) => {
      const code = normalizeState(s.code);
      const name = s.name.toLowerCase();
      return code.toLowerCase().includes(q) || name.includes(q);
    });
  }, [query, allStates]);

  const selectedLabel = useMemo(() => {
    if (!normalizedValue) return "All states";
    const match = allStates.find((s) => normalizeState(s.code) === normalizedValue);
    if (!match) return normalizedValue;
    return `${match.code} — ${match.name}`;
  }, [normalizedValue, allStates]);

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
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="text-truncate" style={{ maxWidth: "85%", minWidth: 0 }}>
          {selectedLabel}
        </span>
        <iconify-icon
          icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="fs-5"
        ></iconify-icon>
      </button>

      {isOpen && (
        <div
          className="position-absolute start-0 end-0 mt-1 bg-white border rounded-4 shadow-sm"
          style={{ zIndex: 1070, maxHeight: 320, overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
          <div className="p-2 border-bottom">
            <input
              className="form-control form-control-sm"
              placeholder="Search state..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div style={{ overflowY: "auto", flex: "1 1 auto" }}>
            <button
              type="button"
              className={`w-100 text-start px-3 py-2 border-0 bg-transparent ${
                !normalizedValue ? "fw-semibold" : ""
              }`}
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              All states
            </button>
            <hr className="my-1" />
            {filteredStates.map((s) => {
              const code = normalizeState(s.code);
              const isActive = code === normalizedValue;
              return (
                <button
                  key={code}
                  type="button"
                  className={`w-100 text-start px-3 py-2 border-0 bg-transparent ${
                    isActive ? "fw-semibold" : ""
                  }`}
                  onClick={() => {
                    onChange(code);
                    setIsOpen(false);
                  }}
                >
                  {code} — {s.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

