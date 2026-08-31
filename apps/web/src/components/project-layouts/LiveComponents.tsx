"use client";

import { useEffect, useRef, useState } from "react";
import DotGrid from "@/components/DotGrid";
import NavTabs from "@/components/NavTabs";
import PillLink from "@/components/PillLink";
import ThemeSlider from "@/components/ThemeSlider";
import ThemeToggle from "@/components/ThemeToggle";
import type { CaptionKey } from "@/lib/projects";
import { applyDim } from "@/lib/theme";
import { Eyebrow } from "./shared";

/**
 * The component gallery. These are the real components the rest of the site is
 * built from — the same files, not copies — but every one is wired to state
 * that lives inside its own tile. Pressing something here changes that tile and
 * nothing else: the slider doesn't re-colour the page, and the tabs don't
 * navigate away from it.
 */

function Tile({
  name,
  note,
  children,
  wide = false,
  stageRef,
}: {
  name: string;
  note: string;
  children: React.ReactNode;
  /** Taller stage for the dot grid, which needs room to read. */
  wide?: boolean;
  stageRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="flex flex-col gap-16">
      <div
        ref={stageRef}
        className={`flex items-center justify-center rounded-sm bg-accent px-24 ${
          wide ? "py-32" : "h-[104px]"
        }`}
      >
        {children}
      </div>
      <div className="flex flex-col gap-4">
        <Eyebrow>{name}</Eyebrow>
        <p className="text-xs leading-[1.5] text-muted">{note}</p>
      </div>
    </div>
  );
}

/**
 * Runs the dimmer against one element instead of the document, so a demo can
 * show the whole palette moving inside its own box. The stage picks up the
 * scoped variables; everything outside it keeps the page's own palette.
 */
function useScopedDim(t: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) applyDim(t, ref.current);
  }, [t]);
  return ref;
}

/** Written in the CMS; these stand in when a field is left empty. */
const FALLBACK: Record<CaptionKey, string> = {
  themeSlider:
    "Trinnløs lys/mørk. Fargene regnes ut per steg, ikke byttet mellom to sett — dra i den, så mørkner boksen. På siden styrer den hele paletten; her bare sin egen rute.",
  navTabs:
    "Fanevelger der den hvite pillen glir mellom fanene. I headeren navigerer den; her flytter den bare pillen.",
  button: "Sekundærknappen — PillLink i koden. Samme hover- og trykk-tilstand som ellers på siden.",
  tag: "Nøytral chip — brukes til programmer på CV-siden. Den eneste her uten en tilstand å trykke på.",
  themeToggle:
    "Erstatter slideren på telefon. Viser ikonet for der et trykk tar deg — og mørkner boksen, ikke siden.",
  footerDots:
    "Prikkerutenettet i bunnteksten. Prikkene mørkner der pekeren er, og falmer tilbake med forsinkelse. Rutenettet tettes på smale skjermer så J-en og O-en fortsatt kan leses.",
};

export default function LiveComponents({
  captions,
}: {
  captions?: Partial<Record<CaptionKey, string>>;
}) {
  const note = (k: CaptionKey) => captions?.[k] || FALLBACK[k];
  const [sliderDim, setSliderDim] = useState(0);
  const [toggleDim, setToggleDim] = useState(0);
  const [tab, setTab] = useState(0);

  const sliderStage = useScopedDim(sliderDim);
  const toggleStage = useScopedDim(toggleDim);

  return (
    <div className="flex flex-col gap-24">
      {/* A grid rather than two fixed rows: with five tiles the last row holds
          two, and each keeps a column's width instead of stretching to half. */}
      <div className="grid gap-24 sm:grid-cols-2 lg:grid-cols-3">
        <Tile
          stageRef={sliderStage}
          name="ThemeSlider"
          note={note("themeSlider")}
        >
          <ThemeSlider value={sliderDim} onChange={setSliderDim} />
        </Tile>
        <Tile
          name="NavTabs"
          note={note("navTabs")}
        >
          <NavTabs active={tab} onSelect={setTab} />
        </Tile>
        <Tile
          name="Button"
          note={note("button")}
        >
          <PillLink>Se mer</PillLink>
        </Tile>
        <Tile
          name="Tag"
          note={note("tag")}
        >
          <span className="rounded-sm bg-ink/5 px-12 py-8 text-xs leading-[1.5] text-ink">
            Figma
          </span>
        </Tile>
        <Tile
          stageRef={toggleStage}
          name="ThemeToggle"
          note={note("themeToggle")}
        >
          <ThemeToggle value={toggleDim} onChange={setToggleDim} />
        </Tile>
      </div>

      <Tile
        wide
        name="FooterDots"
        note={note("footerDots")}
      >
        <div className="w-full">
          <DotGrid />
        </div>
      </Tile>
    </div>
  );
}
