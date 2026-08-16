"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, AlertTriangle, Check, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";

export type Product = "incidents" | "security";

export const PRODUCTS: { id: Product; label: string; sub: string; href: string; icon: typeof ShieldCheck; accentClass: string }[] = [
  { id: "incidents", label: "Incident Manager", sub: "Respond & resolve", href: "/incidents", icon: AlertTriangle, accentClass: "text-[#3b82f6]" },
  { id: "security", label: "Security Checker", sub: "Vibe-coded scan & fix", href: "/security", icon: ShieldCheck, accentClass: "text-[#8b5cf6]" },
];

export function useProduct(): Product {
  const pathname = usePathname();
  if (pathname.startsWith("/security")) return "security";
  return "incidents";
}

export default function ProductSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const product = useProduct();
  const current = PRODUCTS.find((p) => p.id === product) ?? PRODUCTS[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-soft bg-surface-elevated hover:bg-surface-elevated/80 transition-colors duration-150"
        aria-label="Switch product"
      >
        <current.icon size={14} className={current.accentClass} />
        <span className="text-left hidden md:block">
          <span className="block text-[13px] font-medium leading-tight text-text-primary">{current.label}</span>
        </span>
        <ChevronsUpDown size={14} className="text-text-tertiary ml-1" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[240px] bg-surface-elevated border border-border-strong rounded-lg shadow-lg p-1 z-50">
          {PRODUCTS.map((p) => {
            const active = p.id === product;
            return (
              <Link
                key={p.id}
                href={p.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150",
                  active ? "bg-surface-base" : "hover:bg-surface-base"
                )}
              >
                <p.icon size={16} className={p.accentClass} />
                <span className="flex-1">
                  <span className="block text-[13px] font-medium text-text-primary">{p.label}</span>
                  <span className="block text-[11px] text-text-secondary">{p.sub}</span>
                </span>
                {active && <Check size={14} className="text-text-secondary" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
