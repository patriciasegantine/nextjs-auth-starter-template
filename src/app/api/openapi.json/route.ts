import { auth } from "@/lib/auth";

const DOCUMENTED_AUTH_PATHS = new Set([
  "/sign-up/email",
  "/sign-in/email",
  "/sign-in/social",
  "/callback/{id}",
  "/get-session",
  "/sign-out",
  "/send-verification-email",
  "/verify-email",
  "/request-password-reset",
  "/reset-password/{token}",
  "/reset-password",
  "/error",
]);

export const dynamic = "force-dynamic";

export async function GET() {
  const schema = await auth.api.generateOpenAPISchema();
  const paths = Object.fromEntries(
    Object.entries(schema.paths).filter(([path]) =>
      DOCUMENTED_AUTH_PATHS.has(path),
    ),
  );

  return Response.json(
    {
      ...schema,
      info: {
        ...schema.info,
        title: "Auth Starter API",
        description:
          "Authentication endpoints used by the Next.js Auth Starter.",
      },
      paths,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
