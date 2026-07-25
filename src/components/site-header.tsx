import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DOCUMENTATION_URL,
  REPOSITORY_URL,
} from "@/lib/project-links";
import { AuthBrand } from "./auth-brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#f7f7f5]/90 px-5 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <Link
          href="/login"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <AuthBrand />
        </Link>

        <nav
          aria-label="Project resources"
          className="flex items-center gap-1"
        >
          <ResourceLink href={DOCUMENTATION_URL}>Documentation</ResourceLink>
          <ResourceLink href={REPOSITORY_URL} emphasized>
            GitHub
          </ResourceLink>
        </nav>
      </div>
    </header>
  );
}

function ResourceLink({
  href,
  emphasized = false,
  children,
}: {
  href: string;
  emphasized?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
        emphasized
          ? "bg-black text-white hover:bg-black/80"
          : "text-black/55 hover:bg-white hover:text-black"
      }`}
    >
      {children}
      <ExternalLink aria-hidden="true" className="size-3 opacity-55" />
    </a>
  );
}
