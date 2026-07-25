import Image from "next/image";

export function AuthBrand() {
  return (
    <div className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
      <Image
        src="/auth-starter-logo.png"
        alt=""
        width={22}
        height={22}
        priority
      />
      <span>Auth Starter</span>
      <span className="rounded-full bg-black/[0.07] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-900">
        Demo
      </span>
    </div>
  );
}
