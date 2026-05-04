"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type GalleryImage = {
  id: string;
  src: string;
};

const PLACEHOLDER_SRC = "/No%20photo%20yet.jpg";

function upgradeRescuegroupsWidth(url: string, width: number) {
  try {
    const u = new URL(url);
    if (u.hostname !== "cdn.rescuegroups.org") return url;
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

export default function ShelterDogGallery({
  images,
  fallbackSrc,
  alt,
}: {
  images: GalleryImage[];
  fallbackSrc: string;
  alt: string;
}) {
  const normalized = useMemo(
    () => (images.length > 0 ? images : [{ id: "fallback", src: fallbackSrc }]),
    [images, fallbackSrc]
  );
  const [activeId, setActiveId] = useState(normalized[0]?.id || "fallback");
  const active = normalized.find((x) => x.id === activeId) || normalized[0];
  const isPlaceholder = active.src === PLACEHOLDER_SRC;

  return (
    <>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: "#F9F3EC" }}>
        <div className="position-relative" style={{ width: "100%", aspectRatio: "4 / 3" }}>
          <Image
            src={active.src.startsWith("http") ? upgradeRescuegroupsWidth(active.src, 1400) : active.src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 992px) 100vw, 50vw"
            style={{ objectFit: isPlaceholder ? "cover" : "contain", padding: isPlaceholder ? 0 : 12 }}
            unoptimized
          />
        </div>
      </div>

      {normalized.length > 1 && (
        <div className="row g-3 mt-3">
          {normalized.slice(0, 12).map((p) => {
            const isActive = p.id === active.id;
            return (
              <div key={p.id} className="col-4">
                <button
                  type="button"
                  onClick={() => setActiveId(p.id)}
                  className="p-0 w-100 border-0 bg-transparent"
                  aria-label="Choose photo"
                >
                  <div
                    className="position-relative rounded-3 overflow-hidden"
                    style={{
                      width: "100%",
                      height: 120,
                      background: "#F9F3EC",
                      boxShadow: isActive ? "0 0 0 2px #2F2F2F inset" : "none",
                    }}
                  >
                    <Image
                      src={p.src.startsWith("http") ? upgradeRescuegroupsWidth(p.src, 500) : p.src}
                      alt={alt}
                      fill
                      sizes="(max-width: 992px) 33vw, 180px"
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
