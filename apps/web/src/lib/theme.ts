/**
 * The dimmer — one value from 0 (daylight) to 1 (night) that walks the whole
 * page between the two palettes.
 *
 * Backgrounds, borders and the footer dots interpolate continuously. Ink cannot:
 * a text colour halfway between #0a0a0a and #f2efe9 is invisible on a background
 * that is also halfway. So ink is *picked* rather than mixed — whichever end
 * reads better against the live background — and the background's own curve is
 * eased so the page rushes through the mid-grey band where that choice flips.
 */

export const DIM_KEY = "jo-dim";

/**
 * Writes the palette for `t` onto the document root.
 *
 * Everything it needs is declared inside the function body, because the whole
 * function is stringified into the no-flash inline script below — nothing from
 * module scope survives that trip.
 */
export function applyDim(t: number) {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  const eased = clamped * clamped * (3 - 2 * clamped);
  const style = document.documentElement.style;

  const mix = (from: number[], to: number[], k: number) => [
    from[0] + (to[0] - from[0]) * k,
    from[1] + (to[1] - from[1]) * k,
    from[2] + (to[2] - from[2]) * k,
  ];
  const write = (name: string, c: number[], tint?: number[]) => {
    const out = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      const v = Math.round(c[i] + (tint ? tint[i] : 0));
      out[i] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
    style.setProperty("--color-" + name, "rgb(" + out[0] + " " + out[1] + " " + out[2] + ")");
  };

  // The two grounds interpolate straight between the palettes.
  const paper = mix([254, 253, 251], [14, 14, 13], eased);
  write("paper", paper);
  write("surface", mix([255, 255, 255], [26, 26, 24], eased));

  // WCAG relative luminance; 0.179 is the crossover where light text starts to
  // beat dark text on the same ground.
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminance =
    0.2126 * channel(paper[0]) + 0.7152 * channel(paper[1]) + 0.0722 * channel(paper[2]);
  const lightGround = luminance > 0.179;

  const ink = lightGround ? [10, 10, 10] : [242, 239, 233];
  write("ink", ink);
  style.colorScheme = lightGround ? "light" : "dark";

  // Everything between the ground and the ink is mixed from the pair rather
  // than ramped on its own, so it can never land on the same grey as the
  // background halfway through the dimmer. The tints put back the warmth that
  // mixing two near-neutrals loses. Muted leans further toward ink around the
  // midpoint, where there is least contrast to spend.
  const mutedWeight = 0.467 + 0.21 * Math.sin(Math.PI * clamped);
  write("muted", mix(paper, ink, mutedWeight), [0, -5, -15]);
  write("line", mix(paper, ink, 0.11), [0, -2, -8]);
  write("dot", mix(paper, ink, 0.17), [0, -2, -8]);
}

/**
 * Runs before first paint so a stored dim level never flashes through white.
 * Reuses `applyDim` verbatim so the two can't drift apart.
 */
export const THEME_INIT_SCRIPT =
  `try{var t=parseFloat(localStorage.getItem(${JSON.stringify(DIM_KEY)}));` +
  `if(t>0)(${applyDim.toString()})(t)}catch(e){}`;

type Listener = (t: number) => void;

const listeners = new Set<Listener>();
let current = 0;

export function getDim() {
  return current;
}

/** Reads the persisted level without applying it — for hydrating a control. */
export function readStoredDim() {
  try {
    const stored = parseFloat(localStorage.getItem(DIM_KEY) ?? "");
    if (stored > 0) return stored > 1 ? 1 : stored;
  } catch {
    // Private mode, or storage disabled — daylight is a fine default.
  }
  return 0;
}

export function setDim(t: number) {
  current = t;
  applyDim(t);
  try {
    localStorage.setItem(DIM_KEY, String(t));
  } catch {
    // Not being able to remember the setting shouldn't break changing it.
  }
  for (const fn of listeners) fn(t);
}

/** Notifies canvas-drawn UI, which can't pick up CSS variable changes on its own. */
export function subscribeDim(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
