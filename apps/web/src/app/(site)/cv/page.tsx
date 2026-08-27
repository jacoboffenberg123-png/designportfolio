import Image from "next/image";
import { getCV } from "@/lib/cv";

export default async function CVPage() {
  const cv = await getCV();

  return (
    <main className="mx-auto flex w-full max-w-[820px] flex-1 flex-col gap-48 px-24 py-64 md:px-48 lg:px-0">
      <div className="flex flex-col gap-24">
        <div className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded-sm bg-line shadow-card">
          {cv.avatarUrl ? (
            <Image
              src={cv.avatarUrl}
              alt=""
              width={120}
              height={120}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <p className="text-base leading-[1.65] tracking-[-0.005em] text-ink">{cv.bio}</p>
      </div>

      <Section title="Utdanning">
        <div className="flex flex-col gap-16">
          {cv.education.map((ed) => (
            <div key={ed.program + ed.dates} className="flex flex-col gap-8">
              <span className="text-[13px] leading-[1.3] font-medium text-ink">
                {ed.program}
              </span>
              <span className="text-xs leading-[1.5] text-muted">
                {ed.school} — {ed.dates}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Programmer">
        <div className="flex flex-wrap gap-8">
          {cv.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-sm bg-ink/5 px-12 py-8 text-xs leading-[1.5] text-ink"
            >
              {skill}
            </span>
          ))}
        </div>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-24">
      {/* Section headings carry the `eyebrow` style, not a display size — the
          page gets its hierarchy from spacing rather than typographic scale. */}
      <h2 className="text-xs leading-[1.2] font-medium tracking-[0.08em] text-ink uppercase">
        {title}
      </h2>
      {children}
    </div>
  );
}
