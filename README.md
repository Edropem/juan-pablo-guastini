# Juan Pablo Guastini — Portfolio

Bilingual (EN/ES) Art Director portfolio built with **Next.js** and **Payload CMS 3**, ready to deploy on **Vercel** (Neon Postgres + Vercel Blob).

## Stack

- Next.js App Router + Payload 3 (admin at `/admin`)
- PostgreSQL via `@payloadcms/db-vercel-postgres`
- Vercel Blob for media in production (local disk when `BLOB_READ_WRITE_TOKEN` is unset)
- Tailwind CSS + Motion for restrained animation
- Locales: `/en` and `/es`

## Pages

| Route | Content |
|-------|---------|
| `/[locale]` | Home — brand, intro, featured work |
| `/[locale]/work` | Project index |
| `/[locale]/work/[slug]` | Project detail |
| `/[locale]/about` | Bio |
| `/[locale]/contact` | Email, socials, contact form |

Author all content in Payload (no seed projects). Upload work assets as **Media**, then create **Projects**.

## Local development

### 1. Database

Start Postgres (Docker):

```bash
docker compose up -d
```

Or point `POSTGRES_URL` at any Postgres instance. The DB name should match (default: `jpg_portfolio`).

### 2. Environment

```bash
cp .env.example .env
```

Set at least:

- `POSTGRES_URL`
- `PAYLOAD_SECRET`

### 3. Install & run

```bash
pnpm install
pnpm dev
```

- Site: [http://localhost:3000](http://localhost:3000) (redirects to `/en` or `/es`)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — create the first user on first visit

In development, schema changes sync automatically (`push`). For production, use migrations:

```bash
pnpm payload migrate:create
pnpm payload migrate
```

### 4. Author content

1. **Globals → Site Settings** — site name, email, social links, default SEO, footer line (EN + ES)
2. **Globals → Home → Hero** — hero image, headline, subhead, intro, CTA label/link (brand name comes from Site Settings)
3. **Globals → About** — bio, portrait, credits
4. **Media** — upload images from Drive (or elsewhere)
5. **Projects** — title, slug, year, disciplines, summary, cover, gallery, body; mark **featured** and set **order**
6. Switch locale in the admin locale selector to fill Spanish fields

Contact form submissions appear under **Form Submissions**.

## Deploy on Vercel

1. Push this repo and import the project in Vercel
2. Add **Neon / Vercel Postgres** and **Blob** stores
3. Set env vars:
   - `POSTGRES_URL` (from the Postgres store)
   - `PAYLOAD_SECRET` (long random string)
   - `BLOB_READ_WRITE_TOKEN` (from Blob)
   - `NEXT_PUBLIC_SERVER_URL` (production URL, e.g. `https://your-domain.com`)
4. Build command: `pnpm run ci` (runs `payload migrate` then `next build`)
5. After deploy, open `/admin`, create a user, and author content

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Local development |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm payload generate:types` | Regenerate `payload-types.ts` |
| `pnpm payload migrate:create` | Create a DB migration |
| `pnpm ci` | Migrate + build (Vercel) |

## Design notes

Minimal Bauhaus-leaning editorial layout (typography-first project list inspired by [luyu.co](https://luyu.co/)): Syne + Space Grotesk, dark ink palette, muted red used sparingly, subtle motion with `prefers-reduced-motion` support.
