"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function CookieBanner() {
  const storageKey = useMemo(() => "cc_consent_v1", []);
  const [visible, setVisible] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const existing = window.localStorage.getItem(storageKey);
      setVisible(!existing);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  const persist = (value: "accepted" | "rejected") => {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
    }
    window.dispatchEvent(new Event("cc_consent_update"));
    setVisible(false);
  };

  if (!hydrated || !visible) return null;

  return (
    <div
      className="alert alert-light border-0 shadow-sm rounded-4 alert-dismissible fade show mb-0"
      role="dialog"
      aria-label="Cookie preferences"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 1050,
        background: "#ffffff",
      }}
    >
      <div className="container px-2 px-md-3">
        <div className="row align-items-center g-3">
          <div className="col-12 col-lg">
            <div className="fw-semibold mb-1">Cookies</div>
            <div className="text-muted secondary-font" style={{ fontSize: 14, lineHeight: 1.4 }}>
              We use essential cookies to make the site work, and optional cookies to improve analytics and marketing.
              You can accept or reject non-essential cookies. Learn more in our{" "}
              <Link href="/privacy-policy" className="text-decoration-underline">
                Privacy Policy
              </Link>
              .
            </div>
          </div>
          <div className="col-12 col-lg-auto">
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
              <button type="button" className="btn btn-outline-dark rounded-pill px-4" onClick={() => persist("rejected")}>
                Reject
              </button>
              <button type="button" className="btn btn-dark rounded-pill px-4" onClick={() => persist("accepted")}>
                Accept
              </button>
            </div>
            <div className="text-center text-lg-end mt-2">
              <Link href="/privacy-policy#privacy-choices" className="text-decoration-underline text-muted secondary-font" style={{ fontSize: 12 }}>
                Cookie settings
              </Link>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="btn-close" aria-label="Close" onClick={() => persist("rejected")}></button>
    </div>
  );
}
