import Link from "next/link";
import NavTabs from "./NavTabs";
import ViewTransition from "./ViewTransition";

export default function Header() {
  return (
    <header className="flex flex-col items-center gap-24 pt-48 pb-24">
      <ViewTransition name="brand" share="morph" default="none">
        <Link
          href="/"
          className="text-[15px] leading-none font-bold uppercase tracking-[0.02em] text-ink"
        >
          Jacob Offenberg
        </Link>
      </ViewTransition>
      <NavTabs />
    </header>
  );
}
