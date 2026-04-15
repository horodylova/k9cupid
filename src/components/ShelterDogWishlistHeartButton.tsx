"use client";

import { useEffect, useMemo, useState } from "react";
import {
  isShelterDogWishlisted,
  normalizeShelterDogHref,
  removeShelterDogWishlistItem,
  subscribeShelterDogWishlist,
  upsertShelterDogWishlistItem,
} from "@/lib/shelterDogWishlistStorage";

type ShelterDogWishlistHeartButtonProps = {
  id: string;
  name: string;
  href: string;
  imageSrc?: string;
  orgName?: string;
  citystate?: string;
  className?: string;
  variant?: "card" | "inline";
};

export default function ShelterDogWishlistHeartButton({
  id,
  name,
  href,
  imageSrc,
  orgName,
  citystate,
  className,
  variant = "card",
}: ShelterDogWishlistHeartButtonProps) {
  const [active, setActive] = useState(false);

  const normalizedHref = useMemo(() => normalizeShelterDogHref(href), [href]);
  const normalizedName = useMemo(() => name.trim().replace(/\s+/g, " "), [name]);
  const payload = useMemo(
    () => ({ id, name: normalizedName, href: normalizedHref, imageSrc, orgName, citystate }),
    [id, normalizedName, normalizedHref, imageSrc, orgName, citystate]
  );

  useEffect(() => {
    const initialActive = isShelterDogWishlisted(normalizedHref);
    setActive(initialActive);
    if (initialActive && (imageSrc || orgName || citystate)) {
      upsertShelterDogWishlistItem(payload);
    }
    return subscribeShelterDogWishlist((items) => setActive(items.some((i) => i.href === normalizedHref)));
  }, [normalizedHref, imageSrc, orgName, citystate, payload]);

  const label = active ? "Remove from wishlist" : "Add to wishlist";
  const icon = active ? "mdi:heart" : "mdi:heart-outline";

  return (
    <button
      type="button"
      className={`wishlist-heart-button${active ? " is-active" : ""}${variant === "inline" ? " is-inline" : ""}${className ? ` ${className}` : ""}`}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) {
          removeShelterDogWishlistItem(normalizedHref);
          return;
        }
        upsertShelterDogWishlistItem(payload);
      }}
    >
      <iconify-icon icon={icon} className="wishlist-heart-icon"></iconify-icon>
    </button>
  );
}

