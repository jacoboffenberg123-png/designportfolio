"use client";

import { usePathname } from "next/navigation";

type FooterProps = {
  contactEmail: string;
  linkedin: string;
  instagram: string;
};

export default function Footer({ contactEmail, linkedin, instagram }: FooterProps) {
  const pathname = usePathname();
  const isCV = pathname.startsWith("/cv");

  return (
    // Padding sits on the outer element so the divider below lines up with the
    // page content rather than running edge to edge.
    <footer className="px-24 md:px-48 lg:px-120">
      <div className="h-px w-full bg-line" />
      <div className="flex items-center justify-between py-32 text-xs leading-[1.5] text-muted">
        {isCV ? (
          <>
            <span className="text-ink">{contactEmail}</span>
            <div className="flex gap-16 text-ink">
              <a href={linkedin} className="hover:underline">
                LinkedIn
              </a>
              <a href={instagram} className="hover:underline">
                Instagram
              </a>
            </div>
          </>
        ) : (
          <>
            <span>© Jacob Offenberg</span>
            <span className="text-ink">{contactEmail}</span>
          </>
        )}
      </div>
    </footer>
  );
}
