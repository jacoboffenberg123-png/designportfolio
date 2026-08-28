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
  // Three groups: a row of three after each text block, then whatever is left
  // under its own heading in a wider format. Each group drops out when empty,
  // so a project with four images still reads properly.
  const afterChallenge = project.gallery.slice(0, 3);
  const afterProcess = project.gallery.slice(3, 6);
  const closing = project.gallery.slice(6);

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

      {project.challenge.body ? (
        <Band className="pt-96">
          <div className="flex max-w-[760px] flex-col gap-16">
            <Eyebrow>{project.challenge.heading}</Eyebrow>
            <Body>{project.challenge.body}</Body>
          </div>
        </Band>
      ) : null}

      {afterChallenge.length > 0 ? (
        <Band className="pt-64">
          <div className="grid grid-cols-1 gap-24 sm:grid-cols-3">
            {afterChallenge.map((g) => (
              <Figure key={g.url} src={g.url} ratio="4 / 5" sizes="(min-width: 640px) 33vw, 100vw" />
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

      {afterProcess.length > 0 ? (
        <Band className="pt-64">
          <div className="grid grid-cols-1 gap-24 sm:grid-cols-3">
            {afterProcess.map((g) => (
              <Figure key={g.url} src={g.url} ratio="4 / 5" sizes="(min-width: 640px) 33vw, 100vw" />
            ))}
          </div>
        </Band>
      ) : null}

      {closing.length > 0 ? (
        // The heading sits a long way below the row above it — the drawing puts
        // 96 on the section and another 96 on the label, which reads as a
        // deliberate break before the last set rather than a continuation.
        <Band className="pt-96">
          <div className="flex flex-col">
            {project.galleryHeading ? (
              <div className="max-w-[760px] pt-96 pb-[20px]">
                <Eyebrow>{project.galleryHeading}</Eyebrow>
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
              {closing.map((g) => (
                <Figure
                  key={g.url}
                  src={g.url}
                  ratio="4 / 3"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
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
