import Image from "next/image";
import Link from "next/link";
import Pill from "./Pill";

type ProjectCardProps = {
  slug: string;
  title: string;
  category: string;
  year: string;
  imageUrl?: string;
  ctaLabel?: string;
};

export default function ProjectCard({
  slug,
  title,
  category,
  year,
  imageUrl,
  ctaLabel = "Se mer",
}: ProjectCardProps) {
  return (
    <Link href={`/arbeid/${slug}`} className="group flex flex-col gap-16">
      <div className="relative aspect-[16/13] w-full overflow-hidden rounded-card bg-line">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="absolute bottom-16 left-16 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Pill
            as="span"
            pillStyle="outline"
            size="small"
            className="bg-surface/80 backdrop-blur-sm"
          >
            {ctaLabel}
          </Pill>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <span className="text-[20px] font-medium uppercase text-ink">{title}</span>
        <span className="text-xs text-muted">{category}</span>
        <span className="text-xs text-muted">{year}</span>
      </div>
    </Link>
  );
}
