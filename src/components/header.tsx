"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation, companyNavigation } from "@/data/site";
import { Arrow } from "./ui";

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="KINT Consult Limited home">
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
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLButtonElement>(null);
  const [overHero, setOverHero] = useState(pathname === "/");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
    const hero = pathname === "/" ? document.querySelector(".hero") : null;
    if (!hero) {
      setOverHero(false);
      return;
    }
    const update = () =>
      setOverHero(
        hero.getBoundingClientRect().bottom >
          (headerRef.current?.offsetHeight ?? 128),
      );
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);
  useEffect(() => {
    if (!open && !moreOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (moreOpen) {
          setMoreOpen(false);
          moreRef.current?.focus();
        } else {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }
    }
    function outside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setMoreOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open, moreOpen]);
  return (
    <header className="site-header" data-over-hero={overHero} ref={headerRef}>
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
          <div
            className="header-more"
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              )
                setMoreOpen(false);
            }}
          >
            <button
              ref={moreRef}
              type="button"
              className="header-more-toggle"
              aria-expanded={moreOpen}
              aria-controls="company-navigation"
              data-active={companyNavigation.some((item) =>
                pathname.startsWith(item.href),
              )}
              onClick={() => setMoreOpen(!moreOpen)}
            >
              More <span aria-hidden="true">⌄</span>
            </button>
            <div
              className="header-more-links"
              id="company-navigation"
              hidden={!moreOpen}
            >
              {companyNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    pathname.startsWith(item.href) ? "page" : undefined
                  }
                  onClick={() => {
                    setMoreOpen(false);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Arrow diagonal />
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/contact"
            className="header-contact"
            onClick={() => setOpen(false)}
          >
            Contact
            <Arrow diagonal />
          </Link>
        </nav>
        <button
          type="button"
          className="menu-toggle"
          ref={toggleRef}
          aria-controls="main-navigation"
          aria-expanded={open}
          onClick={() => {
            setOpen(!open);
            setMoreOpen(false);
          }}
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
