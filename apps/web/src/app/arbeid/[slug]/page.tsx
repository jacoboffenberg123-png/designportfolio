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
    <div className="flex flex-1 flex-col gap-48 px-24 pt-24 pb-96 md:px-48 lg:px-120">
      <Link
        href="/"
        className="w-fit text-[13px] leading-[1.3] font-medium text-ink hover:underline"
      >
        ← Tilbake
      </Link>

      <div className="relative aspect-[16/7] w-full overflow-hidden rounded-md bg-line shadow-card">
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
        <h1 className="text-[40px] leading-[1.1] font-bold tracking-[-0.015em] text-ink">
          {project.title}
        </h1>
        <div className="flex flex-wrap gap-48 border-y border-line py-24">
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
              className="relative aspect-[384/440] w-full overflow-hidden rounded-md bg-line shadow-card"
            >
              <Image src={src} alt="" fill sizes="33vw" className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      {next ? (
        <div className="flex justify-end">
          <Link
            href={`/arbeid/${next.slug}`}
            className="text-[13px] leading-[1.3] font-medium text-ink hover:underline"
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
    <div className="flex w-[160px] flex-col gap-8">
      <span className="text-[11px] leading-[1.2] font-medium tracking-[0.08em] text-muted uppercase">
        {label}
      </span>
      <span className="text-[13px] leading-[1.3] font-medium text-ink">{value}</span>
    </div>
  );
}

function ContentBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="flex flex-col gap-16">
      <h2 className="text-[20px] leading-[1.3] font-medium tracking-[-0.005em] text-ink">
        {heading}
      </h2>
      <p className="text-base leading-[1.65] tracking-[-0.005em] text-ink">{body}</p>
    </div>
  );
}
