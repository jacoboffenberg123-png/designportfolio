"use client";

import { useEffect, useState } from "react";
import { readStoredDim, setDim } from "@/lib/theme";

const STEPS = 100;

/**
 * The dimmer control. A plain range input underneath — so it keeps keyboard
 * support, arrow keys and screen reader semantics for free — with the track and
 * knob restyled in `globals.css` under `.dimmer`.
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
    <label className="flex items-center gap-8">
      <span className="sr-only">Lysstyrke</span>
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
        className="dimmer w-[88px]"
        aria-label="Lysstyrke"
      />
    </label>
  );
}
