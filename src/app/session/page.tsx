import type { Metadata } from "next";
import { headers } from "next/headers";
import { AuthenticatedSession } from "@/components/session/authenticated-session";
import { UnauthenticatedSession } from "@/components/session/unauthenticated-session";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Session status" };

export default async function SessionPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return <UnauthenticatedSession />;
  }

  return (
    <AuthenticatedSession
      user={{ name: session.user.name, email: session.user.email }}
    />
  );
}
