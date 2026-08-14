import clsx from "clsx";
import type { ReactNode } from "react";

type Variant = "success" | "warn" | "danger" | "info" | "neutral";

const variants: Record<Variant, string> = {
  success: "bg-green-100 text-success",
  warn: "bg-amber-100 text-warn",
  danger: "bg-red-100 text-danger",
  info: "bg-blue-100 text-accent",
  neutral: "bg-gray-100 text-fg-2",
};

export default function Badge({
  children,
  variant = "info",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-[9999px] px-[10px] py-[2px] text-[11px] font-medium tracking-wide whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
