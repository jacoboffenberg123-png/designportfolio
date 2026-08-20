"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Prosjekter", href: "/" },
  { label: "CV", href: "/cv" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/arbeid");
  }
  return pathname.startsWith(href);
}

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-8">
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? "rounded-pill bg-ink px-16 py-8 text-xs font-medium tracking-[-0.01em] text-surface"
                : "rounded-pill px-16 py-8 text-xs font-medium tracking-[-0.01em] text-muted"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
