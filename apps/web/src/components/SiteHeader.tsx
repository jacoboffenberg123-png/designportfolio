"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useBlind } from "./BlindShell";
import NavTabs from "./NavTabs";
import PanelToggle from "./PanelToggle";
import ThemeSlider from "./ThemeSlider";
import ThemeToggle from "./ThemeToggle";

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
      {/* Phones get one line: button, mark, tabs, switch. `md:contents`
          dissolves the row above that width, handing the children back to the
          header so the wordmark and tabs centre on the page and the controls
          take their absolute places. */}
      <div className="flex w-full items-center justify-between gap-8 md:contents">
        <div className="md:absolute md:bottom-24 md:left-48 lg:left-120">
          <PanelToggle open={open} onToggle={toggle} />
        </div>

        <Link
          href="/"
          className="shrink-0 text-[13px] leading-none font-bold uppercase tracking-[0.02em] text-ink md:text-[15px]"
        >
          {/* Initials on phones — the full name would leave the rest no room,
              and the project pages already use this mark. */}
          <span className="md:hidden">J.O</span>
          <span className="hidden md:inline">Jacob Offenberg</span>
        </Link>

        <NavTabs />

        {/* A 148px track can't share a phone line with the rest, so below md the
            same setting becomes a round switch. */}
        <div className="md:hidden">
          <ThemeToggle />
        </div>
        <div className="hidden md:absolute md:right-48 md:bottom-24 md:block lg:right-120">
          <ThemeSlider />
        </div>
      </div>
    </header>
  );
}
