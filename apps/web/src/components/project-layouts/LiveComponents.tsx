"use client";

import { useState } from "react";
import DotGrid from "@/components/DotGrid";
import NavTabs from "@/components/NavTabs";
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

function Tile({
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
      <div
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

export default function LiveComponents() {
  // The demo toggle owns its own state — it isn't wired to the real panel, so
  // pressing it here can't roll the page down under the reader.
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col gap-24 sm:flex-row">
        <Tile
          name="ThemeSlider"
          note="Trinnløs lys/mørk. Fargene regnes ut per steg, ikke byttet mellom to sett. Dra i den — hele siden regnes om."
        >
          <ThemeSlider />
        </Tile>
        <Tile
          name="PanelToggle"
          note="Pillen som kollapser til en sirkel når panelet er åpent. Trykk på den."
        >
          <PanelToggle open={open} onToggle={() => setOpen((v) => !v)} />
        </Tile>
        <Tile
          name="NavTabs"
          note="Fanevelger der den hvite pillen glir mellom fanene. Lenker videre til CV-siden."
        >
          <NavTabs />
        </Tile>
      </div>

      <div className="flex flex-col gap-24 sm:flex-row">
        <Tile
          name="Button"
          note="Tre varianter i to størrelser. Secondary er standardpillen — den er PillLink i koden."
        >
          {/* Anchors back to this section, so pressing it demonstrates the hover
              and press states without carrying the reader off the page. */}
          <PillLink href="#komponentene">Se mer</PillLink>
        </Tile>
        <Tile
          name="Tag"
          note="Nøytral chip — brukes til programmer på CV-siden. Den eneste her uten en tilstand å trykke på."
        >
          <span className="rounded-sm bg-ink/5 px-12 py-8 text-xs leading-[1.5] text-ink">
            Figma
          </span>
        </Tile>
        <Tile
          name="ThemeToggle"
          note="Rund bryter som erstatter slideren på telefon. Viser ikonet for der et trykk tar deg."
        >
          <ThemeToggle />
        </Tile>
      </div>

      <Tile
        wide
        name="FooterDots"
        note="Prikkerutenettet i bunnteksten. Prikkene mørkner der pekeren er, og falmer tilbake med forsinkelse. Rutenettet tettes på smale skjermer så J-en og O-en fortsatt kan leses."
      >
        <div className="w-full">
          <DotGrid />
        </div>
      </Tile>
    </div>
  );
}
