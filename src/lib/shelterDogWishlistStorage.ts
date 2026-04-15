export type WishlistShelterDog = {
  id: string;
  name: string;
  href: string;
  imageSrc?: string;
  orgName?: string;
  citystate?: string;
  addedAt: number;
};

const STORAGE_KEY = "k9cupid_wishlist_shelter_dogs";
const EVENT_NAME = "k9cupid:wishlist_shelter_dogs_changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function normalizeShelterDogHref(rawHref: string): string {
  const trimmed = (rawHref || "").trim();
  if (!trimmed) return "";

  let path = trimmed.split("#")[0].split("?")[0];

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      path = new URL(path).pathname;
    } catch {
      path = trimmed;
    }
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  const match = path.match(/^\/shelters\/dogs\/([^/]+)$/);
  if (!match) return path;

  const rawId = match[1] || "";
  const id = rawId.trim();
  if (!id) return path;
  return `/shelters/dogs/${encodeURIComponent(id)}`;
}

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalize(items: unknown): WishlistShelterDog[] {
  if (!Array.isArray(items)) return [];

  const mapped: WishlistShelterDog[] = [];
  for (const entry of items) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Partial<WishlistShelterDog>;
    const id = typeof e.id === "string" ? e.id.trim() : "";
    const name = typeof e.name === "string" ? normalizeName(e.name) : "";
    const href = typeof e.href === "string" ? normalizeShelterDogHref(e.href) : "";
    const imageSrc = typeof e.imageSrc === "string" ? e.imageSrc.trim() : "";
    const orgName = typeof e.orgName === "string" ? normalizeName(e.orgName) : "";
    const citystate = typeof e.citystate === "string" ? normalizeName(e.citystate) : "";
    const addedAt = typeof e.addedAt === "number" && Number.isFinite(e.addedAt) ? e.addedAt : Date.now();
    if (!name || !href) continue;
    mapped.push({
      id: id || href.split("/").pop() || "",
      name,
      href,
      imageSrc: imageSrc || undefined,
      orgName: orgName || undefined,
      citystate: citystate || undefined,
      addedAt,
    });
  }

  const seen = new Set<string>();
  const deduped: WishlistShelterDog[] = [];
  for (const item of mapped) {
    const key = item.href;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  deduped.sort((a, b) => b.addedAt - a.addedAt);
  return deduped;
}

export function loadShelterDogWishlist(): WishlistShelterDog[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return normalize(safeParse(raw));
}

export function saveShelterDogWishlist(items: WishlistShelterDog[]) {
  if (!isBrowser()) return;
  try {
    const normalized = normalize(items);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent<WishlistShelterDog[]>(EVENT_NAME, { detail: normalized }));
  } catch {
    return;
  }
}

export function isShelterDogWishlisted(href: string): boolean {
  const normalizedHref = normalizeShelterDogHref(href);
  if (!normalizedHref) return false;
  const items = loadShelterDogWishlist();
  return items.some((i) => i.href === normalizedHref);
}

export function upsertShelterDogWishlistItem(item: {
  id: string;
  name: string;
  href: string;
  imageSrc?: string;
  orgName?: string;
  citystate?: string;
}): WishlistShelterDog[] {
  const id = (item.id || "").trim();
  const name = normalizeName(item.name);
  const href = normalizeShelterDogHref(item.href);
  const imageSrc = (item.imageSrc || "").trim();
  const orgName = (item.orgName || "").trim();
  const citystate = (item.citystate || "").trim();
  if (!name || !href) return loadShelterDogWishlist();

  const current = loadShelterDogWishlist();
  const existing = current.find((i) => i.href === href);
  const next: WishlistShelterDog[] = existing
    ? current.map((i) =>
        i.href === href
          ? {
              ...i,
              id: id || i.id,
              name,
              imageSrc: imageSrc || i.imageSrc,
              orgName: orgName || i.orgName,
              citystate: citystate || i.citystate,
            }
          : i
      )
    : [
        {
          id: id || href.split("/").pop() || "",
          name,
          href,
          imageSrc: imageSrc || undefined,
          orgName: orgName || undefined,
          citystate: citystate || undefined,
          addedAt: Date.now(),
        },
        ...current,
      ];

  saveShelterDogWishlist(next);
  return next;
}

export function removeShelterDogWishlistItem(href: string): WishlistShelterDog[] {
  const normalizedHref = normalizeShelterDogHref(href);
  if (!normalizedHref) return loadShelterDogWishlist();
  const current = loadShelterDogWishlist();
  const next = current.filter((i) => i.href !== normalizedHref);
  saveShelterDogWishlist(next);
  return next;
}

export function subscribeShelterDogWishlist(onChange: (items: WishlistShelterDog[]) => void) {
  if (!isBrowser()) return () => null;

  const handleCustom = (e: Event) => {
    const ce = e as CustomEvent<WishlistShelterDog[]>;
    onChange(normalize(ce.detail));
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    onChange(loadShelterDogWishlist());
  };

  window.addEventListener(EVENT_NAME, handleCustom as EventListener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustom as EventListener);
    window.removeEventListener("storage", handleStorage);
  };
}

