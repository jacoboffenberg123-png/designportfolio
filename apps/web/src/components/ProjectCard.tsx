import Image from "next/image";
import Link from "next/link";

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
      <div className="relative aspect-[16/13] w-full overflow-hidden rounded-md bg-line shadow-card transition-shadow duration-300 ease-out group-hover:shadow-card-hover">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-32 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-pill bg-white/20 px-16 py-8 text-xs leading-[1.5] text-surface shadow-pill backdrop-blur-[17px] transition-colors duration-200 hover:bg-white/35">
            {ctaLabel}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <span className="text-[22px] leading-[1.3] font-medium tracking-[-0.005em] text-ink uppercase">
          {title}
        </span>
        <div className="flex gap-8 text-xs leading-[1.5] text-muted">
          <span>{category}</span>
          <span>·</span>
          <span>{year}</span>
        </div>
      </div>
    </Link>
  );
}
