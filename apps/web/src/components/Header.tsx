import Link from "next/link";
import NavTabs from "./NavTabs";
import ThemeSlider from "./ThemeSlider";

export default function Header() {
  return (
    <header className="relative flex flex-col items-center gap-24 pt-48 pb-24">
      <Link
        href="/"
        className="text-[15px] leading-none font-bold uppercase tracking-[0.02em] text-ink"
      >
        Jacob Offenberg
      </Link>
      <NavTabs />
      {/* From md up this is absolute, so the wordmark and tabs stay centred on
          the page rather than on whatever is left over beside it. Narrower than
          that there isn't room alongside the wordmark, so it drops into the
          column as its own row. */}
      <div className="md:absolute md:top-48 md:right-48 lg:right-120">
        <ThemeSlider />
      </div>
    </header>
  );
}
