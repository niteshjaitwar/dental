# Dental White-Label Next.js Template

Multi-tenant dental clinic frontend built with Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, and server actions.

## Stack

- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- React Calendar + Day.js
- Zod validation on client and server
- Server Actions for booking, enquiry, and chatbot workflows
- Next Themes + Lenis

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Quality Scripts

```bash
npm run lint
npm run typecheck
npm run build
npm run format:check
npm run analyze
```

`npm run analyze` enables `@next/bundle-analyzer` through `ANALYZE=true`.

## White-Label Configuration

All clinic-specific branding, copy, SEO defaults, navigation, forms, doctors, services, blog content, and manifest values live in [`lib/config.ts`](./lib/config.ts).

To launch another clinic, update:

- Brand identity: name, legal name, logo, favicon, colors
- Contact details: phone, email, WhatsApp, map, geo coordinates
- Navigation and CTA labels
- Hero content, service list, doctor profiles, testimonials, FAQs
- Blog articles and review stats
- SEO defaults, manifest metadata, and JSON-LD inputs

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_SITE_URL`: deployed public domain
- `BOOKING_WEBHOOK_URL`: private webhook endpoint that receives booking submissions
- `CONTACT_WEBHOOK_URL`: private webhook endpoint that receives enquiry submissions
- `ANALYZE`: optional bundle analysis flag

Important:

- Only `NEXT_PUBLIC_*` variables are exposed to the browser.
- Booking and enquiry forms intentionally fail closed when webhook URLs are missing, so the site never shows fake success in production.

## Form Workflows

Booking and enquiry forms are handled by server actions in [`app/actions/forms.ts`](./app/actions/forms.ts).

Current behavior:

- client-side validation uses shared Zod schemas
- server-side validation re-runs the same schema
- submissions forward to private webhook URLs
- missing webhook configuration returns a clear error instead of fake confirmation

This keeps the codebase production-safe while leaving CRM, email, or automation routing flexible.

## SEO and Platform Readiness

The app includes:

- dynamic metadata helper with canonical URLs
- Open Graph and Twitter metadata
- `app/sitemap.ts`
- `app/robots.ts`
- `app/manifest.ts`
- `LocalBusiness` JSON-LD
- generated OG image routes

## Security Notes

- Security headers and CSP are configured in [`next.config.mjs`](./next.config.mjs)
- No sensitive secrets are shipped via client-side environment variables
- Forms use server-side validation before forwarding data
- HTTPS is handled automatically on Vercel once the domain is connected

## Deployment

### Vercel

1. Push the repository.
2. Import it into Vercel.
3. Add environment variables from `.env.example`.
4. Connect the production domain.
5. Trigger a production deployment.

Preview deployments work automatically on new commits.

## Pricing / Packaging Notes

This repository is suitable for white-label delivery models such as:

- single-clinic launch package
- multi-clinic template licensing
- managed monthly maintenance retainers

Pricing logic is intentionally not embedded in the app; keep commercial packaging in your sales process or external docs.

## Remaining Non-Code Launch Tasks

Before calling the site fully live, complete:

- real webhook/CRM/email automation setup
- clinic-approved content and imagery replacement
- domain, analytics, and search console setup
- manual QA on mobile, tablet, and desktop
- Lighthouse verification on the target deployment
