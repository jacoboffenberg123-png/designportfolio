"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SIZE = 41; // matches the nav tabs, and makes the open state a circle

/**
 * The control that opens the panel and then closes it: a "Se mer" pill that
 * collapses into a circular ✕ once the blind is down.
 *
 * The closed width has to be a number, because `auto` can't be transitioned
 * and there would be nothing to animate from. It is taken from the label, not
 * from the button: mid-transition the button's own `offsetWidth` reports the
 * interpolated value, so measuring that on close pins the pill at whatever
 * width the animation happened to be passing through. The label never shrinks —
 * it just overflows the clipped button — so it stays a truthful ruler.
 */
export default function PanelToggle({
  open,
  onToggle,
  label = "Se mer",
}: {
  open: boolean;
  onToggle: () => void;
  label?: string;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelWidth, setLabelWidth] = useState<number>();

  useIsomorphicLayoutEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    const measure = () => setLabelWidth(el.offsetWidth);
    measure();
    // The label's width moves when the webfont swaps in.
    document.fonts?.ready.then(measure).catch(() => {});
  }, []);

  // px-16 on both sides.
  const pillWidth = labelWidth === undefined ? undefined : labelWidth + 32;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? "Lukk" : undefined}
      style={{ width: open ? SIZE : pillWidth, height: SIZE }}
      className="relative flex items-center justify-center overflow-hidden rounded-pill bg-ink/10 px-16 text-xs leading-[1.2] font-medium tracking-[0.08em] whitespace-nowrap text-ink uppercase shadow-card transition-[width,background-color,box-shadow] duration-500 ease-out hover:bg-ink/20 hover:shadow-card-hover"
    >
      <span
        ref={labelRef}
        className={`shrink-0 transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          open ? "opacity-100 delay-200" : "opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="h-[15px] w-[15px]"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </span>
    </button>
  );
}
