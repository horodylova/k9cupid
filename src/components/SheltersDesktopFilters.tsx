"use client";

import { useEffect, useMemo, useState } from "react";
import ShelterFilterSelect from "@/components/ShelterFilterSelect";
import sheltersData from "@/data/rescuegroupsShelters.json";
import StateFilterSelect from "@/components/StateFilterSelect";
import SheltersDesktopFiltersPanel from "@/components/SheltersDesktopFiltersPanel";
import CityFilterSelect from "@/components/CityFilterSelect";
import OptionFilterSelect from "@/components/OptionFilterSelect";
import BreedTypeahead from "@/components/BreedTypeahead";

type ShelterRow = {
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

export default function SheltersDesktopFilters({
  selectedState,
  selectedCity,
  selectedShelterId,
  selectedShelterName,
  selectedBreed,
  selectedAge,
  selectedSize,
  quickShelters,
}: {
  selectedState: string;
  selectedCity: string;
  selectedShelterId: string;
  selectedShelterName: string;
  selectedBreed: string;
  selectedAge: string;
  selectedSize: string;
  quickShelters: ShelterRow[];
}) {
  const shelters = sheltersData as ShelterRow[];
  const [pendingState, setPendingState] = useState(normalizeState(selectedState));
  const [pendingCity, setPendingCity] = useState(normalizeCity(selectedCity));
  const [pendingShelterId, setPendingShelterId] = useState((selectedShelterId || "").trim());
  const [pendingShelterName, setPendingShelterName] = useState((selectedShelterName || "").trim());
  const [pendingBreed, setPendingBreed] = useState((selectedBreed || "").trim());
  const [pendingAge, setPendingAge] = useState((selectedAge || "").trim());
  const [pendingSize, setPendingSize] = useState((selectedSize || "").trim());

  useEffect(() => {
    setPendingState(normalizeState(selectedState));
    setPendingCity(normalizeCity(selectedCity));
    setPendingShelterId((selectedShelterId || "").trim());
    setPendingShelterName((selectedShelterName || "").trim());
    setPendingBreed((selectedBreed || "").trim());
    setPendingAge((selectedAge || "").trim());
    setPendingSize((selectedSize || "").trim());
  }, [selectedState, selectedCity, selectedShelterId, selectedShelterName, selectedBreed, selectedAge, selectedSize]);

  const selectedStateNorm = pendingState;
  const selectedCityNorm = pendingCity;

  const cityOptions = useMemo(() => {
    if (!selectedStateNorm) return [];
    const set = new Set<string>();
    for (const sh of shelters) {
      if (normalizeState(sh.state || "") !== selectedStateNorm) continue;
      const c = normalizeCity(sh.city || "");
      if (!c) continue;
      set.add(c);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [shelters, selectedStateNorm]);

  return (
    <SheltersDesktopFiltersPanel
      pendingParams={{
        state: pendingState,
        city: pendingCity,
        shelter: pendingShelterId,
        shelterName: pendingShelterName,
        breed: pendingBreed,
        age: pendingAge,
        size: pendingSize,
      }}
    >
      <div className="d-grid gap-3">
        <div>
          <label className="form-label mb-1">State</label>
          <StateFilterSelect
            value={selectedStateNorm}
            onChange={(state) => {
              const normalized = normalizeState(state);
              setPendingState(normalized);
              setPendingCity("");
              setPendingShelterId("");
              setPendingShelterName("");
            }}
          />
        </div>

        <div>
          <label className="form-label mb-1">City</label>
          <CityFilterSelect
            value={selectedCityNorm}
            options={cityOptions}
            disabled={!selectedStateNorm || cityOptions.length === 0}
            placeholder={selectedStateNorm ? "All cities" : "Select state first"}
            allLabel="All cities"
            onChange={(city) => {
              const normalized = normalizeCity(city);
              setPendingCity(normalized);
              setPendingShelterId("");
              setPendingShelterName("");
            }}
          />
        </div>

        <div>
          <ShelterFilterSelect
            selectedId={pendingShelterId}
            selectedName={pendingShelterName}
            quickOptions={quickShelters}
            filterState={selectedStateNorm}
            filterCity={selectedCityNorm}
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
    </SheltersDesktopFiltersPanel>
  );
}
