const EXCLUDED_IDS = new Set<string>([
  "10919820",
  "11013605",
  "121598",
  "12645754",
  "12726786",
  "13960944",
  "13961272",
  "14745370",
  "15317294",
  "15501414",
  "15653335",
  "18302613",
  "5364478",
  "3884412",
  "4157256",
  "4284120",
  "6095891",
  "6180059",
  "6180087",
  "6181914",
  "6182118",
  "6182502",
  "6182619",
  "6182712",
  "6182801",
  "6182897",
  "6182997",
  "6183151",
  "6183191",
  "6183236",
  "6183265",
  "6183272",
  "6183303",
  "6183305",
  "6183316",
  "6183364",
  "6183458",
  "6179760",
  "6179953",
  "6179974",
  "16461226",
  "16769302",
  "16870523",
  "8016588",
  "8192118",
]);

export function isExcludedRescuegroupsAnimalId(id: string) {
  return EXCLUDED_IDS.has(id);
}

const INFO_ENTRY_NAME_PATTERNS = [
  "pre-approval",
  "pre approval",
  "preapproval",
  "application",
  "adoption application",
  "foster application",
  "volunteer application",
] as const;

export function isRescuegroupsInfoEntryName(name: string | undefined | null) {
  const n = (name || "").trim().toLowerCase();
  if (!n) return false;
  return INFO_ENTRY_NAME_PATTERNS.some((p) => n.includes(p));
}
