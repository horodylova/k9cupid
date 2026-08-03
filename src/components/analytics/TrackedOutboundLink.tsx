"use client";

import { AnchorHTMLAttributes, MouseEvent, ReactNode, useMemo } from "react";
import { track } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "href" | "children"> & {
  href: string;
  children: ReactNode;
  eventName?: "outbound_click" | "shelter_outbound_click";
  params?: Record<string, string | number | boolean | null | undefined>;
};

export default function TrackedOutboundLink({ href, children, eventName = "outbound_click", params, ...rest }: Props) {
  const destination = useMemo(() => href, [href]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    if (isModified) return;
    track(eventName, { destination_url: destination, ...params });
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
