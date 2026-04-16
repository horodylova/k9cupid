"use client";

import { ReactNode, useRef } from "react";

export default function MobileFiltersPanel({
  children,
  onApply,
  onClear,
}: {
  children: ReactNode;
  onApply?: () => void;
  onClear?: () => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const close = () => {
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <details
      ref={detailsRef}
      className="d-md-none mb-4 border rounded-4"
      style={{ background: "#F9F3EC", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}
    >
      <summary
        className="px-3 py-3 d-flex justify-content-between align-items-center fw-semibold text-uppercase"
        style={{ cursor: "pointer", letterSpacing: 0.8 }}
      >
        <span>Filters</span>
        <iconify-icon icon="ri:arrow-down-s-line" className="fs-5"></iconify-icon>
      </summary>
      <div className="px-3 pb-3">
        {children}
        <div className="d-flex gap-2 mt-3">
          <button
            type="button"
            className="btn btn-outline-dark btn-md text-uppercase fs-6 rounded-1 flex-fill"
            onClick={() => {
              onClear?.();
              close();
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn btn-dark btn-md text-uppercase fs-6 rounded-1 flex-fill"
            onClick={() => {
              onApply?.();
              close();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </details>
  );
}
