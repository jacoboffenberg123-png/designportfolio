"use client";

import { useState } from "react";
import DotGrid from "@/components/DotGrid";
import PanelToggle from "@/components/PanelToggle";
import PillLink from "@/components/PillLink";
import ThemeSlider from "@/components/ThemeSlider";
import ThemeToggle from "@/components/ThemeToggle";
import { Eyebrow } from "./shared";

/**
 * The component gallery. These are the real components the rest of the site is
 * built from — not screenshots and not a prototype of them. The slider and the
 * switch drive the whole page's palette, so the panels they sit in change along
 * with everything else; the dot grid reacts to the pointer exactly as it does in
 * the footer.
 */

function Panel({
  name,
  note,
  children,
  wide = false,
}: {
  name: string;
  note: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-16 ${wide ? "" : "flex-1"}`}>
      <div className="flex min-h-[96px] items-center justify-center rounded-sm bg-sunken px-16 py-24">
        {children}
      </div>
      <div className="flex flex-col gap-4">
        <Eyebrow>{name}</Eyebrow>
        <p className="text-xs leading-[1.5] text-muted">{note}</p>
      </div>
    </div>
  );
}

export default function LiveComponents() {
  // The demo toggle owns its own state — it isn't wired to the real panel, so
  // pressing it here can't roll the page down under you.
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-48">
      <Panel
        wide
        name="ThemeSlider"
        note="Trinnløs, ikke to temaer. Bakgrunnen glir med en smootherstep-kurve, mens tekstfargen velges framfor å blandes — en grå midt imellom ville vært usynlig mot begge. Derfor bytter blekket brått når bakgrunnen krysser 0,179 i relativ luminans. Dra i den: hele siden regnes om, inkludert denne boksen."
      >
        <ThemeSlider />
      </Panel>

      <div className="flex flex-col gap-24 sm:flex-row">
        <Panel
          name="PanelToggle"
          note="Pillen kollapser til en sirkel når panelet er åpent. Bredden måles fra etiketten, ikke fra knappen — knappen rapporterer mellomverdier mens den animerer."
        >
          <PanelToggle open={open} onToggle={() => setOpen((v) => !v)} />
        </Panel>
        <Panel
          name="ThemeToggle"
          note="Erstatter slideren på telefon, der et 148 px spor ikke får plass på linjen. Viser ikonet for der et trykk tar deg."
        >
          <ThemeToggle />
        </Panel>
        <Panel
          name="Button"
          // Set in caps by the eyebrow style, "PillLink" reads as a typo.
          note="Designsystemets sekundærknapp — PillLink i koden. Kantløs pille på en svak blekktone, med samme hover-steg som glass-pillen."
        >
          <PillLink href="#komponentene">Se mer</PillLink>
        </Panel>
      </div>

      <Panel
        wide
        name="FooterDots"
        note="Rutenettet i bunnteksten, tegnet på canvas. Prikkene mørkner der pekeren er og falmer tilbake med forsinkelse, så sporet etter hånden henger igjen et øyeblikk. Rutenettet tettes på smale skjermer så J-en og O-en fortsatt kan leses."
      >
        <div className="w-full">
          <DotGrid />
        </div>
      </Panel>
    </div>
  );
}
