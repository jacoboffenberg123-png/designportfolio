/**
 * The stack as a layered graph: five columns, every node joined to every node
 * in the next column. Drawn as one SVG with a viewBox rather than positioned
 * elements, so it scales to any width without the labels colliding — the whole
 * drawing shrinks together the way a diagram should.
 *
 * Geometry is taken straight off the frame: columns at 230/500/770/1040/1270,
 * 48px nodes, everything centred on y=330.
 */

const LAYERS = [
  { name: "Design", x: 230, step: 132, nodes: ["Figma", "Tokens", "Komponenter"] },
  { name: "Verktøy", x: 500, step: 112, nodes: ["Claude Code", "Figma MCP", "Terminal", "Git"] },
  { name: "Kode", x: 770, step: 112, nodes: ["Next.js", "React", "TypeScript", "Tailwind"] },
  { name: "Innhold", x: 1040, step: 132, nodes: ["Payload", "PostgreSQL", "R2"] },
  { name: "Drift", x: 1270, step: 132, nodes: ["Netlify", "Render"] },
];

const MID_Y = 330;
const R = 24;
const HEAD_Y = 104;

const positions = LAYERS.map((layer) =>
  layer.nodes.map((name, i) => ({
    name,
    x: layer.x,
    y: MID_Y + (i - (layer.nodes.length - 1) / 2) * layer.step,
  })),
);

export default function StackNetwork() {
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < positions.length - 1; i++) {
    for (const a of positions[i]) {
      for (const b of positions[i + 1]) {
        // Stop the line at each rim so it meets the circle instead of crossing it.
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        edges.push({
          x1: a.x + Math.cos(angle) * R,
          y1: a.y + Math.sin(angle) * R,
          x2: b.x - Math.cos(angle) * R,
          y2: b.y - Math.sin(angle) * R,
        });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 1440 560"
      className="w-full"
      role="img"
      aria-label="Teknologien i fem lag: design, verktøy, kode, innhold og drift, der hvert lag henger sammen med det neste."
    >
      <g className="stroke-ink" strokeWidth="1" opacity="0.42">
        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
        ))}
      </g>

      {LAYERS.map((layer) => (
        <text
          key={layer.name}
          x={layer.x}
          y={HEAD_Y}
          textAnchor="middle"
          className="fill-ink text-xs font-medium tracking-[0.08em] uppercase"
          style={{ fontSize: 12, letterSpacing: "0.08em" }}
        >
          {layer.name}
        </text>
      ))}

      {positions.flat().map((p) => (
        <g key={p.name}>
          <circle
            cx={p.x}
            cy={p.y}
            r={R}
            fill="none"
            strokeWidth="1"
            className="stroke-ink"
            opacity="0.42"
          />
          <text
            x={p.x}
            y={p.y + R + 22}
            textAnchor="middle"
            className="fill-ink"
            opacity="0.72"
            style={{ fontSize: 12 }}
          >
            {p.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
