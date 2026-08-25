import Link from "next/link";

/** The design system's Secondary button: white pill, hairline border, soft lift. */
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
      className="inline-flex items-center justify-center whitespace-nowrap rounded-pill border border-line bg-surface px-16 py-8 text-xs leading-[1.5] text-ink shadow-card transition-shadow duration-200 hover:shadow-card-hover"
    >
      {children}
    </Link>
  );
}
