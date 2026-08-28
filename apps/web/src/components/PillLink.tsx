import Link from "next/link";

/**
 * The design system's Secondary button: borderless pill on a soft ink tint.
 * Hover deepens the fill by the same opacity step the glass "Se mer" pill uses.
 */
const CLASSES =
  "inline-flex h-[32px] items-center justify-center whitespace-nowrap rounded-pill bg-ink/10 px-12 text-[11px] leading-[1.5] text-ink shadow-card transition-[background-color,box-shadow] duration-200 hover:bg-ink/20 hover:shadow-card-hover md:h-auto md:px-16 md:py-8 md:text-xs";

export default function PillLink({
  href,
  onClick,
  children,
}: {
  /** Omit to render a button instead — same pill, but it goes nowhere. */
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <button type="button" onClick={onClick} className={CLASSES}>
        {children}
      </button>
    );
  }
  return (
    <Link
      href={href}
      // Phone scale below md, matching the site header's 32px controls.
      className={CLASSES}
    >
      {children}
    </Link>
  );
}
