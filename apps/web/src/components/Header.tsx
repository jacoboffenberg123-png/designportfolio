import Link from "next/link";
import NavTabs from "./NavTabs";

export default function Header() {
  return (
    <header className="flex flex-col items-center gap-24 pt-48 pb-24">
      <Link
        href="/"
        className="text-[15px] leading-none font-bold uppercase tracking-[0.02em] text-ink"
      >
        Jacob Offenberg
      </Link>
      <NavTabs />
    </header>
  );
}
