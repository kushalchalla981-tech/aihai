import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  shine?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = false,
  shine = false,
  glow = false,
  onClick,
}: Props) {
  return (
    <div
      className={clsx(
        "bg-[var(--surface)] backdrop-blur-[16px] border border-[var(--border)] rounded-[20px] p-6",
        hover && "transition-shadow duration-[280ms] hover:shadow-[0_24px_80px_rgba(79,140,255,0.18)] hover:-translate-y-[2px]",
        shine && "glass-shine",
        glow && "border-glow-hover",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
