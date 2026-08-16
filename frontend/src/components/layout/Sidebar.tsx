"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard, BarChart3, AlertTriangle, ScrollText, Settings, ChevronLeft,
  PlusCircle, FolderKanban, ListChecks, History,
} from "lucide-react";
import { useProduct } from "./ProductSwitcher";

const incidentLinks = [
  { href: "/incidents/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/incidents/new", label: "New Incident", icon: PlusCircle, highlight: true },
  { href: "/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/incidents/logs", label: "Logs", icon: ScrollText },
  { href: "/incidents/analytics", label: "Analytics", icon: BarChart3 },
];

const securityLinks = [
  { href: "/security", label: "Dashboard", icon: LayoutDashboard },
  { href: "/security/new", label: "New Scan", icon: PlusCircle, highlight: true },
  { href: "/security/projects", label: "Projects", icon: FolderKanban },
  { href: "/security/findings", label: "Findings", icon: ListChecks },
  { href: "/security/history", label: "History", icon: History },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const product = useProduct();

  const brand = product === "security"
    ? { mark: "VC", name: "Security Checker", links: securityLinks, accent: "#8b5cf6" }
    : { mark: "IC", name: "Incident Copilot", links: incidentLinks, accent: "#4f8cff" };

  const settingsLink = {
    href: product === "security" ? "/security/settings" : "/incidents/settings",
    label: "Settings",
    icon: Settings,
  };

  return (
    <aside
      className={clsx(
        "flex flex-col flex-shrink-0 overflow-hidden z-20 border-r border-[var(--border-soft)]",
        "bg-[var(--surface)] backdrop-blur-[20px] transition-all duration-[280ms]",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center gap-4 h-[var(--topbar-h)] px-5 border-b border-[var(--border-soft)] flex-shrink-0 whitespace-nowrap">
        <div
          className="w-8 h-8 rounded-[16px] grid place-items-center text-white font-bold text-[15px] flex-shrink-0"
          style={{ background: brand.accent }}
        >
          {brand.mark}
        </div>
        <span
          className={clsx(
            "font-display text-base font-semibold tracking-tight transition-opacity duration-[280ms]",
            collapsed && "opacity-0"
          )}
        >
          {brand.name}
        </span>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-[2px] overflow-y-auto">
        {brand.links.map(({ href, label, icon: Icon, highlight }) => {
          const active = href === "/incidents"
            ? pathname === "/incidents"
            : href === "/security"
              ? pathname === "/security" || pathname.startsWith("/security/projects")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-4 px-4 py-[10px] rounded-[10px] text-sm font-[450] whitespace-nowrap transition-colors duration-[180ms] relative",
                highlight
                  ? "bg-[var(--accent-soft)] text-accent font-medium hover:bg-[var(--accent-soft)]"
                  : active
                    ? "bg-[var(--accent-soft)] text-accent font-medium"
                    : "text-[var(--fg-2)] hover:bg-[var(--accent-soft)] hover:text-accent",
                !highlight && active && "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:rounded-r before:bg-accent"
              )}
            >
              <Icon size={20} className="flex-shrink-0 opacity-80" />
              <span className={clsx("transition-opacity duration-[280ms]", collapsed && "opacity-0")}>
                {label}
              </span>
            </Link>
          );
        })}
        <div className="mt-auto" />
        <Link
          key={settingsLink.href}
          href={settingsLink.href}
          className={clsx(
            "flex items-center gap-4 px-4 py-[10px] rounded-[10px] text-sm font-[450] whitespace-nowrap transition-colors duration-[180ms]",
            pathname.startsWith(settingsLink.href)
              ? "bg-[var(--accent-soft)] text-accent font-medium"
              : "text-[var(--fg-2)] hover:bg-[var(--accent-soft)] hover:text-accent"
          )}
        >
          <settingsLink.icon size={20} className="flex-shrink-0 opacity-80" />
          <span className={clsx("transition-opacity duration-[280ms]", collapsed && "opacity-0")}>
            {settingsLink.label}
          </span>
        </Link>
      </nav>

      <div className="p-3 border-t border-[var(--border-soft)]">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full p-2 rounded-[10px] text-muted grid place-items-center hover:bg-[var(--accent-soft)] hover:text-accent transition-colors duration-[180ms]"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft size={18} className={clsx("transition-transform duration-[280ms]", collapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
}