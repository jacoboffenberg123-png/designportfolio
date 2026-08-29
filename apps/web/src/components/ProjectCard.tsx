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
    // 18 and 20 are written out rather than as gap-18/pb-20: neither is in the
    // project's spacing scale, so those would fall through to Tailwind's own and
    // land on 72px and 80px. The bottom padding is what opens up the row gap —
    // 48 between rows plus 20 under each card.
    <Link
      href={`/arbeid/${slug}`}
      className="group flex flex-col gap-[18px] pb-[20px] transition-opacity duration-150 active:opacity-90"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-line">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            // group-active as well as group-hover: Tailwind gates hover behind
            // @media (hover:hover), so on a phone none of it runs and a tap
            // gives no sign the card registered it. Active fires on touch.
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-active:scale-[1.03]"
          />
        ) : null}

        {/* Year sits on the image so the meta line below stays to one thought.
            White rather than `text-surface`: these two labels sit on a scrim
            over a photograph, not on the page, so they shouldn't travel with
            the dimmer the way the page's own ink does. */}
        <span className="serial absolute top-16 right-16 rounded-sm bg-scrim px-8 py-[6px] text-xs leading-[1.2] font-medium tracking-[0.08em] text-white uppercase backdrop-blur-[24px]">
          {year}
        </span>

        <div className="absolute inset-x-0 bottom-32 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100">
          <span className="rounded-pill bg-glass px-16 py-8 text-xs leading-[1.2] font-medium tracking-[0.08em] text-white uppercase backdrop-blur-[17px] transition-colors duration-200 hover:bg-white/35">
            {ctaLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <span className="text-[25px] leading-[1.3] font-medium tracking-[-0.005em] text-ink capitalize">
          {title}
        </span>
        <span className="text-base leading-[1.65] tracking-[-0.005em] text-ink">{category}</span>
      </div>
    </Link>
  );
}
