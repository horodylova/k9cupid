"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ShelterOption = {
  id: string;
  name: string;
  citystate?: string;
};

type IndexResponse = {
  data?: ShelterOption[];
};

const STORAGE_KEY = "k9cupid_rescuegroups_orgs_index_v2";

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
}: {
  selectedId: string;
  selectedName: string;
  quickOptions: ShelterOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = pathname || "/shelters";

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allShelters, setAllShelters] = useState<ShelterOption[]>([]);

  const title = selectedName || quickOptions.find((x) => x.id === selectedId)?.name || "All shelters";

  const visibleQuick = useMemo(() => quickOptions.slice(0, 8), [quickOptions]);

  useEffect(() => {
    if (!isOpen) return;
    const run = async () => {
      if (allShelters.length > 0) return;

      setLoading(true);
      try {
        try {
          const cached = window.localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached) as unknown;
            if (Array.isArray(parsed)) {
              const fromStorage = parsed
                .map((x) => {
                  const o = x as Partial<ShelterOption>;
                  return {
                    id: typeof o.id === "string" ? o.id : "",
                    name: typeof o.name === "string" ? o.name : "",
                    citystate: typeof o.citystate === "string" ? o.citystate : "",
                  };
                })
                .filter((x) => x.id && x.name);
              if (fromStorage.length > 0) {
                setAllShelters(fromStorage);
                return;
              }
            }
          }
        } catch {
          return;
        }

        const res = await fetch("/api/rescuegroups/orgs-index");
        if (!res.ok) return;
        const json = (await res.json()) as IndexResponse;
        const rows = Array.isArray(json.data) ? json.data : [];
        const normalized = rows
          .map((o) => ({
            id: String(o.id || "").trim(),
            name: String(o.name || "").trim(),
            citystate: String(o.citystate || "").trim(),
          }))
          .filter((o) => o.id && o.name);
        setAllShelters(normalized);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch {
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [isOpen, allShelters.length]);

  const filtered = useMemo(() => {
    const q = normalizeToken(query);
    if (!q) return allShelters;
    return allShelters.filter((s) => normalizeToken(s.name).includes(q));
  }, [allShelters, query]);

  const pageSize = 30;
  const resultPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedResults = useMemo(() => filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), [filtered, page]);

  const applySelection = (option: ShelterOption | null) => {
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
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-4 border"
            style={{ width: "min(760px, 100%)", maxHeight: "85vh", overflow: "hidden" }}
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

            <div className="p-3" style={{ maxHeight: "52vh", overflow: "auto" }}>
              {!query && visibleQuick.length > 0 && (
                <div className="mb-3">
                  <div className="text-muted mb-2" style={{ fontSize: 12 }}>
                    Quick picks from current results
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

              {loading ? (
                <div className="text-muted">Loading...</div>
              ) : pagedResults.length === 0 ? (
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
                      {opt.citystate ? (
                        <span className="text-muted" style={{ fontSize: 12 }}>
                          {opt.citystate}
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
