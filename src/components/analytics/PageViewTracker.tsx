"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const last = useRef<string | null>(null);

  useEffect(() => {
    const qs = searchParams?.toString();
    const pagePath = pathname + (qs ? `?${qs}` : "");

    if (last.current === pagePath) return;
    last.current = pagePath;

    track("page_view", { page_path: pagePath, source: "site" });
  }, [pathname, searchParams]);

  return null;
}

