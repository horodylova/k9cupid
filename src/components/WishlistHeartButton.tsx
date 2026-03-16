"use client";

import { useEffect, useMemo, useState } from "react";
import { isWishlisted, removeWishlistItem, subscribeWishlist, upsertWishlistItem } from "@/lib/wishlistStorage";

type WishlistHeartButtonProps = {
  name: string;
  href: string;
  imageSrc?: string;
  className?: string;
};

export default function WishlistHeartButton({ name, href, imageSrc, className }: WishlistHeartButtonProps) {
  const [active, setActive] = useState(false);

  const payload = useMemo(() => ({ name, href, imageSrc }), [name, href, imageSrc]);

  useEffect(() => {
    const initialActive = isWishlisted(href);
    setActive(initialActive);
    if (initialActive && imageSrc) {
      upsertWishlistItem(payload);
    }
    return subscribeWishlist((items) => setActive(items.some((i) => i.href === href)));
  }, [href, imageSrc, payload]);

  const label = active ? "Remove from wishlist" : "Add to wishlist";
  const icon = active ? "mdi:heart" : "mdi:heart-outline";

  return (
    <button
      type="button"
      className={`wishlist-heart-button${active ? " is-active" : ""}${className ? ` ${className}` : ""}`}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) {
          removeWishlistItem(href);
          return;
        }
        upsertWishlistItem(payload);
      }}
    >
      <iconify-icon icon={icon} className="wishlist-heart-icon"></iconify-icon>
    </button>
  );
}
