"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AboutPanel from "./AboutPanel";
import NavTabs from "./NavTabs";
import ThemeSlider from "./ThemeSlider";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The site header, plus the panel that drops out from behind it.
 *
 * Opening slides the header down to the foot of the viewport and reveals the
 * about panel in the space it leaves. The header stays a normal element in the
 * flow and is moved with a transform — going `fixed` would either make it stick
 * while scrolling when closed, or need a spacer to stop the page jumping. The
 * page is scrolled to the top first so "the foot of the viewport" is a single
 * fixed distance rather than something that shifts with the scroll position.
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(152);
  const headerRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The panel covers the viewport, so the page behind it must not scroll.
  useEffect(() => {
    if (!open) return;
    window.scrollTo({ top: 0 });
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shift = `translateY(calc(100dvh - ${height}px))`;

  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-x-0 top-0 z-40 overflow-hidden bg-paper ${
          open ? "" : "pointer-events-none"
        }`}
        style={{ height: `calc(100dvh - ${height}px)` }}
      >
        <div
          className="h-full transition-transform duration-500 ease-out"
          style={{ transform: open ? "translateY(0)" : "translateY(-100%)" }}
        >
          <AboutPanel />
        </div>
      </div>

      <header
        ref={headerRef}
        className="relative z-50 flex flex-col items-center gap-24 bg-paper pt-48 pb-24 transition-transform duration-500 ease-out"
        style={{ transform: open ? shift : undefined }}
      >
        <Link
          href="/"
          className="text-[15px] leading-none font-bold uppercase tracking-[0.02em] text-ink"
        >
          Jacob Offenberg
        </Link>

        <NavTabs />

        {/* Both sit on the tabs' line, absolute so the wordmark and tabs stay
            centred on the page rather than on the space left between them. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="absolute bottom-24 left-24 flex h-[41px] items-center rounded-pill bg-ink/10 px-16 text-xs leading-[1.5] text-ink shadow-card transition-[background-color,box-shadow] duration-200 hover:bg-ink/20 hover:shadow-card-hover md:left-48 lg:left-120"
        >
          Portfolio
        </button>

        <div className="absolute right-24 bottom-24 md:right-48 lg:right-120">
          <ThemeSlider />
        </div>
      </header>
    </>
  );
}
