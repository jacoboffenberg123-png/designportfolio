import type { Project } from "@/lib/projects";
import {
  Band,
  Body,
  Eyebrow,
  Figure,
  MetaTable,
  NextProject,
  PageTitle,
  Reflection,
} from "./shared";

/**
 * Katalog — for a series of objects, where the volume and the variation across
 * the set is the point. Every item is shown once, numbered and labelled; the
 * grid carries the argument, so there is no second pass on selected pieces.
 */
export default function Catalogue({
  project,
  nextSlug,
}: {
  project: Project;
  nextSlug?: string;
}) {
  return (
    <main className="flex flex-1 flex-col">
      <Figure src={project.imageUrl} ratio="9 / 5" rounded={false} priority />

      <Band className="pt-64">
        <div className="flex flex-col gap-48">
          <PageTitle>{project.title}</PageTitle>
          {/* Side by side from md up — at lg the two columns only met on very
              wide screens, and stacked on anything narrower. */}
          <div className="flex flex-col gap-48 md:flex-row md:gap-48 lg:gap-96">
            {project.intro ? (
              <div className="flex flex-1 flex-col gap-16">
                <Eyebrow>Om prosjektet</Eyebrow>
                <Body>{project.intro}</Body>
              </div>
            ) : (
              <div className="flex-1" />
            )}
            <MetaTable project={project} />
          </div>
        </div>
      </Band>

      {project.gallery.length > 0 ? (
        <Band className="pt-96">
          <div className="flex flex-col gap-32">
            <Eyebrow>Serien</Eyebrow>
            <div className="grid grid-cols-2 gap-x-24 gap-y-32 md:grid-cols-4">
              {project.gallery.map((g, i) => (
                <div key={g.url} className="flex flex-col gap-8">
                  <Figure
                    src={g.url}
                    ratio="1 / 1"
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                  {/* Centred against the label, which is the taller of the two —
                      top-aligning them leaves the number sitting high. */}
                  <div className="flex items-center gap-8">
                    {/* Three digits, so the run reads as a series rather than a
                        handful — the set is the argument here. */}
                    <span className="serial text-xs leading-[1.2] font-medium tracking-[0.08em] text-ink uppercase">
                      {`${String(i + 1).padStart(3, "0")}.`}
                    </span>
                    {g.label ? (
                      <span className="text-xs leading-[1.5] text-muted">{g.label}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Band>
      ) : null}

      <Band className="pt-96 pb-96">
        <div className="flex flex-col gap-32">
          <Reflection text={project.reflection} />
          <NextProject slug={nextSlug} />
        </div>
      </Band>
    </main>
  );
}
