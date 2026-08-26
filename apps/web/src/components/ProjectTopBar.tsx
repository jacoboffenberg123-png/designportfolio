import Link from "next/link";
import PillLink from "./PillLink";
import ThemeSlider from "./ThemeSlider";

/** Slim header for project pages, so a case study reads without the site nav. */
export default function ProjectTopBar() {
  return (
    <header className="flex items-center px-24 py-24 md:px-48 lg:px-120">
      {/* Both tracks are the same width so J.O lands on the page's centre. */}
      <div className="flex w-[140px] justify-start lg:w-[260px]">
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

      <div className="flex w-[140px] items-center justify-end gap-16 lg:w-[260px]">
        <div className="hidden lg:block">
          <ThemeSlider />
        </div>
        <PillLink href="/cv">CV</PillLink>
      </div>
    </header>
  );
}
