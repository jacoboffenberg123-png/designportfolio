"use client";

import { useEffect, useRef } from "react";
import { subscribeDim } from "@/lib/theme";

/**
 * The initials as bitmaps, 12 rows tall. Strokes are two dots thick — at one
 * dot they read as scattered specks rather than letterforms, because the gap
 * between dots is wider than the dots themselves.
 */
const GLYPHS: Record<string, string[]> = {
  J: [
    "......##",
    "......##",
    "......##",
    "......##",
    "......##",
    "......##",
    "......##",
    "......##",
    "##....##",
    "##....##",
    "###..###",
    ".######.",
  ],
  ".": ["..", "..", "..", "..", "..", "..", "..", "..", "..", "..", "##", "##"],
  O: [
    "...####...",
    ".########.",
    "###....###",
    "##......##",
    "##......##",
    "##......##",
    "##......##",
    "##......##",
    "##......##",
    "###....###",
    ".########.",
    "...####...",
  ],
};

const MARK_LETTERS = ["J", ".", "O"];
const MARK_GAP = 2; // blank columns between letters
const MARK_ROWS = GLYPHS.O.length;
const MARK_COLS =
  MARK_LETTERS.reduce((sum, l) => sum + GLYPHS[l][0].length, 0) +
  MARK_GAP * (MARK_LETTERS.length - 1);

const ROWS = 20;
const PITCH = 12; // centre-to-centre distance between dots
const RADIUS = 2.3;
const REACH = 58; // how far from the pointer a dot reacts
const HOLD = 260; // ms at full darkness before it begins letting go
const FADE = 1100; // ms to drift back to the resting grey
const LEVELS = 14; // darkness steps, so dots can be filled in batches
const TAU = Math.PI * 2;

/** Normalises any CSS colour to [r, g, b] by letting the canvas parse it. */
function toRgb(ctx: CanvasRenderingContext2D, raw: string): [number, number, number] {
  ctx.fillStyle = "#000000";
  ctx.fillStyle = raw.trim();
  const hex = ctx.fillStyle as string;
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export default function DotGrid() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const height = ROWS * PITCH;

    let width = 0;
    let cols = 0;
    let originX = 0;
    // Peak darkness a dot was pushed to, and when — the current value is
    // derived from the pair, so a dot needs no per-frame bookkeeping.
    let peak = new Float32Array(0);
    let stamp = new Float64Array(0);
    let isMark = new Uint8Array(0);
    let rest: [number, number, number] = [216, 212, 203];
    let hot: [number, number, number] = [10, 10, 10];
    let frame = 0;

    const heatAt = (i: number, now: number) => {
      if (peak[i] === 0) return 0;
      const age = now - stamp[i];
      if (age < HOLD) return peak[i];
      const left = 1 - (age - HOLD) / FADE;
      return left > 0 ? peak[i] * left : 0;
    };

    function readPalette() {
      const styles = getComputedStyle(host!);
      rest = toRgb(ctx!, styles.getPropertyValue("--color-dot"));
      hot = toRgb(ctx!, styles.getPropertyValue("--color-ink"));
    }

    function layout() {
      width = host!.clientWidth;
      if (width <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      // Pin both CSS dimensions: without an explicit width the backing store's
      // pixel count becomes the canvas's intrinsic size and can widen the page.
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(1, Math.floor(width / PITCH));
      originX = (width - (cols - 1) * PITCH) / 2;

      const count = cols * ROWS;
      peak = new Float32Array(count);
      stamp = new Float64Array(count);
      isMark = new Uint8Array(count);

      // Stamp the initials into the grid, centred, letter by letter.
      let colOffset = Math.floor((cols - MARK_COLS) / 2);
      const rowOffset = Math.floor((ROWS - MARK_ROWS) / 2);
      for (const letter of MARK_LETTERS) {
        const glyph = GLYPHS[letter];
        for (let r = 0; r < glyph.length; r++) {
          for (let c = 0; c < glyph[r].length; c++) {
            if (glyph[r][c] !== "#") continue;
            const col = colOffset + c;
            const row = rowOffset + r;
            if (col < 0 || col >= cols || row < 0 || row >= ROWS) continue;
            isMark[row * cols + col] = 1;
          }
        }
        colOffset += glyph[0].length + MARK_GAP;
      }
    }

    /** Paints one frame; returns whether anything is still cooling down. */
    function draw(now: number) {
      ctx!.clearRect(0, 0, width, height);

      const buckets: number[][] = [];
      for (let l = 0; l < LEVELS; l++) buckets.push([]);

      let settling = false;
      for (let i = 0; i < peak.length; i++) {
        let heat = heatAt(i, now);
        if (heat <= 0.004) {
          peak[i] = 0;
          heat = 0;
        } else {
          settling = true;
        }
        if (isMark[i]) heat = 1;
        buckets[Math.round(heat * (LEVELS - 1))].push(i);
      }

      for (let l = 0; l < LEVELS; l++) {
        const ids = buckets[l];
        if (ids.length === 0) continue;
        const k = l / (LEVELS - 1);
        const r = Math.round(rest[0] + (hot[0] - rest[0]) * k);
        const g = Math.round(rest[1] + (hot[1] - rest[1]) * k);
        const b = Math.round(rest[2] + (hot[2] - rest[2]) * k);
        ctx!.fillStyle = `rgb(${r} ${g} ${b})`;
        ctx!.beginPath();
        for (const i of ids) {
          const col = i % cols;
          const row = (i - col) / cols;
          const x = originX + col * PITCH;
          const y = PITCH / 2 + row * PITCH;
          ctx!.moveTo(x + RADIUS, y);
          ctx!.arc(x, y, RADIUS, 0, TAU);
        }
        ctx!.fill();
      }

      return settling;
    }

    function tick() {
      frame = 0;
      if (draw(performance.now())) frame = requestAnimationFrame(tick);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function onMove(event: PointerEvent) {
      if (reduced || cols === 0) return;
      const rect = canvas!.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const now = performance.now();

      // Only walk the dots that could possibly be in range.
      const colFrom = Math.max(0, Math.floor((px - REACH - originX) / PITCH));
      const colTo = Math.min(cols - 1, Math.ceil((px + REACH - originX) / PITCH));
      const rowFrom = Math.max(0, Math.floor((py - REACH - PITCH / 2) / PITCH));
      const rowTo = Math.min(ROWS - 1, Math.ceil((py + REACH - PITCH / 2) / PITCH));

      for (let row = rowFrom; row <= rowTo; row++) {
        for (let col = colFrom; col <= colTo; col++) {
          const dx = originX + col * PITCH - px;
          const dy = PITCH / 2 + row * PITCH - py;
          const distance = Math.hypot(dx, dy);
          if (distance > REACH) continue;

          const falloff = 1 - distance / REACH;
          const value = falloff * falloff * 0.9;
          const i = row * cols + col;
          // Compare against where the dot is *now*, not its stale peak, so a
          // second pass can re-darken a dot that has already faded.
          if (value >= heatAt(i, now)) {
            peak[i] = value;
            stamp[i] = now;
          }
        }
      }
      schedule();
    }

    readPalette();
    layout();
    schedule();

    const observer = new ResizeObserver(() => {
      layout();
      schedule();
    });
    observer.observe(host);
    canvas.addEventListener("pointermove", onMove);
    const unsubscribe = subscribeDim(() => {
      readPalette();
      schedule();
    });

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      unsubscribe();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden className="w-full">
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}
