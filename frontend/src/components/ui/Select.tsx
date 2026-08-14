"use client";

import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export default function Select({ options, className, ...props }: Props) {
  return (
    <div className={clsx("relative", className)}>
      <select
        className="w-full appearance-none py-[7px] pl-3 pr-7 border border-[var(--border)] rounded-[10px] bg-[var(--surface)] text-[var(--fg)] text-[13px] cursor-pointer outline-none transition-[border-color] duration-[180ms] focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
    </div>
  );
}
