"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  // Only the top padding shrinks once you leave the top of the page. The
  // controls on desktop are pinned to the header's bottom edge, so trimming
  // that side too would drag them out of the box.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={`sticky top-0 z-30 flex flex-col items-center gap-24 bg-paper px-24 pb-24 transition-[padding] duration-300 ease-out md:px-0 ${
        scrolled ? "pt-16" : "pt-48"
      }`}
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
