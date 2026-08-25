import Link from "next/link";
import PillLink from "./PillLink";
import ViewTransition from "./ViewTransition";

/**
 * Slim header for project pages. The three slots pair up with the site header's
 * wordmark and nav tabs by view-transition name, so navigating between them
 * splits the tabs out to the edges and collapses the wordmark to a monogram.
 */
export default function ProjectTopBar() {
  return (
    <header className="flex items-center px-24 py-24 md:px-48 lg:px-120">
      <div className="flex w-[140px] justify-start lg:w-[220px]">
        <ViewTransition name="nav-left" share="morph" default="none">
          <PillLink href="/">← Tilbake</PillLink>
        </ViewTransition>
      </div>

      <div className="flex flex-1 justify-center">
        <ViewTransition name="brand" share="morph" default="none">
          <Link
            href="/"
            className="text-[15px] leading-none font-bold uppercase tracking-[0.02em] text-ink"
          >
            J.O
          </Link>
        </ViewTransition>
      </div>

      <div className="flex w-[140px] justify-end lg:w-[220px]">
        <ViewTransition name="nav-right" share="morph" default="none">
          <PillLink href="/cv">CV</PillLink>
        </ViewTransition>
      </div>
    </header>
  );
}
