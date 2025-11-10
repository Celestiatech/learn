# SimplyCode Learning Site

SimplyCode is an opinionated starter for building an interactive coding education platform. It combines structured learning tracks, MDX-based lessons, auto-tested coding challenges, and multi-provider authentication into a cohesive Next.js application ready for customization.

## Feature Highlights

- Guided learner journey with hero, roadmap, progress dashboards, and onboarding modal.
- MDX lesson rendering plus step-by-step interactive lessons authored in TypeScript.
- Rich task workspace powered by Monaco Editor, inline instructions, auto-running tests, and narrated prompts.
- Local-first progress tracking that syncs to PostgreSQL via Prisma when available.
- Email/password registration with verification, magic-link email provider, and GitHub + Google OAuth through NextAuth.
- Styled with Tailwind CSS and curated global design tokens for a premium learning UI.

## Tech Stack

- Next.js 14, React 18, TypeScript 5
- Tailwind CSS 3 with custom global CSS tokens
- MDX via `@next/mdx` and `@mdx-js/react`
- Monaco Editor for in-browser IDE experience
- NextAuth + Prisma + PostgreSQL + bcrypt for auth and persistence
- Nodemailer for transactional email

## Project Layout

- `components/` – Shared UI such as `HeroSection`, `CourseRoadmap`, `TaskWorkspace`, `OnboardingModal`, and layout primitives.
- `content/lessons/` – MDX lessons rendered statically by `/lessons/[slug]`.
- `content/interactive/` – Interactive lessons defined as TypeScript objects with metadata, steps, and runtime tests.
- `content/tracks/` – Learning track manifest (`tracks.json`) and rich task data (`journey.ts`) that drive the roadmap and workspace.
- `lib/` – Runtime utilities (`authOptions`, `mail`, `prisma`, `progress`, `store`, `tracks`).
- `pages/` – Next.js routes for marketing pages, auth flows, APIs, and lesson experiences.
- `prisma/` – Schema definition and seeding script for courses, chapters, tasks, and learner progress.
- `scripts/email-templates/` – Markdown templates for onboarding email sequences.
- `styles/globals.css` – Tailwind layers plus design system tokens for dark, vibrant interface styling.

## Content Model

- **Tracks:** `content/tracks/tracks.json` maps track IDs to ordered lesson slugs. `content/tracks/journey.ts` provides Story Mode tasks with prompts, instructions, narration, starter code, and embedded tests for the Monaco workspace.
- **Lessons:** MDX files under `content/lessons/` are bundled at build time; interactive lessons live in `content/interactive/` and are rendered via `InteractiveLesson`.
- **Progress:** `lib/progress.ts` manages localStorage persistence with real-time dispatch events. When authenticated, `/api/progress` syncs completions and XP to the database, falling back gracefully if Prisma is not configured.

## Authentication & Accounts

- `pages/api/auth/[...nextauth].ts` wires up NextAuth using configuration from `lib/authOptions.ts`.
- Providers include GitHub and Google OAuth, email/password credentials (with bcrypt verification), and magic-link email authentication (enabled when a database + mail transport are configured).
- `pages/api/auth/register.ts` handles manual account creation, hashing passwords, creating verification tokens, and sending verification emails through Nodemailer.
- `pages/api/auth/verify-email.ts` finalizes verification and redirects users back to the sign-in screen with status feedback.
- `pages/auth/signin.tsx` and `pages/auth/register.tsx` deliver custom-auth UI aligned with the rest of the branding.

## Task Workspace & Testing

- `TaskWorkspace.tsx` orchestrates the Monaco editor, instruction checklist, voice narration, and inline result reporting.
- Tests are defined per task (`content/tracks/journey.ts`, `content/interactive/*`) and executed client-side through the `tests` array. Auto-run debounces changes and reruns after typing; manual execution is also supported.
- Successful completions call `onComplete`, enabling XP accrual and progress persistence.

## Styling System

- Global tokens (colors, backgrounds, typography) are defined in `styles/globals.css` and used via CSS variables.
- Tailwind is configured through `tailwind.config.js`, with custom utility classes layered on top of the base theme.
- Components mix Tailwind utility classes and bespoke CSS variables to achieve gradient-driven, glassmorphism-inspired visuals.

## Local Development

1. Install dependencies:

   ```bash
   cd i:\learn\learning-site
   npm install
   ```

2. Create an `.env` file (see Environment Variables below) with database, auth, and mail credentials.

3. Prepare the database (PostgreSQL by default):

   ```bash
   npx prisma migrate deploy   # or `migrate dev` while iterating
   npx prisma generate
   npx prisma db seed          # optional but recommended to preload courses/tasks
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` to explore marketing pages, onboarding, and lesson experiences. The `/playground` route exposes a standalone Monaco sandbox.

## Environment Variables

```env
# Core
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-secure-random-string"

# OAuth (GitHub + Google)
GITHUB_ID="github-oauth-client-id"
GITHUB_SECRET="github-oauth-client-secret"
GOOGLE_CLIENT_ID="google-oauth-client-id"
GOOGLE_CLIENT_SECRET="google-oauth-client-secret"

# Email (used for verification + magic link)
MAIL_HOST="smtp.example.com"
MAIL_PORT="587"
MAIL_USERNAME="smtp-user"
MAIL_PASSWORD="smtp-pass"
MAIL_FROM_ADDRESS="no-reply@simplycode.dev"
MAIL_FROM_NAME="SimplyCode"
MAIL_ENCRYPTION="tls"          # optional: tls | ssl
```

If mail credentials are omitted, email features no-op gracefully while logging failures server-side.

## Database & Prisma

- The Prisma schema (`prisma/schema.prisma`) models users, courses, chapters, tasks, task progress, subscriptions, badges, and certificates.
- `prisma/seed.ts` bootstraps HTML and CSS courses with multi-step tasks and creates a demo learner account (`demo@learningcollective.dev` / `password123`).
- Update the schema as you add new data requirements; rerun `prisma generate` after schema changes.

## API Surface

- `POST /api/auth/register` – create credentials accounts and trigger verification email.
- `GET /api/auth/verify-email` – validate verification token and mark user email as verified.
- `GET /api/progress` – fetch completed tasks for the authenticated user.
- `POST /api/progress` – store completed task progress and award XP (falls back to local storage if Prisma is disabled).
- `GET /api/init` – simple health endpoint for initialisation checks.

## Useful Scripts

- `npm run dev` – start Next.js in development mode.
- `npm run build` – production build.
- `npm run start` – serve the production build.
- `npm run lint` – run Next.js lint rules.
- `npx prisma studio` – open Prisma data browser (requires DATABASE_URL).

## Deployment Checklist

- Configure environment variables (`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, OAuth client settings, mail credentials).
- Run `npm run build` to ensure the bundle compiles without errors.
- Execute `npx prisma migrate deploy` (and optional `prisma db seed`) against the production database.
- Configure your mail transport (or switch to a transactional provider like Resend, SendGrid, or Mailgun by adapting `lib/mail.ts`).

## Next Steps & Customization

- Extend `content/tracks/journey.ts` or add new tracks to scale lesson coverage.
- Build admin tooling or integrate a headless CMS for lesson authoring.
- Layer in analytics, achievement badges, or subscription gating using existing Prisma models.
- Add automated testing (unit/integration/e2e) to cover auth flows and interactive lesson logic.

SimplyCode gives you a polished foundation for experiential coding education—customize the content, evolve the visuals, and expand the backend to fit your learning community.
