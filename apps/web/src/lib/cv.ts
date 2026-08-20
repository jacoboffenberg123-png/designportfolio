import { cmsFetch, cmsMediaUrl } from "./cms";

export type CVData = {
  bio: string;
  avatarUrl?: string;
  education: { program: string; school: string; dates: string }[];
  skills: string[];
  contactEmail: string;
  linkedin: string;
  instagram: string;
};

type PayloadMedia = { url?: string };

type PayloadCV = {
  bio?: string;
  avatar?: PayloadMedia | string;
  education?: { program: string; school: string; dates: string }[];
  skills?: { label: string }[];
  contactEmail?: string;
  linkedin?: string;
  instagram?: string;
};

const fallback: CVData = {
  bio: "",
  education: [],
  skills: [],
  contactEmail: "kontakt@epost.no",
  linkedin: "#",
  instagram: "#",
};

export async function getCV(): Promise<CVData> {
  const doc = await cmsFetch<PayloadCV>("/api/globals/cv?depth=1");
  if (!doc) return fallback;

  const avatar = typeof doc.avatar === "object" ? doc.avatar?.url : undefined;

  return {
    bio: doc.bio || fallback.bio,
    avatarUrl: cmsMediaUrl(avatar),
    education: doc.education ?? [],
    skills: (doc.skills ?? []).map((s) => s.label),
    contactEmail: doc.contactEmail || fallback.contactEmail,
    linkedin: doc.linkedin || fallback.linkedin,
    instagram: doc.instagram || fallback.instagram,
  };
}
