# Design-brief — visuell retning

Basert på referansene: gaadesign.studio/work (primær, hentet live — se målte verdier under) og et Cosmos-skjermbilde (sekundær, for varme/personlighet). Wireframene ligger i Figma: https://www.figma.com/design/VSuFmr2I6jrYofF54jSlJh/Designportefolio-%E2%80%94-Wireframes

## Tolkning av referansene

**GAA.D.S (primær — strukturen)**: Sveitsisk/utilitaristisk minimalisme. All tekst holder seg på ~12px, samme vekt, hele siden — hierarki skapes av layout og bilder, ikke av typografisk skala. Prosjektgrid er 2 kolonner, kant-til-kant bilder (ingen border, ingen gap), med tittel/tags/år i tre små linjer under hvert bilde. "See case study"-piller flyter over bildet nederst til venstre.

**Cosmos (sekundær — varmen)**: Varm off-white bakgrunn (ikke rent hvit), ett trygt sted med typografisk selvtillit (stor overskrift), sorte piller. Jeg låner bakgrunnstonen og pille-selvtilliten herfra, IKKE de fargerike flytende formene eller den enorme beskårne wordmarken i bunn — det leser mer som forbruker-app-markedsføring enn en profesjonell case-study-portefølje. Si ifra hvis du faktisk vil ha noe av den lekenheten inn likevel.

## Avvik fra wireframene å være obs på

Wireframene (fra forrige runde) brukte en 3-kolonners grid med border rundt hvert kort. Referansen bruker 2 kolonner, kant-til-kant, uten border. Jeg foreslår å følge referansen (2 kolonner, borderless, bilder får mer plass) — si ifra om du heller vil beholde 3 kolonner.

## Målte verdier fra gaadesign.studio (live, ikke gjettet)

- Skrift: Helvetica Neue (Medium/Bold/Regular/Condensed Bold) + Inter som sekundær
- Kroppstekst/meta: 12px, weight 400–500, letter-spacing ~normal til -0.5px
- Bakgrunn: #FFFFFF, tekst: #000000
- Pille-knapp: bg #F6F6F6, border-radius 12px (visuelt leser som full pill pga. liten høyde ~26px), padding 6px 8px, 12px/400
- Ingen andre bakgrunnsfarger i bruk — helt monokromt

## Token-forslag for designsystemet

**Farge** (varmere enn ren sort/hvit, jf. Cosmos-lånet):
| Token | Verdi | Bruk |
|---|---|---|
| `ink` | `#0A0A0A` | Primærtekst, wordmark |
| `paper` | `#F7F5F1` | Sidebakgrunn (varm off-white) |
| `surface` | `#FFFFFF` | Kort/pille-bakgrunn på paper |
| `line` | `#E4E1DA` | Hårfine delelinjer |
| `muted` | `#8C877D` | Meta-tekst (tags, år, roller) |

Ingen fargeaksent — systemet er bevisst monokromt, som referansen. Piller/CTA-er bruker `ink` som fylt sort, ikke en aksentfarge.

**Typografi**: Inter (Google Fonts — metrisk nær Helvetica Neue, fungerer på tvers av OS i nettleseren; Helvetica Neue selv er ikke web-lisensiert utenfor macOS)
| Rolle | Størrelse / vekt | Bruk |
|---|---|---|
| micro | 12px / 400 | Meta, footer, tags |
| label | 12px / 500, tight tracking | Nav, tab-switcher |
| body | 14–15px / 400 | Case-study-brødtekst |
| project-title | 13–14px / 500 | Tittel under prosjektkort |
| h1 | 32–40px / 600, tracking -1% | Prosjekttittel på detaljside |
| wordmark | 15px / 700, uppercase, tracking +2% | Logo/navn i header |

**Spacing**: 8px grunnenhet — 8 / 16 / 24 / 32 / 48 / 64 / 96

**Radius**: piller = 999px (full), ingen andre avrundinger — kort og bilder er skarpkantet

**Grid**: prosjektoversikt = 2 kolonner, kant-til-kant (ingen gap, ingen border), full-bleed bilder
