import { cmsFetch, cmsMediaUrl } from "./cms";

const LAYOUTS = ["bildeledet", "katalog", "argumentet", "systemet"] as const;
export type ProjectLayout = (typeof LAYOUTS)[number];

export type GalleryItem = {
  url: string;
  label?: string;
  /** The upload's own pixel size, so a band can take the image's shape. */
  width?: number;
  height?: number;
};

export type Project = {
  slug: string;
  title: string;
  layout: ProjectLayout;
  intro: string;
  category: string;
  year: string;
  subject: string;
  duration: string;
  tools: string;
  imageUrl?: string;
  cardImageUrl?: string;
  gallery: GalleryItem[];
  galleryHeading: string;
  challenge: { heading: string; body: string };
  process: { heading: string; body: string };
  reflection: string;
  // --- Argumentet ---
  angle: string;
  strategy: { label: string; value: string }[];
  logo: {
    before?: GalleryItem;
    beforeNote: string;
    after?: GalleryItem;
    afterNote: string;
  };
  carrier: { heading: string; lead: string; items: GalleryItem[] };
  designNote: string;
  special: { heading: string; images: GalleryItem[] };
};

type PayloadMedia = { url?: string; width?: number; height?: number };

type PayloadProject = {
  slug: string;
  title: string;
  layout?: string;
  intro?: string;
  category: string;
  year: string;
  subject?: string;
  duration?: string;
  tools?: string;
  order?: number;
  coverImage?: PayloadMedia | string;
  cardImage?: PayloadMedia | string;
  gallery?: { image?: PayloadMedia | string; label?: string }[];
  galleryHeading?: string;
  challenge?: { heading?: string; body?: string };
  process?: { heading?: string; body?: string };
  reflection?: string;
  angle?: string;
  strategy?: { label?: string; value?: string }[];
  logo?: {
    before?: PayloadMedia | string;
    beforeNote?: string;
    after?: PayloadMedia | string;
    afterNote?: string;
  };
  carrier?: {
    heading?: string;
    lead?: string;
    items?: { image?: PayloadMedia | string; label?: string }[];
  };
  designNote?: string;
  special?: { heading?: string; images?: { image?: PayloadMedia | string }[] };
};

type PayloadFindResponse<T> = { docs: T[] };

function mediaUrl(m: PayloadMedia | string | undefined) {
  return cmsMediaUrl(typeof m === "object" ? m?.url : undefined);
}

/** A single upload with its pixel size, so a box can take the file's own shape. */
function toItem(m: PayloadMedia | string | undefined): GalleryItem | undefined {
  const url = mediaUrl(m);
  if (!url) return undefined;
  const media = typeof m === "object" ? m : undefined;
  return { url, width: media?.width, height: media?.height };
}

/**
 * flatMap rather than map+filter so an item whose upload didn't resolve is
 * dropped and the rest keep a non-optional url.
 */
function toGallery(
  items: { image?: PayloadMedia | string; label?: string }[] | undefined,
): GalleryItem[] {
  return (items ?? []).flatMap<GalleryItem>((item) => {
    const url = mediaUrl(item.image);
    if (!url) return [];
    const media = typeof item.image === "object" ? item.image : undefined;
    return [
      { url, label: item.label || undefined, width: media?.width, height: media?.height },
    ];
  });
}

function toProject(doc: PayloadProject): Project {
  return {
    slug: doc.slug,
    title: doc.title,
    layout: (LAYOUTS as readonly string[]).includes(doc.layout ?? "")
      ? (doc.layout as ProjectLayout)
      : "bildeledet",
    intro: doc.intro ?? "",
    category: doc.category,
    year: doc.year,
    subject: doc.subject ?? "",
    duration: doc.duration ?? "",
    tools: doc.tools ?? "",
    imageUrl: mediaUrl(doc.coverImage),
    // Falls back to the hero, cropped — a square crop of a wide image is
    // better than an empty card.
    cardImageUrl: mediaUrl(doc.cardImage) ?? mediaUrl(doc.coverImage),
    gallery: toGallery(doc.gallery),
    galleryHeading: doc.galleryHeading ?? "",
    challenge: {
      heading: doc.challenge?.heading || "Utfordringen",
      body: doc.challenge?.body || "",
    },
    process: {
      heading: doc.process?.heading || "Prosessen",
      body: doc.process?.body || "",
    },
    reflection: doc.reflection ?? "",
    angle: doc.angle ?? "",
    // Both halves are required, so a half-filled row would render a label with
    // nothing beside it.
    strategy: (doc.strategy ?? []).flatMap((s) =>
      s.label && s.value ? [{ label: s.label, value: s.value }] : [],
    ),
    logo: {
      before: toItem(doc.logo?.before),
      beforeNote: doc.logo?.beforeNote ?? "",
      after: toItem(doc.logo?.after),
      afterNote: doc.logo?.afterNote ?? "",
    },
    carrier: {
      heading: doc.carrier?.heading || "Bærende element",
      lead: doc.carrier?.lead ?? "",
      items: toGallery(doc.carrier?.items),
    },
    designNote: doc.designNote ?? "",
    special: {
      heading: doc.special?.heading || "Designforslag til spesial-is",
      images: toGallery(doc.special?.images),
    },
  };
}

export async function getProjects(): Promise<Project[]> {
  const res = await cmsFetch<PayloadFindResponse<PayloadProject>>(
    "/api/projects?limit=100&depth=2&sort=order",
  );
  return (res?.docs ?? []).map(toProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const res = await cmsFetch<PayloadFindResponse<PayloadProject>>(
    `/api/projects?limit=1&depth=2&where[slug][equals]=${encodeURIComponent(slug)}`,
  );
  const doc = res?.docs?.[0];
  return doc ? toProject(doc) : undefined;
}

export async function getNextProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || projects.length === 0) return undefined;
  return projects[(index + 1) % projects.length];
}
