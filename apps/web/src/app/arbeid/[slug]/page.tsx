import { notFound } from "next/navigation";
import ProjectTopBar from "@/components/ProjectTopBar";
import ImageLed from "@/components/project-layouts/ImageLed";
import Catalogue from "@/components/project-layouts/Catalogue";
import Argument from "@/components/project-layouts/Argument";
import SystemLayout from "@/components/project-layouts/SystemLayout";
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
  // The template is chosen per project in Payload; new layouts get added here.
  const LAYOUTS = {
    katalog: Catalogue,
    argumentet: Argument,
    systemet: SystemLayout,
    bildeledet: ImageLed,
  } as const;
  const Layout = LAYOUTS[project.layout];

  return (
    <>
      <ProjectTopBar />
      <Layout project={project} nextSlug={next?.slug} />
    </>
  );
}
