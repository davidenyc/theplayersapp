import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
