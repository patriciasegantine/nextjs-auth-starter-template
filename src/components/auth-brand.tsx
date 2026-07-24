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
    </div>
  );
}
