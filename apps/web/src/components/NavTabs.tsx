"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const TABS = [
  { label: "Prosjekter", href: "/" },
  { label: "CV", href: "/cv" },
];

function activeIndexFor(pathname: string) {
  // Project detail pages still belong under "Prosjekter".
  if (pathname.startsWith("/cv")) return 1;
  return 0;
}

// useLayoutEffect would warn during SSR; fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function NavTabs({
  active: controlledActive,
  onSelect,
}: {
  /**
   * Left off, the tabs follow the URL and navigate, as they do in the header.
   * Passing a pair turns them into buttons that only move the thumb — the
   * component gallery needs a tab selector that doesn't leave the page it is
   * being shown on.
   */
  active?: number;
  onSelect?: (index: number) => void;
} = {}) {
  const pathname = usePathname();
  const controlled = controlledActive !== undefined && onSelect !== undefined;
  const active = controlled ? controlledActive : activeIndexFor(pathname);

  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const el = itemRefs.current[active];
    if (!el) return;
    setThumb({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  useIsomorphicLayoutEffect(() => {
    measure();
  }, [measure]);

  // Label widths shift once the webfont swaps in, and again on resize.
  useEffect(() => {
    const el = itemRefs.current[active];
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [active, measure]);

  return (
    // Glass: a 20% ink tint over a blur, rather than a solid pill.
    // Tighter below md so the whole bar fits one phone line.
    <nav className="relative flex items-center rounded-pill bg-ink/20 p-[3px] backdrop-blur-[10px] md:p-4">
      <span
        aria-hidden
        className="absolute top-[3px] bottom-[3px] left-0 rounded-pill bg-surface transition-[transform,width] duration-300 ease-out md:top-4 md:bottom-4"
        style={{
          width: thumb?.width ?? 0,
          transform: `translateX(${thumb?.left ?? 0}px)`,
          // Hidden until measured, so it can't flash at the wrong position.
          opacity: thumb ? 1 : 0,
        }}
      />
      {TABS.map((tab, i) => {
        const className = `relative z-10 rounded-pill px-[10px] py-[6px] text-[11px] leading-[1.3] font-medium whitespace-nowrap transition-colors duration-300 md:px-16 md:py-8 md:text-[13px] ${
          i === active ? "text-ink" : "text-muted hover:text-ink"
        }`;
        const setRef = (el: HTMLElement | null) => {
          itemRefs.current[i] = el;
        };
        return controlled ? (
          <button
            key={tab.href}
            type="button"
            ref={setRef}
            onClick={() => onSelect(i)}
            aria-pressed={i === active}
            className={className}
          >
            {tab.label}
          </button>
        ) : (
          <Link
            key={tab.href}
            ref={setRef}
            href={tab.href}
            aria-current={i === active ? "page" : undefined}
            className={className}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
