import { cmsFetch, cmsMediaUrl } from "./cms";

export type ProjectLayout = "bildeledet" | "katalog";

export type GalleryItem = {
  url: string;
  label?: string;
  featured?: boolean;
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
  role: string;
  tools: string;
  imageUrl?: string;
  gallery: GalleryItem[];
  challenge: { heading: string; body: string };
  process: { heading: string; body: string };
  reflection: string;
};

type PayloadMedia = { url?: string };

type PayloadProject = {
  slug: string;
  title: string;
  layout?: string;
  intro?: string;
  category: string;
  year: string;
  subject?: string;
  duration?: string;
  role?: string;
  tools?: string;
  order?: number;
  coverImage?: PayloadMedia | string;
  gallery?: { image?: PayloadMedia | string; label?: string; featured?: boolean }[];
  challenge?: { heading?: string; body?: string };
  process?: { heading?: string; body?: string };
  reflection?: string;
};

type PayloadFindResponse<T> = { docs: T[] };

function mediaUrl(m: PayloadMedia | string | undefined) {
  return cmsMediaUrl(typeof m === "object" ? m?.url : undefined);
}

function toProject(doc: PayloadProject): Project {
  return {
    slug: doc.slug,
    title: doc.title,
    layout: doc.layout === "katalog" ? "katalog" : "bildeledet",
    intro: doc.intro ?? "",
    category: doc.category,
    year: doc.year,
    subject: doc.subject ?? "",
    duration: doc.duration ?? "",
    role: doc.role ?? "",
    tools: doc.tools ?? "",
    imageUrl: mediaUrl(doc.coverImage),
    // flatMap rather than map+filter so an item without a resolvable URL is
    // dropped and the remaining ones keep a non-optional url.
    gallery: (doc.gallery ?? []).flatMap<GalleryItem>((item) => {
      const url = mediaUrl(item.image);
      if (!url) return [];
      return [{ url, label: item.label || undefined, featured: item.featured ?? false }];
    }),
    challenge: {
      heading: doc.challenge?.heading || "Utfordringen",
      body: doc.challenge?.body || "",
    },
    process: {
      heading: doc.process?.heading || "Prosessen",
      body: doc.process?.body || "",
    },
    reflection: doc.reflection ?? "",
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
