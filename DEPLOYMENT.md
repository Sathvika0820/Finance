# BankHub Deployment

BankHub is a TanStack Start SSR app. Use an SSR-capable target for production so deep links such as `/dashboard`, `/banks`, and `/banks/:bankId` refresh correctly.

## Vercel

Recommended target.

- Install command: `npm ci`
- Build command: `npm run build`
- Output: Vercel Build Output API (`.vercel/output`) generated automatically when `VERCEL=1`

The included `vercel.json` is intentionally minimal so Vercel can use the Nitro adapter output.

## Cloudflare

The existing Cloudflare/TanStack configuration remains supported.

- Build command: `npm run build`
- Deploy using the generated Cloudflare server output or Wrangler flow used by the project.

## Netlify

Use Netlify's SSR/runtime support, not static-only hosting. Netlify sets `NETLIFY=1`, which enables the Nitro adapter path in `vite.config.ts`.

- Install command: `npm ci`
- Build command: `npm run build`

## Firebase Hosting

Firebase Hosting by itself is static-only. BankHub needs SSR for production refresh/deep-link behavior. Use Firebase Hosting with a server runtime such as Cloud Functions/Cloud Run, or deploy BankHub to Vercel/Cloudflare and use Firebase only for a separate static landing/redirect layer.

## Production QA

Before deploying:

1. Run `npm run build`.
2. Run `npm run preview`.
3. Verify `/`, `/dashboard`, `/banks`, `/favorites`, and a `/banks/:bankId` page.
4. Verify the floating AI assistant, loan comparison, language switching, Safety Shield, and official-link buttons.

