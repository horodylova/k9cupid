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
  "16461226",
  "16769302",
  "16870523",
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
