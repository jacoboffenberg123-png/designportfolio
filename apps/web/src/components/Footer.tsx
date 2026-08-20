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
    <footer className="flex items-center justify-between border-t border-line px-24 py-24 text-xs text-muted md:px-48 lg:px-[120px]">
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
          <span>© Navn Etternavn</span>
          <span className="text-ink">{contactEmail}</span>
        </>
      )}
    </footer>
  );
}
