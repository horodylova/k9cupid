"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ShelterFilterSelect from "@/components/ShelterFilterSelect";
import MobileFiltersPanel from "@/components/MobileFiltersPanel";
import sheltersData from "@/data/rescuegroupsShelters.json";
import StateFilterSelect from "@/components/StateFilterSelect";
import CityFilterSelect from "@/components/CityFilterSelect";
import OptionFilterSelect from "@/components/OptionFilterSelect";
import Preloader from "@/components/Preloader";
import BreedTypeahead from "@/components/BreedTypeahead";

type ShelterOption = {
  id: string;
  name: string;
  city?: string;
  state?: string;
};

function normalizeState(value: string) {
  return (value || "").trim().toUpperCase();
}

function normalizeCity(value: string) {
  return (value || "").trim();
}

export default function SheltersMobileFilters({
  quickOptions,
  initialSelectedState,
  initialSelectedCity,
  initialSelectedShelterId,
  initialSelectedShelterName,
  initialSelectedBreed,
  initialSelectedAge,
  initialSelectedSize,
}: {
  quickOptions: ShelterOption[];
  initialSelectedState: string;
  initialSelectedCity: string;
  initialSelectedShelterId: string;
  initialSelectedShelterName: string;
  initialSelectedBreed: string;
  initialSelectedAge: string;
  initialSelectedSize: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = pathname || "/shelters";

  const shelters = sheltersData as ShelterOption[];

  const [pendingState, setPendingState] = useState(initialSelectedState);
  const [pendingCity, setPendingCity] = useState(initialSelectedCity);
  const [pendingShelterId, setPendingShelterId] = useState(initialSelectedShelterId);
  const [pendingShelterName, setPendingShelterName] = useState(initialSelectedShelterName);
  const [pendingBreed, setPendingBreed] = useState(initialSelectedBreed);
  const [pendingAge, setPendingAge] = useState(initialSelectedAge);
  const [pendingSize, setPendingSize] = useState(initialSelectedSize);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setPendingState(initialSelectedState);
    setPendingCity(initialSelectedCity);
    setPendingShelterId(initialSelectedShelterId);
    setPendingShelterName(initialSelectedShelterName);
    setPendingBreed(initialSelectedBreed);
    setPendingAge(initialSelectedAge);
    setPendingSize(initialSelectedSize);
  }, [
    initialSelectedShelterId,
    initialSelectedShelterName,
    initialSelectedState,
    initialSelectedCity,
    initialSelectedBreed,
    initialSelectedAge,
    initialSelectedSize,
  ]);

  useEffect(() => {
    setIsNavigating(false);
  }, [searchParams]);

  const cityOptions = useMemo(() => {
    const st = normalizeState(pendingState);
    if (!st) return [];
    const set = new Set<string>();
    for (const sh of shelters) {
      if (normalizeState(sh.state || "") !== st) continue;
      const c = normalizeCity(sh.city || "");
      if (!c) continue;
      set.add(c);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [shelters, pendingState]);

  const onApply = () => {
    const next = new URLSearchParams(searchParams?.toString() || "");
    next.delete("page");
    const st = normalizeState(pendingState);
    const city = normalizeCity(pendingCity);
    if (!st) {
      next.delete("state");
      next.delete("city");
    } else {
      next.set("state", st);
      if (city) next.set("city", city);
      else next.delete("city");
    }
    if (!pendingShelterId) {
      next.delete("shelter");
      next.delete("shelterName");
    } else {
      next.set("shelter", pendingShelterId);
      next.set("shelterName", pendingShelterName || "");
    }
    if (pendingBreed.trim()) next.set("breed", pendingBreed.trim());
    else next.delete("breed");
    if (pendingAge.trim()) next.set("age", pendingAge.trim());
    else next.delete("age");
    if (pendingSize.trim()) next.set("size", pendingSize.trim());
    else next.delete("size");
    const q = next.toString();
    setIsNavigating(true);
    router.push(q ? `${basePath}?${q}` : basePath);
  };

  const onClear = () => {
    setPendingState("");
    setPendingCity("");
    setPendingShelterId("");
    setPendingShelterName("");
    setPendingBreed("");
    setPendingAge("");
    setPendingSize("");
    const next = new URLSearchParams(searchParams?.toString() || "");
    next.delete("page");
    next.delete("state");
    next.delete("city");
    next.delete("shelter");
    next.delete("shelterName");
    next.delete("breed");
    next.delete("age");
    next.delete("size");
    const q = next.toString();
    setIsNavigating(true);
    router.push(q ? `${basePath}?${q}` : basePath);
  };

  const selectedName = useMemo(() => {
    if (pendingShelterName) return pendingShelterName;
    return quickOptions.find((x) => x.id === pendingShelterId)?.name || "";
  }, [pendingShelterId, pendingShelterName, quickOptions]);

  return (
    <>
      {isNavigating && (
        <Preloader overlay />
      )}
      <MobileFiltersPanel onApply={onApply} onClear={onClear}>
        <div className="widget-product-categories pt-0 pt-md-5">
          <h4 className="widget-title m-0 mb-3">Filters</h4>
          <div className="d-grid gap-3">
          <div>
            <label className="form-label mb-1">State</label>
            <StateFilterSelect
              value={normalizeState(pendingState)}
              onChange={(code) => {
                const st = normalizeState(code);
                setPendingState(st);
                setPendingCity("");
                setPendingShelterId("");
                setPendingShelterName("");
              }}
            />
          </div>
          <div>
            <label className="form-label mb-1">City</label>
            <CityFilterSelect
              value={pendingCity}
              options={cityOptions}
              disabled={!normalizeState(pendingState) || cityOptions.length === 0}
              placeholder={normalizeState(pendingState) ? "All cities" : "Select state first"}
              allLabel="All cities"
              onChange={(city) => {
                setPendingCity(city);
                setPendingShelterId("");
                setPendingShelterName("");
              }}
            />
          </div>
          <div>
            <ShelterFilterSelect
              selectedId={pendingShelterId}
              selectedName={selectedName}
              quickOptions={quickOptions}
              filterState={normalizeState(pendingState)}
              filterCity={pendingCity}
              onSelect={(opt) => {
                setPendingShelterId(opt?.id || "");
                setPendingShelterName(opt?.name || "");
              }}
            />
          </div>
          <div>
            <label className="form-label mb-1">Breed</label>
            <div className="search-bar border rounded-2 border-dark-subtle pe-3 position-relative">
              <BreedTypeahead value={pendingBreed} placeholder="Any breed" onChange={setPendingBreed} />
            </div>
          </div>
          <div>
            <label className="form-label mb-1">Age</label>
            <OptionFilterSelect
              value={pendingAge}
              placeholder="Any age"
              options={[
                { value: "", label: "Any age" },
                { value: "baby", label: "Baby" },
                { value: "young", label: "Young" },
                { value: "adult", label: "Adult" },
                { value: "senior", label: "Senior" },
              ]}
              onChange={(v) => setPendingAge(v)}
            />
          </div>
          <div>
            <label className="form-label mb-1">Size</label>
            <OptionFilterSelect
              value={pendingSize}
              placeholder="Any size"
              options={[
                { value: "", label: "Any size" },
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
                { value: "x-large", label: "X-Large" },
              ]}
              onChange={(v) => setPendingSize(v)}
            />
          </div>
          </div>
        </div>
      </MobileFiltersPanel>
    </>
  );
}
