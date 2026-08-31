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

/**
 * `whitespace-pre-line` because the CMS fields are plain textareas: the blank
 * lines an author types are real newlines in the value, and HTML would collapse
 * them into single spaces.
 */
export function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-[1.65] tracking-[-0.005em] whitespace-pre-line text-ink">
      {children}
    </p>
  );
}

/**
 * Fluid rather than stepped: a one-word title like FORMFABRIKKEN can't wrap, so
 * at a fixed 40px it needs 325px in a 257px column and pushes the page sideways.
 * The clamp scales it with the viewport and settles on the design's 40px from
 * about 570px up. `break-words` is the backstop for a title long enough to
 * overflow even at the floor.
 */
export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-[clamp(26px,7vw,40px)] leading-[1.1] font-bold tracking-[-0.015em] break-words text-ink uppercase">
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
  height,
  rounded = true,
  contain = false,
  sizes = "100vw",
  priority = false,
}: {
  src?: string;
  /** Aspect ratio for the box. Ignored when `height` is given. */
  ratio?: string;
  /**
   * A fixed pixel height instead of a ratio, so the box keeps the same height
   * at every width and the image crops wider as the viewport grows.
   */
  height?: number;
  rounded?: boolean;
  /**
   * Fits the whole image inside the box instead of cropping to fill, and drops
   * the grey ground so a transparent cut-out sits straight on the page. Two
   * images that share a canvas keep their alignment: identical boxes letterbox
   * them identically.
   */
  contain?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${
        // The grey stays while there's nothing to show — otherwise a missing
        // image would be an invisible hole rather than an obvious gap.
        contain && src ? "" : "bg-line"
      } ${rounded ? "rounded-sm" : ""}`}
      style={height ? { height } : { aspectRatio: ratio }}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className={contain ? "object-contain" : "object-cover"}
        />
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
    ["Verktøy", project.tools],
  ];
  const filled = rows.filter(([, v]) => v);
  if (filled.length === 0) return null;

  return (
    <dl className="flex w-full shrink-0 flex-col md:w-[320px] lg:w-[400px]">
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
