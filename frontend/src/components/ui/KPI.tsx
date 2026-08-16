"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  change?: { value: string; up?: boolean; down?: boolean };
  children?: ReactNode;
  className?: string;
}

export default function KPI({
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  change,
  children,
  className,
}: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const dur = 600; // Faster, more snappy animation
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setDisplay(value * ease);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className={clsx(
        "bg-surface-base border border-border-soft rounded-lg p-4 transition-colors duration-150 hover:border-border-strong",
        className
      )}
    >
      <div className="text-[11px] text-text-secondary uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="font-mono text-[24px] font-semibold tracking-tight leading-none text-text-primary tabular-nums">
        {prefix}
        {decimals > 0 ? display.toFixed(decimals) : Math.round(display)}
        {suffix}
      </div>
      {change && (
        <div
          className={clsx(
            "text-[11px] mt-2 font-medium",
            change.up && "text-status-success",
            change.down && "text-status-critical",
            !change.up && !change.down && "text-text-secondary"
          )}
        >
          {change.up ? "↑ " : change.down ? "↓ " : ""}{change.value}
        </div>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
