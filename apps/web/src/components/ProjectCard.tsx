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
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center justify-center whitespace-nowrap rounded-pill bg-white/20 px-16 py-8 text-xs font-normal text-surface backdrop-blur-[17px] transition-[background-color,transform] duration-200 ease-out hover:scale-[1.08] hover:bg-black/55">
            {ctaLabel}
          </span>
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
