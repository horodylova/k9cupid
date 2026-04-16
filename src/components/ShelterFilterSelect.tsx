"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import sheltersData from "@/data/rescuegroupsShelters.json";

type ShelterOption = {
  id: string;
  name: string;
  city?: string;
  state?: string;
};

const SESSION_SHELTER_HISTORY_KEY = "k9cupid_shelter_history_session_v1";

function normalizeToken(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ShelterFilterSelect({
  selectedId,
  selectedName,
  quickOptions,
  filterState,
  filterCity,
  onSelect,
}: {
  selectedId: string;
  selectedName: string;
  quickOptions: ShelterOption[];
  filterState?: string;
  filterCity?: string;
  onSelect?: (option: ShelterOption | null) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = pathname || "/shelters";

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sessionHistory, setSessionHistory] = useState<ShelterOption[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.sessionStorage.getItem(SESSION_SHELTER_HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((x) => {
          const o = x as Partial<ShelterOption>;
          return {
            id: typeof o.id === "string" ? o.id : "",
            name: typeof o.name === "string" ? o.name : "",
            city: typeof o.city === "string" ? o.city : "",
            state: typeof o.state === "string" ? o.state : "",
          };
        })
        .filter((x) => x.id && x.name);
    } catch {
      return [];
    }
  });

  const title = selectedName || quickOptions.find((x) => x.id === selectedId)?.name || "All shelters";

  const visibleQuick = useMemo(() => sessionHistory.slice(0, 8), [sessionHistory]);

  const allShelters = sheltersData as ShelterOption[];
  const normalizedFilterState = (filterState || "").trim().toUpperCase();
  const normalizedFilterCity = (filterCity || "").trim().toLowerCase();
  const scopedShelters = useMemo(() => {
    return allShelters.filter((s) => {
      if (normalizedFilterState && (s.state || "").trim().toUpperCase() !== normalizedFilterState) return false;
      if (normalizedFilterCity && (s.city || "").trim().toLowerCase() !== normalizedFilterCity) return false;
      return true;
    });
  }, [allShelters, normalizedFilterState, normalizedFilterCity]);

  const formatCityState = (opt: ShelterOption) => {
    const parts = [opt.city, opt.state].filter(Boolean);
    return parts.join(", ");
  };

  const filtered = useMemo(() => {
    const q = normalizeToken(query);
    if (!q) return scopedShelters;
    return scopedShelters.filter((s) => normalizeToken(s.name).includes(q));
  }, [scopedShelters, query]);

  const pageSize = 30;
  const resultPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedResults = useMemo(() => filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), [filtered, page]);

  const applySelection = (option: ShelterOption | null) => {
    if (option) {
      const nextHistory = [option, ...sessionHistory.filter((x) => x.id !== option.id)].slice(0, 10);
      setSessionHistory(nextHistory);
      try {
        window.sessionStorage.setItem(SESSION_SHELTER_HISTORY_KEY, JSON.stringify(nextHistory));
      } catch {}
    }

    if (onSelect) {
      onSelect(option);
      setIsOpen(false);
      return;
    }
    const next = new URLSearchParams(searchParams?.toString() || "");
    next.delete("page");
    if (!option) {
      next.delete("shelter");
      next.delete("shelterName");
    } else {
      next.set("shelter", option.id);
      next.set("shelterName", option.name);
    }
    const q = next.toString();
    router.push(q ? `${basePath}?${q}` : basePath);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="form-label mb-1">Shelter</label>
      <button
        type="button"
        className="form-control shelter-filter-button text-start d-flex justify-content-between align-items-center"
        onClick={() => setIsOpen(true)}
        title={title}
      >
        <span className="shelter-filter-value">
          {title}
        </span>
        <iconify-icon icon="mdi:chevron-down" className="fs-5 shelter-filter-chevron"></iconify-icon>
      </button>

      {selectedId && (
        <button type="button" className="btn btn-link p-0 mt-2 text-decoration-none" onClick={() => applySelection(null)}>
          Clear shelter filter
        </button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 1060,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-4 border"
            style={{
              width: "min(760px, 100%)",
              maxHeight: "calc(100vh - 32px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              marginTop: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="m-0">Choose Shelter</h5>
              <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
            <div className="p-3 border-bottom">
              <input
                className="form-control"
                placeholder="Search shelters..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="p-3" style={{ overflow: "auto", flex: "1 1 auto" }}>
              {!query && visibleQuick.length > 0 && (
                <div className="mb-3">
                  <div className="text-muted mb-2" style={{ fontSize: 12 }}>
                    Previous shelters in this session
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {visibleQuick.map((opt) => (
                      <button key={opt.id} type="button" className="btn btn-sm btn-outline-dark" onClick={() => applySelection(opt)}>
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pagedResults.length === 0 ? (
                <div className="text-muted">No shelters found.</div>
              ) : (
                <div className="list-group">
                  {pagedResults.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      onClick={() => applySelection(opt)}
                    >
                      <span>{opt.name}</span>
                      {formatCityState(opt) ? (
                        <span className="text-muted" style={{ fontSize: 12 }}>
                          {formatCityState(opt)}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-top d-flex justify-content-between align-items-center">
              <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                Prev
              </button>
              <div className="text-muted" style={{ fontSize: 12 }}>
                Page {page} / {resultPages} ({filtered.length})
              </div>
              <button
                type="button"
                className="btn btn-outline-dark btn-sm"
                onClick={() => setPage((p) => Math.min(resultPages, p + 1))}
                disabled={page >= resultPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
