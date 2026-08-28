import type { GalleryItem, Project } from "@/lib/projects";
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
 * A row of images that runs edge to edge, no gaps and no side margin — the page
 * stops being a document for a moment and becomes the product. Used for both the
 * final design and the special editions, so the two read as the same kind of
 * statement.
 */
function Triptych({ images }: { images: GalleryItem[] }) {
  if (images.length === 0) return null;
  // The band takes its shape from the uploads rather than a fixed ratio: a
  // packaging render is wider than it is tall, and forcing it into a squarer box
  // both crops the sides and makes the band taller than the pictures warrant.
  // One ratio for the whole row, from the first image, so they stay level even
  // if a later upload differs.
  const first = images[0];
  const ratio = first.width && first.height ? `${first.width} / ${first.height}` : "8 / 7";
  return (
    // Wrapping flex rather than a grid: three fit per row, and a row left with
    // one or two grows them to fill the width. A grid would leave a white notch
    // at the end of the band, which reads as a mistake when nothing else on the
    // page bleeds to the edge.
    <div className="flex flex-wrap">
      {images.map((g) => (
        <div key={g.url} className="grow basis-full sm:basis-1/2 md:basis-1/3">
          <Figure
            src={g.url}
            ratio={ratio}
            rounded={false}
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}

/** One half of the before/after comparison. */
function LogoSide({
  src,
  label,
  note,
}: {
  src?: string;
  label: string;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-16">
      {/* Both sides get the same box, so two marks drawn on a shared canvas keep
          their baseline and cap-height across the gap between them. */}
      <Figure
        src={src}
        ratio="2 / 1"
        rounded={false}
        contain
        sizes="(min-width: 768px) 50vw, 100vw"
      />
      <div className="flex flex-col gap-8">
        <Eyebrow>{label}</Eyebrow>
        {note ? <p className="text-sm leading-[1.55] text-muted">{note}</p> : null}
      </div>
    </div>
  );
}

/**
 * Argumentet — for a rebrand, where the work only makes sense as a chain of
 * reasoning: the reading that broke from the brief, the strategy that followed,
 * how the mark changed, and what it became. Sections drop out when empty.
 */
export default function Argument({
  project,
  nextSlug,
}: {
  project: Project;
  nextSlug?: string;
}) {
  const { logo, carrier, special } = project;
  const hasLogos = Boolean(logo.before || logo.after);

  return (
    <main className="flex flex-1 flex-col">
      <Figure src={project.imageUrl} ratio="9 / 5" rounded={false} priority />

      <Band className="pt-64">
        <div className="flex flex-col gap-48">
          <PageTitle>{project.title}</PageTitle>
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

      {project.angle ? (
        <Band className="pt-96">
          <div className="flex max-w-[760px] flex-col gap-24">
            <Eyebrow>Vinkling</Eyebrow>
            <Body>{project.angle}</Body>
          </div>
        </Band>
      ) : null}

      {project.strategy.length > 0 ? (
        <Band className="pt-96">
          <div className="flex flex-col gap-32">
            <Eyebrow>Strategien</Eyebrow>
            {/* Two columns on a tablet rather than four: four 14px lines in a
                190px column break after every second word. */}
            <div className="grid grid-cols-1 gap-24 sm:grid-cols-2 lg:grid-cols-4">
              {project.strategy.map((s) => (
                <div key={s.label} className="flex flex-col gap-12">
                  <Eyebrow>{s.label}</Eyebrow>
                  <p className="text-sm leading-[1.55] text-ink">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Band>
      ) : null}

      {hasLogos ? (
        <Band className="pt-96">
          <div className="flex flex-col gap-32">
            <Eyebrow>Logoutvikling</Eyebrow>
            <div className="grid grid-cols-1 gap-48 md:grid-cols-2 md:gap-24">
              <LogoSide src={logo.before} label="Før" note={logo.beforeNote} />
              <LogoSide src={logo.after} label="Etter" note={logo.afterNote} />
            </div>
          </div>
        </Band>
      ) : null}

      {carrier.items.length > 0 || carrier.lead ? (
        <Band className="pt-96">
          <div className="flex flex-col gap-32">
            <div className="flex max-w-[760px] flex-col gap-16">
              <Eyebrow>{carrier.heading}</Eyebrow>
              {carrier.lead ? <Body>{carrier.lead}</Body> : null}
            </div>
            {carrier.items.length > 0 ? (
              <div className="grid grid-cols-1 gap-24 sm:grid-cols-3">
                {carrier.items.map((item) => (
                  <div key={item.url} className="flex flex-col gap-8">
                    <Figure
                      src={item.url}
                      ratio="308 / 476"
                      rounded={false}
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                    {item.label ? <Eyebrow>{item.label}</Eyebrow> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Band>
      ) : null}

      {project.gallery.length > 0 ? (
        <>
          <Band className="pt-96 pb-32">
            <Eyebrow>Endelig design</Eyebrow>
          </Band>
          <Triptych images={project.gallery} />
        </>
      ) : null}

      {project.designNote ? (
        // Sits close to the images above: it's a note on them, not a new section.
        <Band className="pt-48">
          <div className="max-w-[760px]">
            <Body>{project.designNote}</Body>
          </div>
        </Band>
      ) : null}

      {special.images.length > 0 ? (
        <>
          <Band className="pt-96 pb-32">
            <Eyebrow>{special.heading}</Eyebrow>
          </Band>
          <Triptych images={special.images} />
        </>
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
