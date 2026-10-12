"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/site";
import { Arrow } from "./ui";

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="KINT Consult Home">
      <Image
        src="/images/kint-logo.jpg"
        alt="KINT"
        width={105}
        height={70}
        priority
        className="brand-logo"
      />
      <span className="wordmark-sub">CONSULT LIMITED</span>
    </Link>
  );
}
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-inner">
        <Wordmark />
        <nav
          aria-label="Main navigation"
          id="main-navigation"
          className={`main-nav ${open ? "is-open" : ""}`}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="header-contact"
            onClick={() => setOpen(false)}
          >
            Work with us
            <Arrow diagonal />
          </Link>
        </nav>
        <button
          type="button"
          className="menu-toggle"
          ref={toggleRef}
          aria-controls="main-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <span
            className={`menu-lines ${open ? "is-open" : ""}`}
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  );
}
