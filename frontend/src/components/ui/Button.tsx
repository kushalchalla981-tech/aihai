import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-text-primary text-page-bg border-transparent hover:bg-text-primary/90",
  secondary: "bg-surface-elevated text-text-primary border-border-strong hover:border-text-secondary",
  ghost: "bg-transparent text-text-secondary border-transparent hover:text-text-primary hover:bg-surface-elevated",
  danger: "bg-transparent text-status-critical border-border-strong hover:border-status-critical",
};

type Size = "sm" | "md";

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1 text-[12px] rounded-md",
  md: "px-3.5 py-1.5 text-[13px] rounded-md",
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
        "inline-flex items-center justify-center gap-1.5 font-medium border transition-colors duration-150 active:scale-[0.98] whitespace-nowrap outline-none focus:ring-2 focus:ring-border-strong",
        variants[variant],
        sizes[size],
        props.disabled && "opacity-50 cursor-not-allowed active:scale-100",
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
        "w-7 h-7 grid place-items-center rounded-md border border-border-soft text-text-secondary bg-surface-base hover:border-border-strong hover:text-text-primary hover:bg-surface-elevated transition-colors duration-150",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
