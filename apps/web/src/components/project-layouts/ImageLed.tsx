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
 * Bildeledet — for work where the outcome is the argument: branding, packaging,
 * print. Big imagery in an alternating rhythm, with short text as breathing room.
 * Sections drop out cleanly when their content is missing.
 */
export default function ImageLed({
  project,
  nextSlug,
}: {
  project: Project;
  nextSlug?: string;
}) {
  const [wide, ...rest] = project.gallery;
  const pair = rest.slice(0, 2);
  const grid = rest.slice(2);

  return (
    <main className="flex flex-1 flex-col">
      <Figure src={project.imageUrl} ratio="9 / 5" rounded={false} priority />

      <Band className="pt-64">
        <div className="flex flex-col gap-48">
          <PageTitle>{project.title}</PageTitle>
          <div className="flex flex-col gap-48 lg:flex-row lg:gap-96">
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

      {project.challenge.body ? (
        <Band className="pt-96">
          <div className="flex max-w-[760px] flex-col gap-16">
            <Eyebrow>{project.challenge.heading}</Eyebrow>
            <Body>{project.challenge.body}</Body>
          </div>
        </Band>
      ) : null}

      {wide ? (
        <div className="pt-96">
          <Figure src={wide.url} ratio="16 / 7" rounded={false} />
        </div>
      ) : null}

      {pair.length > 0 ? (
        <Band className="pt-96">
          <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
            {pair.map((g) => (
              <Figure key={g.url} src={g.url} ratio="4 / 3" sizes="(min-width: 768px) 50vw, 100vw" />
            ))}
          </div>
        </Band>
      ) : null}

      {project.process.body ? (
        <Band className="pt-96">
          <div className="flex max-w-[760px] flex-col gap-16">
            <Eyebrow>{project.process.heading}</Eyebrow>
            <Body>{project.process.body}</Body>
          </div>
        </Band>
      ) : null}

      {grid.length > 0 ? (
        <Band className="pt-64">
          <div className="grid grid-cols-1 gap-24 md:grid-cols-3">
            {grid.map((g) => (
              <Figure key={g.url} src={g.url} ratio="4 / 5" sizes="33vw" />
            ))}
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
