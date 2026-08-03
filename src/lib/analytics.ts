export type AnalyticsEventName =
  | "page_view"
  | "quiz_complete"
  | "quiz_start"
  | "quiz_abandon"
  | "lead"
  | "outbound_click"
  | "filter_apply"
  | "wishlist_add"
  | "wishlist_remove"
  | "shelter_dog_view"
  | "shelter_outbound_click"
  | "breed_view"
  | "blog_post_view";

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export const CONSENT_KEY = "cc_consent_v1";

const ATTR_INITIAL_KEY = "cc_attr_initial_v1";
const ATTR_LAST_KEY = "cc_attr_last_v1";

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
  landing_page?: string;
  referrer?: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function extractAttributionFromLocation(): Attribution {
  if (!isBrowser()) return {};

  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => {
    const v = params.get(k);
    return v && v.trim() ? v.trim() : undefined;
  };

  const landing = window.location.pathname + window.location.search;
  const referrer = document.referrer || undefined;

  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
    gclid: get("gclid"),
    fbclid: get("fbclid"),
    ttclid: get("ttclid"),
    msclkid: get("msclkid"),
    landing_page: landing,
    referrer,
  };
}

function readStoredAttribution(key: string): Attribution {
  if (!isBrowser()) return {};
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return {};
    return (JSON.parse(raw) as Attribution) || {};
  } catch {
    return {};
  }
}

function writeStoredAttribution(key: string, value: Attribution): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
}

function mergeDefined(base: Attribution, next: Attribution): Attribution {
  const out: Attribution = { ...base };
  (Object.keys(next) as Array<keyof Attribution>).forEach((k) => {
    const v = next[k];
    if (typeof v === "string" && v.trim()) {
      out[k] = v;
    }
  });
  if (next.landing_page) out.landing_page = next.landing_page;
  if (next.referrer) out.referrer = next.referrer;
  return out;
}

export function captureAttribution(): void {
  if (!isBrowser()) return;
  const fromUrl = extractAttributionFromLocation();

  const last = mergeDefined(readStoredAttribution(ATTR_LAST_KEY), fromUrl);
  writeStoredAttribution(ATTR_LAST_KEY, last);

  const existingInitial = readStoredAttribution(ATTR_INITIAL_KEY);
  const hasInitial = Object.keys(existingInitial).some((k) => {
    const v = (existingInitial as Record<string, unknown>)[k];
    return typeof v === "string" && v.length > 0;
  });
  if (!hasInitial) {
    writeStoredAttribution(ATTR_INITIAL_KEY, last);
  }
}

function getAttributionForTracking(): Record<string, string | undefined> {
  const initial = readStoredAttribution(ATTR_INITIAL_KEY);
  const last = readStoredAttribution(ATTR_LAST_KEY);
  return {
    utm_source: last.utm_source,
    utm_medium: last.utm_medium,
    utm_campaign: last.utm_campaign,
    utm_content: last.utm_content,
    utm_term: last.utm_term,
    gclid: last.gclid,
    fbclid: last.fbclid,
    ttclid: last.ttclid,
    msclkid: last.msclkid,
    landing_page: initial.landing_page,
    referrer: initial.referrer,
    utm_source_initial: initial.utm_source,
    utm_medium_initial: initial.utm_medium,
    utm_campaign_initial: initial.utm_campaign,
  };
}

export function hasTrackingConsent(): boolean {
  if (typeof window === "undefined") return false;

  const gpc = (navigator as unknown as { globalPrivacyControl?: boolean })?.globalPrivacyControl === true;
  if (gpc) return false;

  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export function track(event: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (!hasTrackingConsent()) return;

  captureAttribution();

  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    const pagePath = window.location.pathname + window.location.search;
    const source = typeof params.source === "string" ? params.source : "site";
    const attribution = getAttributionForTracking();

    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event,
      ...params,
      ...attribution,
      page_path: pagePath,
      source,
    });
  } catch {
  }
}
