export type AnalyticsEventName =
  | "page_view"
  | "quiz_complete"
  | "lead"
  | "outbound_click"
  | "filter_apply";

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

const CONSENT_KEY = "cc_consent_v1";

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

  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    const pagePath = window.location.pathname + window.location.search;
    const source = typeof params.source === "string" ? params.source : "site";

    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event,
      ...params,
      page_path: pagePath,
      source,
    });
  } catch {
  }
}

