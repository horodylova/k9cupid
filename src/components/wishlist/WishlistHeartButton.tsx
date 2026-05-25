"use client";

import { useEffect, useMemo, useState } from "react";
import { isWishlisted, normalizeWishlistHref, removeWishlistItem, subscribeWishlist, upsertWishlistItem } from "@/lib/wishlistStorage";
import { track } from "@/lib/analytics";

type WishlistHeartButtonProps = {
  name: string;
  href: string;
  imageSrc?: string;
  className?: string;
  variant?: "card" | "inline";
};

export default function WishlistHeartButton({
  name,
  href,
  imageSrc,
  className,
  variant = "card",
}: WishlistHeartButtonProps) {
  const [active, setActive] = useState(false);

  const normalizedHref = useMemo(() => normalizeWishlistHref(href), [href]);
  const normalizedName = useMemo(() => name.trim().replace(/\s+/g, " "), [name]);
  const payload = useMemo(
    () => ({ name: normalizedName, href: normalizedHref, imageSrc }),
    [normalizedName, normalizedHref, imageSrc]
  );

  useEffect(() => {
    const initialActive = isWishlisted(normalizedHref);
    setActive(initialActive);
    if (initialActive && imageSrc) {
      upsertWishlistItem(payload);
    }
    return subscribeWishlist((items) => setActive(items.some((i) => i.href === normalizedHref)));
  }, [normalizedHref, imageSrc, payload]);

  const label = active ? "Remove from wishlist" : "Add to wishlist";
  const icon = active ? "mdi:heart" : "mdi:heart-outline";

  const itemType = normalizedHref.startsWith("/breeds/")
    ? "breed"
    : normalizedHref.startsWith("/shelters/dogs/")
      ? "shelter_dog"
      : "unknown";

  return (
    <button
      type="button"
      className={`wishlist-heart-button${active ? " is-active" : ""}${variant === "inline" ? " is-inline" : ""}${className ? ` ${className}` : ""}`}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) {
          removeWishlistItem(normalizedHref);
          track("wishlist_remove", { item_type: itemType, item_name: normalizedName, item_href: normalizedHref });
          return;
        }
        upsertWishlistItem(payload);
        track("wishlist_add", { item_type: itemType, item_name: normalizedName, item_href: normalizedHref });
      }}
    >
      <iconify-icon icon={icon} className="wishlist-heart-icon"></iconify-icon>
    </button>
  );
}
