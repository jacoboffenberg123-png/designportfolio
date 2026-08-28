"use client";

import { useDim } from "@/lib/useDim";
import { Moon, Sun } from "./icons";

const STEPS = 100;

// Track geometry. Height and inner padding match NavTabs, so the two controls
// read as one family and sit on the same line. The knob travels the full width
// and passes over both icons — it is glass, so they read through it.
const HEIGHT = 41;
const WIDTH = 148;
const PAD = 4;
const KNOB = HEIGHT - PAD * 2;
// The icon zone is the height, which puts each icon's centre exactly on the
// knob's centre when the knob is parked at that end.
const ICON_ZONE = HEIGHT;
const TRAVEL = WIDTH - PAD * 2 - KNOB;

/**
 * The dimmer. A pill in the same family as the nav tabs — dark-tinted track,
 * round light knob — with the sun at the daylight end and the moon at the dark
 * one. The knob is a plain element; the range input above it is transparent and
 * covers the whole pill, so dragging, clicking and arrow keys work as they
 * would on any slider.
 */
export default function ThemeSlider({
  value: controlledValue,
  onChange,
}: {
  /**
   * Drives the page's dimmer when left off. Passing a pair makes the control
   * local instead — the component gallery does that so a demo slider can't
   * change the palette of the page it's being demonstrated on.
   */
  value?: number;
  onChange?: (t: number) => void;
} = {}) {
  const [globalValue, setGlobal] = useDim();
  const controlled = controlledValue !== undefined && onChange !== undefined;
  const value = controlled ? controlledValue : globalValue;
  const setValue = controlled ? onChange : setGlobal;

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-pill shadow-card"
      style={{
        width: WIDTH,
        height: HEIGHT,
        // Fixed colours, not palette tokens: the track has to mean the same
        // thing at both ends of the dimmer, and tokens would invert it.
        // Ends on the same dark grey the page bottoms out at, so the control
        // doesn't promise a black it never reaches.
        background: "linear-gradient(90deg, #ffffff 0%, #222222 100%)",
        // A mid grey so the pill's outline survives against both grounds — a
        // dark ring vanishes on the dark end of the dimmer, and vice versa.
        boxShadow: "inset 0 0 0 1px rgb(140 135 125 / 0.35)",
      }}
    >
      {/* Icons sit under the knob and pass clicks through to the input. Each is
          coloured against its own end of the gradient. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center"
        style={{ width: ICON_ZONE, color: "#0a0a0a" }}
      >
        <Sun />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center"
        style={{ width: ICON_ZONE, color: "#ffffff" }}
      >
        <Moon />
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute rounded-pill transition-transform duration-150 ease-out"
        style={{
          left: PAD,
          top: (HEIGHT - KNOB) / 2,
          width: KNOB,
          height: KNOB,
          // Thin enough to read the sun and moon straight through; the ring and
          // the shadow are what give it an edge, not the fill.
          // A sheen rather than a backdrop blur: the icons' strokes are ~1.3px,
          // and any blur at all smears them into the track instead of letting
          // them show through. The gradient is what makes it read as glass.
          background:
            "linear-gradient(160deg, rgb(255 255 255 / 0.34), rgb(255 255 255 / 0.06))",
          // A mid-grey ring rather than a white or black one, so the knob keeps
          // an edge at both ends of the track.
          boxShadow:
            "inset 0 0 0 1px rgb(140 135 125 / 0.6), 0 2px 10px rgb(10 10 10 / 0.22)",
          transform: `translateX(${value * TRAVEL}px)`,
        }}
      />

      <input
        type="range"
        min={0}
        max={STEPS}
        step={1}
        value={Math.round(value * STEPS)}
        onChange={(event) => {
          setValue(Number(event.target.value) / STEPS);
        }}
        className="dimmer absolute inset-0 h-full w-full opacity-0"
        aria-label="Lysstyrke"
      />
    </div>
  );
}
