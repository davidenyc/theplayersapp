import Image from "next/image";

import { getInitials } from "@/lib/utils/formatters";

type AvatarProps = {
  name: string;
  src?: string;
  className?: string;
};

export function Avatar({ name, src, className = "" }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={44}
        height={44}
        className={`h-11 w-11 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
