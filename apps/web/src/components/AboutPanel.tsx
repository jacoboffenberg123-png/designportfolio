import { Fragment } from "react";

/**
 * The stack, drawn as layers rather than a list — reading top to bottom mirrors
 * the way a request actually travels through it.
 */
const STACK: { layer: string; items: string[] }[] = [
  { layer: "Design", items: ["Figma"] },
  { layer: "Grensesnitt", items: ["Next.js", "React", "TypeScript", "Tailwind"] },
  { layer: "Innhold", items: ["Payload CMS"] },
  { layer: "Database", items: ["Neon Postgres"] },
  { layer: "Bilder", items: ["Cloudflare R2"] },
  { layer: "Drift", items: ["Netlify", "Render"] },
];

/** Edit this copy here — it isn't in the CMS. */
const PARAGRAPHS = [
  "Denne porteføljen er bygget med Claude Code. Jeg hadde ikke skrevet en linje React da jeg begynte, så jeg brukte den som en måte å lære på: jeg tegnet skjermene i Figma først, og lot koden følge designet i stedet for omvendt.",
  "Det ga en arbeidsflyt jeg ikke hadde forutsett. Figma-filen er fasiten — komponenter, variabler og tekststiler — og hver runde har handlet om å finne hvor koden sier noe annet enn designet, og rette koden. Det tvang meg til å ta stilling til ting jeg ellers ville latt være tilfeldig: hvorfor akkurat 8px radius, hvorfor 12px og ikke 11 på småteksten, hva en knapp faktisk skal gjøre når musa er over den.",
  "Det jeg sitter igjen med er ikke bare siden, men en forståelse av hvordan delene henger sammen — at innholdet ligger i en database, at bildene ligger et annet sted, at noe må bygges før det kan vises, og at et designsystem er verdt noe først når det finnes to steder samtidig og de er enige.",
];

export default function AboutPanel() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col gap-48 overflow-y-auto px-24 py-48 md:px-48 lg:flex-row lg:gap-96 lg:px-0 lg:py-64">
      <div className="flex shrink-0 flex-col gap-8 lg:w-[320px]">
        <span className="mb-8 text-xs leading-[1.2] font-medium tracking-[0.08em] text-ink uppercase">
          Teknisk oppsett
        </span>
        {STACK.map(({ layer, items }) => (
          <div
            key={layer}
            className="flex flex-col gap-8 rounded-sm bg-ink/5 px-16 py-12"
          >
            <span className="text-[11px] leading-[1.2] font-medium tracking-[0.08em] text-muted uppercase">
              {layer}
            </span>
            <span className="text-xs leading-[1.5] text-ink">
              {items.map((item, i) => (
                <Fragment key={item}>
                  {i > 0 ? <span className="text-muted"> · </span> : null}
                  {item}
                </Fragment>
              ))}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-24">
        <span className="text-xs leading-[1.2] font-medium tracking-[0.08em] text-ink uppercase">
          Om porteføljen
        </span>
        {PARAGRAPHS.map((text) => (
          <p
            key={text.slice(0, 24)}
            className="max-w-[680px] text-base leading-[1.65] tracking-[-0.005em] text-ink"
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
