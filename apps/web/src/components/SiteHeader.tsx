"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useBlind } from "./BlindShell";
import NavTabs from "./NavTabs";
import PanelToggle from "./PanelToggle";
import ThemeSlider from "./ThemeSlider";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The site header. It doesn't move itself — it rides the blind with the rest of
 * the page, and only reports its height so the blind knows where to stop.
 */
export default function SiteHeader() {
  const { open, toggle, reportHeaderHeight } = useBlind();
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => reportHeaderHeight(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [reportHeaderHeight]);

  return (
    <header
      ref={ref}
      className="relative flex flex-col items-center gap-24 pt-48 pb-24"
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
      <div className="absolute bottom-24 left-24 md:left-48 lg:left-120">
        <PanelToggle open={open} onToggle={toggle} />
      </div>

      <div className="absolute right-24 bottom-24 md:right-48 lg:right-120">
        <ThemeSlider />
      </div>
    </header>
  );
}
