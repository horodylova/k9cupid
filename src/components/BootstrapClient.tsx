"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    void import("bootstrap/js/dist/offcanvas");
    void import("bootstrap/js/dist/collapse");
    void import("bootstrap/js/dist/dropdown");
    void import("bootstrap/js/dist/tab");
  }, []);

  return null;
}
