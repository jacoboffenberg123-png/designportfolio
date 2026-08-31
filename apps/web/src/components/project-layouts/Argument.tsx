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
      {images.map((g, i) => (
        <div key={`${i}-${g.url}`} className="grow basis-full sm:basis-1/2 md:basis-1/3">
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

/** The mark is held well under the column width — the pair reads better with air
 *  around it than filling the half, and a smaller box oversamples the file. */
const LOGO_MAX = 420;

/** The packaging fronts are 308px wide files — drawn any bigger they're upscaled. */
const CARRIER_MAX = 308;

/** One half of the before/after comparison. */
function LogoSide({
  item,
  ratio,
  label,
  note,
}: {
  item?: GalleryItem;
  ratio: string;
  label: string;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-16">
      {/* Both sides get the same box, so two marks drawn on a shared canvas keep
          their baseline and cap-height across the gap between them. */}
      <div className="w-full" style={{ maxWidth: LOGO_MAX }}>
        <Figure
          src={item?.url}
          ratio={ratio}
          rounded={false}
          contain
          sizes={`(min-width: 768px) ${LOGO_MAX}px, 100vw`}
        />
      </div>
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
  // One ratio for both halves — that's what keeps the two wordmarks on a line.
  // Taken from whichever file is present, since they share a canvas.
  const logoRef = logo.before ?? logo.after;
  const logoRatio =
    logoRef?.width && logoRef.height ? `${logoRef.width} / ${logoRef.height}` : "2 / 1";

  return (
    <main className="flex flex-1 flex-col">
      <Figure src={project.imageUrl} height={755} rounded={false} priority />

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
        <Band className="pt-120 pb-[20px]">
          <div className="flex flex-col gap-32">
            <Eyebrow>Logoutvikling</Eyebrow>
            <div className="grid grid-cols-1 gap-48 md:grid-cols-2 md:gap-24">
              <LogoSide item={logo.before} ratio={logoRatio} label="Før" note={logo.beforeNote} />
              <LogoSide item={logo.after} ratio={logoRatio} label="Etter" note={logo.afterNote} />
            </div>
          </div>
        </Band>
      ) : null}

      {carrier.items.length > 0 || carrier.lead ? (
        <Band className="pt-120 pb-[20px]">
          <div className="flex flex-col gap-32">
            <div className="flex max-w-[760px] flex-col gap-16">
              <Eyebrow>{carrier.heading}</Eyebrow>
              {carrier.lead ? <Body>{carrier.lead}</Body> : null}
            </div>
            {carrier.items.length > 0 ? (
              // Capped at the artwork's own width and spread across the band. In
              // even thirds each card was drawn at 384px from a 308px file — a
              // 25% upscale, which is what made the row look soft. They still
              // shrink below the cap when the column can't hold three.
              <div className="flex flex-col gap-24 sm:flex-row sm:justify-between">
                {carrier.items.map((item, i) => (
                  <div
                    key={`${i}-${item.url}`}
                    className="flex flex-col gap-8 sm:flex-1"
                    style={{ maxWidth: CARRIER_MAX }}
                  >
                    <Figure
                      src={item.url}
                      ratio={
                        item.width && item.height
                          ? `${item.width} / ${item.height}`
                          : "308 / 476"
                      }
                      rounded={false}
                      sizes={`(min-width: 640px) ${CARRIER_MAX}px, 100vw`}
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
          <Band className="pt-120 pb-32">
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
          <Band className="pt-120 pb-32">
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
