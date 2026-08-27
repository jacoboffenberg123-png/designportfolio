"use client";

import { useEffect, useState } from "react";
import { readStoredDim, setDim, subscribeDim } from "./theme";

/**
 * The dim level, shared by every control that can change it.
 *
 * The slider and the phone toggle are both mounted at once — one is only hidden
 * by a breakpoint — so they have to read the same value, or resizing the window
 * would show a control that disagrees with the page it's controlling.
 */
export function useDim() {
  // Starts at 0 on both sides of hydration; the stored level is applied before
  // paint by the init script, and read back into the controls on mount.
  const [dim, setLocal] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeDim(setLocal);
    const stored = readStoredDim();
    setLocal(stored);
    setDim(stored);
    return unsubscribe;
  }, []);

  return [dim, setDim] as const;
}
