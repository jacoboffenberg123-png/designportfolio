import Image from "next/image";
import PillLink from "@/components/PillLink";
import type { Project } from "@/lib/projects";

/** The `eyebrow` text style: Inter Medium 12/120%, 8% tracking, uppercase. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs leading-[1.2] font-medium tracking-[0.08em] text-ink uppercase">
      {children}
    </span>
  );
}

export function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-[1.65] tracking-[-0.005em] text-ink">{children}</p>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-[40px] leading-[1.1] font-bold tracking-[-0.015em] text-ink uppercase">
      {children}
    </h1>
  );
}

/** Content band carrying the page's side margin. */
export function Band({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-24 md:px-48 lg:px-120 ${className}`}>{children}</div>
  );
}

export function Figure({
  src,
  ratio,
  rounded = true,
  sizes = "100vw",
  priority = false,
}: {
  src?: string;
  ratio: string;
  rounded?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-line ${
        rounded ? "rounded-sm shadow-card" : ""
      }`}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Image src={src} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      ) : null}
    </div>
  );
}

/** Label/value rows — only rows with a value are rendered. */
export function MetaTable({ project }: { project: Project }) {
  const rows: [string, string][] = [
    ["Emne", project.subject],
    ["Kategori", project.category],
    ["År", project.year],
    ["Varighet", project.duration],
    ["Rolle", project.role],
    ["Verktøy", project.tools],
  ];
  const filled = rows.filter(([, v]) => v);
  if (filled.length === 0) return null;

  return (
    <dl className="flex w-full flex-col lg:w-[400px]">
      {filled.map(([label, value]) => (
        // Centred, not top-aligned: the label and value are different sizes, so
        // aligning their tops leaves them visibly off the same line.
        <div key={label} className="flex items-center gap-24 border-t border-line py-16">
          <dt className="w-[120px] shrink-0 text-xs leading-[1.2] font-medium tracking-[0.08em] text-ink uppercase">
            {label}
          </dt>
          <dd className="text-sm leading-[1.55] text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Reflection({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="flex max-w-[760px] flex-col gap-16">
      <Eyebrow>Hva jeg lærte</Eyebrow>
      <Body>{text}</Body>
    </div>
  );
}

export function NextProject({ slug }: { slug?: string }) {
  if (!slug) return null;
  return (
    <div className="flex justify-end">
      <PillLink href={`/arbeid/${slug}`}>Neste prosjekt →</PillLink>
    </div>
  );
}
