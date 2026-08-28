import { Eyebrow } from "./shared";

/**
 * The workflow loop, drawn as real elements rather than an exported image: it
 * reflow on a phone, stay sharp at any zoom, and travel with the dimmer like
 * the rest of the page. An image would do none of that.
 */

/**
 * A connector between two boxes — horizontal once there's room, vertical below
 * that. The row only appears at xl: a flex item never shrinks past its longest
 * word, and "PostgreSQL" plus padding sets a 156px floor per box. Four of those
 * and three connectors need 888px of content, which the page doesn't have until
 * about 1280. Forcing the row at md pushed the document out to 972px wide.
 */
function Arrow({ label }: { label?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center gap-8 py-12 xl:flex-col xl:gap-8 xl:py-0 xl:pt-48 ${
        label ? "xl:w-[88px]" : "xl:w-[48px]"
      }`}
    >
      {label ? (
        <span className="text-xs leading-[1.2] font-medium tracking-[0.08em] text-muted uppercase">
          {label}
        </span>
      ) : null}
      {/* One drawing, rotated a quarter turn when the row becomes a column. */}
      <svg
        width="44"
        height="8"
        viewBox="0 0 44 8"
        aria-hidden="true"
        className="rotate-90 xl:rotate-0"
      >
        <line x1="0" y1="4" x2="36" y2="4" strokeWidth="1" className="stroke-line" />
        <path d="M36 0.5 L43 4 L36 7.5 Z" className="fill-line" />
      </svg>
    </div>
  );
}

const STEPS = [
  ["01", "Figma", "Tegner endringen"],
  ["02", "Claude Code", "Leser filen via MCP, skriver koden"],
  ["03", "Git", "Commit på main"],
  ["04", "Deploy", "Netlify og Render bygger av seg selv"],
  ["05", "Nettsiden", "Måles og verifiseres"],
] as const;

/** The loop the work actually ran in, including what comes back round. */
export function WorkflowLoop() {
  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col xl:flex-row xl:items-start">
        {STEPS.map(([nr, title, desc], i) => (
          <div key={nr} className="contents">
            <div className="flex flex-1 flex-col gap-4 rounded-sm border border-line bg-paper p-24">
              <Eyebrow>
                <span className="text-muted">{nr}</span>
              </Eyebrow>
              <span className="text-xl leading-[1.3] font-medium text-ink">{title}</span>
              <span className="text-xs leading-[1.5] text-muted">{desc}</span>
            </div>
            {i < STEPS.length - 1 ? <Arrow /> : null}
          </div>
        ))}
      </div>

      {/* The return path. Hidden while the steps are a column, where the page
          already reads top to bottom and a bracket underneath would only add noise. */}
      <div className="relative hidden xl:block">
        <div className="h-32 rounded-b-sm border-x border-b border-line" />
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          aria-hidden="true"
          className="absolute -top-1 left-0 -translate-x-1/2"
        >
          <path d="M4.5 0 L9 8 L0 8 Z" className="fill-line" />
        </svg>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-paper px-16 text-xs leading-[1.5] text-muted">
          Testere og iterere
        </span>
      </div>
      <p className="text-xs leading-[1.5] text-muted xl:hidden">
        …og tilbake til start: teste og iterere.
      </p>
    </div>
  );
}
