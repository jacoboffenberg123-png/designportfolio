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
      className="relative flex flex-col items-center gap-24 px-24 pt-48 pb-24 md:px-0"
    >
      {/* On phones the three controls share the top line, because the tabs need
          the whole of the next one — a 148px slider and a 159px tab group can't
          both sit beside centred tabs at 390px without overlapping them.
          `md:contents` dissolves this row above that width, handing the children
          straight back to the header so the absolute placement below applies. */}
      <div className="flex w-full items-center justify-between gap-16 md:contents">
        <div className="md:absolute md:bottom-24 md:left-48 lg:left-120">
          <PanelToggle open={open} onToggle={toggle} />
        </div>

        <Link
          href="/"
          className="text-[15px] leading-none font-bold uppercase tracking-[0.02em] text-ink"
        >
          {/* Initials on phones — the full name would leave the controls no room,
              and the project pages already use this mark. */}
          <span className="md:hidden">J.O</span>
          <span className="hidden md:inline">Jacob Offenberg</span>
        </Link>

        <div className="md:absolute md:right-48 md:bottom-24 lg:right-120">
          <ThemeSlider />
        </div>
      </div>

      <NavTabs />
    </header>
  );
}
