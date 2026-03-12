"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

export default function NewsletterSubscribeForm() {
  const alertImage = "/Dog%20in%20car-Picsart-BackgroundRemover.png";

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const isEmailValid = useMemo(() => {
    const normalized = email.trim();
    if (normalized.length < 3 || normalized.length > 254) return false;
    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return basic.test(normalized);
  }, [email]);

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setStatus(null);
    const normalized = email.trim();
    if (!normalized || !isEmailValid) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, source: "footer" }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus({
          type: "success",
          message: "You’re subscribed. Weekly updates will land in your inbox.",
        });
        setEmail("");
      } else {
        setStatus({ type: "error", message: data.error || "Subscription failed." });
      }
    } catch {
      setStatus({ type: "error", message: "Subscription failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="search-bar border rounded-pill border-dark-subtle px-2">
        <form className="text-center d-flex align-items-center" onSubmit={handleSubscribe} noValidate>
          <input
            type="email"
            className="form-control border-0 bg-transparent"
            placeholder="Enter your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            aria-label="Email address"
          />
          <button
            type="submit"
            className="btn p-0 border-0 bg-transparent"
            disabled={submitting}
            aria-label="Subscribe"
          >
            <iconify-icon className="send-icon" icon="tabler:location-filled"></iconify-icon>
          </button>
        </form>
      </div>
      {status && (
        <div className={`custom-alert mt-3 ${status.type === "success" ? "custom-alert--success" : "custom-alert--error"}`}>
          <div className="custom-alert__media">
            <Image
              src={alertImage}
              alt="k9cupid"
              className="custom-alert__img"
              width={56}
              height={56}
            />
          </div>
          <div className="custom-alert__content">
            <h5 className="custom-alert__title">
              {status.type === "success" ? "You’re subscribed!" : "Something went wrong"}
            </h5>
            <p className="custom-alert__text">{status.message}</p>
          </div>
        </div>
      )}
    </>
  );
}
