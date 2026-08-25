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
    <nav className="flex items-center gap-4 rounded-pill bg-surface p-4 shadow-card">
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? "rounded-pill bg-ink px-16 py-8 text-[13px] leading-[1.3] font-medium text-surface"
                : "rounded-pill px-16 py-8 text-[13px] leading-[1.3] font-medium text-muted transition-colors duration-200 hover:bg-ink/10 hover:text-ink"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
