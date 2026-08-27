import Link from "next/link";

/**
 * The design system's Secondary button: borderless pill on a soft ink tint.
 * Hover deepens the fill by the same opacity step the glass "Se mer" pill uses.
 */
export default function PillLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      // Phone scale below md, matching the site header's 32px controls.
      className="inline-flex h-[32px] items-center justify-center whitespace-nowrap rounded-pill bg-ink/10 px-12 text-[11px] leading-[1.5] text-ink shadow-card transition-[background-color,box-shadow] duration-200 hover:bg-ink/20 hover:shadow-card-hover md:h-auto md:px-16 md:py-8 md:text-xs"
    >
      {children}
    </Link>
  );
}
