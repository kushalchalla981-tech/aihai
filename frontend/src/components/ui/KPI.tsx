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
          const dur = 1200;
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
        "bg-[var(--surface)] backdrop-blur-[16px] border border-[var(--border)] rounded-[20px] p-5 transition-shadow duration-[280ms] hover:shadow-[0_24px_80px_rgba(79,140,255,0.18)] hover:-translate-y-[2px]",
        className
      )}
    >
      <div className="text-[12px] text-muted font-medium uppercase tracking-wide mb-[6px]">
        {label}
      </div>
      <div className="font-display text-[28px] font-bold tracking-tight leading-[1.1]">
        {prefix}
        {decimals > 0 ? display.toFixed(decimals) : Math.round(display)}
        {suffix}
      </div>
      {change && (
        <div
          className={clsx(
            "text-[12px] mt-1 inline-flex items-center gap-[3px]",
            change.up && "text-success",
            change.down && "text-danger",
            !change.up && !change.down && "text-muted"
          )}
        >
          {change.value}
        </div>
      )}
      {children}
    </div>
  );
}
