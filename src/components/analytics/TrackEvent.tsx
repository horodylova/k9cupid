"use client";

import { useEffect } from "react";
import { AnalyticsEventName, AnalyticsParams, track } from "@/lib/analytics";

export default function TrackEvent({ event, params }: { event: AnalyticsEventName; params?: AnalyticsParams }) {
  useEffect(() => {
    track(event, params || {});
  }, [event, params]);

  return null;
}
