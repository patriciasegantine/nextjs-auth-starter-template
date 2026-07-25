import type { ReactNode } from "react";

export function SessionCard({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-full place-items-center bg-[radial-gradient(circle_at_top,#ffffff_0%,transparent_42%)] px-5 py-10">
      <section className="w-full max-w-lg rounded-[2rem] border border-black/[0.08] bg-white p-7 shadow-[0_28px_90px_rgba(0,0,0,0.09)] sm:p-10">
        {children}
      </section>
    </main>
  );
}
