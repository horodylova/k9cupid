export type WishlistBreed = {
  name: string;
  href: string;
  imageSrc?: string;
  addedAt: number;
};

const STORAGE_KEY = "k9cupid_wishlist";
const EVENT_NAME = "k9cupid:wishlist_changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function normalizeWishlistHref(rawHref: string): string {
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

  const match = path.match(/^\/breeds\/(.+)$/);
  if (!match) return path;

  const slug = match[1] || "";
  let decoded = slug;
  for (let i = 0; i < 3; i++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  decoded = normalizeName(decoded);
  return `/breeds/${encodeURIComponent(decoded)}`;
}

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalize(items: unknown): WishlistBreed[] {
  if (!Array.isArray(items)) return [];

  const mapped: WishlistBreed[] = [];
  for (const entry of items) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Partial<WishlistBreed>;
    const name = typeof e.name === "string" ? normalizeName(e.name) : "";
    const href = typeof e.href === "string" ? normalizeWishlistHref(e.href) : "";
    const imageSrc = typeof e.imageSrc === "string" ? e.imageSrc.trim() : "";
    const addedAt = typeof e.addedAt === "number" && Number.isFinite(e.addedAt) ? e.addedAt : Date.now();
    if (!name || !href) continue;
    mapped.push({ name, href, imageSrc: imageSrc || undefined, addedAt });
  }

  const seen = new Set<string>();
  const deduped: WishlistBreed[] = [];
  for (const item of mapped) {
    const key = item.href;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  deduped.sort((a, b) => b.addedAt - a.addedAt);
  return deduped;
}

export function loadWishlist(): WishlistBreed[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return normalize(safeParse(raw));
}

export function saveWishlist(items: WishlistBreed[]) {
  if (!isBrowser()) return;
  try {
    const normalized = normalize(items);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent<WishlistBreed[]>(EVENT_NAME, { detail: normalized }));
  } catch {
    return;
  }
}

export function isWishlisted(href: string): boolean {
  const normalizedHref = normalizeWishlistHref(href);
  if (!normalizedHref) return false;
  const items = loadWishlist();
  return items.some((i) => i.href === normalizedHref);
}

export function toggleWishlistItem(item: { name: string; href: string }): WishlistBreed[] {
  const name = normalizeName(item.name);
  const href = normalizeWishlistHref(item.href);
  if (!name || !href) return loadWishlist();

  const current = loadWishlist();
  const exists = current.some((i) => i.href === href);
  const next = exists
    ? current.filter((i) => i.href !== href)
    : [{ name, href, addedAt: Date.now() }, ...current];

  saveWishlist(next);
  return next;
}

export function upsertWishlistItem(item: { name: string; href: string; imageSrc?: string }): WishlistBreed[] {
  const name = normalizeName(item.name);
  const href = normalizeWishlistHref(item.href);
  const imageSrc = (item.imageSrc || "").trim();
  if (!name || !href) return loadWishlist();

  const current = loadWishlist();
  const existing = current.find((i) => i.href === href);
  const next: WishlistBreed[] = existing
    ? current.map((i) => (i.href === href ? { ...i, name, imageSrc: imageSrc || i.imageSrc } : i))
    : [{ name, href, imageSrc: imageSrc || undefined, addedAt: Date.now() }, ...current];

  saveWishlist(next);
  return next;
}

export function removeWishlistItem(href: string): WishlistBreed[] {
  const normalizedHref = normalizeWishlistHref(href);
  if (!normalizedHref) return loadWishlist();
  const current = loadWishlist();
  const next = current.filter((i) => i.href !== normalizedHref);
  saveWishlist(next);
  return next;
}

export function subscribeWishlist(onChange: (items: WishlistBreed[]) => void) {
  if (!isBrowser()) return () => null;

  const handleCustom = (e: Event) => {
    const ce = e as CustomEvent<WishlistBreed[]>;
    onChange(normalize(ce.detail));
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    onChange(loadWishlist());
  };

  window.addEventListener(EVENT_NAME, handleCustom as EventListener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustom as EventListener);
    window.removeEventListener("storage", handleStorage);
  };
}
