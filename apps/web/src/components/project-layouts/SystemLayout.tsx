import type { Project } from "@/lib/projects";
import LiveComponents from "./LiveComponents";
import StackNetwork from "./StackNetwork";
import { WorkflowLoop } from "./SystemDiagrams";
import { Band, Body, Eyebrow, Figure, MetaTable, Reflection } from "./shared";

/**
 * Systemet — for the one project that is the site itself. It opens on the stack
 * rather than a photograph, because the subject is how the thing is put
 * together, and the parts further down are live rather than pictured.
 */
// nextSlug is declared but unused: the frame drops the «Neste prosjekt»
// button, and the route hands every layout the same pair of props.
export default function SystemLayout({ project }: { project: Project; nextSlug?: string }) {
  // The gallery holds the two device shots, in order: desktop then phone.
  const [desktop, phone] = project.gallery;
  // This layout's fact table is written per project — Rolle, Periode, Omfang —
  // rather than assembled from the shared fields, which don't have a row for
  // "49 commits". Falls back to the standard table when nothing is filled in.
  const facts = project.strategy;

  return (
    <main className="flex flex-1 flex-col">
      {/* The title sits inside the tinted band with the diagram rather than in
          the usual head, so the stack is the first thing on the page. */}
      <section className="bg-accent px-24 pt-48 pb-64 md:px-48 lg:px-120 lg:pt-96">
        <StackNetwork />
        <div className="mt-48 flex max-w-[760px] flex-col gap-16 lg:mt-64">
          <Eyebrow>Case · Portefølje · {project.year}</Eyebrow>
          <h1 className="text-[clamp(26px,7vw,40px)] leading-[1.1] font-bold tracking-[-0.015em] break-words text-ink uppercase">
            {project.title}
          </h1>
          {project.intro ? (
            <p className="text-base leading-[1.65] tracking-[-0.005em] text-ink">
              Tegnet i Figma, bygget i kode sammen med en agent i terminalen, driftet på fire
              tjenester. Dette er kartet over hvordan delene henger sammen.
            </p>
          ) : null}
        </div>
      </section>

      <Band className="pt-96">
        <div className="flex flex-col gap-48 md:flex-row md:gap-48 lg:gap-96">
          {project.intro ? (
            <div className="flex flex-1 flex-col gap-16">
              <Eyebrow>Om prosjektet</Eyebrow>
              <Body>{project.intro}</Body>
            </div>
          ) : (
            <div className="flex-1" />
          )}
          {facts.length > 0 ? (
            <dl className="flex w-full shrink-0 flex-col md:w-[320px] lg:w-[400px]">
              {facts.map((row) => (
                // Centred rather than top-aligned: the label and value are
                // different sizes, so aligning their tops reads as off by a line.
                <div
                  key={row.label}
                  className="flex items-center gap-24 border-t border-line py-16"
                >
                  <dt className="w-[120px] shrink-0 text-xs leading-[1.2] font-medium tracking-[0.08em] text-ink uppercase">
                    {row.label}
                  </dt>
                  <dd className="text-sm leading-[1.55] text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <MetaTable project={project} />
          )}
        </div>
      </Band>

      {desktop ? (
        <Band className="pt-96">
          <div className="flex flex-col gap-32">
            <div className="flex max-w-[760px] flex-col gap-16">
              <Eyebrow>Grensesnittet</Eyebrow>
              <Body>
                Tre sider av de samme delene. Hele paletten styres av én skyvekontroll som går
                trinnløst fra lyst til mørkt — den bytter ikke mellom to temaer, den regner ut
                hvert steg.
              </Body>
            </div>
            {/* One box, both screens, matched heights: on a phone they stack and
                each keeps its own shape. */}
            <div className="flex flex-col items-center gap-48 rounded-md bg-accent p-24 sm:flex-row sm:justify-center sm:p-48 lg:p-64">
              <div className="w-full sm:w-auto sm:flex-[792]">
                <Figure
                  src={desktop.url}
                  ratio={
                    desktop.width && desktop.height
                      ? `${desktop.width} / ${desktop.height}`
                      : "1425 / 900"
                  }
                  sizes="(min-width: 640px) 66vw, 100vw"
                />
              </div>
              {phone ? (
                <div className="w-[196px] shrink-0 sm:w-auto sm:flex-[231]">
                  <Figure
                    src={phone.url}
                    ratio={
                      phone.width && phone.height
                        ? `${phone.width} / ${phone.height}`
                        : "390 / 844"
                    }
                    sizes="(min-width: 640px) 20vw, 196px"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </Band>
      ) : null}

      <Band className="pt-96">
        <div className="flex flex-col gap-32">
          <div className="flex max-w-[760px] flex-col gap-16">
            <Eyebrow>Arbeidsflyten</Eyebrow>
            <Body>
              Prosessen jeg jobbet med. Agenten leser Figma-filen direkte gjennom en Figma MCP,
              så en endring i en komponent kan hentes ut som tall og ikke som beskrivelse. Det
              korteste jeg fikk en endring fra tegning til publisert side var under to minutter.
            </Body>
          </div>
          <WorkflowLoop />
        </div>
      </Band>

      <Band className="pt-96">
        <div className="flex scroll-mt-96 flex-col gap-32" id="komponentene">
          <div className="flex max-w-[760px] flex-col gap-16">
            <Eyebrow>Komponentene</Eyebrow>
            <Body>
              Tolv komponenter i Figma, hver med sin motpart i koden. Instansene under er ikke
              bilder — det er de samme komponentene siden bygges av, hentet rett fra biblioteket.
            </Body>
          </div>
          <LiveComponents />
        </div>
      </Band>

      <Band className="pt-96 pb-96">
        <Reflection text={project.reflection} />
      </Band>
    </main>
  );
}
