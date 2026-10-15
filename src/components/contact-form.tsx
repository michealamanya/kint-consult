"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { enquiryAreas } from "@/data/site";
import { validateEnquiry } from "@/lib/contact-validation.mjs";
import { Arrow } from "./ui";
import { trackEnquiryAccepted } from "./analytics";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}

export function ContactForm({
  deliveryReady,
  initialArea,
}: {
  deliveryReady: boolean;
  initialArea: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (
      !scriptReady ||
      !deliveryReady ||
      !siteKey ||
      !captchaRef.current ||
      !window.turnstile
    )
      return;
    const id = window.turnstile.render(captchaRef.current, {
      sitekey: siteKey,
      action: "contact",
      size: "compact",
      theme: "light",
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
    widgetRef.current = id;
    return () => {
      window.turnstile?.remove(id);
      widgetRef.current = null;
    };
  }, [scriptReady, deliveryReady, siteKey]);

  function saveDraft(value: {
    name: string;
    email: string;
    phone?: string;
    organisation: string;
    area: string;
    message: string;
  }) {
    const text = `KINT Consult — Enquiry draft\n\nName: ${value.name}\nEmail: ${value.email}\nPhone: ${value.phone || "Not supplied"}\nOrganisation: ${value.organisation || "Not supplied"}\nArea: ${value.area}\n\n${value.message}\n\nThis draft has not been sent to KINT.`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "kint-enquiry-draft.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setFailed(false);
    const data = new FormData(event.currentTarget);
    const input = {
      ...Object.fromEntries(data),
      consent: data.get("consent") === "on",
      token,
    };
    const checked = validateEnquiry(input, enquiryAreas);
    setErrors(checked.errors);
    if (!checked.value) {
      const field = Object.keys(checked.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
      return;
    }
    if (!deliveryReady) {
      saveDraft(checked.value);
      setMessage(
        "Your enquiry draft has been saved to your device. It has not been sent to KINT.",
      );
      return;
    }
    if (siteKey && !token) {
      setFailed(true);
      setMessage("Please complete the spam protection check.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(40000),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors || {});
        throw new Error(result.error || "The enquiry could not be delivered.");
      }
      setMessage(result.message);
      trackEnquiryAccepted();
      formRef.current?.reset();
    } catch (error) {
      setFailed(true);
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "Delivery could not be confirmed. Please save your draft before trying again.",
      );
    } finally {
      setPending(false);
      setToken("");
      if (widgetRef.current) window.turnstile?.reset(widgetRef.current);
    }
  }

  function fieldError(field: string) {
    return errors[field] ? (
      <span className="field-error" id={`${field}-error`}>
        {errors[field]}
      </span>
    ) : null;
  }
  function errorProps(field: string) {
    return {
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": errors[field] ? `${field}-error` : undefined,
    };
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} ref={formRef} noValidate>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Full name *</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            maxLength={100}
            required
            {...errorProps("name")}
          />
          {fieldError("name")}
        </div>
        <div className="form-field">
          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@organisation.com"
            maxLength={254}
            required
            {...errorProps("email")}
          />
          {fieldError("email")}
        </div>
        <div className="form-field full">
          <label htmlFor="phone">Phone number (optional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            {...errorProps("phone")}
          />
          {fieldError("phone")}
        </div>
        <div className="form-field full">
          <label htmlFor="organisation">Organisation</label>
          <input
            id="organisation"
            name="organisation"
            autoComplete="organization"
            placeholder="Company or institution"
            maxLength={150}
            {...errorProps("organisation")}
          />
          {fieldError("organisation")}
        </div>
        <div className="form-field full">
          <label htmlFor="area">Area of interest *</label>
          <select
            id="area"
            name="area"
            defaultValue={enquiryAreas.includes(initialArea) ? initialArea : ""}
            required
            {...errorProps("area")}
          >
            <option value="" disabled>
              Select an area
            </option>
            {enquiryAreas.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
          {fieldError("area")}
        </div>
        <div className="form-field full">
          <label htmlFor="message">How can we help? *</label>
          <textarea
            id="message"
            name="message"
            placeholder="Tell us about your requirements, existing systems or research interests."
            minLength={20}
            maxLength={5000}
            required
            {...errorProps("message")}
          />
          {fieldError("message")}
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="consent">
        <input
          type="checkbox"
          name="consent"
          required
          {...errorProps("consent")}
        />
        <span>
          I have read the <Link href="/privacy">privacy notice</Link> and
          understand how my enquiry information will be used. *
        </span>
      </label>
      {fieldError("consent")}
      {deliveryReady && siteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={() => setScriptReady(true)}
          />
          <div ref={captchaRef} className="mb-6" />
        </>
      )}
      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          className="button button-primary"
          disabled={pending}
        >
          {pending
            ? "Sending enquiry…"
            : deliveryReady
              ? "Send enquiry"
              : "Save enquiry draft"}
          <Arrow />
        </button>
        {deliveryReady && (
          <button
            type="button"
            className="text-link"
            onClick={() => {
              const data = new FormData(formRef.current!);
              saveDraft({
                name: String(data.get("name") || ""),
                email: String(data.get("email") || ""),
                phone: String(data.get("phone") || ""),
                organisation: String(data.get("organisation") || ""),
                area: String(data.get("area") || ""),
                message: String(data.get("message") || ""),
              });
            }}
          >
            Save a draft
          </button>
        )}
      </div>
      <p className="form-disclaimer">
        {deliveryReady
          ? "Please avoid sharing passwords, credentials or confidential project information."
          : "Save a draft to your device, then email it using the contact details on this page. Saving a draft does not send it to KINT."}
      </p>
      {errors.form && (
        <p className="field-error mt-4" role="alert">
          {errors.form}
        </p>
      )}
      {message && (
        <p
          className={`form-message ${failed ? "error" : ""}`}
          role={failed ? "alert" : "status"}
        >
          {message}
        </p>
      )}
      <noscript>
        <p className="form-disclaimer">
          This enquiry form requires JavaScript. Please use the verified contact
          details shown on this page when available.
        </p>
      </noscript>
    </form>
  );
}
