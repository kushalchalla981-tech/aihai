"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, AlertTriangle, ScrollText, LayoutDashboard } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const typeLines = [
  "Your on-call deserves better.",
  "Resolve before your coffee gets cold.",
  "Incidents happen. We make them short.",
  "99.2% uptime. And climbing.",
];

export default function HomePage() {
  const [line, setLine] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = typeLines[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (charIdx < full.length) {
        timeout = setTimeout(() => {
          setLine(full.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        }, 40);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setLine(full.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        }, 20);
      } else {
        setDeleting(false);
        setLineIdx((i) => (i + 1) % typeLines.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, lineIdx]);

  return (
    <div className="min-h-[calc(100vh-var(--topbar-h))] flex flex-col justify-center relative">
      <div className="max-w-[720px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-[6px] rounded-[9999px] bg-blue-100 border border-blue-200 text-accent text-[12px] font-medium mb-5">
          <span className="w-2 h-2 rounded-full bg-success animate-live-pulse" />
          AI-Powered Incident Management
        </div>

        <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-accent mb-[10px]">
          INCIDENT COPILOT
        </p>

        <h1 className="text-gradient-anim text-[clamp(40px,6vw,68px)] font-semibold leading-[1.05] tracking-[-0.03em] mb-4">
          Monitor, investigate, and <br />
          resolve faster.
        </h1>

        <p className="text-[18px] text-[var(--fg-2)] max-w-[560px] mx-auto mb-5">
          Intelligent log analysis, real-time incident detection, and automated postmortems for small engineering teams.
        </p>

        <div className="mb-5 min-h-[1.6em]">
          <span className="text-[16px] text-[var(--fg-2)]">Your on-call engineer: </span>
          <span className="text-[16px] text-accent font-medium">
            {line}
            <span className="animate-pulse">|</span>
          </span>
        </div>

        <div className="flex gap-4 justify-center flex-wrap mb-8">
          <Link href="/dashboard">
            <Button variant="primary" className="px-7 py-3 text-[15px] rounded-[12px]">
              <LayoutDashboard size={16} />
              Open Dashboard
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="secondary" className="px-7 py-3 text-[15px] rounded-[12px]">
              <BarChart3 size={16} />
              View Analytics
            </Button>
          </Link>
        </div>

        <div className="flex gap-10 justify-center flex-wrap">
          {[
            { value: "99.2", label: "Uptime %", variant: "success" as const },
            { value: "247", label: "Resolved", variant: "accent" as const },
            { value: "12", label: "Team Size", variant: "warn" as const },
            { value: "8.4", label: "Avg Res. (m)", variant: "success" as const },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center animate-[scale-in_0.4s_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
              <div className={`text-[22px] font-bold font-display tracking-tight ${
                stat.variant === "success" ? "text-gradient-success" :
                stat.variant === "warn" ? "text-gradient-warn" :
                "text-gradient"
              }`}>
                {stat.value}
              </div>
              <div className="text-[11px] text-muted mt-[2px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="text-center mb-8">
          <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-accent mb-2">EXPLORE</p>
          <h2 className="text-[28px] font-semibold">Your command center</h2>
          <p className="text-[15px] text-[var(--fg-2)]">Everything you need to manage incidents across your stack.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          {[
            { href: "/dashboard", icon: LayoutDashboard, title: "Dashboard", desc: "Real-time KPIs, service health status, and recent incident timeline at a glance." },
            { href: "/incidents", icon: AlertTriangle, title: "Incidents", desc: "Track, investigate, and resolve incidents with AI-powered root cause suggestions." },
            { href: "/logs", icon: ScrollText, title: "Logs", desc: "Search, filter, and analyze application logs with pattern recognition." },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Card hover shine glow className="text-center py-8 px-6 cursor-pointer block">
                <div className="w-14 h-14 rounded-[36px] bg-[var(--accent-soft)] grid place-items-center mx-auto mb-5">
                  <item.icon size={26} className="text-accent" />
                </div>
                <h3 className="mb-[10px] text-[18px]">{item.title}</h3>
                <p className="text-[13px] text-muted">{item.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
