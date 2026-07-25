import { PORTFOLIO_URL } from "@/lib/project-links";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.06] px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-1.5 text-center text-xs text-black/45 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p>© 2026 Auth Starter. Build the product, not the login.</p>
        <p>
          Created by{" "}
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-black/60 transition hover:text-black"
          >
            Patricia Segantine
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
