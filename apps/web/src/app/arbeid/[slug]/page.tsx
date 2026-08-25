import { notFound } from "next/navigation";
import ProjectTopBar from "@/components/ProjectTopBar";
import ImageLed from "@/components/project-layouts/ImageLed";
import Catalogue from "@/components/project-layouts/Catalogue";
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
  const Layout = project.layout === "katalog" ? Catalogue : ImageLed;

  return (
    <>
      <ProjectTopBar />
      <Layout project={project} nextSlug={next?.slug} />
    </>
  );
}
