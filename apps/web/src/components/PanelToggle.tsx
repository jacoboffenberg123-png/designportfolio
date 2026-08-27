"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;


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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ pill: number; size: number }>();

  useIsomorphicLayoutEffect(() => {
    const button = buttonRef.current;
    const label = labelRef.current;
    if (!button || !label) return;
    const measure = () => {
      const styles = getComputedStyle(button);
      const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      setBox({ pill: label.offsetWidth + padding, size: button.offsetHeight });
    };
    measure();
    // The label's width moves when the webfont swaps in, and both change at the
    // breakpoint — but never mid-transition, since the button's width is the
    // only thing animating and neither reading depends on it.
    document.fonts?.ready.then(measure).catch(() => {});
    const media = window.matchMedia("(min-width: 768px)");
    media.addEventListener("change", measure);
    return () => media.removeEventListener("change", measure);
  }, []);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? "Lukk" : undefined}
      ref={buttonRef}
      style={{ width: open ? box?.size : box?.pill }}
      className="relative flex h-[32px] shrink-0 items-center justify-center overflow-hidden rounded-pill bg-ink/10 px-12 text-[11px] leading-[1.2] font-medium tracking-[0.08em] whitespace-nowrap text-ink uppercase shadow-card transition-[width,background-color,box-shadow] duration-500 ease-out hover:bg-ink/20 hover:shadow-card-hover md:h-[41px] md:px-16 md:text-xs"
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
