import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
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
    <div className="flex flex-1 flex-col gap-48 px-24 pt-32 pb-64 md:px-48 lg:px-[120px]">
      <div className="flex flex-col gap-8">
        <Link href="/" className="w-fit text-xs font-medium tracking-[-0.01em] text-ink">
          ← Tilbake
        </Link>
        <p className="text-xs tracking-[0.08em] text-muted uppercase">
          Prosjektside — /arbeid/{slug}
        </p>
      </div>

      <div className="relative aspect-[16/7] w-full overflow-hidden rounded-card bg-line">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-24">
        <h1 className="text-[36px] leading-[1.05] font-semibold tracking-[-0.01em] text-ink">
          {project.title}
        </h1>
        <div className="flex flex-wrap gap-48 border-y border-line py-16">
          <MetaItem label="Rolle" value={project.role} />
          <MetaItem label="År" value={project.year} />
          <MetaItem label="Verktøy" value={project.tools} />
        </div>
      </div>

      <div className="flex max-w-[760px] flex-col gap-32">
        <ContentBlock heading={project.challenge.heading} body={project.challenge.body} />
        <ContentBlock heading={project.process.heading} body={project.process.body} />
      </div>

      {project.gallery.length > 0 ? (
        <div className="grid grid-cols-1 gap-24 md:grid-cols-3">
          {project.gallery.map((src) => (
            <div
              key={src}
              className="relative aspect-[331/379] w-full overflow-hidden rounded-card bg-line"
            >
              <Image src={src} alt="" fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      {next ? (
        <div className="flex justify-end pt-16">
          <Link
            href={`/arbeid/${next.slug}`}
            className="text-xs font-medium tracking-[-0.01em] text-ink"
          >
            Neste prosjekt →
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-[100px] flex-col gap-8">
      <span className="text-xs tracking-[0.06em] text-muted uppercase">{label}</span>
      <span className="text-xs font-medium tracking-[-0.01em] text-ink">{value}</span>
    </div>
  );
}

function ContentBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="flex flex-col gap-16">
      <span className="text-xs font-medium tracking-[-0.01em] text-ink">{heading}</span>
      <p className="text-[15px] leading-[1.6] tracking-[-0.005em] text-ink">{body}</p>
    </div>
  );
}
