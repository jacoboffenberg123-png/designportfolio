"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import AboutPanel from "./AboutPanel";
import NavTabs from "./NavTabs";
import ThemeSlider from "./ThemeSlider";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Paper above the panel, so no sub-pixel seam can show at the very top. */
const BLEED = 40;
const EASE = "cubic-bezier(0.5, 0, 0.15, 1)";
const DURATION = 640;

/**
 * The site header, plus the panel that drops out from behind it.
 *
 * The panel and the header are one column that moves with a single transform,
 * rather than two elements animating in step. Two transforms can drift apart
 * mid-flight — even a frame of it opens a gap between them and the page shows
 * through — and no pair of easings can guarantee otherwise.
 *
 * The column is only mounted while the panel is in use. The rest of the time
 * the header is an ordinary element in the flow, so it scrolls away with the
 * page; going fixed permanently would leave 152px of chrome pinned to the top.
 * Opening scrolls to the top first, which is both what makes "the foot of the
 * viewport" a fixed distance and what makes the swap invisible: at scroll 0 the
 * column's closed position is exactly where the in-flow header already sits.
 */
export default function SiteHeader() {
  const [mounted, setMounted] = useState(false); // is the moving column present
  const [slid, setSlid] = useState(false); // where the column is headed
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

  const close = useCallback(() => setSlid(false), []);

  const open = useCallback(() => {
    window.scrollTo({ top: 0 });
    setMounted(true);
    // Two frames: one to get the column painted at its closed position, one to
    // start the transition from it. Without the first, there is nothing to
    // animate away from and the column simply appears open.
    requestAnimationFrame(() => requestAnimationFrame(() => setSlid(true)));
  }, []);

  // The column covers the viewport, so the page behind it must not scroll.
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, close]);

  const bar = (
    <>
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
        onClick={() => (slid ? close() : open())}
        aria-expanded={slid}
        className="absolute bottom-24 left-24 flex h-[41px] items-center rounded-pill bg-ink/10 px-16 text-xs leading-[1.5] text-ink shadow-card transition-[background-color,box-shadow] duration-200 hover:bg-ink/20 hover:shadow-card-hover md:left-48 lg:left-120"
      >
        Portfolio
      </button>

      <div className="absolute right-24 bottom-24 md:right-48 lg:right-120">
        <ThemeSlider />
      </div>
    </>
  );

  const barClass =
    "relative flex flex-col items-center gap-24 bg-paper pt-48 pb-24";

  return (
    <>
      {/* Kept in the flow while the column is up — hidden, but still holding
          its space so the page underneath doesn't shift. */}
      <header
        ref={headerRef}
        className={barClass}
        style={mounted ? { visibility: "hidden" } : undefined}
        aria-hidden={mounted}
        inert={mounted ? true : undefined}
      >
        {bar}
      </header>

      {mounted ? (
        <div
          className="fixed inset-x-0 z-50 flex flex-col"
          style={{
            top: -BLEED,
            height: `calc(100dvh + ${BLEED}px)`,
            transform: slid
              ? "translateY(0)"
              : `translateY(calc(-100dvh + ${height}px))`,
            transition: `transform ${DURATION}ms ${EASE}`,
          }}
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform" && !slid) setMounted(false);
          }}
        >
          <div className="flex-1 overflow-hidden bg-paper" style={{ paddingTop: BLEED }}>
            <AboutPanel />
          </div>
          <header className={barClass}>{bar}</header>
        </div>
      ) : null}
    </>
  );
}
