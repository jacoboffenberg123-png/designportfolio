"use client";

import { useDim } from "@/lib/useDim";
import { Moon, Sun } from "./icons";

/**
 * The dimmer, reduced to a switch for phones. A 148px track can't share a line
 * with the tabs and the panel button at 390px, so on small screens the same
 * setting gets a round button that jumps between the two ends.
 *
 * It shows where a tap would take you, not where you are — the page itself
 * already tells you that.
 */
export default function ThemeToggle({
  size = 32,
  value,
  onChange,
}: {
  size?: number;
  /** Same contract as ThemeSlider: pass a pair to keep the switch local. */
  value?: number;
  onChange?: (t: number) => void;
} = {}) {
  const [globalDim, setGlobal] = useDim();
  const controlled = value !== undefined && onChange !== undefined;
  const dim = controlled ? value : globalDim;
  const setDim = controlled ? onChange : setGlobal;
  const dark = dim > 0.5;

  return (
    <button
      type="button"
      onClick={() => setDim(dark ? 0 : 1)}
      aria-label={dark ? "Bytt til lys modus" : "Bytt til mørk modus"}
      aria-pressed={dark}
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-pill bg-ink/10 text-ink transition-colors duration-200 hover:bg-ink/20"
    >
      {dark ? <Sun size={size * 0.45} /> : <Moon size={size * 0.45} />}
    </button>
  );
}
