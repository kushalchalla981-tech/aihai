"use client";

import { AlertTriangle } from "lucide-react";
import { useScans } from "@/lib/hooks";
import Badge from "@/components/ui/Badge";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { ScanRun } from "@/lib/types";

const statusVariant: Record<string, "success" | "warn" | "danger" | "info" | "neutral"> = {
  queued: "info",
  running: "warn",
  completed: "success",
  failed: "danger",
};

function scoreClass(score: number | null): string {
  if (score === null) return "text-muted";
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warn";
  return "text-danger";
}

export default function ScanList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (scan: ScanRun) => void;
}) {
  const { data: scans, isLoading, isError } = useScans();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-muted text-sm">
        <AlertTriangle size={24} className="mx-auto mb-3 opacity-40" />
        <p>Failed to load scans</p>
      </div>
    );
  }

  if (!scans?.length) {
    return (
      <div className="text-center py-8 text-muted text-sm">
        No scans yet — start one with the form above
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr>
            <th className="text-left py-3 pr-4 text-muted font-mono text-[11px] uppercase tracking-wide">Repo</th>
            <th className="text-left py-3 pr-4 text-muted font-mono text-[11px] uppercase tracking-wide">Status</th>
            <th className="text-left py-3 pr-4 text-muted font-mono text-[11px] uppercase tracking-wide">Score</th>
            <th className="text-left py-3 pr-4 text-muted font-mono text-[11px] uppercase tracking-wide">Grade</th>
            <th className="text-left py-3 pr-4 text-muted font-mono text-[11px] uppercase tracking-wide">Findings</th>
            <th className="text-left py-3 text-muted font-mono text-[11px] uppercase tracking-wide">Created</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => {
            const selected = selectedId === scan.id;
            return (
              <tr
                key={scan.id}
                onClick={() => onSelect(scan)}
                className={`border-t border-[var(--border-soft)] transition-colors duration-[180ms] cursor-pointer ${
                  selected
                    ? "bg-[var(--accent-soft)]"
                    : "hover:bg-[var(--accent-soft)]"
                }`}
              >
                <td className="py-3 pr-4">
                  <div className="font-mono text-[13px] font-medium truncate max-w-[260px]">{scan.repo_url}</div>
                  {scan.name && (
                    <div className="text-[11px] text-muted truncate max-w-[260px]">{scan.name}</div>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <Badge
                    variant={statusVariant[scan.status] || "neutral"}
                    className={scan.status === "running" ? "animate-pulse" : undefined}
                  >
                    {scan.status}
                  </Badge>
                </td>
                <td className="py-3 pr-4">
                  <span className={`font-mono text-sm font-semibold ${scoreClass(scan.score)}`}>
                    {scan.score === null ? "—" : scan.score}
                  </span>
                </td>
                <td className="py-3 pr-4 font-mono text-sm text-muted">
                  {scan.grade || "—"}
                </td>
                <td className="py-3 pr-4 text-[var(--fg-2)]">{scan.finding_count}</td>
                <td className="py-3 font-mono text-[12px] text-muted whitespace-nowrap">
                  {new Date(scan.created_at).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
