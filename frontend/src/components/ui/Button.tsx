import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-on border-accent hover:bg-accent-hover",
  secondary: "bg-transparent text-fg border-[var(--border)] hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-fg-2 border-transparent hover:text-accent hover:bg-[var(--accent-soft)]",
  danger: "bg-transparent text-danger border-[var(--border)] hover:border-danger",
};

type Size = "sm" | "md";

const sizes: Record<Size, string> = {
  sm: "px-3 py-[5px] text-[12px] rounded-[8px]",
  md: "px-[18px] py-[9px] text-[14px] rounded-[10px]",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-[6px] font-medium tracking-tight border transition-colors duration-[180ms] active:translate-y-[1px] whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={clsx(
        "w-[34px] h-[34px] grid place-items-center rounded-full border border-[var(--border)] text-[var(--fg-2)] bg-[var(--surface)] hover:border-accent hover:text-accent hover:bg-[var(--accent-soft)] transition-colors duration-[180ms]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
