"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    plausible?: ((event: string, options?: Record<string, unknown>) => void) & {
      q?: unknown[];
      o?: Record<string, unknown>;
      init?: (options?: Record<string, unknown>) => void;
    };
  }
}
const preferenceKey = "kint-audience-measurement";
export function Analytics() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const update = () => {
      try {
        const enabled = localStorage.getItem(preferenceKey) === "allow";
        if (enabled && !window.plausible) {
          const tracker: NonNullable<Window["plausible"]> = function (
            ...args: unknown[]
          ) {
            (tracker.q = tracker.q || []).push(args);
          };
          tracker.init = (options = {}) => {
            tracker.o = options;
          };
          tracker.init();
          window.plausible = tracker;
        }
        setAllowed(enabled);
      } catch {
        setAllowed(false);
      }
    };
    update();
    window.addEventListener("kint-privacy-change", update);
    return () => window.removeEventListener("kint-privacy-change", update);
  }, []);
  const raw = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;
  let url: URL;
  try {
    url = new URL(raw || "");
  } catch {
    return null;
  }
  if (!allowed || url.protocol !== "https:" || url.username || url.password)
    return null;
  return (
    <Script
      src={url.href}
      data-domain={
        process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || "kintconsult.com"
      }
      strategy="afterInteractive"
    />
  );
}

export function AnalyticsPreferences() {
  const [preference, setPreference] = useState("unset");
  useEffect(() => {
    try {
      setPreference(localStorage.getItem(preferenceKey) || "unset");
    } catch {}
  }, []);
  function choose(value: string) {
    try {
      localStorage.setItem(preferenceKey, value);
    } catch {
      return;
    }
    // Reload on withdrawal so an already loaded provider stops immediately.
    if (value === "deny") {
      window.location.reload();
      return;
    }
    setPreference(value);
    window.dispatchEvent(new Event("kint-privacy-change"));
  }
  if (!process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL)
    return <p>Optional audience measurement is currently disabled.</p>;
  return (
    <section>
      <h2>Audience measurement preference</h2>
      <p>
        Optional, anonymous page and successful-enquiry counts help us improve
        the website. Form contents are excluded. Your preference is stored on
        this device.
      </p>
      <p role="status">
        Current preference:{" "}
        {preference === "allow"
          ? "allowed"
          : preference === "deny"
            ? "declined"
            : "not selected; measurement is off"}
        .
      </p>
      <div className="hero-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => choose("allow")}
        >
          Allow measurement
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => choose("deny")}
        >
          Decline measurement
        </button>
      </div>
    </section>
  );
}

export function trackEnquiryAccepted() {
  try {
    if (localStorage.getItem(preferenceKey) === "allow")
      window.plausible?.("Enquiry accepted");
  } catch {
    /* Measurement must never interrupt the enquiry. */
  }
}
