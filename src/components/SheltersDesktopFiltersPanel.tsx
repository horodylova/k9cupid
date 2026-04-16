"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SheltersDesktopFiltersPanel({
  children,
  pendingParams,
}: {
  children: ReactNode;
  pendingParams: { state: string; city: string; shelter: string; shelterName: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = pathname || "/shelters";

  const committedRef = useRef({ state: "", city: "", shelter: "", shelterName: "" });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const next = {
      state: searchParams?.get("state") || "",
      city: searchParams?.get("city") || "",
      shelter: searchParams?.get("shelter") || "",
      shelterName: searchParams?.get("shelterName") || "",
    };
    committedRef.current = next;
    setIsDirty(false);
  }, [searchParams]);

  useEffect(() => {
    const c = committedRef.current;
    const dirty =
      pendingParams.state !== c.state ||
      pendingParams.city !== c.city ||
      pendingParams.shelter !== c.shelter ||
      pendingParams.shelterName !== c.shelterName;
    setIsDirty(dirty);
  }, [pendingParams]);

  const apply = (mode: "apply" | "clear") => {
    const next = new URLSearchParams(searchParams?.toString() || "");
    next.delete("page");
    if (mode === "clear") {
      next.delete("state");
      next.delete("city");
      next.delete("shelter");
      next.delete("shelterName");
    } else {
      if (pendingParams.state) next.set("state", pendingParams.state);
      else next.delete("state");
      if (pendingParams.city) next.set("city", pendingParams.city);
      else next.delete("city");
      if (pendingParams.shelter) next.set("shelter", pendingParams.shelter);
      else next.delete("shelter");
      if (pendingParams.shelterName) next.set("shelterName", pendingParams.shelterName);
      else next.delete("shelterName");
    }
    const q = next.toString();
    router.push(q ? `${basePath}?${q}` : basePath);
  };

  return (
    <div className="widget-product-categories pt-0 pt-md-5">
      <h4 className="widget-title m-0 mb-3">Filters</h4>
      {children}
      <div className="d-flex gap-2 mt-3">
        <button
          type="button"
          className="btn btn-outline-dark btn-md text-uppercase fs-6 rounded-1 flex-fill"
          onClick={() => apply("clear")}
          disabled={!isDirty && !committedRef.current.state && !committedRef.current.city && !committedRef.current.shelter}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn-dark btn-md text-uppercase fs-6 rounded-1 flex-fill"
          onClick={() => apply("apply")}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
