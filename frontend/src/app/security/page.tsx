"use client";

import { useRouter } from "next/navigation";
import { ScanSearch, ShieldCheck, FolderKanban, ListChecks, PlusCircle, RefreshCw, ArrowRight } from "lucide-react";
import { useSecurityProjects, useSecurityScans, useSecurityFindings } from "@/lib/hooks";
import KPI from "@/components/ui/KPI";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LiveBadge from "@/components/shared/LiveBadge";

const statusVariant: Record<string, "warn" | "success" | "danger" | "neutral"> = {
  queued: "warn", running: "warn", completed: "success", failed: "danger",
};

const severityVariant: Record<string, "danger" | "warn" | "info" | "neutral"> = {
  critical: "danger", high: "warn", medium: "info", low: "neutral", informational: "neutral",
};

const gradeColor: Record<string, string> = {
  A: "text-success", B: "text-accent", C: "text-warn", D: "text-warn", F: "text-danger",
};

export default function SecurityDashboardPage() {
  const router = useRouter();
  const { data: projects } = useSecurityProjects();
  const { data: scans } = useSecurityScans();
  const { data: findings } = useSecurityFindings();

  const activeScans = (scans || []).filter((s) => s.status === "queued" || s.status === "running").length;
  const openCritical = (findings || []).filter((f) => f.status === "open" && f.severity === "critical").length;
  const openHigh = (findings || []).filter((f) => f.status === "open" && f.severity === "high").length;
  const avgScore = projects && projects.length > 0
    ? Math.round((projects.reduce((acc, p) => acc + (p.last_scan_score ?? 0), 0) / projects.length) * 10) / 10
    : 0;
  const recentScans = [...(scans || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 6);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient-anim text-[24px] font-semibold">Security Checker</h1>
          <LiveBadge />
        </div>
        <div className="flex items-center gap-[10px]">
          <Button variant="secondary" size="sm" onClick={() => router.refresh()}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => router.push("/security/new")}>
            <PlusCircle size={14} /> New Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI label="Projects Monitored" value={projects?.length ?? 0} className="kpi-glow-hover">
          <FolderKanban size={20} className="text-accent mt-[10px] opacity-70" />
        </KPI>
        <KPI label="Open Critical Findings" value={openCritical} change={{ value: `${openHigh} high severity`, up: openHigh > 0 }}>
          <ShieldCheck size={20} className="text-danger mt-[10px] opacity-70" />
        </KPI>
        <KPI label="Average Score" value={avgScore} suffix=" / 100">
          <ScanSearch size={20} className="text-warn mt-[10px] opacity-70" />
        </KPI>
        <KPI label="Active Scans" value={activeScans} change={{ value: activeScans > 0 ? "in progress" : "idle", up: activeScans > 0 }}>
          <RefreshCw size={20} className="text-accent mt-[10px] opacity-70" />
        </KPI>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <Card hover shine glow className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px]">Recent Scans</h3>
            <LinkButton href="/security/history" label="View all" />
          </div>
          {recentScans.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <ScanSearch size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No scans yet — run your first one.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentScans.map((s) => (
                <button
                  key={s.id}
                  onClick={() => router.push(`/security/scans/${s.id}`)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-[12px] bg-white/40 hover:bg-white/70 border border-[var(--border-soft)] transition-colors duration-[180ms] text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{s.name || s.source_ref || s.repo_url}</div>
                    <div className="text-[11px] text-muted font-mono mt-[2px]">
                      {s.source_type} · {new Date(s.created_at).toLocaleString()}
                    </div>
                  </div>
                  {s.score !== null && (
                    <span className={`font-mono text-[15px] font-bold ${gradeColor[s.grade ?? "F"]}`}>{s.score}</span>
                  )}
                  <Badge variant={statusVariant[s.status] || "neutral"}>{s.status}</Badge>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card hover shine glow>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px]">Projects</h3>
            <LinkButton href="/security/projects" label="View all" />
          </div>
          {!projects || projects.length === 0 ? (
            <p className="text-[13px] text-muted py-8 text-center">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/security/projects/${p.id}`)}
                  className="w-full text-left group"
                >
                  <div className="text-[13px] font-medium truncate group-hover:text-accent transition-colors">
                    {p.name || p.source_ref}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="neutral">{p.source_type}</Badge>
                    {p.last_scan_grade && (
                      <span className={`font-mono text-[12px] font-bold ${gradeColor[p.last_scan_grade]}`}>
                        {p.last_scan_grade} · {p.last_scan_score ?? "—"}
                      </span>
                    )}
                    {p.last_scan_status && (
                      <Badge variant={statusVariant[p.last_scan_status] || "neutral"}>{p.last_scan_status}</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card hover shine glow className="overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-[16px]">
            <ListChecks size={16} className="text-accent" />
            Open Findings
          </h3>
          <LinkButton href="/security/findings" label="View all" />
        </div>
        {!findings || findings.length === 0 ? (
          <p className="text-[13px] text-muted py-8 text-center">No findings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-muted uppercase font-mono tracking-wide border-b border-[var(--border-soft)]">
                  <th className="py-2 pr-4">Finding</th>
                  <th className="py-2 pr-4">Severity</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {findings.filter((f) => f.status === "open").slice(0, 8).map((f) => (
                  <tr key={f.id} className="border-b border-[var(--border-soft)] last:border-b-0 hover:bg-[var(--fg-soft)] transition-colors">
                    <td className="py-3 pr-4">
                      <div className="text-[13px] font-medium truncate max-w-[340px]">{f.title || f.rule_id || f.description}</div>
                      <div className="text-[11px] text-muted font-mono">{f.rule_id} · {f.file || "—"}{f.line ? `:${f.line}` : ""}</div>
                    </td>
                    <td className="py-3 pr-4"><Badge variant={severityVariant[f.severity] || "neutral"}>{f.severity}</Badge></td>
                    <td className="py-3 pr-4 text-[12px] text-[var(--fg-2)]">{f.category}</td>
                    <td className="py-3 pr-4"><Badge variant="warn">{f.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-1 text-[12px] text-accent font-medium hover:underline">
      {label} <ArrowRight size={12} />
    </a>
  );
}