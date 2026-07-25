export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-full place-items-center px-5 py-10">
      {children}
    </main>
  );
}
