# Designportefolio

Personlig portefølje-nettsted. Monorepo (npm workspaces) med to Next.js-apper:

- **`apps/web`** — den offentlige frontend-siden (Prosjektoversikt, Prosjektside, CV). Deployes til **Netlify**.
- **`apps/cms`** — Payload CMS (self-hosted), kjører inni sin egen Next.js-instans slik Payload 3 krever. Deployes til **Render**, med **Neon** (Postgres) som database og etter hvert **Cloudinary** for mediefiler.

Design­grunnlag: se [`design/design-brief.md`](design/design-brief.md) og Figma-filen den lenker til.

## Kom i gang

```bash
npm install

# Frontend, http://localhost:3001
npm run dev:web

# Payload admin, http://localhost:3002/admin
npm run dev:cms
```

`apps/cms` trenger et `.env` (kopiér `apps/cms/.env.example`) med `DATABASE_URL` (Neon) og `PAYLOAD_SECRET` før admin-panelet kan opprette en bruker.

## Status

- [x] Design­system-tokens (farger, spacing, typografi) fra `design-brief.md` satt opp som Tailwind v4-tema i `apps/web`
- [x] De tre sidene bygget med statisk plassholderdata (`apps/web/src/lib/projects.ts`, `apps/web/src/lib/cv.ts`) — samme datamodell som Payload-collectionene, så bytte til ekte data er en liten endring
- [x] Payload-collections: `Projects`, `Media`, `Users`; global: `CV`
- [ ] Koble `apps/web` til `apps/cms` sitt REST/GraphQL-API (krever `DATABASE_URL`)
- [ ] Cloudinary som media-storage-adapter for Payload
- [ ] Deploy: Netlify (web) + Render (cms) + Neon (db)

Prosjektkortenes CTA-pille ("Se mer") vises kun ved hover, per avklaring med bruker 2026-08-20 — se `ProjectCard.tsx`. CV-siden har ingen Erfaring-seksjon og ingen nedlastings-CTA, samme avklaring.
