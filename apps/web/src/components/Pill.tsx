import type { ComponentPropsWithoutRef, ElementType } from "react";

type PillStyle = "filled" | "outline";
type PillSize = "small" | "large";

const styleClasses: Record<PillStyle, string> = {
  filled: "bg-ink text-surface",
  outline: "bg-surface text-ink",
};

const sizeClasses: Record<PillSize, string> = {
  small: "px-16 py-8 text-xs font-normal",
  large: "px-24 py-16 text-xs font-medium tracking-[-0.01em]",
};

type PillProps<T extends ElementType> = {
  as?: T;
  pillStyle?: PillStyle;
  size?: PillSize;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export default function Pill<T extends ElementType = "span">({
  as,
  pillStyle = "filled",
  size = "small",
  className = "",
  ...props
}: PillProps<T>) {
  const Component = as || "span";
  return (
    <Component
      className={`inline-flex items-center justify-center rounded-pill ${styleClasses[pillStyle]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
