import { cmsFetch, cmsMediaUrl } from "./cms";

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  role: string;
  tools: string;
  imageUrl?: string;
  gallery: string[];
  challenge: { heading: string; body: string };
  process: { heading: string; body: string };
};

type PayloadMedia = { url?: string };

type PayloadProject = {
  slug: string;
  title: string;
  category: string;
  year: string;
  role?: string;
  tools?: string;
  order?: number;
  coverImage?: PayloadMedia | string;
  gallery?: { image?: PayloadMedia | string }[];
  challenge?: { heading?: string; body?: string };
  process?: { heading?: string; body?: string };
};

type PayloadFindResponse<T> = { docs: T[] };

function toProject(doc: PayloadProject): Project {
  const cover = typeof doc.coverImage === "object" ? doc.coverImage?.url : undefined;
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    year: doc.year,
    role: doc.role ?? "",
    tools: doc.tools ?? "",
    imageUrl: cmsMediaUrl(cover),
    gallery: (doc.gallery ?? [])
      .map((item) => (typeof item.image === "object" ? item.image?.url : undefined))
      .map((url) => cmsMediaUrl(url))
      .filter((url): url is string => Boolean(url)),
    challenge: {
      heading: doc.challenge?.heading || "Utfordringen",
      body: doc.challenge?.body || "",
    },
    process: {
      heading: doc.process?.heading || "Prosessen",
      body: doc.process?.body || "",
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
