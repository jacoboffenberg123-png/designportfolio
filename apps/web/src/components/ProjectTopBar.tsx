import Link from "next/link";
import PillLink from "./PillLink";

/** Slim header for project pages, so a case study reads without the site nav. */
export default function ProjectTopBar() {
  return (
    <header className="flex items-center px-24 py-24 md:px-48 lg:px-120">
      <div className="flex w-[140px] justify-start lg:w-[220px]">
        <PillLink href="/">← Tilbake</PillLink>
      </div>

      <div className="flex flex-1 justify-center">
        <Link
          href="/"
          className="text-[15px] leading-none font-bold uppercase tracking-[0.02em] text-ink"
        >
          J.O
        </Link>
      </div>

      <div className="flex w-[140px] justify-end lg:w-[220px]">
        <PillLink href="/cv">CV</PillLink>
      </div>
    </header>
  );
}
