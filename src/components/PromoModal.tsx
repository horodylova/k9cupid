"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PromoModal.module.css";
import NewsletterSubscribeForm from "@/components/NewsletterSubscribeForm";

const TIMEOUT_MS = 60000;
const STORAGE_KEY = "k9PromoVideoLastSeen";
const SHOW_AGAIN_MS = 7 * 24 * 60 * 60 * 1000;
const VIDEO_SRC = "/Every%20dog.mp4";
const ANIMATION_MS = 220;

export default function PromoModal() {
  const enabled = process.env.NEXT_PUBLIC_PROMO_VIDEO_ENABLED === "true";
  const [isOpen, setIsOpen] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const scheduledRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const schedule = () => {
      if (scheduledRef.current) return;
      scheduledRef.current = true;

      const canShow = () => {
        try {
          const lastSeen = localStorage.getItem(STORAGE_KEY);
          const now = Date.now();
          if (!lastSeen) return true;
          const last = Number(lastSeen);
          if (!Number.isFinite(last)) return true;
          return now - last > SHOW_AGAIN_MS;
        } catch {
          return true;
        }
      };

      if (!canShow()) return;

      timeoutRef.current = window.setTimeout(() => {
        setIsOpen(true);
        setIsVisible(true);
        try {
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
        } catch {
        }
      }, TIMEOUT_MS);
    };

    const onInteract = () => {
      schedule();
      detach();
    };

    const detach = () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };

    window.addEventListener("pointerdown", onInteract, { passive: true });
    window.addEventListener("keydown", onInteract);
    window.addEventListener("scroll", onInteract, { passive: true });
    window.addEventListener("touchstart", onInteract, { passive: true });

    return () => {
      detach();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (!isOpen) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => setShowReplay(true));
  }, [enabled, isOpen]);

  const close = () => {
    setIsVisible(false);
    window.setTimeout(() => setIsOpen(false), ANIMATION_MS);
    setShowReplay(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => null);
    setShowReplay(false);
  };

  if (!enabled || !isOpen) return null;

  return (
    <div
      className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Promo video"
    >
      <div className={`${styles.modal} ${isVisible ? styles.modalVisible : ""}`}>
        <button type="button" className={styles.closeButton} onClick={close} aria-label="Close promo">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            src={VIDEO_SRC}
            playsInline
            muted
            onEnded={() => setShowReplay(true)}
          />

          <div className={`${styles.replayOverlay} ${showReplay ? styles.replayOverlayVisible : ""}`}>
            <div className={styles.ctaColumn}>
              <div className={styles.subscribeForm}>
                <NewsletterSubscribeForm source="promo_modal" variant="button" placeholder="Email address" successBehavior="inline" />
              </div>

              <button type="button" className={styles.replayButton} onClick={replay}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                Watch again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
