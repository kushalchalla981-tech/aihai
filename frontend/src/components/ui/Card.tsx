import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  shine?: boolean; // Kept for prop compatibility, but functionality disabled in Technical Editorial
  glow?: boolean; // Kept for prop compatibility, but functionality disabled in Technical Editorial
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = false,
  onClick,
}: Props) {
  return (
    <div
      className={clsx(
        "bg-surface-base border border-border-soft rounded-lg p-5",
        hover && "transition-colors duration-150 hover:border-border-strong",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
