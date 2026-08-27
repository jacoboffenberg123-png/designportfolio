import Link from "next/link";
import PillLink from "./PillLink";
import ThemeSlider from "./ThemeSlider";
import ThemeToggle from "./ThemeToggle";

/** Slim header for project pages, so a case study reads without the site nav. */
export default function ProjectTopBar() {
  return (
    // Sticky at its natural height: at 80–89px it's already compact enough not
    // to need the site header's shrink-on-scroll.
    <header className="sticky top-0 z-30 flex items-center justify-between bg-paper px-24 py-24 md:px-48 lg:px-120">
      <PillLink href="/">← Tilbake</PillLink>

      <div className="flex items-center gap-12 md:gap-24">
        <Link
          href="/"
          className="text-[13px] leading-none font-bold uppercase tracking-[0.02em] text-ink md:text-[15px]"
        >
          J.O
        </Link>

        {/* Same trade as the site header: the 148px track doesn't fit a phone
            line, so below md the setting becomes a round switch. */}
        <div className="md:hidden">
          <ThemeToggle />
        </div>
        <div className="hidden md:block">
          <ThemeSlider />
        </div>
      </div>
    </header>
  );
}
