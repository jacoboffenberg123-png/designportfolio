"use client";

import { useEffect, useState } from "react";
import { readStoredDim, setDim } from "@/lib/theme";

const STEPS = 100;

// Track geometry. Height and inner padding match NavTabs, so the two controls
// read as one family and sit on the same line. The knob travels the full width
// and passes over both icons — it is glass, so they read through it.
const HEIGHT = 41;
const WIDTH = 148;
const PAD = 4;
const KNOB = HEIGHT - PAD * 2;
const ICON_ZONE = 34;
const TRAVEL = WIDTH - PAD * 2 - KNOB;

function Sun() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-[15px] w-[15px]">
      <circle cx="8" cy="8" r="3.1" />
      <path d="M8 1.4v1.6M8 13v1.6M14.6 8H13M3 8H1.4M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1M12.7 12.7l-1.1-1.1M4.4 4.4L3.3 3.3" />
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-[15px] w-[15px]">
      <path d="M13.4 9.9A5.9 5.9 0 0 1 6.1 2.6a.5.5 0 0 0-.7-.6 6.6 6.6 0 1 0 8.6 8.6.5.5 0 0 0-.6-.7Z" />
    </svg>
  );
}

/**
 * The dimmer. A pill in the same family as the nav tabs — dark-tinted track,
 * round light knob — with the sun at the daylight end and the moon at the dark
 * one. The knob is a plain element; the range input above it is transparent and
 * covers the whole pill, so dragging, clicking and arrow keys work as they
 * would on any slider.
 */
export default function ThemeSlider() {
  // Starts at 0 on both sides of hydration; the stored level is applied before
  // paint by the init script, and read back into the control on mount.
  const [value, setValue] = useState(0);

  useEffect(() => {
    const stored = readStoredDim();
    setValue(stored);
    setDim(stored);
  }, []);

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
          const next = Number(event.target.value) / STEPS;
          setValue(next);
          setDim(next);
        }}
        className="dimmer absolute inset-0 h-full w-full opacity-0"
        aria-label="Lysstyrke"
      />
    </div>
  );
}
