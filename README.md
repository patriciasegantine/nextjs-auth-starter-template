# Next.js Auth Starter

A reusable authentication starter for Next.js applications. It provides the
complete account lifecycle while keeping product-specific code out of the
foundation.

For guided setup and customization, visit the
[visual documentation](https://ps-nextjs-auth-starter.vercel.app/docs).

## Features

- Next.js 16 App Router and React 19
- Better Auth with email/password and optional Google sign-in
- PostgreSQL with Prisma 7
- Registration with strong-password validation
- Email verification before password sign-in
- Login, logout, and server-side session validation
- Password recovery and reset
- Transactional email templates for verification, welcome, and password reset
- Nodemailer with Gmail SMTP or another SMTP-compatible provider
- Curated OpenAPI 3.1 reference rendered with Scalar
- Tailwind CSS 4
- Zod validation

## Authentication flows

### Email and password

1. The user creates an account.
2. A confirmation link is sent by email.
3. After confirmation, the user receives a welcome email.
4. The user can sign in and view the session status page.

### Google

Google verifies the email during OAuth sign-in. A Google user can later use the
password recovery flow to define a password and enable both sign-in methods.

### Password recovery

1. The user requests a reset link.
2. The UI always returns a neutral response to avoid exposing registered
   addresses.
3. The link opens the password reset page with a temporary token.
4. After a successful reset, existing sessions are revoked.

## Requirements

- Node.js 22 or newer
- npm
- PostgreSQL

## Quick start

### 1. Create a repository from the template

Use **Use this template** on GitHub, create your repository, and clone it
locally. This creates a clean project without requiring you to fork the starter.

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

```bash
cp .env.example .env
```

Generate the Better Auth secret:

```bash
openssl rand -base64 32
```

Configure the required variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
BETTER_AUTH_SECRET="paste-the-generated-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

You can use any PostgreSQL provider, including Neon, Supabase, Railway, or a
local database.

### 4. Create the database tables

For the first local migration:

```bash
npm run db:migrate -- --name init_auth
```

`prisma migrate dev` creates the migration and applies it to the development
database. In production, apply committed migrations with:

```bash
npm run db:deploy
```

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to
the sign-in page.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Signs and encrypts authentication data |
| `BETTER_AUTH_URL` | Yes | Public base URL, without a trailing slash |
| `TRUSTED_ORIGINS` | No | Comma-separated extra origins allowed to call the auth API (`BETTER_AUTH_URL` is trusted by default) |
| `GOOGLE_CLIENT_ID` | No | Enables Google OAuth when paired with the client secret |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `SMTP_HOST` | Production email | SMTP server hostname |
| `SMTP_PORT` | Production email | SMTP server port, normally `465` or `587` |
| `SMTP_USER` | Production email | SMTP account username |
| `SMTP_PASSWORD` | Production email | SMTP password or app password |
| `EMAIL_FROM` | Production email | Sender name and address |

Variables without the `NEXT_PUBLIC_` prefix remain server-only. Never expose
the database URL, Better Auth secret, OAuth secret, or SMTP credentials to
browser code.

## Google sign-in

Create an OAuth 2.0 web application in Google Cloud and configure:

```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

Add the local authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

For production, add the equivalent URI using your deployed domain:

```text
https://your-domain.com/api/auth/callback/google
```

The Google button is enabled automatically when both variables are configured.
Google OAuth itself does not require a paid Better Auth plan.

## Transactional email

The starter uses Nodemailer directly; `@better-auth/infra` is not required.

### Gmail SMTP

Enable two-step verification on the Google account, create an App Password, and
configure:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-google-app-password"
EMAIL_FROM="Auth Starter <your-email@gmail.com>"
```

Port `465` uses a secure connection immediately. Port `587` commonly uses
STARTTLS. The transport selects secure mode automatically for port `465`.

Never use the regular Gmail account password. During local development, if SMTP
is not configured, email links are printed in the server terminal.

Before production, customize the app name, copy, author, resource links, and
styles in `src/lib/email-template.ts`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to sign-in |
| `/login` | Email/password and Google sign-in |
| `/register` | Account creation |
| `/verify-email` | Confirmation instructions and resend |
| `/forgot-password` | Password reset request |
| `/reset-password` | New password form opened from the email link |
| `/session` | Public authentication status page |
| `/api-reference` | Interactive Scalar reference for the implemented auth API |
| `/api/openapi.json` | Curated OpenAPI 3.1 schema |
| `/api/auth/[...all]` | Better Auth API handler |

The session page is intentionally public: it renders either the authenticated
user state or a signed-out state.

## API reference

Open the interactive Scalar documentation during development:

```text
http://localhost:3000/api-reference
```

The underlying OpenAPI 3.1 schema is available at:

```text
http://localhost:3000/api/openapi.json
```

Once deployed, both routes are served from your production domain instead.
This starter's own demo has it live:
[ps-nextjs-auth-starter-demo.vercel.app/api-reference](https://ps-nextjs-auth-starter-demo.vercel.app/api-reference).

The Better Auth plugin can describe more endpoints than this starter exposes in
its interface. To keep the reference focused, `src/app/api/openapi.json/route.ts`
filters the generated schema to the flows implemented here:

```text
POST /sign-up/email
POST /sign-in/email
POST /sign-in/social
GET/POST /callback/{id}
GET/POST /get-session
POST /sign-out
POST /send-verification-email
GET  /verify-email
POST /request-password-reset
GET  /reset-password/{token}
POST /reset-password
GET  /error
```

The exact methods shown in Scalar come from Better Auth's generated schema. If
you add another Better Auth flow, include its path in `DOCUMENTED_AUTH_PATHS`.
For application-specific APIs, add their OpenAPI operations to the schema and
reuse the existing Zod schemas where appropriate.

The Scalar interface supports interactive requests. Use “Try it out” carefully
against production environments because write endpoints can create users,
sessions, and emails.

## Protecting application routes

Validate the complete session on the server before reading or modifying private
data:

```ts
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  redirect("/login");
}
```

Repeat authorization checks in Route Handlers and Server Actions. A protected
page alone does not protect its underlying mutations.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma Client and create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:migrate` | Create and apply a development migration |
| `npm run db:deploy` | Apply committed migrations in production |
| `npm run db:studio` | Inspect the database with Prisma Studio |
| `npm run test` | Run unit tests (schemas and form hooks) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:integration` | Run integration tests against a local Postgres |
| `npm run validate` | Run lint, typecheck, unit tests, and production build |

## Testing

Unit tests (`npm run test`) cover the Zod schemas in `auth-validation.ts` and
the client-side form hooks in `src/hooks`, with `authClient` mocked. They
need no database and run in a few hundred milliseconds.

Integration tests (`npm run test:integration`) exercise the real better-auth
server API — registration, email verification, login, and password
recovery — against a disposable local Postgres container. The command
handles the full lifecycle on its own:

```bash
npm run test:integration
```

This starts `docker-compose.test.yml` (Postgres on port 5434, so it won't
collide with another local database), applies migrations using `.env.test`,
runs the suite, and tears the container down afterward, win or lose. Requires
Docker to be running locally; no other setup is needed since `.env.test` is
committed with disposable, non-production credentials. Outbound email is
mocked in these tests, so nothing is actually sent.

## Project structure

```text
prisma/
  migrations/                 Committed database migrations
  schema.prisma               Better Auth database models
src/
  app/
    (auth)/                   Authentication pages
    api-reference/            Scalar API reference
    api/openapi.json/         Curated OpenAPI schema
    api/auth/[...all]/        Better Auth HTTP handler
    session/                  Public session status page
  components/                 Reusable authentication UI
  hooks/                      Client-side form flows
  lib/
    auth.ts                   Server authentication configuration
    auth-client.ts            Browser authentication client
    auth-validation.ts        Shared Zod schemas and password rules
    db.ts                     Prisma client
    email.ts                  Nodemailer transport
    email-template.ts         Transactional email templates
```

## Deployment

Vercel is the recommended host for this Next.js starter.

1. Import the repository into Vercel.
2. Add all production environment variables.
3. Set `BETTER_AUTH_URL` to the production domain.
4. Add the production Google callback URI.
5. Apply migrations with `npm run db:deploy`.
6. Test registration, verification, login, recovery, reset, Google OAuth, and
   logout using the deployed domain.

Avoid connecting the same repository to multiple automatic deployment services
unless that is intentional.

## Before publishing your product

- Replace the starter name, logo, metadata, links, and email content.
- Use a dedicated transactional email provider for production volume.
- Add platform-appropriate rate limiting.
- Review trusted origins and OAuth callback URLs.
- Validate authorization on every private read and mutation.
- Add automated tests for the authentication flows.
- Review dependency alerts instead of running `npm audit fix --force` blindly.

## Resources

- [Auth Starter visual documentation](https://ps-nextjs-auth-starter.vercel.app/docs)
- [Better Auth](https://better-auth.com/)
- [Better Auth installation](https://better-auth.com/docs/installation)
- [Better Auth OpenAPI plugin](https://better-auth.com/docs/plugins/open-api)
- [Scalar for Next.js](https://scalar.com/products/api-references/integrations/nextjs)
- [OpenAPI specification](https://spec.openapis.org/oas/latest.html)
- [Prisma documentation](https://www.prisma.io/docs)
- [Nodemailer](https://nodemailer.com/)
- [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js documentation](https://nextjs.org/docs)

## License

Licensed under the [MIT License](LICENSE).

---

## Author

Created by **Patricia Segantine**, Senior Frontend Engineer

[LinkedIn](https://linkedin.com/in/patriciasegantine) ·
[Portfolio](https://patriciasegantine.vercel.app/)