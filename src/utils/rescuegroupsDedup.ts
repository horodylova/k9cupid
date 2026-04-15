export function normalizeDedupToken(token: string | undefined | null) {
  const raw = (token || "").toLowerCase().trim();
  if (!raw) return "";
  return raw
    .replace(/&[^;\s]+;/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function makeRescuegroupsDogDedupKey({
  name,
  orgName,
  orgId,
}: {
  name: string | undefined | null;
  orgName: string | undefined | null;
  orgId: string | undefined | null;
}) {
  const n = normalizeDedupToken(name);
  if (!n) return "";
  const org = normalizeDedupToken(orgName) || (orgId || "").trim();
  if (!org) return "";
  return `${n}|${org}`;
}

export function createWindowedDeduper(windowSize: number) {
  const lastSeenByKey = new Map<string, number>();
  let index = 0;

  return {
    isDuplicate(key: string) {
      const k = (key || "").trim();
      if (!k) {
        index += 1;
        return false;
      }

      const prev = lastSeenByKey.get(k);
      const isDup = prev !== undefined && index - prev <= windowSize;
      lastSeenByKey.set(k, index);
      index += 1;
      return isDup;
    },
  };
}

