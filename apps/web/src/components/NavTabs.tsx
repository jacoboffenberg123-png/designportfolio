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

export default function NavTabs() {
  const pathname = usePathname();
  const active = activeIndexFor(pathname);

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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
    <nav className="relative flex items-center rounded-pill bg-ink p-4 shadow-card">
      <span
        aria-hidden
        className="absolute top-4 bottom-4 left-0 rounded-pill bg-surface transition-[transform,width] duration-300 ease-out"
        style={{
          width: thumb?.width ?? 0,
          transform: `translateX(${thumb?.left ?? 0}px)`,
          // Hidden until measured, so it can't flash at the wrong position.
          opacity: thumb ? 1 : 0,
        }}
      />
      {TABS.map((tab, i) => (
        <Link
          key={tab.href}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          href={tab.href}
          aria-current={i === active ? "page" : undefined}
          className={`relative z-10 rounded-pill px-16 py-8 text-[13px] leading-[1.3] font-medium whitespace-nowrap transition-colors duration-300 ${
            i === active ? "text-ink" : "text-muted hover:text-surface"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
