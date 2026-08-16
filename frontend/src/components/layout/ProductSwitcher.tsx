"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, AlertTriangle, Check, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";

export type Product = "incidents" | "security";

export const PRODUCTS: { id: Product; label: string; sub: string; href: string; icon: typeof ShieldCheck; accent: string }[] = [
  { id: "incidents", label: "Incident Manager", sub: "Respond & resolve", href: "/incidents", icon: AlertTriangle, accent: "#4f8cff" },
  { id: "security", label: "Security Checker", sub: "Vibe-coded scan & fix", href: "/security", icon: ShieldCheck, accent: "#8b5cf6" },
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
        className="flex items-center gap-3 px-3 py-[7px] rounded-[12px] border border-[var(--border)] bg-white/50 hover:bg-white/80 transition-colors duration-[180ms]"
        aria-label="Switch product"
      >
        <span
          className="w-7 h-7 rounded-[14px] grid place-items-center text-white text-[13px] font-semibold flex-shrink-0"
          style={{ background: current.accent }}
        >
          <current.icon size={15} />
        </span>
        <span className="text-left hidden md:block">
          <span className="block text-[13px] font-semibold leading-tight text-[var(--fg)]">{current.label}</span>
          <span className="block text-[11px] text-muted leading-tight">{current.sub}</span>
        </span>
        <ChevronsUpDown size={14} className="text-muted flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[300px] bg-[var(--surface)] backdrop-blur-[24px] border border-[var(--border)] rounded-[20px] shadow-[0_24px_80px_rgba(16,32,51,0.16)] p-2 z-50">
          {PRODUCTS.map((p) => {
            const active = p.id === product;
            return (
              <Link
                key={p.id}
                href={p.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-[10px] rounded-[12px] transition-colors duration-[180ms]",
                  active ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--fg-soft)]"
                )}
              >
                <span
                  className="w-9 h-9 rounded-[16px] grid place-items-center text-white flex-shrink-0"
                  style={{ background: p.accent }}
                >
                  <p.icon size={17} />
                </span>
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold text-[var(--fg)]">{p.label}</span>
                  <span className="block text-[12px] text-muted">{p.sub}</span>
                </span>
                {active && <Check size={16} className="text-accent" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}