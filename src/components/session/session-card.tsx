import Image from "next/image";
import type { ReactNode } from "react";

const DOCUMENTATION_URL =
  "https://ps-nextjs-auth-starter.vercel.app/docs";
const REPOSITORY_URL =
  "https://github.com/patriciasegantine/nextjs-auth-starter-template";

export function SessionCard({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#ffffff_0%,transparent_42%)] px-5 py-12">
      <section className="w-full max-w-lg rounded-[2rem] border border-black/[0.08] bg-white p-7 shadow-[0_28px_90px_rgba(0,0,0,0.09)] sm:p-10">
        {children}
      </section>
    </main>
  );
}

export function SessionBrand() {
  return (
    <div className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
      <Image
        src="/auth-starter-logo.png"
        alt=""
        width={22}
        height={22}
        priority
      />
      Auth Starter
    </div>
  );
}

export function ProjectLinks() {
  return (
    <nav
      aria-label="Project resources"
      className="mt-4 flex items-center justify-end gap-4 text-xs font-medium text-black/55"
    >
      <ProjectLink href={DOCUMENTATION_URL}>Documentation</ProjectLink>
      <ProjectLink href={REPOSITORY_URL}>GitHub</ProjectLink>
    </nav>
  );
}

function ProjectLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 transition hover:text-black"
    >
      {children}
      <ExternalLinkIcon />
    </a>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="size-2.5 opacity-60"
      fill="none"
    >
      <path
        d="M4 8 8.5 3.5M5.25 3.5H8.5v3.25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
