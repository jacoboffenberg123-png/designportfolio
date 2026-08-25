import Image from "next/image";
import { notFound } from "next/navigation";
import ProjectTopBar from "@/components/ProjectTopBar";
import PillLink from "@/components/PillLink";
import { getProjectBySlug, getNextProject } from "@/lib/projects";

export default async function ProsjektsidePage({
  params,
}: PageProps<"/arbeid/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const next = await getNextProject(slug);

  return (
    <>
      <ProjectTopBar />
      <main className="flex flex-1 flex-col">
        {/* Full bleed — the hero runs edge to edge, outside the content margin. */}
        <div className="relative aspect-[9/5] w-full bg-line">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-64 px-24 pt-64 pb-96 md:px-48 lg:px-120">
          <h1 className="text-[40px] leading-[1.1] font-bold tracking-[-0.015em] text-ink uppercase">
            {project.title}
          </h1>

          <div className="flex flex-col gap-48 lg:flex-row lg:gap-96">
            <div className="flex flex-1 flex-col gap-16">
              <Eyebrow>{project.challenge.heading}</Eyebrow>
              <p className="text-base leading-[1.65] tracking-[-0.005em] text-ink">
                {project.challenge.body}
              </p>
            </div>

            <dl className="flex w-full flex-col lg:w-[400px]">
              <MetaRow label="Kategori" value={project.category} />
              <MetaRow label="År" value={project.year} />
              <MetaRow label="Rolle" value={project.role} />
              <MetaRow label="Verktøy" value={project.tools} />
            </dl>
          </div>

          <div className="flex max-w-[760px] flex-col gap-16">
            <Eyebrow>{project.process.heading}</Eyebrow>
            <p className="text-base leading-[1.65] tracking-[-0.005em] text-ink">
              {project.process.body}
            </p>
          </div>

          {project.gallery.length > 0 ? (
            <div className="grid grid-cols-1 gap-24 md:grid-cols-3">
              {project.gallery.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[384/440] w-full overflow-hidden rounded-md bg-line shadow-card"
                >
                  <Image src={src} alt="" fill sizes="33vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}

          {next ? (
            <div className="flex justify-end">
              <PillLink href={`/arbeid/${next.slug}`}>Neste prosjekt →</PillLink>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] leading-[1.2] font-medium tracking-[0.08em] text-ink uppercase">
      {children}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-24 border-t border-line py-16">
      <dt className="w-[120px] shrink-0 text-[11px] leading-[1.2] font-medium tracking-[0.08em] text-muted uppercase">
        {label}
      </dt>
      <dd className="text-sm leading-[1.55] text-ink">{value}</dd>
    </div>
  );
}
