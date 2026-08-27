"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const EASE = "cubic-bezier(0.5, 0, 0.15, 1)";
const DURATION = 700;

type Blind = {
  open: boolean;
  toggle: () => void;
  close: () => void;
  /** The header reports its own height; the blind stops with it at the foot. */
  reportHeaderHeight: (h: number) => void;
};

const BlindContext = createContext<Blind | null>(null);

export function useBlind() {
  const value = useContext(BlindContext);
  if (!value) throw new Error("useBlind must be used inside BlindShell");
  return value;
}

/**
 * The page as a roller blind.
 *
 * The panel behind never moves — it is a fixed plane the page is pulled down
 * over, so what you see is the page rolling away rather than a box sliding in.
 * That is also why the whole page travels, footer included, instead of just the
 * header: a blind that only moved its top edge would read as two sheets.
 *
 * The transform lives on this wrapper rather than on `body`, so the panel can
 * sit outside it. A transformed ancestor becomes the containing block for
 * fixed-position descendants, and a fixed panel inside the blind would be
 * dragged along by the very transform it is meant to stay behind.
 */
export default function BlindShell({
  children,
  panel,
}: {
  children: React.ReactNode;
  panel: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(152);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => {
    setOpen((wasOpen) => {
      // Roll down from the top, so the distance to the foot of the viewport is
      // a fixed number rather than something that moves with the scroll.
      if (!wasOpen) window.scrollTo({ top: 0 });
      return !wasOpen;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const value = useMemo<Blind>(
    () => ({ open, toggle, close, reportHeaderHeight: setHeaderHeight }),
    [open, toggle, close],
  );

  const drop = `calc(100dvh - ${headerHeight}px)`;

  return (
    <BlindContext.Provider value={value}>
      <div
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className="fixed inset-0 z-0 bg-sunken"
      >
        {/* Sized to the opening the blind leaves, so the content sits in the
            gap rather than behind where the header comes to rest. */}
        <div style={{ height: drop }}>{panel}</div>
      </div>

      <div
        className="relative z-10 flex min-h-dvh flex-col bg-paper"
        style={{
          transform: open ? `translateY(${drop})` : undefined,
          transition: `transform ${DURATION}ms ${EASE}`,
        }}
      >
        {children}
      </div>
    </BlindContext.Provider>
  );
}
