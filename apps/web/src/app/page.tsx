import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";

export default async function ProsjektoversiktPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-1 flex-col gap-24 px-24 pt-24 pb-48 md:px-48 lg:px-[120px]">
      <p className="text-xs tracking-[0.08em] text-muted uppercase">
        Prosjektoversikt — /arbeid
      </p>
      {projects.length === 0 ? (
        <p className="text-xs text-muted">
          Ingen prosjekter publisert ennå — legg til det første i Payload-admin.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-[42px] gap-y-[42px] md:grid-cols-2">
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
    </div>
  );
}
