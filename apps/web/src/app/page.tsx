import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";

export default async function ProsjektoversiktPage() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col gap-32 px-24 pt-48 pb-96 md:px-48 lg:px-120">
        {projects.length === 0 ? (
          <p className="text-xs leading-[1.5] text-muted">
            Ingen prosjekter publisert ennå — legg til det første i Payload-admin.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-24 gap-y-48 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={project.title}
                category={project.category}
                year={project.year}
                imageUrl={project.imageUrl}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
