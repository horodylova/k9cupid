"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  source?: string;
  variant?: "icon" | "button";
  placeholder?: string;
  successBehavior?: "toast" | "inline";
};

type ToastState = {
  type: "success" | "error";
  title: string;
  message: string;
};

export default function NewsletterSubscribeForm({
  source = "footer",
  variant = "icon",
  placeholder = "Enter your email here",
  successBehavior = "toast",
}: Props) {
  const alertImage = "/Dog%20in%20car-Picsart-BackgroundRemover.png";

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [inlineSuccess, setInlineSuccess] = useState<{ title: string; message: string } | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const removeTimeoutRef = useRef<number | null>(null);

  const isEmailValid = useMemo(() => {
    const normalized = email.trim();
    if (normalized.length < 3 || normalized.length > 254) return false;
    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return basic.test(normalized);
  }, [email]);

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setToast(null);
    const normalized = email.trim();
    if (!normalized || !isEmailValid) {
      setToast({
        type: "error",
        title: "Something went wrong",
        message: "Please enter a valid email address.",
      });
      setToastVisible(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, source }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; state?: string };
      if (res.ok && data.ok) {
        const isAlready = data.state === "already_subscribed";
        const title = isAlready ? "You’re already subscribed" : "You’re subscribed!";
        const message = isAlready
          ? "You’re already on the list. Weekly updates will land in your inbox."
          : "Weekly updates will land in your inbox.";

        setToast({ type: "success", title, message });
        setToastVisible(true);

        if (successBehavior === "inline") {
          setInlineSuccess({
            title: "Thanks for subscribing",
            message: "You’ll get our weekly dog guides and new blog posts in your inbox.",
          });
        }

        setEmail("");
      } else {
        setToast({
          type: "error",
          title: "Something went wrong",
          message: data.error || "Subscription failed.",
        });
        setToastVisible(true);
      }
    } catch {
      setToast({
        type: "error",
        title: "Something went wrong",
        message: "Subscription failed.",
      });
      setToastVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!toast) return;

    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    if (removeTimeoutRef.current) window.clearTimeout(removeTimeoutRef.current);

    setToastVisible(true);
    hideTimeoutRef.current = window.setTimeout(() => {
      setToastVisible(false);
      removeTimeoutRef.current = window.setTimeout(() => setToast(null), 280);
    }, 3600);

    return () => {
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
      if (removeTimeoutRef.current) window.clearTimeout(removeTimeoutRef.current);
    };
  }, [toast]);

  return (
    <>
      {successBehavior === "inline" && inlineSuccess ? (
        <div className="custom-alert custom-alert--success">
          <div className="custom-alert__media">
            <Image src={alertImage} alt="k9cupid" className="custom-alert__img" width={56} height={56} />
          </div>
          <div className="custom-alert__content">
            <h5 className="custom-alert__title">{inlineSuccess.title}</h5>
            <p className="custom-alert__text">{inlineSuccess.message}</p>
          </div>
          <button
            type="button"
            className="btn btn-outline-dark rounded-pill ms-auto px-3 py-2"
            onClick={() => setInlineSuccess(null)}
          >
            Use another email
          </button>
        </div>
      ) : (
        <div
          className="search-bar border rounded-pill border-dark-subtle px-2"
          style={{ overflow: "hidden", background: "#fff", padding: 4 }}
        >
          <form
            className="text-center d-flex align-items-center"
            onSubmit={handleSubscribe}
            noValidate
            style={{ width: "100%", position: "relative" }}
          >
            <input
              type="email"
              className="form-control border-0 bg-transparent"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              aria-label="Email address"
              data-newsletter-email="true"
              style={{
                flex: 1,
                borderRadius: 9999,
                outline: "none",
                boxShadow: "none",
                backgroundColor: "#fff",
                padding: "0.75rem 1rem",
                height: "auto",
                paddingRight: variant === "button" ? "10.5rem" : "1rem",
              }}
            />
            {variant === "button" ? (
              <button
                type="submit"
                className="btn btn-dark rounded-pill px-4 py-2"
                disabled={submitting}
                style={{
                  position: "absolute",
                  right: 4,
                  top: 4,
                  bottom: 4,
                  height: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 9999,
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </button>
            ) : (
              <button type="submit" className="btn p-0 border-0 bg-transparent" disabled={submitting} aria-label="Subscribe">
                <iconify-icon className="send-icon" icon="tabler:location-filled"></iconify-icon>
              </button>
            )}
          </form>
        </div>
      )}

      {toast && (
        <div
          className="position-fixed p-3"
          style={{
            right: 0,
            bottom: 0,
            zIndex: 1100,
            width: "min(520px, calc(100vw - 32px))",
            opacity: toastVisible ? 1 : 0,
            transform: toastVisible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 220ms ease, transform 220ms ease",
            pointerEvents: toastVisible ? "auto" : "none",
          }}
          role="status"
          aria-live="polite"
        >
          <div className={`custom-alert ${toast.type === "success" ? "custom-alert--success" : "custom-alert--error"}`} style={{ alignItems: "flex-start" }}>
            <div className="custom-alert__media">
              <Image src={alertImage} alt="k9cupid" className="custom-alert__img" width={56} height={56} />
            </div>
            <div className="custom-alert__content">
              <h5 className="custom-alert__title">{toast.title}</h5>
              <p className="custom-alert__text">{toast.message}</p>
            </div>
            <button
              type="button"
              className="btn p-0 border-0 bg-transparent"
              style={{ marginLeft: "0.75rem", color: "#111827", lineHeight: 1 }}
              aria-label="Close"
              onClick={() => {
                setToastVisible(false);
                window.setTimeout(() => setToast(null), 280);
              }}
            >
              <iconify-icon icon="ic:baseline-close" className="fs-4"></iconify-icon>
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        input[data-newsletter-email]:-webkit-autofill,
        input[data-newsletter-email]:-webkit-autofill:hover,
        input[data-newsletter-email]:-webkit-autofill:focus,
        input[data-newsletter-email]:-webkit-autofill:active {
          -webkit-text-fill-color: #111827;
          box-shadow: 0 0 0px 1000px #ffffff inset;
          transition: background-color 9999s ease-out 0s;
        }

        input[data-newsletter-email]:autofill {
          box-shadow: 0 0 0px 1000px #ffffff inset;
        }
      `}</style>
    </>
  );
}
