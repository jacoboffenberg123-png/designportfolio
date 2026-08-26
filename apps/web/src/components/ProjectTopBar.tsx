import Link from "next/link";
import PillLink from "./PillLink";
import ThemeSlider from "./ThemeSlider";

/** Slim header for project pages, so a case study reads without the site nav. */
export default function ProjectTopBar() {
  return (
    <header className="flex items-center justify-between px-24 py-24 md:px-48 lg:px-120">
      <PillLink href="/">← Tilbake</PillLink>

      <div className="flex items-center gap-16 md:gap-24">
        <ThemeSlider />
        <Link
          href="/"
          className="text-[15px] leading-none font-bold uppercase tracking-[0.02em] text-ink"
        >
          J.O
        </Link>
      </div>
    </header>
  );
}
