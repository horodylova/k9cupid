"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ShelterFilterSelect from "@/components/ShelterFilterSelect";
import MobileFiltersPanel from "@/components/MobileFiltersPanel";
import sheltersData from "@/data/rescuegroupsShelters.json";
import StateFilterSelect from "@/components/StateFilterSelect";
import CityFilterSelect from "@/components/CityFilterSelect";

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
}: {
  quickOptions: ShelterOption[];
  initialSelectedState: string;
  initialSelectedCity: string;
  initialSelectedShelterId: string;
  initialSelectedShelterName: string;
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

  useEffect(() => {
    setPendingState(initialSelectedState);
    setPendingCity(initialSelectedCity);
    setPendingShelterId(initialSelectedShelterId);
    setPendingShelterName(initialSelectedShelterName);
  }, [initialSelectedShelterId, initialSelectedShelterName, initialSelectedState, initialSelectedCity]);

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
    const q = next.toString();
    router.push(q ? `${basePath}?${q}` : basePath);
  };

  const onClear = () => {
    setPendingState("");
    setPendingCity("");
    setPendingShelterId("");
    setPendingShelterName("");
    const next = new URLSearchParams(searchParams?.toString() || "");
    next.delete("page");
    next.delete("state");
    next.delete("city");
    next.delete("shelter");
    next.delete("shelterName");
    const q = next.toString();
    router.push(q ? `${basePath}?${q}` : basePath);
  };

  const selectedName = useMemo(() => {
    if (pendingShelterName) return pendingShelterName;
    return quickOptions.find((x) => x.id === pendingShelterId)?.name || "";
  }, [pendingShelterId, pendingShelterName, quickOptions]);

  return (
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
            <input className="form-control" placeholder="Coming soon" disabled />
          </div>
          <div>
            <label className="form-label mb-1">Age</label>
            <select className="form-select" disabled>
              <option>Coming soon</option>
            </select>
          </div>
          <div>
            <label className="form-label mb-1">Size</label>
            <select className="form-select" disabled>
              <option>Coming soon</option>
            </select>
          </div>
        </div>
      </div>
    </MobileFiltersPanel>
  );
}
