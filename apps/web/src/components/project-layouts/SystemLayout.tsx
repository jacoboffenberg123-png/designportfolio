import type { Project } from "@/lib/projects";
import LiveComponents from "./LiveComponents";
import { SystemMap, WorkflowLoop } from "./SystemDiagrams";
import {
  Band,
  Body,
  Eyebrow,
  Figure,
  MetaTable,
  NextProject,
  PageTitle,
  Reflection,
} from "./shared";

/**
 * Systemet — for the one project that is the site itself. Instead of showing an
 * outcome, it shows how the thing is put together: the services, the loop the
 * work ran in, and the parts, live. There's no hero image because the subject
 * is the page you're already standing on.
 */
export default function SystemLayout({
  project,
  nextSlug,
}: {
  project: Project;
  nextSlug?: string;
}) {
  // The gallery holds the two device shots, in order: desktop then phone.
  const [desktop, phone] = project.gallery;

  return (
    <main className="flex flex-1 flex-col">
      <Band className="pt-64">
        <div className="flex flex-col gap-48">
          <PageTitle>{project.title}</PageTitle>
          <div className="flex flex-col gap-48 md:flex-row md:gap-48 lg:gap-96">
            {project.intro ? (
              <div className="flex flex-1 flex-col gap-16">
                <Eyebrow>Om prosjektet</Eyebrow>
                <Body>{project.intro}</Body>
              </div>
            ) : (
              <div className="flex-1" />
            )}
            <MetaTable project={project} />
          </div>
        </div>
      </Band>

      {project.angle ? (
        <Band className="pt-96">
          <div className="flex max-w-[760px] flex-col gap-24">
            <Eyebrow>Vinkling</Eyebrow>
            <Body>{project.angle}</Body>
          </div>
        </Band>
      ) : null}

      <Band className="pt-120">
        <div className="flex flex-col gap-32">
          <div className="flex max-w-[760px] flex-col gap-16">
            <Eyebrow>Systemkart</Eyebrow>
            <Body>
              Fire tjenester, hver med én jobb. Nettsiden vet ingenting om databasen — den
              spør CMS-et, og CMS-et eier lagringen. Det gjør at innholdet kan endres uten
              at noe bygges på nytt, og at et bytte av database ikke rører frontend.
            </Body>
          </div>
          <SystemMap />
        </div>
      </Band>

      <Band className="pt-120">
        <div className="flex flex-col gap-32">
          <div className="flex max-w-[760px] flex-col gap-16">
            <Eyebrow>Arbeidsflyten</Eyebrow>
            <Body>
              Sløyfen jeg jobbet i. Agenten leser Figma-filen direkte gjennom en
              plugin-bro, så en endring i en komponent kan hentes ut som tall og ikke som
              beskrivelse. Det korteste jeg fikk en endring fra tegning til publisert side
              var under to minutter.
            </Body>
          </div>
          <WorkflowLoop />
        </div>
      </Band>

      {desktop ? (
        <Band className="pt-120">
          <div className="flex flex-col gap-32">
            <div className="flex max-w-[760px] flex-col gap-16">
              <Eyebrow>Grensesnittet</Eyebrow>
              <Body>
                Tre sider av de samme delene. Hele paletten styres av én skyvekontroll som
                går trinnløst fra lyst til mørkt — den bytter ikke mellom to temaer, den
                regner ut hvert steg.
              </Body>
            </div>
            {/* One box, both screens, matched heights: on a phone they stack and
                each keeps its own shape. */}
            <div className="flex flex-col items-center gap-48 rounded-md bg-sunken p-24 sm:flex-row sm:justify-center sm:p-48 lg:p-64">
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

      <Band className="pt-120" >
        <div className="flex scroll-mt-96 flex-col gap-32" id="komponentene">
          <div className="flex max-w-[760px] flex-col gap-16">
            <Eyebrow>Komponentene</Eyebrow>
            <Body>
              Tolv komponenter i Figma, hver med sin motpart her. Delene under er ikke
              bilder og ikke en prototype — det er komponentene siden faktisk er bygget av.
              Bruk dem.
            </Body>
          </div>
          <LiveComponents />
        </div>
      </Band>

      <Band className="pt-120 pb-96">
        <div className="flex flex-col gap-32">
          <Reflection text={project.reflection} />
          <NextProject slug={nextSlug} />
        </div>
      </Band>
    </main>
  );
}
