"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NavTabs from "./NavTabs";
import ThemeSlider from "./ThemeSlider";
import ThemeToggle from "./ThemeToggle";

/**
 * The site header. Sticks to the top and trims its own top padding once you
 * leave the top of the page.
 */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  // Only the top padding shrinks once you leave the top of the page. The
  // controls on desktop are pinned to the header's bottom edge, so trimming
  // that side too would drag them out of the box.
  //
  // The two thresholds are far apart on purpose. The header is in flow, so
  // shrinking it by 32px shortens the page above you, and the browser keeps the
  // content anchored by pulling the scroll position down by the same 32px. With
  // one threshold that lands you back below it, the header grows, the scroll
  // returns, and it oscillates forever — measured at 71 direction changes a
  // second. A gap wider than the shrink means neither edge can trigger the
  // other.
  useEffect(() => {
    const onScroll = () =>
      setScrolled((was) => {
        const y = window.scrollY;
        if (!was && y > 96) return true;
        if (was && y < 32) return false;
        return was;
      });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 flex flex-col items-center gap-24 bg-paper px-24 pb-24 transition-[padding] duration-300 ease-out md:px-0 ${
        scrolled ? "pt-16" : "pt-48"
      }`}
    >
      {/* Phones get one line: mark, tabs, switch. `md:contents` dissolves the
          row above that width, handing the children back to the header so the
          wordmark and tabs centre on the page and the slider takes its absolute
          place at the right. */}
      <div className="flex w-full items-center justify-between gap-8 md:contents">
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
