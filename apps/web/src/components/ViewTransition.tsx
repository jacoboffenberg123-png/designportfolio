import * as React from "react";

type ViewTransitionProps = {
  name?: string;
  share?: string;
  enter?: string;
  exit?: string;
  default?: string;
  children: React.ReactNode;
};

// React 19.2 (the canary build Next 16 bundles) ships ViewTransition, but
// @types/react doesn't declare it yet — hence the cast. If it's ever missing
// at runtime the children still render, just without the morph.
const ReactViewTransition = (
  React as unknown as { ViewTransition?: React.ComponentType<ViewTransitionProps> }
).ViewTransition;

export default function ViewTransition({ children, ...props }: ViewTransitionProps) {
  if (!ReactViewTransition) return <>{children}</>;
  return <ReactViewTransition {...props}>{children}</ReactViewTransition>;
}
