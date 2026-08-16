"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard, BarChart3, AlertTriangle, ScrollText, Settings, ChevronLeft, ChevronRight,
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
    ? { mark: "VC", name: "Security Checker", links: securityLinks, accentClass: "text-[#8b5cf6]" }
    : { mark: "IC", name: "Incident Copilot", links: incidentLinks, accentClass: "text-[#3b82f6]" };

  const settingsLink = {
    href: product === "security" ? "/security/settings" : "/incidents/settings",
    label: "Settings",
    icon: Settings,
  };

  return (
    <aside
      className={clsx(
        "flex flex-col flex-shrink-0 z-20 transition-all duration-200 bg-page-bg",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center gap-3 h-[var(--topbar-h)] px-4 flex-shrink-0 whitespace-nowrap overflow-hidden">
        <div className={clsx("w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold bg-surface-elevated border border-border-strong flex-shrink-0", brand.accentClass)}>
          {brand.mark}
        </div>
        <span
          className={clsx(
            "text-[14px] font-semibold tracking-tight transition-opacity duration-200",
            collapsed && "opacity-0"
          )}
        >
          {brand.name}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
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
                "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors duration-150 relative",
                highlight
                  ? "bg-surface-elevated text-text-primary border border-border-soft hover:border-border-strong"
                  : active
                    ? "bg-accent-soft text-accent"
                    : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
              )}
            >
              <Icon size={16} className={clsx("flex-shrink-0", active ? brand.accentClass : "opacity-80")} />
              <span className={clsx("transition-opacity duration-200", collapsed && "opacity-0")}>
                {label}
              </span>
            </Link>
          );
        })}
        <div className="mt-auto pt-4" />
        <Link
          key={settingsLink.href}
          href={settingsLink.href}
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors duration-150",
            pathname.startsWith(settingsLink.href)
              ? "bg-accent-soft text-accent"
              : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
          )}
        >
          <settingsLink.icon size={16} className="flex-shrink-0 opacity-80" />
          <span className={clsx("transition-opacity duration-200", collapsed && "opacity-0")}>
            {settingsLink.label}
          </span>
        </Link>
      </nav>

      <div className="p-3">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center p-2 rounded-md text-text-tertiary hover:bg-surface-elevated hover:text-text-primary transition-colors duration-150"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
