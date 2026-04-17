"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Preloader from "@/components/Preloader";

export default function SheltersDesktopFiltersPanel({
  children,
  pendingParams,
}: {
  children: ReactNode;
  pendingParams: { state: string; city: string; shelter: string; shelterName: string; breed: string; age: string; size: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = pathname || "/shelters";

  const committedRef = useRef({ state: "", city: "", shelter: "", shelterName: "", breed: "", age: "", size: "" });
  const [isDirty, setIsDirty] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const next = {
      state: searchParams?.get("state") || "",
      city: searchParams?.get("city") || "",
      shelter: searchParams?.get("shelter") || "",
      shelterName: searchParams?.get("shelterName") || "",
      breed: searchParams?.get("breed") || "",
      age: searchParams?.get("age") || "",
      size: searchParams?.get("size") || "",
    };
    committedRef.current = next;
    setIsDirty(false);
    setIsNavigating(false);
  }, [searchParams]);

  useEffect(() => {
    const c = committedRef.current;
    const dirty =
      pendingParams.state !== c.state ||
      pendingParams.city !== c.city ||
      pendingParams.shelter !== c.shelter ||
      pendingParams.shelterName !== c.shelterName ||
      pendingParams.breed !== c.breed ||
      pendingParams.age !== c.age ||
      pendingParams.size !== c.size;
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
      next.delete("breed");
      next.delete("age");
      next.delete("size");
    } else {
      if (pendingParams.state) next.set("state", pendingParams.state);
      else next.delete("state");
      if (pendingParams.city) next.set("city", pendingParams.city);
      else next.delete("city");
      if (pendingParams.shelter) next.set("shelter", pendingParams.shelter);
      else next.delete("shelter");
      if (pendingParams.shelterName) next.set("shelterName", pendingParams.shelterName);
      else next.delete("shelterName");
      if (pendingParams.breed) next.set("breed", pendingParams.breed);
      else next.delete("breed");
      if (pendingParams.age) next.set("age", pendingParams.age);
      else next.delete("age");
      if (pendingParams.size) next.set("size", pendingParams.size);
      else next.delete("size");
    }
    const q = next.toString();
    setIsNavigating(true);
    router.push(q ? `${basePath}?${q}` : basePath);
  };

  return (
    <div className="widget-product-categories pt-0 pt-md-5">
      {isNavigating && (
        <Preloader overlay />
      )}
      <h4 className="widget-title m-0 mb-3">Filters</h4>
      {children}
      <div className="d-flex gap-2 mt-3">
        <button
          type="button"
          className="btn btn-outline-dark btn-md text-uppercase fs-6 rounded-1 flex-fill"
          onClick={() => apply("clear")}
          disabled={
            !isDirty &&
            !committedRef.current.state &&
            !committedRef.current.city &&
            !committedRef.current.shelter &&
            !committedRef.current.breed &&
            !committedRef.current.age &&
            !committedRef.current.size
          }
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
